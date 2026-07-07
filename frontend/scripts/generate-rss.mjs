// Generates RSS feeds from Sanity at build time (npm prebuild):
//   public/feed.xml — blog posts
//   public/log.xml  — ~/lab microblog entries
// Never fails the build: on any error it warns and exits 0.

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = 'https://ashmitahaldar.github.io';
const SANITY = 'https://2azshrlg.apicdn.sanity.io/v2024-01-01/data/query/production';
const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');

const esc = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

async function query(groq) {
  const res = await fetch(`${SANITY}?query=${encodeURIComponent(groq)}`);
  if (!res.ok) throw new Error(`Sanity query failed: ${res.status}`);
  const { result } = await res.json();
  return result || [];
}

function rss({ title, description, path, items }) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(title)}</title>
    <link>${SITE}</link>
    <description>${esc(description)}</description>
    <language>en</language>
    <atom:link href="${SITE}${path}" rel="self" type="application/rss+xml"/>
${items
  .map(
    (i) => `    <item>
      <title>${esc(i.title)}</title>
      <link>${esc(i.link)}</link>
      <guid isPermaLink="${i.permalink ? 'true' : 'false'}">${esc(i.guid)}</guid>
      <pubDate>${new Date(i.date).toUTCString()}</pubDate>
      <description>${esc(i.description)}</description>
    </item>`,
  )
  .join('\n')}
  </channel>
</rss>
`;
}

try {
  const [posts, logs] = await Promise.all([
    query(`*[_type == "blogPost"] | order(publishedAt desc)[0...50]{title, "slug": slug.current, publishedAt, excerpt, tags}`),
    query(`*[_type == "microblog"] | order(postedAt desc)[0...100]{_id, text, postedAt, mood, tags}`),
  ]);

  mkdirSync(OUT_DIR, { recursive: true });

  writeFileSync(
    join(OUT_DIR, 'feed.xml'),
    rss({
      title: 'ashmita.haldar — blog',
      description: 'writing on code, building, and the occasional pun',
      path: '/feed.xml',
      items: posts
        .filter((p) => p.slug && p.publishedAt)
        .map((p) => ({
          title: p.title || 'untitled',
          link: `${SITE}/blog/${p.slug}`,
          guid: `${SITE}/blog/${p.slug}`,
          permalink: true,
          date: p.publishedAt,
          description: p.excerpt || '',
        })),
    }),
  );

  writeFileSync(
    join(OUT_DIR, 'log.xml'),
    rss({
      title: 'ashmita.haldar — lab log',
      description: 'microblog: short thoughts, shipped often',
      path: '/log.xml',
      items: logs
        .filter((l) => l.text && l.postedAt)
        .map((l) => ({
          title: l.text.length > 80 ? `${l.text.slice(0, 77)}...` : l.text,
          link: `${SITE}/lab#log`,
          guid: l._id,
          permalink: false,
          date: l.postedAt,
          description: [l.text, l.tags?.length ? l.tags.map((t) => `#${t}`).join(' ') : '']
            .filter(Boolean)
            .join(' — '),
        })),
    }),
  );

  console.log(`rss: wrote feed.xml (${posts.length} posts), log.xml (${logs.length} entries)`);
} catch (err) {
  console.warn(`rss: skipped — ${err.message}`);
}
