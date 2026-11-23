/**
 * PanierMalin — Serveur statique local léger (zéro dépendance externe)
 * Lit optionnellement .env (APP_PORT) et sert l'application sur http://localhost:5500
 */
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const ENV_PATH = path.join(ROOT, '.env');

if (fs.existsSync(ENV_PATH)) {
  for (const rawLine of fs.readFileSync(ENV_PATH, 'utf8').split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq > 0) {
      const k = line.slice(0, eq).trim();
      const v = line.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
      if (!(k in process.env)) process.env[k] = v;
    }
  }
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.json': 'application/json; charset=utf-8'
};

const PORT = Number(process.env.APP_PORT || 5500);

const server = http.createServer((req, res) => {
  const reqPath = (req.url || '/').split('?')[0];
  const rel = reqPath === '/' ? 'index.html' : reqPath.replace(/^\/+/, '');
  const full = path.resolve(ROOT, rel);

  if (!full.startsWith(ROOT) || !fs.existsSync(full) || fs.statSync(full).isDirectory()) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Ressource introuvable');
    return;
  }

  const ext = path.extname(full).toLowerCase();
  res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
  fs.createReadStream(full).pipe(res);
});

server.listen(PORT, () => {
  console.log(`\nPanierMalin prêt sur http://localhost:${PORT}\n`);
});
