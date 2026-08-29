// Generates public/sitemap.xml from Sanity at build time (npm prebuild).
// Lists the static routes plus every blog post. Never fails the build:
// on any error it falls back to the static routes and exits 0.

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE, STATIC_ROUTES, POSTS_QUERY, query } from './site-routes.mjs';

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');

const esc = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

function urlEntry({ path, lastmod, changefreq, priority }) {
  const lm = lastmod ? `\n    <lastmod>${lastmod.slice(0, 10)}</lastmod>` : '';
  return `  <url>
    <loc>${esc(SITE + path)}</loc>${lm}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

function sitemap(entries) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(urlEntry).join('\n')}
</urlset>
`;
}

let posts = [];
try {
  posts = await query(POSTS_QUERY);
} catch (err) {
  console.warn(`sitemap: Sanity unreachable, writing static routes only — ${err.message}`);
}

const postEntries = posts
  .filter((p) => p.slug)
  .map((p) => ({
    path: `/blog/${p.slug}`,
    lastmod: p._updatedAt || p.publishedAt,
    changefreq: 'yearly',
    priority: '0.6',
  }));

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(join(OUT_DIR, 'sitemap.xml'), sitemap([...STATIC_ROUTES, ...postEntries]));
console.log(`sitemap: wrote sitemap.xml (${STATIC_ROUTES.length} static + ${postEntries.length} posts)`);
