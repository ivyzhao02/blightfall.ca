import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const distRoot = fileURLToPath(new URL('../dist/', import.meta.url));
const host = '127.0.0.1';
const port = Number(process.env.PORT ?? 4321);
const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.webp': 'image/webp',
  '.xml': 'application/xml; charset=utf-8',
};

function safePath(pathname) {
  const decoded = decodeURIComponent(pathname);
  const route = decoded.endsWith('/') ? `${decoded}index.html` : decoded;
  const candidate = resolve(distRoot, `.${route}`);
  return candidate.startsWith(`${resolve(distRoot)}${sep}`) ? candidate : null;
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? '/', `http://${host}:${port}`);
    let filePath = safePath(url.pathname);

    if (filePath && extname(filePath) === '') {
      const directoryIndex = resolve(filePath, 'index.html');
      if (directoryIndex.startsWith(`${resolve(distRoot)}${sep}`)) filePath = directoryIndex;
    }

    if (!filePath || !(await stat(filePath).catch(() => null))?.isFile()) {
      filePath = resolve(distRoot, '404.html');
      response.statusCode = 404;
    }

    response.setHeader(
      'Content-Type',
      contentTypes[extname(filePath)] ?? 'application/octet-stream',
    );
    response.setHeader('Cache-Control', 'no-store');
    response.end(await readFile(filePath));
  } catch (error) {
    response.statusCode = 500;
    response.end('Local preview error');
    console.error(error);
  }
});

server.listen(port, host, () => {
  console.info(`Serving dist at http://${host}:${port}`);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
