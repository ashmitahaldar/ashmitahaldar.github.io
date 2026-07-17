// Shared SEO constants + JSON-LD (schema.org) builders.
// Canonical production domain — matches scripts/generate-rss.mjs.
export const SITE_URL = 'https://ashmitahaldar.com';
export const SITE_NAME = 'Ashmita Haldar';
export const JOB_TITLE = 'CS Student & Builder';
export const DEFAULT_IMAGE = `${SITE_URL}/og-cover.png`;
export const DEFAULT_DESCRIPTION =
  'Ashmita Haldar — CS student & builder. Code, pixels, and the occasional pun: projects, writing, and creative experiments.';

const abs = (url) => (url?.startsWith('http') ? url : `${SITE_URL}${url || ''}`);

// schema.org Person — the identity graph node reused across pages.
export function personLd({ name = SITE_NAME, sameAs = [] } = {}) {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: name || SITE_NAME,
    url: SITE_URL,
    jobTitle: JOB_TITLE,
    image: DEFAULT_IMAGE,
  };
  const links = sameAs.filter(Boolean);
  if (links.length) ld.sameAs = links;
  return ld;
}

// schema.org WebSite — helps Google associate the domain with the site.
export function websiteLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    author: { '@type': 'Person', name: SITE_NAME, url: SITE_URL },
  };
}

// schema.org BlogPosting — one per blog post.
export function articleLd({ title, description, path, publishedTime, tags, image = DEFAULT_IMAGE }) {
  const url = abs(path);
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    author: { '@type': 'Person', name: SITE_NAME, url: SITE_URL },
    publisher: { '@type': 'Person', name: SITE_NAME, url: SITE_URL },
    image: abs(image),
  };
  if (publishedTime) {
    ld.datePublished = publishedTime;
    ld.dateModified = publishedTime;
  }
  const kw = (tags || []).filter(Boolean);
  if (kw.length) ld.keywords = kw.join(', ');
  return ld;
}

// schema.org BreadcrumbList — Home › Blog › Post.
export function breadcrumbLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: abs(it.path),
    })),
  };
}
