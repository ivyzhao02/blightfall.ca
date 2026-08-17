import { readFile, readdir } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const rootPath = fileURLToPath(root);
const dist = new URL('../dist/', import.meta.url);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function readDist(path) {
  return readFile(new URL(path, dist), 'utf8');
}

const pages = {
  home: await readDist('index.html'),
  studio: await readDist('studio/index.html'),
  projects: await readDist('projects/index.html'),
  blightfall: await readDist('projects/blightfall/index.html'),
  news: await readDist('news/index.html'),
  contact: await readDist('contact/index.html'),
  links: await readDist('links/index.html'),
  privacy: await readDist('privacy/index.html'),
  notFound: await readDist('404.html'),
};

const expected = [
  ['home', pages.home, 'https://blightfall.ca/'],
  ['studio', pages.studio, 'https://blightfall.ca/studio/'],
  ['projects', pages.projects, 'https://blightfall.ca/projects/'],
  ['blightfall', pages.blightfall, 'https://blightfall.ca/projects/blightfall/'],
  ['news', pages.news, 'https://blightfall.ca/news/'],
  ['contact', pages.contact, 'https://blightfall.ca/contact/'],
  ['links', pages.links, 'https://blightfall.ca/links/'],
  ['privacy', pages.privacy, 'https://blightfall.ca/privacy/'],
];

for (const [name, html, canonical] of expected) {
  assert(html.includes(`<link rel="canonical" href="${canonical}">`), `${name}: canonical URL`);
  assert(html.includes('<meta name="description"'), `${name}: description metadata`);
  assert(html.includes('<meta property="og:image"'), `${name}: Open Graph image`);
  assert(
    html.includes('<meta name="twitter:card" content="summary_large_image">'),
    `${name}: social card metadata`,
  );
  assert(html.includes('application/ld+json'), `${name}: structured data`);
  assert(!html.includes('href=""'), `${name}: empty link`);
  assert(!html.includes('undefined'), `${name}: undefined output`);
  assert(!html.includes('example.com'), `${name}: placeholder domain`);
  assert(!html.includes('<script type="module"'), `${name}: unexpected client JavaScript`);
}

assert(pages.notFound.includes('noindex, nofollow'), '404: noindex metadata');
assert(pages.notFound.includes('This path fades into the dark.'), '404: custom content');
assert(pages.home.includes('<h1 id="page-heading">Coming Soon</h1>'), 'home: approved headline');

for (const [name, html] of Object.entries(pages)) {
  assert(html.includes('"@type":"Organization"'), `${name}: studio structured data`);
  assert(!html.includes('"@type":"Corporation"'), `${name}: no corporate legal claim`);
  if (name === 'blightfall') {
    assert(html.includes('"@type":"VideoGame"'), `${name}: game structured data`);
  } else {
    assert(!html.includes('"@type":"VideoGame"'), `${name}: no site-level game schema`);
  }
  assert(
    !/\b(incorporated|corporation|limited liability company|LLC)\b/i.test(html),
    `${name}: no unapproved legal status`,
  );
}

assert(pages.home.includes('independent game studio'), 'home: studio-level metadata');

for (const [name, html] of Object.entries(pages)) {
  assert(!/(datePublished|releaseDate)/i.test(html), `${name}: unapproved release date property`);
  assert(
    !/(internal-only|restricted-reference|private calendar|recovery code|webhook URL)/i.test(html),
    `${name}: internal material`,
  );
  assert(
    !/(plausible\.io|cloudflareinsights\.com)/i.test(html),
    `${name}: analytics unexpectedly active`,
  );
}

const enabledExternalAnchors = [
  ...pages.links.matchAll(/<a[^>]+href="(https:\/\/[^\"]+)"[^>]*>/g),
].map((match) => match[1]);
assert(
  JSON.stringify([...new Set(enabledExternalAnchors)]) ===
    JSON.stringify([
      'https://discord.gg/blightfall',
      'https://www.youtube.com/@BlightFallRoblox',
      'https://www.tiktok.com/@blightfallroblox',
      'https://www.instagram.com/blightfallroblox/',
      'https://x.com/BlightFallRblx',
      'https://bsky.app/profile/blightfallroblox.bsky.social',
    ]),
  'links: only confirmed external destinations may render',
);

const robots = await readDist('robots.txt');
assert(robots.includes('Sitemap: https://blightfall.ca/sitemap-index.xml'), 'robots: sitemap URL');
const sitemapIndex = await readDist('sitemap-index.xml');
assert(
  sitemapIndex.includes('https://blightfall.ca/sitemap-0.xml'),
  'sitemap index: child sitemap',
);
const sitemap = await readDist('sitemap-0.xml');
for (const url of [
  'https://blightfall.ca/',
  'https://blightfall.ca/studio/',
  'https://blightfall.ca/projects/',
  'https://blightfall.ca/projects/blightfall/',
  'https://blightfall.ca/news/',
  'https://blightfall.ca/contact/',
  'https://blightfall.ca/links/',
  'https://blightfall.ca/privacy/',
]) {
  assert(sitemap.includes(`<loc>${url}</loc>`), `sitemap: ${url}`);
}
assert(!sitemap.includes('/404'), 'sitemap: 404 excluded');

JSON.parse(await readDist('site.webmanifest'));

const secretPatterns = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /github_pat_[A-Za-z0-9_]{20,}/,
  /gh[pousr]_[A-Za-z0-9]{20,}/,
  /AKIA[0-9A-Z]{16}/,
  /DISCORD_BOT_TOKEN\s*=\s*\S+/,
  /CLOUDFLARE_API_TOKEN\s*=\s*\S+/,
  /PLAUSIBLE_API_KEY\s*=\s*\S+/,
];
const textExtensions = new Set([
  '.astro',
  '.css',
  '.html',
  '.js',
  '.json',
  '.md',
  '.mjs',
  '.ts',
  '.txt',
  '.yaml',
  '.yml',
]);
const ignoredDirectories = new Set([
  '.astro',
  '.git',
  'dist',
  'node_modules',
  'playwright-report',
  'test-results',
]);

async function scanDirectory(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      await scanDirectory(path);
      continue;
    }
    if (!textExtensions.has(extname(entry.name))) continue;
    const content = await readFile(path, 'utf8');
    for (const pattern of secretPatterns) {
      assert(!pattern.test(content), `potential secret in ${relative(rootPath, path)}`);
    }
  }
}

await scanDirectory(rootPath);
console.info('Validated generated pages, metadata, sitemap, public links, and secret patterns.');
