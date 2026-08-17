# Architecture decisions

## ADR-001: Astro static output

**Status:** accepted

Astro with strict TypeScript produces portable static files, keeps client JavaScript opt-in, and can
later add Markdown news collections. A database, client framework, and CMS are unnecessary for the
initial release.

## ADR-002: One public link and release authority

**Status:** accepted

`src/config/site.ts` owns release state, primary-action selection, analytics mode, and public
destinations. Both `/` and `/links/` render the shared `LinkHub` component from this data. The homepage
can expand while `/links/` remains stable.

Unconfirmed links are disabled records with null URLs. This preserves priority and maintenance
structure without generating broken or guessed buttons.

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

## ADR-007: Studio-level website with project-scoped games

**Status:** accepted

BlightFall names both the independent development studio/team and its flagship Roblox game. The site
is therefore organized around the studio, not permanently around one title. Existing game branding
can serve as the initial studio identity without making the layout or data model single-project.

Site-level metadata uses the broad Schema.org `Organization` type and the legally neutral descriptor
“independent game studio.” This does not claim incorporation or a specific legal entity. Dedicated
game pages may add `VideoGame` structured data from the relevant approved project record.

## ADR-008: Separate studio, project, team, and news models

**Status:** accepted

`src/content/` separates:

- `studio.ts` for public-safe studio identity
- `projects.ts` for game-specific records
- `team.ts` for individually approved public profiles
- `news.ts` for explicitly studio- or project-scoped announcements

Team and news collections start empty. Unapproved personal information and draft announcements stay
outside the repository rather than being hidden in source. Additional games can be added as project
records before routes or navigation are expanded.

## ADR-009: Contact collection remains absent by default

**Status:** accepted

A contact form is not a harmless placeholder. It will not be implemented until the destination, spam
protection, data retention, consent language, privacy disclosure, and minimum required fields are
approved. The form must not request unnecessary personal information.

## ADR-010: Studio homepage and permanent link utility have different layouts

**Status:** accepted

The homepage uses a wide editorial composition with global navigation, a flagship-project feature,
and studio-level sections. `/links/` remains a compact, durable social-bio destination backed by the
same central configuration. This prevents the public website from reading as a single profile card
while keeping the link route fast and easy to maintain.

Public navigation exposes only useful routes with approved copy. Team data remains modeled but a
team route is deferred until approved profiles exist, avoiding an empty or speculative public page.

## ADR-011: Contact routes use direct email links before a hosted form

**Status:** accepted

The public contact directory routes general, business, press, support, and privacy inquiries to
approved Zoho aliases using direct `mailto:` links. The site does not collect, relay, or retain form
submissions. A hosted form remains deferred until its provider, destination routing, spam controls,
retention, consent language, and privacy impact are approved.

## ADR-012: Discord is the current announcement source, not an embedded feed

**Status:** accepted

The news page identifies the official BlightFall Discord as the current source and links visitors to
it. Discord's official server widget does not expose channel messages, while reading announcements
through the API requires an authenticated application and channel permissions. The public site will
not add an unapproved bot, synchronization process, or credential.

The News page uses Discord's unauthenticated PNG widget endpoint to display the server icon, name,
and live online count. It deliberately avoids the iframe member list, requires no client-side
JavaScript, sends no site referrer, and is disclosed on the Privacy page. The widget is an invitation
to the community, not an announcement feed or source of website content.

A future website archive can use approved, intentionally published news records, or a separately
reviewed synchronization design with strict public-channel and data boundaries.
