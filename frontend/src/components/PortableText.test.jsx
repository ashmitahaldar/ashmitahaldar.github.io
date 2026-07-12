import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

// urlFor pulls in the Sanity client; stub it so the test stays offline and
// focused on rendering. Only the image branch uses it.
jest.mock('../services/sanityClient', () => ({
  urlFor: () => ({ width: () => ({ url: () => 'https://cdn.example/image.jpg' }) }),
}));

// eslint-disable-next-line import/first
import PortableText from './PortableText';

const pdfBlock = {
  _type: 'pdf',
  _key: 'pdf1',
  url: 'https://cdn.sanity.io/files/proj/production/doc.pdf',
  title: 'My Paper',
  caption: 'Figure 1 — the writeup',
};

describe('PortableText PDF block', () => {
  it('renders an embedded iframe viewer using the GROQ-resolved url', () => {
    const html = renderToStaticMarkup(<PortableText value={[pdfBlock]} />);
    expect(html).toContain('<iframe');
    expect(html).toContain('https://cdn.sanity.io/files/proj/production/doc.pdf#toolbar=0');
  });

  it('renders a download link with a sanitized filename', () => {
    const html = renderToStaticMarkup(<PortableText value={[pdfBlock]} />);
    expect(html).toContain('href="https://cdn.sanity.io/files/proj/production/doc.pdf"');
    expect(html).toContain('download="My_Paper.pdf"');
    expect(html).toContain('My Paper');
    expect(html).toContain('Figure 1 — the writeup');
  });

  it('renders nothing for a pdf block whose url did not resolve', () => {
    const html = renderToStaticMarkup(
      <PortableText value={[{ _type: 'pdf', _key: 'pdf2', title: 'broken' }]} />
    );
    expect(html).not.toContain('<iframe');
  });

  it('still renders plain text blocks alongside pdfs', () => {
    const doc = [
      {
        _type: 'block',
        _key: 'b1',
        markDefs: [],
        children: [{ _type: 'span', _key: 's1', text: 'Hello world', marks: [] }],
      },
      pdfBlock,
    ];
    const html = renderToStaticMarkup(<PortableText value={doc} />);
    expect(html).toContain('Hello world');
    expect(html).toContain('<iframe');
  });
});
