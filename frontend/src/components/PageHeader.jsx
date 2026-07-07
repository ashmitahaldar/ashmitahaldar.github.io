import React from 'react';
import { motion } from 'framer-motion';
import { useTypingEffect } from '../hooks/useTypingEffect';
import styles from './PageHeader.module.css';

// Shared page header in the ~/lab style: `~/word` path title with a
// blinking caret, plus a typed `$ command` line and optional intro.
export default function PageHeader({ word, command, intro }) {
  const { displayedText: typedCommand } = useTypingEffect(command, 40, 600);
  return (
    <motion.div
      className={styles.header}
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
    >
      <h1 className={styles.title}>
        <span className={styles.titleTilde}>~</span>
        <span className={styles.titleSlash}>/</span>
        <span className={styles.titleWord}>{word}</span>
        <span className="blink" style={{ color: 'var(--pink)' }} />
      </h1>
      <p className={styles.subtitle}>
        <span className={styles.subtitlePrompt}>$ </span>
        <span className={styles.subtitleCommand}>{typedCommand}</span>
      </p>
      {intro && <p className={styles.intro}>{intro}</p>}
    </motion.div>
  );
}
