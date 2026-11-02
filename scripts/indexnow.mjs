import { execFileSync } from 'node:child_process';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const siteUrl = new URL('https://www.base44expert.com');
const repositoryRoot = fileURLToPath(new URL('../', import.meta.url));
const publicDirectory = path.join(repositoryRoot, 'public');

function runGit(args) {
  return execFileSync('git', args, {
    cwd: repositoryRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

function pageUrlFromSource(filePath) {
  const routePath = path
    .relative(path.join(repositoryRoot, 'src/pages'), path.join(repositoryRoot, filePath))
    .split(path.sep)
    .join('/')
    .replace(/\.(astro|md|mdx)$/, '');
  const segments = routePath.split('/');

  if (segments.some((segment) => /^\[.*\]$/.test(segment))) return null;
  if (segments.at(-1) === 'index') segments.pop();

  const pathname = segments.length ? `/${segments.join('/')}/` : '/';
  if (/^\/admin(?:\/|$)/.test(pathname)) return undefined;
  return new URL(pathname, siteUrl).href;
}

function publicUrlFromSource(filePath) {
  const relativePath = filePath.slice('public/'.length);
  if (
    relativePath === 'robots.txt' ||
    /^sitemap(?:-index|-\d+)?\.xml$/.test(relativePath) ||
    /^[a-f\d-]{8,128}\.txt$/i.test(relativePath)
  ) {
    return null;
  }

  return new URL(`/${relativePath}`, siteUrl).href;
}

function getChangedPaths(baseRef, currentRef) {
  return runGit([
    'diff',
    '--no-renames',
    '--name-only',
    '-z',
    baseRef,
    currentRef,
  ])
    .split('\0')
    .filter(Boolean);
}

function getKey() {
  return readdir(publicDirectory).then(async (files) => {
    const candidates = files.filter((file) => /^[a-f\d-]{8,128}\.txt$/i.test(file));
    if (candidates.length !== 1) {
      throw new Error(`Expected one IndexNow key file in public/, found ${candidates.length}.`);
    }

    const keyFile = candidates[0];
    const key = keyFile.slice(0, -'.txt'.length);
    const fileContents = (await readFile(path.join(publicDirectory, keyFile), 'utf8')).trim();
    if (fileContents !== key) {
      throw new Error(`The contents of public/${keyFile} must match its filename.`);
    }

    return key;
  });
}

function sitemapLocations(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) =>
    match[1]
      .replaceAll('&amp;', '&')
      .replaceAll('&lt;', '<')
      .replaceAll('&gt;', '>')
      .replaceAll('&quot;', '"')
      .replaceAll('&apos;', "'"),
  );
}

async function getPublishedUrls() {
  const indexResponse = await fetch(new URL('/sitemap-index.xml', siteUrl));
  if (!indexResponse.ok) {
    throw new Error(`Could not read the deployed sitemap index (${indexResponse.status}).`);
  }

  const indexXml = await indexResponse.text();
  const indexLocations = sitemapLocations(indexXml);
  const sitemapFiles = indexXml.includes('<sitemapindex')
    ? indexLocations
    : [new URL('/sitemap-index.xml', siteUrl).href];
  const sitemapXmlFiles = await Promise.all(
    sitemapFiles.map(async (url) => {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Could not read sitemap ${url} (${response.status}).`);
      return response.text();
    }),
  );

  return sitemapXmlFiles
    .flatMap(sitemapLocations)
    .filter((url) => new URL(url).host === siteUrl.host);
}

async function submitUrls(urls, key) {
  const batches = [];
  for (let index = 0; index < urls.length; index += 10_000) {
    batches.push(urls.slice(index, index + 10_000));
  }

  for (const urlList of batches) {
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: siteUrl.host,
        key,
        keyLocation: new URL(`/${key}.txt`, siteUrl).href,
        urlList,
      }),
    });

    if (!response.ok && response.status !== 202) {
      const details = await response.text();
      throw new Error(`IndexNow rejected the URL batch (${response.status}): ${details}`);
    }
  }
}

const currentRef = process.env.VERCEL_GIT_COMMIT_SHA || process.argv[3] || 'HEAD';
const baseRef = process.env.VERCEL_GIT_PREVIOUS_SHA || process.argv[2] || `${currentRef}^`;
const changedPaths = getChangedPaths(baseRef, currentRef);

if (changedPaths.length === 0) {
  console.log(`No changed files between ${baseRef} and ${currentRef}; IndexNow was not called.`);
  process.exit(0);
}

const changedUrls = new Set();
let refreshAllPages = false;

for (const filePath of changedPaths) {
  if (
    filePath === 'astro.config.mjs' ||
    filePath.startsWith('src/layouts/') ||
    filePath.startsWith('src/components/') ||
    filePath.startsWith('src/styles/') ||
    filePath.startsWith('src/lib/')
  ) {
    refreshAllPages = true;
  }

  if (filePath.startsWith('src/pages/')) {
    const url = pageUrlFromSource(filePath);
    if (url === null) refreshAllPages = true;
    else if (url) changedUrls.add(url);
  } else if (filePath.startsWith('public/')) {
    const url = publicUrlFromSource(filePath);
    if (url) changedUrls.add(url);
  }
}

if (refreshAllPages) {
  for (const url of await getPublishedUrls()) changedUrls.add(url);
}

if (changedUrls.size === 0) {
  console.log('The deploy changed no indexable page URLs; IndexNow was not called.');
  process.exit(0);
}

const urls = [...changedUrls].sort();
await submitUrls(urls, await getKey());
console.log(`Submitted ${urls.length} changed URL(s) to IndexNow.`);
