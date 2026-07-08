import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import PixelGirl from '../components/PixelGirl';
import styles from '../styles/NotFound.module.css';

export default function NotFound() {
  const { pathname } = useLocation();

  return (
    <div className={styles.container}>
      <div className={styles.terminalLines}>
        <div className={styles.cmdLine}>
          <span className={styles.prompt}>$</span> cd {pathname}
        </div>
        <div className={styles.errLine}>bash: cd: {pathname}: No such file or directory</div>
      </div>

      <h1 className={styles.code} aria-label="404 — page not found">
        4<span className={styles.codeZero}>0</span>4
      </h1>

      <PixelGirl />

      <p className={styles.message}>// she checked the whole filesystem. it's not here.</p>

      <div className={styles.actions}>
        <Link to="/" className={`${styles.action} ${styles.actionPink}`}>$ cd ~/home</Link>
        <Link to="/projects" className={`${styles.action} ${styles.actionCyan}`}>$ open ~/projects</Link>
      </div>
    </div>
  );
}
