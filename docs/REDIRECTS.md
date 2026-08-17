# Stable redirect and short-link plan

Planned routes:

| Route        | Intended fixed destination         |
| ------------ | ---------------------------------- |
| `/discord`   | Confirmed Discord invite           |
| `/play`      | Public Roblox game after release   |
| `/roblox`    | Official Roblox group or community |
| `/youtube`   | Official YouTube channel           |
| `/tiktok`    | Official TikTok profile            |
| `/instagram` | Official Instagram profile         |
| `/x`         | Official X profile                 |
| `/bluesky`   | Official Bluesky profile           |
| `/press`     | Future first-party press page      |

## Implementation rules

- Store destinations in the same reviewed configuration authority as the link hub or generate
  host-specific fixed redirect rules from it.
- Never accept a destination from a query string, path parameter, form value, or request header. This
  prevents open redirects.
- Use temporary redirects while destinations are being validated; move to permanent redirects only
  when route semantics are stable.
- Preserve query parameters only when they are safe campaign parameters and the host has an explicit
  allowlist.
- Measure aggregate route requests at the host or approved analytics layer without cookies or
  fingerprinting.
- Provide a first-party fallback page when an external service is unavailable.
- Test every route in preview and production after a destination change.

Redirects remain unimplemented until hosting is selected because syntax and analytics support differ
across Cloudflare Pages, GitHub Pages, and other static hosts.
