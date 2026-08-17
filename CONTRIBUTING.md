# Contributing

BlightFall’s website is privately maintained. Contribution access does not authorize publication,
deployment, DNS changes, new public claims, or use of internal production material.

## Safe contribution rules

- Keep all work inside this repository.
- Use only approved public copy, destinations, and visual assets.
- Do not add credentials, recovery data, private addresses, webhooks, analytics secrets, schedules,
  unreleased media, operational records, or restricted references.
- Do not add a licence without project-owner approval.
- Do not enable a link until its exact official URL has been confirmed.
- Do not publish a release date, gameplay metric, player count, quote, biography, or implementation
  claim without explicit current approval.
- Preserve the existing domain’s email configuration in all deployment proposals.

## Development workflow

1. Create a focused branch.
2. Make the smallest scoped change.
3. Run `npm run check`.
4. Install Chromium once and run `npm run test:e2e` for UI or content changes.
5. Run `npm run check:links` when changing an enabled destination.
6. Review the complete diff for public-safety and unrelated files.

Pull requests should explain the public outcome, list any new facts or assets and their approval
source, and report the commands run. Deployment remains a separate approval-gated action.
