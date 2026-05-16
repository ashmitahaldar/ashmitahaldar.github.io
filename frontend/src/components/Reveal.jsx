import React, { useEffect, useRef, useState } from 'react';

/**
 * Scroll-reveal wrapper.
 * Children start hidden (opacity 0, translateY 14px) and animate in
 * once they enter the viewport. One-shot — does not re-trigger.
 */
export default function Reveal({ children, delay = 0, className = '', style }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let t;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          t = setTimeout(() => setVisible(true), delay);
          io.disconnect();
        }
      },
      { rootMargin: '-40px' }
    );

    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(t);
    };
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`reveal${visible ? ' in' : ''} ${className}`.trim()}
      style={style}
    >
      {children}
    </div>
  );
}
