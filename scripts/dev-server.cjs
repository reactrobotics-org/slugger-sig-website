const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const port = Number(process.env.PORT || 5173);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

function reply(res, status, message) {
  res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end(message);
}

const server = http.createServer(async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    return reply(res, 405, 'Method not allowed');
  }
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch {
    return reply(res, 400, 'Invalid URL');
  }
  // Only serve public website files; keep Git and development files private.
  if (pathname.includes('\\') || pathname.includes('\0') ||
      pathname.split('/').some(part => part.startsWith('.')) ||
      !['/', '.html', '.css', '.js', '.json', '.svg', '.png', '.jpg', '.jpeg',
        '.gif', '.webp', '.ico', '.pdf', '.woff', '.woff2'].includes(
          pathname.endsWith('/') ? '/' : path.extname(pathname).toLowerCase()) ||
      /^\/(scripts|node_modules)(\/|$)/i.test(pathname) ||
      /^\/package(?:-lock)?\.json$/i.test(pathname)) {
    return reply(res, 404, 'Not found');
  }
  const file = path.resolve(root, '.' + pathname, pathname.endsWith('/') ? 'index.html' : '');
  const relative = path.relative(root, file);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    return reply(res, 404, 'Not found');
  }
  try {
    const data = await fs.readFile(file);
    res.writeHead(200, {
      'Content-Type': types[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'Content-Length': data.length,
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff'
    });
    res.end(req.method === 'HEAD' ? undefined : data);
  } catch (error) {
    if (['ENOENT', 'EISDIR', 'ENOTDIR'].includes(error.code)) {
      reply(res, 404, 'Not found');
    } else {
      console.error(error.message);
      reply(res, 500, 'Unable to read file');
    }
  }
});

server.on('error', error => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Stop the other preview server, or set PORT to another number.`);
  } else {
    console.error(error.message);
  }
  process.exitCode = 1;
});
server.listen(port, '127.0.0.1', () => {
  console.log(`\nWebsite preview: http://127.0.0.1:${port}\nSave changes and refresh your browser to see them.\nPress Ctrl+C to stop.\n`);
});
