# Content maintenance

## Links

All destinations are in `src/config/site.ts`. Each entry has a label, URL, platform, icon, order,
enabled state, presentation, and optional analytics identifier.

To add or update a destination:

1. Confirm the exact official `https://` URL from an approved current source.
2. Add the URL to the existing entry.
3. Set `enabled: true` only when it is ready for public use.
4. Run `npm run check`, `npm run check:links`, and `npm run test:e2e`.
5. Review `/` and `/links/` at mobile and desktop widths.

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

- Keep `siteConfig.description` aligned with approved stable game pillars.
- Page-specific titles and descriptions live in `src/pages/`.
- Do not add a release date to structured data until approved.
- Keep social-image dimensions at 1200×630 and use approved assets only.
- Update the privacy page before enabling analytics or any data collection.

## Approved asset replacements

Place optimized public exports in `public/assets/`, icons in `public/icons/`, and sharing previews in
`public/social/`. Preserve aspect ratio, alternative text, and explicit width/height attributes.
Source files and private production libraries should stay outside this repository.
