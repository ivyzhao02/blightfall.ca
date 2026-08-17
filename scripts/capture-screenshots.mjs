import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const baseURL = 'http://127.0.0.1:4321';
const output = new URL('../docs/screenshots/', import.meta.url);
await mkdir(output, { recursive: true });

let server;

async function waitForServer() {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      const response = await fetch(baseURL);
      if (response.ok) return;
    } catch {
      // Preview server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error('Preview server did not start.');
}

try {
  try {
    const existing = await fetch(baseURL);
    if (!existing.ok) throw new Error('Preview server is not ready.');
  } catch {
    const astroCli = fileURLToPath(new URL('../node_modules/astro/astro.js', import.meta.url));
    server = spawn(process.execPath, [astroCli, 'preview', '--host', '127.0.0.1'], {
      cwd: fileURLToPath(new URL('../', import.meta.url)),
      stdio: 'ignore',
    });
  }
  await waitForServer();
  const browser = await chromium.launch();
  for (const viewport of [
    { name: 'desktop', width: 1440, height: 1000 },
    { name: 'mobile', width: 390, height: 844 },
  ]) {
    const page = await browser.newPage({ viewport });
    for (const route of [
      { name: 'home', path: '/' },
      { name: 'links', path: '/links/?utm_source=instagram' },
    ]) {
      await page.goto(`${baseURL}${route.path}`, { waitUntil: 'networkidle' });
      await page.screenshot({
        path: fileURLToPath(new URL(`${route.name}-${viewport.name}.png`, output)),
        fullPage: true,
      });
    }
    await page.close();
  }
  await browser.close();
  console.info('Captured desktop and mobile screenshots for / and /links/.');
} finally {
  server?.kill();
}
