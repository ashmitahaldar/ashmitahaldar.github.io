import React from 'react';
import { PortableText as PT } from '@portabletext/react';

export default function PortableText({ value, className }) {
  if (!value) return null;
  return <PT value={value} className={className} />;
}
