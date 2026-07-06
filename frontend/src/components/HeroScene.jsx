import React, { useEffect, useMemo, useState } from 'react';
import styles from './HeroScene.module.css';

// Reserved slot for the 3D hero scene (cute anime-style me, coding).
// Drop a Spline scene URL into HOME_CONTENT.hero.sceneUrl and this
// component lazy-loads the viewer from CDN — zero bundle cost until then.
// Without a URL it renders a hand-placed pixel-art placeholder.

const SPLINE_VIEWER_SRC = 'https://unpkg.com/@splinetool/viewer@1.9.82/build/spline-viewer.js';

// ── pixel sprite: girl at her laptop ─────────────────────────
// 22×17 grid, one char per pixel. Edit rows to redraw her.
const SPRITE = [
  '......hhhhhhhhhh......',
  '.....hhhhhhhhhhhh.....',
  '....hhHhhhhhhhhHhh....',
  '...hhhhhhhhhhhhhhhh...',
  '...hhshhhsssshhhshh...',
  '..hhsssssssssssssshh..',
  '..hhsseewssssweesshh..',
  '..hhsseesssssseesshh..',
  '..hhsbbssssssssbbshh..',
  '..hhssssssmmsssssshh..',
  '..hhhsssssssssssshhh..',
  '.hh.cccccccccccccc.hh.',
  '.hh.LLLLLLLLLLLLLL.hh.',
  '.hh.LLLLLLppLLLLLL.hh.',
  '.hh.LLLLLLLLLLLLLL.hh.',
  '.hh.llllllllllllll.hh.',
  '..ssddddddddddddddss..',
];

const PALETTE = {
  h: '#241b33', // hair
  H: '#40305c', // hair shine
  s: '#c98a63', // skin
  e: '#1b1426', // eyes
  w: '#fff6fa', // eye shine
  b: '#ff7ab3', // blush
  m: '#a44a5e', // smile
  c: '#2dd4bf', // screen light spilling over the lid
  L: '#10162e', // laptop lid
  p: '#ff3d8c', // lid sticker
  l: '#1d2547', // hinge
  d: '#131a38', // desk
};

const PX = 9;

function buildShadow() {
  const drops = [];
  SPRITE.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      if (PALETTE[ch]) drops.push(`${x * PX}px ${y * PX}px 0 0 ${PALETTE[ch]}`);
    });
  });
  return drops.join(', ');
}

function PixelGirl() {
  const shadow = useMemo(buildShadow, []);
  return (
    <div className={styles.spriteStage} aria-hidden="true">
      <div className={styles.spriteGlow} />
      <div className={`${styles.spriteFloat} pixel-float`}>
        <div
          className={styles.sprite}
          style={{
            width: PX,
            height: PX,
            boxShadow: shadow,
            marginRight: (SPRITE[0].length - 1) * PX,
            marginBottom: (SPRITE.length - 1) * PX,
          }}
        />
        <div className={styles.screenLight} />
      </div>
      <div className={styles.spriteShadow} />
      {['✦', '✧', '✦', '·', '✧'].map((star, i) => (
        <span key={i} className={`${styles.particle} ${styles[`p${i + 1}`]}`}>{star}</span>
      ))}
    </div>
  );
}

export default function HeroScene({ sceneUrl, label, status }) {
  const [viewerReady, setViewerReady] = useState(false);

  useEffect(() => {
    if (!sceneUrl) return;
    const existing = document.querySelector('script[data-spline-viewer]');
    if (existing) {
      setViewerReady(true);
      return;
    }
    const script = document.createElement('script');
    script.type = 'module';
    script.src = SPLINE_VIEWER_SRC;
    script.dataset.splineViewer = 'true';
    script.onload = () => setViewerReady(true);
    document.head.appendChild(script);
  }, [sceneUrl]);

  return (
    <div className={styles.frame}>
      <div className={styles.frameBar}>
        <span className={styles.frameDot} />
        <span className={styles.frameLabel}>{label || './scene/me.spline'}</span>
        <span className={styles.frameDot} />
      </div>

      <div className={styles.frameBody}>
        {sceneUrl && viewerReady ? (
          <spline-viewer url={sceneUrl} style={{ width: '100%', height: '100%' }} />
        ) : (
          <PixelGirl />
        )}
      </div>

      <div className={styles.frameStatus}>
        <span className={styles.statusPrompt}>»</span>
        <span>{sceneUrl ? 'scene loaded' : (status || '3d me in progress')}</span>
        <span className="blink" style={{ color: 'var(--cyan)', width: 6, height: 12 }} />
      </div>
    </div>
  );
}
