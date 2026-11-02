// @ts-check
import { readdirSync, readFileSync } from 'node:fs';
import { extname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));
const pagesDirectory = join(projectRoot, 'src', 'pages');

function normalizePathname(pathname) {
  return pathname.replace(/\/+$/, '') || '/';
}

function pageRouteFromFile(filePath) {
  const routePath = relative(pagesDirectory, filePath)
    .split(sep)
    .join('/')
    .replace(/\.(astro|md|mdx)$/, '');
  const segments = routePath.split('/');

  if (segments.some((segment) => /^\[.*\]$/.test(segment))) return null;
  if (segments.at(-1) === 'index') segments.pop();

  return normalizePathname(`/${segments.join('/')}`);
}

function findUpdatedDates(directory = pagesDirectory, result = new Map()) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const filePath = join(directory, entry.name);
    if (entry.isDirectory()) {
      findUpdatedDates(filePath, result);
      continue;
    }

    if (!['.astro', '.md', '.mdx'].includes(extname(filePath))) continue;
    const source = readFileSync(filePath, 'utf8');
    const frontmatter = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1];
    if (!frontmatter) continue;

    const updatedDate =
      frontmatter.match(/(?:^|\n)\s*(?:export\s+)?(?:const|let|var)\s+updatedDate\s*=\s*(?:new Date\()?['"]([^'"]+)['"]\)?/m)?.[1] ??
      frontmatter.match(/(?:^|\n)\s*updatedDate:\s*['"]?([^'"\s#]+)['"]?\s*(?:#.*)?$/m)?.[1];
    const routePath = pageRouteFromFile(filePath);

    if (updatedDate && routePath) {
      const lastmod = new Date(updatedDate);
      if (!Number.isNaN(lastmod.getTime())) result.set(routePath, lastmod);
    }
  }

  return result;
}

const updatedDatesByPath = findUpdatedDates();

// https://astro.build/config
export default defineConfig({
  site: 'https://www.base44expert.com',
  output: 'static',
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [
    sitemap({
      filter: (page) => !/^\/admin(?:\/|$)/.test(new URL(page).pathname),
      serialize(item) {
        const pathname = normalizePathname(new URL(item.url).pathname);
        const lastmod = updatedDatesByPath.get(pathname);
        return lastmod ? { ...item, lastmod } : item;
      },
    }),
  ]
});
