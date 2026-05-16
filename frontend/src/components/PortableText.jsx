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
  },
};

export default function PortableText({ value, className }) {
  if (!value) return null;
  return <PT value={value} components={components} className={className} />;
}
