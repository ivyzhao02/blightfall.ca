# Content maintenance

## Studio and project scope

- `src/content/studio.ts` contains public-safe studio-level identity.
- `src/content/projects.ts` contains game-specific records. BlightFall is currently the featured
  project, but the model supports additional games.
- `src/content/team.ts` and `src/content/news.ts` remain empty until approved records exist.
- `src/content/contact.ts` contains the approved public inquiry categories and email aliases.
- `src/pages/projects/` renders the project index and individual public project pages.
- `src/pages/studio.astro`, `news.astro`, and `contact.astro` provide the studio-level routes.

Site-level metadata may use “independent game studio” or “development team.” Do not use a legal name,
incorporation claim, address, founding history, or other legal-entity description without explicit
approval. Game descriptions and implementation claims remain project-scoped and pre-alpha.

## Links

All destinations are in `src/config/site.ts`. Each entry has a label, URL, platform, icon, order,
enabled state, presentation, and optional analytics identifier.

To add or update a destination:

1. Confirm the exact official `https://` URL from an approved current source.
2. Add the URL to the existing entry.
3. Set `enabled: true` only when it is ready for public use.
4. Run `npm run check`, `npm run check:links`, and `npm run test:e2e`.
5. Review `/`, `/links/`, `/contact/`, and any affected project page at mobile and desktop widths.

Disabled or URL-less entries are deliberately omitted from the rendered site.

## Release state and primary action

`siteConfig.release.state` accepts `prelaunch`, `launch`, or `live`.

- `prelaunch` requires the confirmed `discord` link and makes it primary.
- `launch` requires an enabled `play` link.
- `live` requires an enabled `play` link.

Before changing to `launch` or `live`, add the approved Roblox game URL to the `play` entry, enable it,
and set `showPlayNow: true`. The build intentionally fails if the selected state has no confirmed
primary destination.

`launchDate`, `showLaunchDate`, and `showCountdown` are separate controls. Leave all three off until a
date is approved for public release. Use an ISO 8601 value with an explicit time zone when approved.

Newsletter and announcement prompts are also opt-in. Do not enable newsletter UI until a provider,
consent language, retention policy, and privacy-page update are approved.

## Copy and metadata

- Keep `siteConfig.description` studio-level and legally neutral.
- Keep gameplay copy in the relevant project record rather than the studio profile.
- Page-specific titles and descriptions live in `src/pages/`.
- Do not add a release date to structured data until approved.
- Use `Organization` structured data for the studio site and `VideoGame` only on game-specific pages.
- Keep social-image dimensions at 1200×630 and use approved assets only.
- Update the privacy page before enabling analytics or any data collection.

## Team, news, and contact

Publish a team member only after their name, role, biography, image, and optional links have all been
approved for public use. Keep unapproved records out of the repository rather than storing them as
hidden drafts.

Every news entry must declare whether it is studio-level or tied to a project. Discord is currently
the authoritative public location for game announcements; the website links there without embedding
or synchronizing messages. Only add an item to the website archive after its copy is approved for
publication.

The News page's official server-status image is configured in `src/config/site.ts`. It shows the
server name and live online count but no member list or messages. If it is removed or replaced,
review the related disclosure on the Privacy page.

Approved public inquiry categories live in `src/content/contact.ts`. Keep unlisted aliases private.
A contact form must remain absent until its provider, destination routing, spam protection, retention,
consent language, and privacy impact are decided. Request only the information genuinely needed to
answer the inquiry.

## Approved asset replacements

Place optimized public exports in `public/assets/`, icons in `public/icons/`, and sharing previews in
`public/social/`. Preserve aspect ratio, alternative text, and explicit width/height attributes.
Source files and private production libraries should stay outside this repository.
