# Architecture decisions

## ADR-001: Astro static output

**Status:** accepted

Astro with strict TypeScript produces portable static files, keeps client JavaScript opt-in, and can
later add Markdown news collections. A database, client framework, and CMS are unnecessary for the
initial release.

## ADR-002: One public configuration authority

**Status:** accepted

`src/config/site.ts` owns release state, primary-action selection, analytics mode, and public
destinations. Both `/` and `/links/` render the shared `LinkHub` component from this data. The homepage
can later expand while `/links/` remains stable.

Unconfirmed links are retained as disabled configuration records with null URLs. This preserves
priority and maintenance structure without generating broken or guessed buttons.

## ADR-003: Build-time release safeguards

**Status:** accepted

The configured release state must have an enabled primary destination. Switching to `launch` or
`live` before enabling the approved `play` URL fails the build. Release-date and countdown controls
also require a non-null date.

## ADR-004: Approved static assets only

**Status:** accepted

The site uses current approved BlightFall exports. Web copies are isolated in `public/`; the original
production library is not imported. No unrelated fantasy symbols, generated artwork, or unapproved
fonts are included.

## ADR-005: Analytics disabled by default

**Status:** accepted

The initial build loads no analytics script, sets no analytics cookies, and ships no analytics client
JavaScript. The optional component supports Plausible page views and outbound events or Cloudflare Web
Analytics page views after approval and configuration. Provider activation requires a privacy review.

## ADR-006: Host-neutral application layer

**Status:** accepted

The application emits ordinary static files. Host-specific redirects and headers are deferred until
hosting is selected, preventing premature coupling and unreviewed production changes.
