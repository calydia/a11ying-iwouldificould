import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const fixturesDir = join(__dirname, 'fixtures');

function loadFixture(name) {
  const raw = readFileSync(join(fixturesDir, name), 'utf-8');
  return JSON.parse(raw);
}

const fixtures = {
  frontPage: loadFixture('frontPage.json'),
  blogCards: loadFixture('blogCards.json'),
  mainNav: loadFixture('mainNav.json'),
  footerNav: loadFixture('footerNav.json'),
  drupalBlog: loadFixture('drupalBlog.json'),
};

const server = createServer((req, res) => {
  if (!req.url) {
    res.writeHead(400);
    res.end('Bad request');
    return;
  }

  if (req.url.startsWith('/api/globals/frontPage')) {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify(fixtures.frontPage));
    return;
  }

  if (req.url.startsWith('/api/globals/mainNav')) {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify(fixtures.mainNav));
    return;
  }

  if (req.url.startsWith('/api/globals/footerNav')) {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify(fixtures.footerNav));
    return;
  }

  if (req.url.startsWith('/api/blogCards')) {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify(fixtures.blogCards));
    return;
  }

  if (req.url.startsWith('/blogs/node/article')) {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify(fixtures.drupalBlog));
    return;
  }

  res.writeHead(404, { 'content-type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

const port = Number(process.env.MOCK_SERVER_PORT || 4010);
server.listen(port, '127.0.0.1', () => {
  console.log(`Mock server running at http://127.0.0.1:${port}`);
});
