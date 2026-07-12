import React from 'react';
import { PortableText as PT } from '@portabletext/react';
import { urlFor } from '../services/sanityClient';

const components = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      return (
        <figure style={{ margin: '24px 0' }}>
          <img
            src={urlFor(value).width(800).url()}
            alt={value.alt || ''}
            style={{ width: '100%', borderRadius: 6, display: 'block' }}
          />
          {value.caption && (
            <figcaption style={{
              fontFamily: 'var(--mono)', fontSize: 12,
              color: 'var(--text-dim)', textAlign: 'center', marginTop: 8,
            }}>
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    pdf: ({ value }) => {
      // `url` is resolved in the GROQ query (asset->url); file assets can't
      // use the image-url builder the way images do.
      if (!value?.url) return null;
      const downloadName = value.title
        ? `${value.title.replace(/[^\w.-]+/g, '_')}.pdf`
        : 'document.pdf';
      return (
        <figure style={{ margin: '24px 0' }}>
          {value.title && (
            <div style={{
              fontFamily: 'var(--mono)', fontSize: 13,
              color: 'var(--text-dim)', marginBottom: 8,
            }}>
              {value.title}
            </div>
          )}
          <iframe
            src={`${value.url}#toolbar=0`}
            title={value.title || 'PDF'}
            style={{
              width: '100%', height: 600, display: 'block',
              border: '1px solid var(--border)', borderRadius: 6,
              background: 'var(--card)',
            }}
          />
          <div style={{ marginTop: 8 }}>
            <a
              href={value.url}
              download={downloadName}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-link"
            >
              Download PDF ↓
            </a>
          </div>
          {value.caption && (
            <figcaption style={{
              fontFamily: 'var(--mono)', fontSize: 12,
              color: 'var(--text-dim)', textAlign: 'center', marginTop: 8,
            }}>
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};

export default function PortableText({ value, className }) {
  if (!value) return null;
  return <PT value={value} components={components} className={className} />;
}
