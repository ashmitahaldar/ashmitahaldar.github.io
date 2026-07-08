import React, { Suspense, lazy } from 'react';
import PixelGirl from './PixelGirl';
import styles from './HeroScene.module.css';

// Hero scene: a procedural three.js voxel-chibi girl coding at her
// laptop (see HeroGirl3D.jsx), rendered directly on the page — no
// frame, transparent canvas. Loaded lazily so three.js ships as a
// separate chunk; the pixel-art sprite shows while it loads and
// stands in wherever WebGL isn't available.

const HeroGirl3D = lazy(() => import('./HeroGirl3D'));

export default function HeroScene({ status }) {
  return (
    <div className={styles.stage}>
      <Suspense fallback={<PixelGirl />}>
        <HeroGirl3D />
      </Suspense>
      {status && <span className={styles.stageHint}>{status}</span>}
    </div>
  );
}
