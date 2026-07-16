import { useEffect } from 'react';

// Canonical production domain — matches scripts/generate-rss.mjs.
const SITE_URL = 'https://ashmitahaldar.com';
const SITE_NAME = 'Ashmita Haldar';
const DEFAULT_IMAGE = `${SITE_URL}/og-cover.png`;
const DEFAULT_DESCRIPTION =
  'Ashmita Haldar — CS student & builder. Code, pixels, and the occasional pun: projects, writing, and creative experiments.';

// Upsert a <meta> tag keyed by name/property; create it if missing so
// the tags declared statically in index.html are updated, not duplicated.
function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (content == null || content === '') {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

/**
 * Per-route metadata: <title>, description, canonical, Open Graph, and
 * Twitter Card tags. Renders nothing — it drives document.head directly.
 *
 * This runs in the browser after JS loads, so JS-capable crawlers
 * (Googlebot) pick up per-route tags; non-JS scrapers still see the
 * site-level defaults baked into public/index.html. Prerendering is the
 * durable fix for full non-JS crawlability.
 */
export default function Seo({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '/',
  image = DEFAULT_IMAGE,
  type = 'website',
  publishedTime,
  tags,
  noindex = false,
}) {
  const fullTitle = title ? `${title} · ${SITE_NAME}` : `${SITE_NAME} — CS Student & Builder`;
  const url = `${SITE_URL}${path}`;
  const img = image.startsWith('http') ? image : `${SITE_URL}${image}`;
  const tagsKey = Array.isArray(tags) ? tags.join(',') : '';

  useEffect(() => {
    document.title = fullTitle;

    setMeta('name', 'description', description);
    setMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');
    setLink('canonical', url);

    // Open Graph
    setMeta('property', 'og:site_name', SITE_NAME);
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:image', img);

    // Twitter Card
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', img);

    // Article metadata — reset multi-value tags on every route change.
    document.head
      .querySelectorAll('meta[property="article:tag"]')
      .forEach((n) => n.remove());
    if (type === 'article') {
      setMeta('property', 'article:published_time', publishedTime || '');
      (tags || []).forEach((t) => {
        const m = document.createElement('meta');
        m.setAttribute('property', 'article:tag');
        m.setAttribute('content', t);
        document.head.appendChild(m);
      });
    } else {
      setMeta('property', 'article:published_time', '');
    }
  }, [fullTitle, description, url, img, type, publishedTime, tagsKey, noindex]);

  return null;
}
