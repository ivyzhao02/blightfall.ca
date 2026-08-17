import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../dist/links/index.html', import.meta.url), 'utf8');
const urls = [
  ...new Set(
    [...html.matchAll(/<a[^>]+href="(https:\/\/[^\"]+)"[^>]*>/g)].map((match) => match[1]),
  ),
];

if (urls.length === 0)
  throw new Error('No enabled external destinations found in the built link page.');

for (const url of urls) {
  const response = await fetch(url, {
    redirect: 'follow',
    signal: AbortSignal.timeout(15_000),
    headers: { 'user-agent': 'BlightFall-site-link-check/1.0' },
  });
  const reachable = response.status < 400 || [403, 405, 429].includes(response.status);
  if (!reachable) throw new Error(`${url} returned HTTP ${response.status}`);
  console.info(`${url} -> HTTP ${response.status} (${response.url})`);
}
