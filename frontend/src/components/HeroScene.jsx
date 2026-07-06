import React, { Suspense, lazy } from 'react';
import PixelGirl from './PixelGirl';
import styles from './HeroScene.module.css';

// Framed viewport for the hero scene: a procedural three.js voxel-chibi
// girl coding at her laptop (see HeroGirl3D.jsx). Loaded lazily so
// three.js ships as a separate chunk — the pixel-art sprite shows while
// it loads and stands in wherever WebGL isn't available.

const HeroGirl3D = lazy(() => import('./HeroGirl3D'));

export default function HeroScene({ label, status }) {
  return (
    <div className={styles.frame}>
      <div className={styles.frameBar}>
        <span className={styles.frameDot} />
        <span className={styles.frameLabel}>{label || './scene/me.voxel'}</span>
        <span className={styles.frameDot} />
      </div>

      <div className={styles.frameBody}>
        <Suspense fallback={<PixelGirl />}>
          <HeroGirl3D />
        </Suspense>
      </div>

      <div className={styles.frameStatus}>
        <span className={styles.statusPrompt}>»</span>
        <span>{status || 'rendered live with three.js'}</span>
        <span className="blink" style={{ color: 'var(--cyan)', width: 6, height: 12 }} />
      </div>
    </div>
  );
}
