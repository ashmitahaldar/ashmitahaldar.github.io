import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Calendar, Camera, MapPin } from 'lucide-react';
import CornerCard from '../components/CornerCard';
import PageHeader from '../components/PageHeader';
import QuickNav from '../components/QuickNav';
import SectionHeader from '../components/SectionHeader';
import Reveal from '../components/Reveal';
import Terminal from '../components/Terminal';
import ArtLightboxModal from '../components/ArtLightboxModal';
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

const LOG_PAGE = 8; // entries shown per "older" click — the feed only grows on demand

function LogFeed({ entries }) {
  const [visible, setVisible] = useState(LOG_PAGE);
  const shown = entries.slice(0, visible);
  const hidden = entries.length - shown.length;
  return (
    <section id="log" className={styles.anchorSection}>
      <SectionHeader cmd="tail" arg="-f log.txt" comment="microblog" count={entries.length} />
      <Window title="~/lab/log.txt">
        <div className={styles.logFeed}>
          {shown.map((e, i) => (
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
              {/* schema validates this too, but never trust stored data
                  with an href — javascript:/data: links stay unclickable */}
              {typeof e.link === 'string' && /^https?:\/\//i.test(e.link) && (
                <a href={e.link} target="_blank" rel="noopener noreferrer" className={styles.logLink}>
                  attached link ↗
                </a>
              )}
            </article>
          ))}
          {hidden > 0 && (
            <button className={styles.logMore} onClick={() => setVisible((v) => v + LOG_PAGE)}>
              <span style={{ color: 'var(--pink)' }}>$</span> tail -n +{visible + 1} log.txt
              <span className={styles.logMoreCount}>· {hidden} older</span>
            </button>
          )}
          <div className={styles.logHint}>short thoughts, posted often</div>
        </div>
      </Window>
    </section>
  );
}

// ── gallery ──────────────────────────────────────────────────

// Sanity CDN filenames end in -<width>x<height>.<ext>; reserving the
// ratio up front stops the photo wall reflowing as images load.
function aspectFromUrl(url) {
  const m = /-(\d+)x(\d+)\.\w+$/.exec(url || '');
  return m ? `${m[1]} / ${m[2]}` : undefined;
}

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
    <section id="gallery" className={styles.anchorSection}>
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
        <div className={styles.galleryWall}>
          {filtered.map((item) => (
            <CornerCard
              key={item._id}
              tone="cyan"
              className={styles.galleryCard}
              role="button"
              tabIndex={0}
              aria-label={`View ${item.title || 'image'}`}
              onClick={() => openLightbox(item._id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openLightbox(item._id);
                }
              }}
            >
              <div
                className={styles.galleryImageWrap}
                style={item.imageUrl ? { aspectRatio: aspectFromUrl(item.imageUrl) } : undefined}
              >
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
    <section id="facts" className={styles.anchorSection}>
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
      <PageHeader
        word="lab"
        command="cd ~/lab && ls -la"
        intro="Nothing here is a deliverable."
      />

      <QuickNav
        className={styles.labQuickNav}
        links={[
          { id: 'log',      label: 'log' },
          { id: 'gallery',  label: 'gallery' },
          { id: 'facts',    label: 'facts' },
          { id: 'terminal', label: 'terminal' },
        ]}
      />

      <Reveal><LogFeed entries={logEntries} /></Reveal>

      <Reveal><Gallery photos={photos} /></Reveal>

      <Reveal><FunFacts facts={facts} /></Reveal>

      <Reveal>
        <section id="terminal" className={styles.anchorSection}>
          <SectionHeader cmd="ssh" arg="visitor@ashmita" comment="try `help` or `snake`" />
          <Window title="portfolio-terminal">
            <Terminal profileData={profileData} height="420px" />
          </Window>
        </section>
      </Reveal>
    </div>
  );
}
