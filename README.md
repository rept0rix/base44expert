# Base44 Expert

Professional marketing site for **Base44 Expert** — a specialist studio that unsticks stuck Base44 apps.

## About

Base44 Expert helps teams solve Base44 app issues including:
- Publish errors and deployment failures
- Custom domain setup and DNS configuration
- Entity schema problems and data display issues
- Connector configuration and API integration
- Production blockers and environment-specific bugs

**Important:** The brand is **Base44 Expert** (the specialist studio), not a personal name. The site reflects a studio identity serving Base44 developers who need expert troubleshooting.

Live site: [base44expert.vercel.app](https://base44expert.vercel.app)

Built by Naor Yanko, who also created [FixTheBase](https://fixthebase.com), a Base44 app for generating entity schemas and queries.

## Tech Stack

- **Astro 7** - Static site generator
- **Tailwind CSS 4** - Styling with custom design tokens
- **TypeScript** - Type safety
- **Vercel** - Hosting (Hobby tier)

## Design System

The site uses a professional teal and slate color palette with custom design tokens:

- **Brand Colors**: Teal (primary), Slate (text/backgrounds)
- **Typography**: System font stack optimized for readability
- **Components**: Logo SVG, custom navigation, responsive layouts
- **Visual Identity**: Logo mark + wordmark in `/public/logo.svg`

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

#### Automatic deployments:

The site is connected to this GitHub repository for automatic deployments on push to `main`.

Any push to the `main` branch triggers a new production deployment on Vercel.

### Custom Domain Setup

The domain `base44expert.com` is registered at Cloudflare.

DNS configuration:
1. In Vercel dashboard: Settings → Domains
2. Add `base44expert.com` and `www.base44expert.com`
3. Configure DNS records at Cloudflare as instructed by Vercel
4. Use "DNS only" mode (gray cloud icon), not "Proxied" (orange cloud)

DNS propagation typically completes within 1-2 hours.

## Contact Form Setup

The contact form uses a placeholder Formspree ID. To make it functional:

### Option 1: Formspree (Recommended)

1. Sign up at [formspree.io](https://formspree.io)
2. Create a new form
3. Copy your form ID
4. Replace `YOUR_FORM_ID` in `/src/pages/contact.astro` with your actual form ID

### Option 2: Getform

1. Sign up at [getform.io](https://getform.io)
2. Create a new form
3. Replace the entire form action URL in `/src/pages/contact.astro`

## Site Structure

- `/` - Home page
- `/work` - Process/how we work
- `/base44-expert` - Base44 expertise page
- `/base44-not-working` - Troubleshooting guide
- `/custom-domains` - Custom domain setup guide
- `/contact` - Contact form

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

- ✓ Real content (no lorem ipsum)
- ✓ Professional copy that sounds human
- ✓ Mobile-first responsive design
- ✓ Accessible navigation and forms
- ✓ Fast static site performance
- ✓ SEO-optimized structure
- ✓ Professional visual identity
- ✓ Clean, maintainable code

## License

Copyright 2026 Base44 Expert. All rights reserved.
Built by Naor Yanko.
