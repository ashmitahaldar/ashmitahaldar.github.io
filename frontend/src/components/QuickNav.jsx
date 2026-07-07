import React from 'react';
import styles from './QuickNav.module.css';

// Sticky `$ cd ./section` jumper. Pass links as [{ id, label }] where
// id matches an element on the page (give targets scroll-margin-top).
export default function QuickNav({ links, className }) {
  const jump = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  return (
    <nav className={`${styles.quickNav}${className ? ` ${className}` : ''}`} aria-label="Page sections">
      <span className={styles.quickPrompt}>$ cd</span>
      {links.map((l) => (
        <button key={l.id} className={styles.quickChip} onClick={() => jump(l.id)}>
          ./{l.label}
        </button>
      ))}
    </nav>
  );
}
