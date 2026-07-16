import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import Seo from './Seo';

// react-dom warns if act() runs outside a flagged test environment.
global.IS_REACT_ACT_ENVIRONMENT = true;

function mount(element) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => root.render(element));
  return () => act(() => root.unmount());
}

const meta = (sel) => document.head.querySelector(sel)?.getAttribute('content');

describe('Seo', () => {
  it('sets a per-route title, description, canonical, and social tags', () => {
    mount(<Seo title="Blog" path="/blog" description="hello world" />);

    expect(document.title).toBe('Blog · Ashmita Haldar');
    expect(meta('meta[name="description"]')).toBe('hello world');
    expect(document.head.querySelector('link[rel="canonical"]').getAttribute('href')).toBe(
      'https://ashmitahaldar.com/blog',
    );
    expect(meta('meta[property="og:title"]')).toBe('Blog · Ashmita Haldar');
    expect(meta('meta[property="og:url"]')).toBe('https://ashmitahaldar.com/blog');
    expect(meta('meta[name="twitter:card"]')).toBe('summary_large_image');
    expect(meta('meta[name="robots"]')).toBe('index, follow');
  });

  it('emits article metadata for blog posts and clears it on the next route', () => {
    mount(
      <Seo title="A Post" path="/blog/a-post" type="article" publishedTime="2026-01-02T00:00:00Z" tags={['react', 'seo']} />,
    );
    expect(meta('meta[property="og:type"]')).toBe('article');
    expect(meta('meta[property="article:published_time"]')).toBe('2026-01-02T00:00:00Z');
    expect(document.head.querySelectorAll('meta[property="article:tag"]').length).toBe(2);

    // Navigating to a non-article route clears the article-only tags.
    mount(<Seo title="Projects" path="/projects" />);
    expect(document.head.querySelectorAll('meta[property="article:tag"]').length).toBe(0);
    expect(document.head.querySelector('meta[property="article:published_time"]')).toBeNull();
  });

  it('marks 404 pages noindex', () => {
    mount(<Seo title="404" path="/nope" noindex />);
    expect(meta('meta[name="robots"]')).toBe('noindex, nofollow');
  });
});
