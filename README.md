# BlightFall official website

This repository contains the static-first official website for **BlightFall** at
`https://blightfall.ca`. The initial release is a mobile-first pre-launch landing page and
permanent social-bio link page.

The repository is intentionally independent from the Roblox game code, internal production
systems, private calendars, and personal websites. It contains only public-site code, approved
brand assets, and confirmed public destinations.

No open-source licence has been granted. All rights are reserved unless a licence is added with
project-owner approval.

## Technology

- Astro with strict TypeScript
- Static HTML output with no database and no client framework
- No client-side JavaScript in the current pre-launch configuration
- Vitest for configuration tests
- Playwright and axe-core for browser and accessibility checks
- ESLint and Prettier for code quality
- GitHub Actions for checks only; there is no deployment workflow

Astro was selected because it produces portable static files, keeps client JavaScript opt-in, and
supports future Markdown news content without introducing a database or CMS.

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
src/config/site.ts       Release state, analytics mode, and all public links
src/components/          Shared link-hub UI and opt-in analytics integration
src/pages/               Home, permanent links page, privacy page, and 404
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

- Canonical domain is configured as `https://blightfall.ca` for generated metadata only.
- Production hosting, custom-domain attachment, analytics, DNS, and GitHub Pages are not configured.
- The existing domain email records must remain unchanged during any future deployment.
- Only the confirmed Discord destination is currently enabled.

See [Missing content](docs/MISSING_CONTENT.md), [Deployment](DEPLOYMENT.md), and
[Roadmap](ROADMAP.md) for the remaining approved work.
