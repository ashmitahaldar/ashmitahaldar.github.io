import React from 'react';
import { motion } from 'framer-motion';

// Props: { glow?: boolean; hover?: boolean } plus div props
export default function PixelCard({ glow = false, hover = true, className = '', children, style, ...rest }) {
  return (
    <motion.div
      whileHover={hover ? { scale: 1.02, y: -4 } : {}}
      className={className}
      style={{ position: 'relative', ...style }}
    >
      <div
        className="panel"
        style={{
          position: 'relative',
          padding: 24,
          border: '2px solid rgb(var(--accent))',
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)'
        }}
        {...rest}
      >
        {/* Corner decorations */}
        <div style={{ position: 'absolute', top: -2, left: -2, width: 12, height: 12, borderTop: '4px solid rgb(var(--accent-2))', borderLeft: '4px solid rgb(var(--accent-2))' }} />
        <div style={{ position: 'absolute', top: -2, right: -2, width: 12, height: 12, borderTop: '4px solid rgb(var(--accent))', borderRight: '4px solid rgb(var(--accent))' }} />
        <div style={{ position: 'absolute', bottom: -2, left: -2, width: 12, height: 12, borderBottom: '4px solid rgb(var(--accent))', borderLeft: '4px solid rgb(var(--accent))' }} />
        <div style={{ position: 'absolute', bottom: -2, right: -2, width: 12, height: 12, borderBottom: '4px solid rgb(var(--accent-2))', borderRight: '4px solid rgb(var(--accent-2))' }} />

        {children}
      </div>
    </motion.div>
  );
}
