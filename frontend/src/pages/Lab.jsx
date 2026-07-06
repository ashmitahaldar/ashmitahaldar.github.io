import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Calendar, Camera, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import CornerCard from '../components/CornerCard';
import SectionHeader from '../components/SectionHeader';
import Reveal from '../components/Reveal';
import Terminal from '../components/Terminal';
import ArtLightboxModal from '../components/ArtLightboxModal';
import { useTypingEffect } from '../hooks/useTypingEffect';
import { getArtPhotos, getMicroblogs, getProfile } from '../services/sanityClient';
import { HOME_CONTENT } from '../content/home';
import { LOG_FALLBACK } from '../content/log';
import styles from '../styles/Lab.module.css';

// ── helpers ──────────────────────────────────────────────────

function formatLogTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const date = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  const time = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  return `${date} ${time}`;
}

function Window({ title, children }) {
  return (
    <div className={styles.window}>
      <div className={styles.windowBar}>
        <div className={styles.windowDots}>
          <span className={`${styles.windowDot} ${styles.dotRed}`} />
          <span className={`${styles.windowDot} ${styles.dotYellow}`} />
          <span className={`${styles.windowDot} ${styles.dotGreen}`} />
        </div>
        <span className={styles.windowTitle}>{title}</span>
        <span />
      </div>
      {children}
    </div>
  );
}

// ── log feed ─────────────────────────────────────────────────

