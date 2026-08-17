# Deployment plan

No production deployment, custom-domain attachment, DNS change, GitHub Pages configuration, or
Cloudflare configuration has been performed.

## Recommended host

**Cloudflare Pages** is the recommended first option because it supports static Astro builds,
automatic preview deployments, atomic production releases, redirects, and response headers. It also
keeps the site portable: the output is ordinary files in `dist/` and can move to another static host.

Cloudflare Pages should not be confused with moving DNS or nameservers to Cloudflare. A Pages project
can be evaluated before any production domain decision. Do not enable Cloudflare Web Analytics until
its privacy impact and the matching privacy-page update are approved.

## Build contract

- Install: `npm ci`
- Build: `npm run build`
- Validation: `npm run validate:dist`
- Output directory: `dist`
- Node.js: 22.12 or newer

## Preview deployments

Connect the private repository to the selected host with least-privilege read access. Configure pull
requests and non-default branches as preview-only. A preview URL must not claim that `blightfall.ca`
is live and should be reviewed for public-safe content before sharing.

## Cloudflare Pages compatibility

Use the build contract above. Add `_headers` and `_redirects` files only after the final host is
selected; host-specific rules should not be assumed to work elsewhere. Recommended headers include a
tested Content Security Policy, `Referrer-Policy`, `X-Content-Type-Options`, and a conservative
`Permissions-Policy`.

## GitHub Pages compatibility

The site builds as static output and is compatible with GitHub Pages. For the root custom domain,
keep Astro’s `site` value as `https://blightfall.ca`. A future Pages workflow would need to build and
upload `dist/`, but the current Actions workflow deliberately validates only and does not deploy.

GitHub Pages has more limited redirect and header controls than Cloudflare Pages. If stable short
routes and security headers are launch requirements, prefer a host with explicit support.

## Custom domain and HTTPS

After hosting is approved:

1. Add `blightfall.ca` to the host and copy the exact verification/target values it provides.
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

1. Identify the last verified production deployment in the host’s deployment history.
2. Promote or roll back to that immutable deployment.
3. Verify `/`, `/links/`, `/privacy/`, metadata, and the primary destination.
4. If a destination caused the incident, disable it in `src/config/site.ts` and deploy a reviewed fix.
5. Record the incident and corrective action outside the public repository if it contains sensitive
   operational information.

DNS rollback is not the normal website rollback method. Avoid changing DNS for ordinary code/content
releases because propagation makes recovery slower and can endanger mail configuration.
