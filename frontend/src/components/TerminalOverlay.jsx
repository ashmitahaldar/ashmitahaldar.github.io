import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import Terminal from './Terminal';
import { getProfile } from '../services/sanityClient';
import styles from './TerminalOverlay.module.css';

export default function TerminalOverlay() {
  const [open, setOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    getProfile().then(setProfileData).catch(() => {});
  }, []);

  useEffect(() => {
    const handleOpen = () => setOpen(true);
    window.addEventListener('ashmayo:open-terminal', handleOpen);
    return () => window.removeEventListener('ashmayo:open-terminal', handleOpen);
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    if (open) {
      document.addEventListener('keydown', handleKey);
      setTimeout(() => window.dispatchEvent(new Event('ashmayo:focus-terminal')), 80);
    }
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Portfolio terminal"
      className={styles.backdrop}
      onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
    >
      <div className={styles.window}>
        {/* Title bar */}
        <div className={styles.titleBar}>
          <div className={styles.dots}>
            <button
              onClick={() => setOpen(false)}
              className={`${styles.dot} ${styles.dotRed}`}
              aria-label="Close terminal"
            />
            <div className={`${styles.dot} ${styles.dotYellow}`} />
            <div className={`${styles.dot} ${styles.dotGreen}`} />
          </div>
          <span className={styles.title}>portfolio-terminal</span>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close terminal"
            className={styles.closeBtn}
          >
            <X style={{ width: 14, height: 14 }} />
          </button>
        </div>

        <Terminal profileData={profileData} />
      </div>
    </div>
  );
}
