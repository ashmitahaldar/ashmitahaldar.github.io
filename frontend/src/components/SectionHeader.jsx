import React from 'react';

/**
 * Terminal-style section header:
 *   $ <cmd> <arg>   // <comment>  ─────────────  [count]
 */
export default function SectionHeader({ cmd, arg, comment, count }) {
  return (
    <div className="sh">
      <span className="sh-prompt">$</span>
      <span className="sh-cmd">{cmd}</span>
      {arg && <span className="sh-arg">{arg}</span>}
      {comment && <span className="sh-comment">// {comment}</span>}
      <div className="sh-rule" />
      {count != null && (
        <span className="sh-count">{String(count).padStart(2, '0')}</span>
      )}
    </div>
  );
}
