import React from 'react';

/**
 * Corner-bracketed card — the signature component of the design system.
 * tone="pink"  → all four corners are pink
 * tone="cyan"  → all four corners are cyan
 * (no tone)    → TL/BR pink, TR/BL cyan (alternating)
 */
export default function CornerCard({ tone, className = '', children, style, ...rest }) {
  const classes = ['cc', tone ? `cc-${tone}` : '', className].filter(Boolean).join(' ');
  return (
    <div className={classes} style={style} {...rest}>
      <div className="cc-corners" />
      {children}
    </div>
  );
}
