// Emits a real index.html for every client-side route (npm postbuild).
//
// Why: GitHub Pages serves 404.html for any path with no matching file, and
// serves it with an HTTP 404 status. The SPA router then renders the correct
// page, so humans never notice — but crawlers read 404 as "this URL does not
// exist" and will not index it, no matter what the sitemap claims. Before
// this script, every route except / returned 404.
//
// Writing build/<route>/index.html makes each route a real file, so the host
// serves it with a 200.
//
// Scope: this fixes the status code, not the payload. Each file is a copy of
// the same client-rendered shell, so JS-less crawlers still see an empty
// page. Per-route markup needs prerendering or SSG — a separate job.
//
// Never fails the build: if Sanity is unreachable the static routes are still
// written and the script exits 0.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { STATIC_ROUTES, REDIRECT_ROUTES, POSTS_QUERY, query, isSafeSlug } from './site-routes.mjs';

const BUILD_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'build');

const shell = readFileSync(join(BUILD_DIR, 'index.html'));

// The catch-all. Still needed: it covers genuinely unknown URLs, which should
// keep returning 404.
writeFileSync(join(BUILD_DIR, '404.html'), shell);

function writeRoute(path) {
  if (path === '/') return false; // build/index.html already is this file
  const dir = join(BUILD_DIR, path);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), shell);
  return true;
}

let posts = [];
try {
  posts = await query(POSTS_QUERY);
} catch (err) {
  console.warn(`routes: Sanity unreachable, writing static routes only — ${err.message}`);
}

const postPaths = posts
  .map((p) => p.slug)
  .filter((slug) => {
    if (isSafeSlug(slug)) return true;
    if (slug) console.warn(`routes: skipping unsafe slug ${JSON.stringify(slug)}`);
    return false;
  })
  .map((slug) => `/blog/${slug}`);

const written = [
  ...STATIC_ROUTES.map((r) => r.path),
  ...REDIRECT_ROUTES,
  ...postPaths,
].filter(writeRoute);

console.log(
  `routes: wrote ${written.length} route files + 404.html ` +
    `(${STATIC_ROUTES.length - 1} static, ${REDIRECT_ROUTES.length} legacy, ${postPaths.length} posts)`,
);
