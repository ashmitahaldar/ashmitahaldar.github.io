import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import PixelGirl from './PixelGirl';
import styles from './HeroScene.module.css';

// Procedural voxel-chibi me, coding at her laptop. No model files, no
// Spline — the whole scene is built from boxes right here. Tweak the
// COLORS map or the part dimensions below to restyle her.
// Loaded lazily (React.lazy) so three.js stays out of the main bundle.

const COLORS = {
  skin:    0xc98a63,
  skinDark: 0xb87a55,
  hair:    0x241b33,
  hairHi:  0x40305c,
  shirt:   0xff3d8c,
  sleeve:  0xd12e75,
  eye:     0x1b1426,
  shine:   0xfff6fa,
  blush:   0xff7ab3,
  mouth:   0xa44a5e,
  laptop:  0x10162e,
  hinge:   0x1d2547,
  screen:  0x2dd4bf,
  sticker: 0xff3d8c,
  desk:    0x131a38,
  deskEdge: 0x1c2447,
};

function box(w, h, d, color, x = 0, y = 0, z = 0, opts = {}) {
  const mat = new THREE.MeshStandardMaterial({
    color,
    roughness: opts.roughness ?? 0.85,
    metalness: 0.0,
    ...(opts.emissive ? { emissive: opts.emissive, emissiveIntensity: opts.emissiveIntensity ?? 1 } : {}),
  });
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  mesh.position.set(x, y, z);
  return mesh;
}

function makeShadowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(64, 64, 8, 64, 64, 62);
  g.addColorStop(0, 'rgba(0,0,0,0.45)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

function buildScene() {
  const root = new THREE.Group();

  // ── desk + laptop ──────────────────────────────────────────
  const desk = new THREE.Group();
  desk.add(box(3.6, 0.12, 1.7, COLORS.desk, 0, 0.52, 0.5));
  desk.add(box(3.6, 0.03, 1.7, COLORS.deskEdge, 0, 0.595, 0.5)); // top sheen
  root.add(desk);

  const laptop = new THREE.Group();
  laptop.add(box(1.25, 0.06, 0.85, COLORS.laptop, 0, 0.64, 0.55));
  laptop.add(box(1.1, 0.02, 0.62, COLORS.hinge, 0, 0.673, 0.5)); // keyboard

  const lid = new THREE.Group();
  lid.add(box(1.2, 0.8, 0.06, COLORS.laptop, 0, 0, 0));
  // screen face (points back at her) — the room's light source
  const screen = box(1.06, 0.66, 0.03, COLORS.screen, 0, 0, -0.035, {
    emissive: COLORS.screen,
    emissiveIntensity: 1.2,
  });
  lid.add(screen);
  lid.add(box(0.16, 0.16, 0.05, COLORS.sticker, 0, 0.05, 0.04, {
    emissive: COLORS.sticker,
    emissiveIntensity: 0.35,
  })); // sticker on the back of the lid
  lid.position.set(0, 0.98, 0.93);
  lid.rotation.x = 0.12;
  laptop.add(lid);
  root.add(laptop);

  // gentle cyan spill from the screen — an accent, not a floodlight
  const screenLight = new THREE.PointLight(COLORS.screen, 2.4, 3.2, 1.9);
  screenLight.position.set(0, 1.25, 0.6);
  root.add(screenLight);

  // ── the girl ───────────────────────────────────────────────
  const girl = new THREE.Group();

  // torso
  girl.add(box(1.0, 0.85, 0.6, COLORS.shirt, 0, 0.98, -0.35));
  girl.add(box(1.06, 0.18, 0.66, COLORS.sleeve, 0, 0.62, -0.35)); // hem
  // hair falling down her back
  girl.add(box(1.2, 1.05, 0.32, COLORS.hair, 0, 0.95, -0.78));

  // arms reaching for the keyboard
  const armL = box(0.22, 0.62, 0.22, COLORS.sleeve, -0.58, 0.92, -0.05);
  armL.rotation.x = -0.85;
  const armR = armL.clone();
  armR.position.x = 0.58;
  girl.add(armL, armR);

  const handL = box(0.2, 0.14, 0.24, COLORS.skin, -0.58, 0.72, 0.32);
  const handR = handL.clone();
  handR.position.x = 0.58;
  girl.add(handL, handR);

  // head
  const head = new THREE.Group();
  head.position.set(0, 1.95, -0.3);

  head.add(box(1.3, 1.15, 1.15, COLORS.skin, 0, 0, 0));                 // face
  head.add(box(1.44, 0.5, 1.3, COLORS.hair, 0, 0.48, -0.03));           // crown
  head.add(box(1.44, 1.3, 0.42, COLORS.hair, 0, -0.1, -0.6));           // back
  head.add(box(0.34, 0.42, 0.34, COLORS.hairHi, 0.52, 0.6, 0.22));      // shine tuft
  // curtain bangs, middle-parted
  head.add(box(0.56, 0.34, 0.12, COLORS.hair, -0.36, 0.42, 0.585));
  head.add(box(0.56, 0.34, 0.12, COLORS.hair, 0.36, 0.42, 0.585));
  head.add(box(0.2, 0.62, 0.14, COLORS.hair, -0.64, 0.24, 0.55));
  head.add(box(0.2, 0.62, 0.14, COLORS.hair, 0.64, 0.24, 0.55));
  // long side hair falling to the desk
  head.add(box(0.3, 1.75, 0.55, COLORS.hair, -0.75, -0.7, -0.32));
  head.add(box(0.3, 1.75, 0.55, COLORS.hair, 0.75, -0.7, -0.32));

  // face details
  head.add(box(0.17, 0.26, 0.06, COLORS.eye, -0.28, -0.04, 0.585));
  head.add(box(0.17, 0.26, 0.06, COLORS.eye, 0.28, -0.04, 0.585));
  head.add(box(0.07, 0.09, 0.05, COLORS.shine, -0.23, 0.04, 0.615, { emissive: COLORS.shine, emissiveIntensity: 0.5 }));
  head.add(box(0.07, 0.09, 0.05, COLORS.shine, 0.33, 0.04, 0.615, { emissive: COLORS.shine, emissiveIntensity: 0.5 }));
  head.add(box(0.22, 0.1, 0.05, COLORS.blush, -0.5, -0.26, 0.575));
  head.add(box(0.22, 0.1, 0.05, COLORS.blush, 0.5, -0.26, 0.575));
  head.add(box(0.16, 0.06, 0.05, COLORS.mouth, 0, -0.36, 0.585));
  head.add(box(0.07, 0.07, 0.05, COLORS.sticker, 0, 0.24, 0.6));        // bindi

  girl.add(head);
  root.add(girl);

  // ── ground shadow (kept out of root so it stays flat while she spins) ──
  const shadowTex = makeShadowTexture();
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(4.4, 2.6),
    new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = -0.02;

  // ── ambient particles ──────────────────────────────────────
  const particles = new THREE.Group();
  const particleMeshes = [];
  for (let i = 0; i < 10; i++) {
    const pink = i % 2 === 0;
    const s = 0.05 + (i % 3) * 0.02;
    const p = box(s, s, s, pink ? COLORS.sticker : COLORS.screen, 0, 0, 0, {
      emissive: pink ? COLORS.sticker : COLORS.screen,
      emissiveIntensity: 0.9,
    });
    const angle = (i / 10) * Math.PI * 2;
    const radius = 2.1 + (i % 4) * 0.25;
    p.position.set(Math.cos(angle) * radius, 0.5 + (i % 5) * 0.45, Math.sin(angle) * radius * 0.6);
    p.userData = { baseY: p.position.y, phase: angle * 3 };
    particles.add(p);
    particleMeshes.push(p);
  }
  root.add(particles);

  return { root, shadow, head, girl, handL, handR, screen, screenLight, particles, particleMeshes };
}

export default function HeroGirl3D() {
  const mountRef = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch (e) {
      setFailed(true);
      return undefined;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, mount.clientWidth / mount.clientHeight, 0.1, 30);
    camera.position.set(0, 1.5, 6.1);
    camera.lookAt(0, 1.15, 0);

    scene.add(new THREE.AmbientLight(0x9a97c9, 1.4));
    const key = new THREE.DirectionalLight(0xffe9f3, 2.2);
    key.position.set(2.5, 4, 3);
    scene.add(key);
    // warm fill from the camera side so her face reads warm, not screen-green
    const fill = new THREE.DirectionalLight(0xffe3cc, 1.1);
    fill.position.set(-1.5, 2.5, 5);
    scene.add(fill);
    const rim = new THREE.PointLight(0xff3d8c, 6, 8, 2);
    rim.position.set(-2.5, 2.2, -2.5);
    scene.add(rim);

    const parts = buildScene();
    scene.add(parts.root);
    scene.add(parts.shadow);

    // the black drop shadow reads far too heavy on light backgrounds
    const applyShadowTheme = () => {
      const light = document.documentElement.getAttribute('data-theme') === 'light';
      parts.shadow.material.opacity = light ? 0.35 : 1;
    };
    applyShadowTheme();

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ── drag to spin (soft parallax until the first grab) ─────
    const rot = { x: 0, y: 0 };     // applied rotation
    const target = { x: 0, y: 0 };  // parallax target
    let dragging = false;
    let hasDragged = false;
    let spinVel = 0;                // yaw inertia after release
    let last = { x: 0, y: 0 };

    const onPointerDown = (e) => {
      dragging = true;
      hasDragged = true;
      spinVel = 0;
      last = { x: e.clientX, y: e.clientY };
      if (mount.setPointerCapture) mount.setPointerCapture(e.pointerId);
      mount.style.cursor = 'grabbing';
    };
    const onPointerMove = (e) => {
      if (dragging) {
        const dx = e.clientX - last.x;
        const dy = e.clientY - last.y;
        last = { x: e.clientX, y: e.clientY };
        rot.y += dx * 0.009;
        rot.x = Math.max(-0.5, Math.min(0.38, rot.x + dy * 0.005));
        spinVel = dx * 0.009;
        if (reduceMotion) renderFrame(); // render on demand when the loop is off
      } else if (!hasDragged && !reduceMotion) {
        const r = mount.getBoundingClientRect();
        target.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
        target.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
      }
    };
    const onPointerUp = () => {
      dragging = false;
      mount.style.cursor = 'grab';
    };
    const onPointerLeave = () => {
      target.x = 0;
      target.y = 0;
      onPointerUp();
    };
    mount.addEventListener('pointerdown', onPointerDown);
    mount.addEventListener('pointermove', onPointerMove);
    mount.addEventListener('pointerup', onPointerUp);
    mount.addEventListener('pointercancel', onPointerUp);
    mount.addEventListener('pointerleave', onPointerLeave);

    const clock = new THREE.Clock();
    let raf = 0;
    let visible = true;

    const renderFrame = () => {
      const t = clock.getElapsedTime();

      // idle: breathe, look around a little
      parts.girl.position.y = Math.sin(t * 1.5) * 0.035;
      parts.head.rotation.z = Math.sin(t * 0.7) * 0.03;
      parts.head.rotation.y = Math.sin(t * 0.4) * 0.06;

      // typing taps
      parts.handL.position.y = 0.72 + Math.max(0, Math.sin(t * 11)) * 0.04;
      parts.handR.position.y = 0.72 + Math.max(0, Math.sin(t * 11 + Math.PI)) * 0.04;

      // screen flicker
      const flicker = 1.1 + Math.sin(t * 13) * Math.sin(t * 5.7) * 0.25;
      parts.screen.material.emissiveIntensity = flicker;
      parts.screenLight.intensity = 1.8 + flicker * 0.8;

      // particles drift
      parts.particles.rotation.y = t * 0.12;
      parts.particleMeshes.forEach((p) => {
        p.position.y = p.userData.baseY + Math.sin(t * 1.3 + p.userData.phase) * 0.12;
        p.material.emissiveIntensity = 0.5 + (Math.sin(t * 2 + p.userData.phase) + 1) * 0.35;
      });

      // rotation: direct while dragging, inertia after, parallax before
      if (!dragging) {
        if (hasDragged) {
          rot.y += spinVel;
          spinVel *= 0.94;
          rot.x += (0 - rot.x) * 0.03; // pitch settles back level
        } else {
          rot.y += (target.x * 0.22 - rot.y) * 0.06;
          rot.x += (target.y * 0.08 - rot.x) * 0.06;
        }
      }
      parts.root.rotation.y = rot.y;
      parts.root.rotation.x = rot.x;

      renderer.render(scene, camera);
    };

    const loop = () => {
      renderFrame();
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (!raf && visible && !document.hidden) {
        clock.start();
        raf = requestAnimationFrame(loop);
      }
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    if (reduceMotion) {
      renderFrame(); // single still frame
    } else {
      start();
    }

    // pause when offscreen or tab hidden
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (reduceMotion) return;
      if (visible) start(); else stop();
    });
    io.observe(mount);
    const onVisibility = () => {
      if (reduceMotion) return;
      if (document.hidden) stop(); else start();
    };
    document.addEventListener('visibilitychange', onVisibility);

    // follow the site theme toggle live
    const themeObserver = new MutationObserver(() => {
      applyShadowTheme();
      if (reduceMotion) renderFrame();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    const ro = new ResizeObserver(() => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      if (reduceMotion) renderFrame();
    });
    ro.observe(mount);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      themeObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      mount.removeEventListener('pointerdown', onPointerDown);
      mount.removeEventListener('pointermove', onPointerMove);
      mount.removeEventListener('pointerup', onPointerUp);
      mount.removeEventListener('pointercancel', onPointerUp);
      mount.removeEventListener('pointerleave', onPointerLeave);
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (obj.material.map) obj.material.map.dispose();
          obj.material.dispose();
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  if (failed) return <PixelGirl />;
  return <div ref={mountRef} className={styles.mount3d} aria-hidden="true" />;
}
