import React, { Suspense, lazy, useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { getProfile } from '../services/sanityClient';
import styles from './TerminalOverlay.module.css';

// Only pulled down the first time someone opens the terminal.
const Terminal = lazy(() => import('./Terminal'));

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
    if (open) {
      setTimeout(() => window.dispatchEvent(new Event('ashmayo:focus-terminal')), 80);
    }
  }, [open]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.backdrop} />
        <Dialog.Content className={styles.window}>
          <div className={styles.titleBar}>
            <div className={styles.dots}>
              <Dialog.Close asChild>
                <button className={`${styles.dot} ${styles.dotRed}`} aria-label="Close terminal" />
              </Dialog.Close>
              <div className={`${styles.dot} ${styles.dotYellow}`} />
              <div className={`${styles.dot} ${styles.dotGreen}`} />
            </div>
            <Dialog.Title asChild>
              <span className={styles.title}>portfolio-terminal</span>
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className={styles.closeBtn} aria-label="Close terminal">
                <X style={{ width: 14, height: 14 }} />
              </button>
            </Dialog.Close>
          </div>

          <Suspense
            fallback={
              <div className={styles.loading}>
                <span style={{ color: 'var(--pink)' }}>$</span>
                &nbsp;loading...
                <span className="blink" style={{ color: 'var(--pink)' }} />
              </div>
            }
          >
            <Terminal profileData={profileData} />
          </Suspense>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
