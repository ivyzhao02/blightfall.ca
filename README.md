# BlightFall official website

This repository contains the static-first official website for **BlightFall** at
`https://blightfall.ca`. BlightFall is the intended name of the independent game studio and its
current flagship Roblox game. The studio is not described as an incorporated company or other
specific legal entity. The current release includes a studio homepage, scalable project area,
dedicated flagship-game page, news and contact foundations, and a permanent social-bio link page.

The repository is intentionally independent from the Roblox game code, internal production
systems, private calendars, and personal websites. It contains only public-site code, approved
brand assets, and confirmed public destinations.

No open-source licence has been granted. All rights are reserved unless a licence is added with
project-owner approval.

## Technology

- Astro with strict TypeScript
- Static HTML output with no database and no client framework
- Minimal client-side JavaScript, limited to aggregate live Discord community statistics
- Vitest for configuration tests
- Playwright and axe-core for browser and accessibility checks
- ESLint and Prettier for code quality
- GitHub Actions for validation and deployment to GitHub Pages

Astro was selected because it produces portable static files, keeps client JavaScript opt-in, and
supports future Markdown news content without introducing a database or CMS. Studio, project, team,
and news records are separate so another game can be added without restructuring the website.

## Local development

Requires Node.js 22.12 or newer.

```sh
npm ci
npm run dev
```

The main commands are:

```sh
npm run format:check   # formatting
npm run lint           # linting
npm run typecheck      # Astro and TypeScript checks
npm run test:unit      # configuration tests
npm run build          # production build to dist/
npm run validate:dist  # generated-page, metadata, sitemap, and safety checks
npm run check:links    # live check of enabled external destinations
npm run test:e2e       # viewport, keyboard, reduced-motion, and axe checks
npm run check          # deterministic local/CI checks except browser tests
```

Install the Chromium test browser once before running browser tests:

```sh
npx playwright install chromium
```

## Project structure

```text
src/config/site.ts       Site settings, release state, analytics mode, and public links
src/content/             Separate studio, project, team, and news models
src/components/          Shared navigation, footer, link UI, and opt-in analytics integration
src/pages/               Studio home, projects, news, contact, links, privacy, and 404
src/styles/global.css    Brand-aligned responsive design system
public/                  Approved web assets, icons, robots, and manifest
tests/                   Configuration and browser validation
docs/                    Maintenance, decisions, missing content, and redirects
```

## Updating links and release state

Edit [`src/config/site.ts`](src/config/site.ts). A link renders only when both `enabled: true` and a
confirmed `https://` URL are present. Do not add guessed handles, placeholder URLs, or unpublished
Roblox destinations.

The same file controls `prelaunch`, `launch`, and `live`. Before switching to `launch` or `live`, add
and enable the confirmed `play` URL and set `showPlayNow: true`. The build fails if the selected
release state lacks its required primary destination. Launch dates and countdowns remain off unless
an approved date is supplied.

See [Content maintenance](docs/CONTENT_MAINTENANCE.md) for the full safe update procedure.

## Current status

- The site is deployed to GitHub Pages at `https://blightfall.ca` from pushes to `main`.
- Domain verification, apex DNS, and the `www` redirect are configured without changing Zoho mail.
- Analytics remains disabled and the site sets no analytics cookies.
- Discord, YouTube, TikTok, Instagram, X, and Bluesky are confirmed and enabled.
- The news page directs visitors to the official Discord announcement source without embedding or
  synchronizing messages.
- A site-native Discord panel on the News page shows aggregate member and online counts without
  exposing usernames or a member list.
- Categorized general, business, press, support, and privacy email routes are published; no hosted
  contact form or submission storage is active.
- The Roblox group is confirmed and enabled. The public game and current trailer destinations remain
  disabled until confirmed.
- Studio-level metadata identifies BlightFall as an independent game studio; game-specific copy
  remains scoped to the flagship pre-alpha Roblox project.

See [Missing content](docs/MISSING_CONTENT.md), [Deployment](DEPLOYMENT.md), and
[Roadmap](ROADMAP.md) for the remaining approved work.