function LogFeed({ entries }) {
  return (
    <section id="log">
      <SectionHeader cmd="tail" arg="-f log.txt" comment="microblog" count={entries.length} />
      <Window title="~/lab/log.txt">
        <div className={styles.logFeed}>
          {entries.map((e, i) => (
            <article key={e._id || i} className={styles.logEntry}>
              <div className={styles.logMeta}>
                <span className={styles.logTime}>[{formatLogTime(e.postedAt)}]</span>
                {e.mood && <span className={styles.logMood}>{e.mood}</span>}
                {e.tags?.length > 0 && (
                  <span className={styles.logTags}>
                    {e.tags.map((t) => <span key={t}>#{t}</span>)}
                  </span>
                )}
              </div>
              <p className={styles.logText}>
                {e.text}
                {i === 0 && <span className="blink" style={{ color: 'var(--cyan)', width: 6, height: 13 }} />}
              </p>
              {e.link && (
                <a href={e.link} target="_blank" rel="noopener noreferrer" className={styles.logLink}>
                  attached link ↗
                </a>
              )}
            </article>
          ))}
          <div className={styles.logHint}>// short thoughts, shipped often. no editing after posting.</div>
        </div>
      </Window>
    </section>
  );
}

// ── gallery ──────────────────────────────────────────────────

function Gallery({ photos }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const categories = useMemo(() => {
    const set = new Set();
    photos.forEach((item) => { if (item.category) set.add(item.category); });
    return ['All', ...Array.from(set)];
  }, [photos]);

  const filtered = useMemo(() => {
    if (selectedCategory === 'All') return photos;
    return photos.filter((item) => item.category === selectedCategory);
  }, [selectedCategory, photos]);

  const openLightbox = (id) => {
    const idx = filtered.findIndex((item) => item._id === id);
    if (idx >= 0) {
      setLightboxIndex(idx);
      setLightboxOpen(true);
    }
  };

  return (
    <section id="gallery">
      <SectionHeader cmd="open" arg="./gallery" comment="photography + art" count={photos.length} />

      {categories.length > 2 && (
        <div className={styles.tagButtons}>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`${styles.tagButton} ${
                selectedCategory === category ? styles.tagButtonActive : styles.tagButtonInactive
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className={styles.emptyState}>
          Nothing here yet — the camera roll is loading.
        </div>
      ) : (
        <div className={styles.galleryGrid}>
          {filtered.map((item) => (
            <CornerCard
              key={item._id}
              tone="cyan"
              className={styles.galleryCard}
              onClick={() => openLightbox(item._id)}
            >
              <div className={styles.galleryImageWrap}>
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.altText || item.title}
                    className={styles.galleryImage}
                    loading="lazy"
                  />
                ) : (
                  <div className={styles.galleryImageFallback}>
                    <Camera className={styles.galleryFallbackIcon} />
                  </div>
                )}
              </div>
              <div className={styles.galleryCardBody}>
                <div className={styles.galleryMeta}>
                  <span className={styles.galleryBadge}>{item.category}</span>
                  {item.capturedAt && (
                    <span className={styles.galleryDate}>
                      <Calendar className={styles.calendarIcon} />
                      {new Date(item.capturedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </div>
                {item.location && (
                  <div className={styles.galleryLocation}>
                    <MapPin className={styles.galleryLocationIcon} />
                    <span>{item.location}</span>
                  </div>
                )}
                {item.description && (
                  <p className={styles.galleryDescription}>{item.description}</p>
                )}
              </div>
            </CornerCard>
          ))}
        </div>
      )}

      <ArtLightboxModal
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        items={filtered}
        currentIndex={lightboxIndex}
        onPrev={() => setLightboxIndex((prev) => (prev === 0 ? filtered.length - 1 : prev - 1))}
        onNext={() => setLightboxIndex((prev) => (prev === filtered.length - 1 ? 0 : prev + 1))}
      />
    </section>
  );
}

// ── fun facts ────────────────────────────────────────────────

function FunFacts({ facts }) {
  if (!facts.length) return null;
  return (
    <section id="facts">
      <SectionHeader cmd="whoami" arg="--verbose" count={facts.length} />
      <CornerCard tone="cyan">
        <div className={styles.factsGrid}>
          {facts.map((f, i) => (
            <div key={i} className={styles.factItem}>
              <span className={styles.factKey}>// {f.k}</span>
              <span className={styles.factVal}>{f.v}</span>
              {f.note && <span className={styles.factNote}>{f.note}</span>}
            </div>
          ))}
        </div>
      </CornerCard>
    </section>
  );
}

// ── main ─────────────────────────────────────────────────────

export default function Lab() {
  const location = useLocation();
  const [profileData, setProfileData] = useState(null);
  const [photos, setPhotos]           = useState([]);
  const [logEntries, setLogEntries]   = useState([]);
  const [loading, setLoading]         = useState(true);

  const { displayedText: typedSubtitle } = useTypingEffect('cd ~/lab && ls -la', 40, 600);

  useEffect(() => {
    Promise.allSettled([
      getProfile(),
      getArtPhotos(),
      getMicroblogs(),
    ]).then(([profileRes, photosRes, logsRes]) => {
      if (profileRes.status === 'fulfilled') setProfileData(profileRes.value);
      if (photosRes.status  === 'fulfilled') setPhotos(photosRes.value || []);

      setLogEntries(
        logsRes.status === 'fulfilled' && logsRes.value?.length
          ? logsRes.value
          : LOG_FALLBACK,
      );

      setLoading(false);
    });
  }, []);

  // Honour #log / #gallery / #facts / #terminal deep links once content is in.
  useEffect(() => {
    if (loading || !location.hash) return;
    const el = document.getElementById(location.hash.slice(1));
    if (el) {
      setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
    }
  }, [loading, location.hash]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <span style={{ color: 'var(--pink)' }}>$</span>
        &nbsp;loading...
        <span className="blink" style={{ color: 'var(--pink)' }} />
      </div>
    );
  }

  const facts = profileData?.funFacts?.length ? profileData.funFacts : HOME_CONTENT.funFacts;

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
      >
        <h1 className={styles.title}>
          <span className={styles.titleTilde}>~</span>
          <span className={styles.titleSlash}>/</span>
          <span className={styles.titleWord}>lab</span>
          <span className="blink" style={{ color: 'var(--pink)' }} />
        </h1>
        <p className={styles.subtitle}>
          <span className={styles.subtitlePrompt}>$ </span>
          <span className={styles.subtitleCommand}>{typedSubtitle}</span>
        </p>
        <p className={styles.intro}>
          Nothing here is a deliverable.
        </p>
      </motion.div>

      <Reveal><LogFeed entries={logEntries} /></Reveal>

      <Reveal><Gallery photos={photos} /></Reveal>

      <Reveal><FunFacts facts={facts} /></Reveal>

      <Reveal>
        <section id="terminal">
          <SectionHeader cmd="ssh" arg="visitor@ashmita" comment="try `help` or `snake`" />
          <Window title="portfolio-terminal">
            <Terminal profileData={profileData} height="420px" />
          </Window>
        </section>
      </Reveal>
    </div>
  );
}
