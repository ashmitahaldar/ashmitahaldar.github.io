import React, { useMemo } from 'react';
import styles from './HeroScene.module.css';

// Pixel-art girl at her laptop — used as the loading state for the 3D
// scene and as the fallback when WebGL isn't available.
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

export default function PixelGirl() {
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
