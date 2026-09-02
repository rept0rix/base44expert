# Base44 Expert - Naor Yanko

Production-quality static lead-generation site for Base44 specialist services.

## About

This is a professional lead-generation site for Naor Yanko, who helps teams solve Base44 app issues including:
- Publish errors and deployment failures
- Custom domain setup and DNS configuration
- Entity schema problems and data display issues
- Connector configuration and API integration
- Production blockers and environment-specific bugs

Live site: [base44expert.com](https://base44expert.com)

## Tech Stack

- **Astro** - Static site generator
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety
- **Vercel** - Hosting (Hobby tier)

## Development

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Deployment

### Vercel (Recommended)

This site is designed to be deployed on Vercel's Hobby (free) tier.

#### First-time deployment:

1. Install Vercel CLI (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```
   
3. Follow the prompts. For production deployment:
   ```bash
   vercel --prod
   ```

#### Automatic deployments:

Connect your GitHub repository to Vercel for automatic deployments on push:

1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Select your repository
4. Vercel will auto-detect Astro and configure build settings
5. Click "Deploy"

### Custom Domain Setup

The domain `base44expert.com` is registered at Cloudflare (account ID: `79543deab8821f3201471a8b77bda7c3`).

#### After deploying to Vercel:

1. In Vercel dashboard, go to your project Settings → Domains
2. Add `base44expert.com` and `www.base44expert.com`
3. Vercel will show you the DNS records needed

#### In Cloudflare DNS:

Add these records (values will be provided by Vercel after adding the domain):

```
Type: A
Name: @
Value: [Vercel IP from Vercel dashboard]
Proxy: DNS only (gray cloud)

Type: CNAME
Name: www
Value: [Vercel domain from Vercel dashboard, e.g., cname.vercel-dns.com]
Proxy: DNS only (gray cloud)
```

**Important**: Use "DNS only" mode (gray cloud icon) in Cloudflare, not "Proxied" (orange cloud), to avoid SSL certificate issues with Vercel.

DNS propagation can take anywhere from a few minutes to 48 hours, but usually completes within 1-2 hours.

## Contact Form Setup

The contact form currently uses a placeholder. To make it functional:

### Option 1: Formspree (Recommended)

1. Sign up at [formspree.io](https://formspree.io)
2. Create a new form
3. Copy your form ID
4. Replace `YOUR_FORM_ID` in `/src/pages/contact.astro` with your actual form ID:
   ```
   action="https://formspree.io/f/YOUR_ACTUAL_FORM_ID"
   ```

### Option 2: Getform

1. Sign up at [getform.io](https://getform.io)
2. Create a new form
3. Copy your form endpoint
4. Replace the entire form action URL in `/src/pages/contact.astro`

### Option 3: Mailto Fallback

For a simple fallback without a service:

```html
<form action="mailto:your@email.com" method="post" enctype="text/plain">
```

Note: mailto forms have limitations and don't work well on all devices.

## Site Structure

- `/` - Home page
- `/work` - How it works / process
- `/base44-expert` - Base44 expertise page
- `/base44-not-working` - Troubleshooting guide
- `/custom-domains` - Custom domain setup guide
- `/contact` - Contact form / lead capture

## SEO Features

- Semantic HTML structure
- Meta descriptions on all pages
- Canonical URLs
- Sitemap.xml (auto-generated at build)
- robots.txt
- Mobile-responsive design
- Fast load times (static site)

## Quality Standards

This site follows production-quality standards:

- ✓ Real content (no lorem ipsum or placeholder text)
- ✓ Professional copy that doesn't sound AI-generated
- ✓ Mobile-first responsive design
- ✓ Accessible navigation and forms
- ✓ Fast static site performance
- ✓ SEO-optimized structure
- ✓ Clean, maintainable code

## License

Copyright 2026 Naor Yanko. All rights reserved.
