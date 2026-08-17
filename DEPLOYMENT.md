# Deployment plan

The production site is deployed through GitHub Pages at `https://blightfall.ca`. Pushes to `main`
run validation and an Astro Pages deployment workflow. Cloudflare configuration has not been
performed.

## Recommended host

**GitHub Pages** is the current host because it provides straightforward static deployment from the
public repository without a paid GitHub plan. The output remains ordinary files in `dist/` and can
move to another static host.

Cloudflare Pages remains a future option if preview environments, configurable redirects, or response
headers become requirements. Moving the site would not itself authorize moving DNS or nameservers.

## Build contract

- Install: `npm ci`
- Build: `npm run build`
- Validation: `npm run validate:dist`
- Output directory: `dist`
- Node.js: 22.12 or newer

## Preview deployments

Pull requests run validation but do not receive automatic public preview deployments on the current
GitHub Pages setup. Use local preview for review, or approve a separate preview host later.

## Cloudflare Pages compatibility

Use the build contract above. Add `_headers` and `_redirects` files only after the final host is
selected; host-specific rules should not be assumed to work elsewhere. Recommended headers include a
tested Content Security Policy, `Referrer-Policy`, `X-Content-Type-Options`, and a conservative
`Permissions-Policy`.

## GitHub Pages compatibility

The site builds as static output for GitHub Pages. Keep Astro’s `site` value as
`https://blightfall.ca`. `.github/workflows/deploy.yml` builds and uploads the site using Astro’s
official Pages action; `.github/workflows/ci.yml` separately runs the complete validation suite.

GitHub Pages has more limited redirect and header controls than Cloudflare Pages. If stable short
routes and security headers are launch requirements, prefer a host with explicit support.

## Custom domain and HTTPS

The apex domain and `www` variant currently target GitHub Pages. If the host ever changes:

1. Add `blightfall.ca` to the new host and copy the exact verification/target values it provides.
2. Inventory the current DNS zone before any change.
3. Add only the required web record—typically an apex `A`/`AAAA` set, an apex flattening/ALIAS record,
   or a host-provided `CNAME` where the DNS provider permits it.
4. Optionally add `www` as a `CNAME` to the host and redirect it to the apex domain.
5. Wait for the host to issue HTTPS, then verify both the apex and `www` behaviour.

**Mail-preservation warning:** future DNS work must preserve the existing Zoho MX records and all
mail-related TXT/CNAME records. Do not change nameservers, remove MX records, enable conflicting mail
forwarding, or alter email routing as part of website deployment.

The exact DNS values cannot be documented until the host is selected; never fabricate them.

## Redirects and security headers

Implement stable routes using host-owned fixed mappings, never a user-supplied destination parameter.
See [docs/REDIRECTS.md](docs/REDIRECTS.md). Test redirects in preview before adding production DNS.

## Rollback

1. Identify the last verified commit and deployment in GitHub Actions.
2. Revert the faulty site commit without rewriting history and push the revert to `main`.
3. Verify `/`, `/links/`, `/privacy/`, metadata, and the primary destination.
4. If a destination caused the incident, disable it in `src/config/site.ts` and deploy a reviewed fix.
5. Record the incident and corrective action outside the public repository if it contains sensitive
   operational information.

DNS rollback is not the normal website rollback method. Avoid changing DNS for ordinary code/content
releases because propagation makes recovery slower and can endanger mail configuration.
