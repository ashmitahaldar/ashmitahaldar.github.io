// Shared route + Sanity helpers for the build-time generators
// (generate-sitemap.mjs, generate-routes.mjs). Kept in one place so the
// sitemap and the emitted HTML files can never disagree about which routes
// exist — a route in one but not the other is either an unindexable page or
// a sitemap entry that 404s.

export const SITE = 'https://ashmitahaldar.com';

const SANITY = 'https://2azshrlg.apicdn.sanity.io/v2024-01-01/data/query/production';

// Real pages, with a rough change-frequency hint for the sitemap.
export const STATIC_ROUTES = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/about', changefreq: 'monthly', priority: '0.8' },
  { path: '/projects', changefreq: 'monthly', priority: '0.8' },
  { path: '/blog', changefreq: 'weekly', priority: '0.7' },
  { path: '/lab', changefreq: 'weekly', priority: '0.6' },
];

// Legacy URLs that App.js redirects into /about via <Navigate>. They get real
// files so old inbound links resolve 200 instead of 404, but they stay out of
// the sitemap — the rendered page canonicalises to /about, and advertising
// both would be duplicate content.
export const REDIRECT_ROUTES = ['/experience', '/education'];

export const POSTS_QUERY =
  `*[_type == "blogPost" && defined(slug.current)] | order(publishedAt desc){"slug": slug.current, publishedAt, _updatedAt}`;

export async function query(groq) {
  const res = await fetch(`${SANITY}?query=${encodeURIComponent(groq)}`);
  if (!res.ok) throw new Error(`Sanity query failed: ${res.status}`);
  const { result } = await res.json();
  return result || [];
}

// Slugs become directory names, so refuse anything that could escape the
// build directory or nest unexpectedly.
export const isSafeSlug = (slug) => typeof slug === 'string' && /^[A-Za-z0-9._-]+$/.test(slug) && slug !== '.' && slug !== '..';
