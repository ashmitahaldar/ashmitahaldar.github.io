import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen, Clapperboard, Gamepad2, Github, Hammer, Headphones,
  Linkedin, Mail, MapPin, Sparkles,
} from 'lucide-react';
import GitHubActivityCard from '../components/GitHubActivityCard';
import HeroScene from '../components/HeroScene';
import SectionHeader from '../components/SectionHeader';
import Reveal from '../components/Reveal';
import { useTypingEffect } from '../hooks/useTypingEffect';
import { getBlogPosts, getMicroblogs, getProfile, getProjects } from '../services/sanityClient';
import { HOME_CONTENT } from '../content/home';
import { LOG_FALLBACK } from '../content/log';
import Seo from '../components/Seo';
import styles from '../styles/Home.module.css';

// ── helpers ──────────────────────────────────────────────────

function ptToText(blocks) {
  if (!Array.isArray(blocks)) return typeof blocks === 'string' ? blocks : '';
  return blocks
    .filter((b) => b._type === 'block')
    .map((b) => (b.children || []).map((c) => c.text || '').join(''))
    .join(' ');
}

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

// ── hero typewriter: role first, tagline after 900ms ─────────

function HeroTypewriter({ role, tagline }) {
  const [phase, setPhase] = useState(0);

  const { displayedText: roleTxt, isComplete: roleDone } = useTypingEffect(role, 22, 600);
  // const { displayedText: taglineTxt, isComplete: taglineDone } = useTypingEffect(
  //   phase >= 1 ? `// ${tagline}` : '', 14, 0,
  // );

  useEffect(() => {
    if (roleDone && phase === 0) {
      const t = setTimeout(() => setPhase(1), 900);
      return () => clearTimeout(t);
    }
  }, [roleDone, phase]);

  return (
    <div>
      <div className={styles.typeRole}>
        {roleTxt}
        {!roleDone && <span className="blink" />}
      </div>
      {/* <div className={styles.typeTagline}>
        {phase >= 1 && taglineTxt}
        {phase >= 1 && !taglineDone && <span className="blink" />}
      </div> */}
    </div>
  );
}

// ── motion presets ───────────────────────────────────────────

const cascade = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const rise = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.2, 0.7, 0.2, 1] } },
};

// ── hero ─────────────────────────────────────────────────────

function DottedName({ name }) {
  const parts = (name || '').trim().toLowerCase().split(/\s+/).filter(Boolean);
  return (
    <h1 className={styles.name}>
      {parts.map((part, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className={styles.nameDot}>.</span>}
          {part}
        </React.Fragment>
      ))}
      <span className="blink" style={{ color: 'var(--pink)', width: '0.45em', height: '0.85em' }} />
    </h1>
  );
}

function Hero({ profileData }) {
  // Never render an empty hero — fall back to static content if the CMS is down.
  if (!profileData) profileData = HOME_CONTENT.profileFallback;

  const socials = [
    { kind: 'email',    href: profileData.email    ? `mailto:${profileData.email}` : null, Icon: Mail,     accent: 'pink' },
    { kind: 'github',   href: profileData.github   || null,                                Icon: Github,   accent: 'cyan' },
    { kind: 'linkedin', href: profileData.linkedin || null,                                Icon: Linkedin, accent: 'pink' },
  ].filter((s) => s.href);

  return (
    <motion.section className={styles.hero} variants={cascade} initial="hidden" animate="show">
      <div className={styles.heroLeft}>
        <motion.p className={styles.hello} variants={rise}>// hi, i&apos;m</motion.p>

        <motion.div variants={rise}>
          <DottedName name={profileData.name} />
        </motion.div>

        <motion.div variants={rise}>
          <HeroTypewriter role={profileData.title || ''} tagline={profileData.tagline || ''} />
        </motion.div>

        {(profileData.summary || profileData.bio) && (
          <motion.p className={styles.bio} variants={rise}>
            {profileData.summary || ptToText(profileData.bio)}
          </motion.p>
        )}

        {profileData.location && (
          <motion.div className={styles.metaRow} variants={rise}>
            <MapPin style={{ width: 13, height: 13, flexShrink: 0 }} />
            <span>{profileData.location}</span>
          </motion.div>
        )}

        <motion.div className={styles.ctaRow} variants={rise}>
          {socials.length > 0 && (
            <div className={styles.socials}>
              {socials.map((s) => (
                <a
                  key={s.kind}
                  href={s.href}
                  target={s.kind !== 'email' ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className={`ds-icon-btn${s.accent === 'cyan' ? ' cyan' : ''}`}
                  aria-label={s.kind}
                  style={{ width: 38, height: 38 }}
                >
                  <s.Icon style={{ width: 16, height: 16 }} />
                </a>
              ))}
            </div>
          )}
          <Link to="/projects" className="btn-link">see projects →</Link>
          <Link to="/blog" className="btn-link">read the blog →</Link>
        </motion.div>
      </div>

      <motion.div className={styles.heroRight} variants={rise}>
        <HeroScene status={HOME_CONTENT.hero.sceneStatus} />
      </motion.div>
    </motion.section>
  );
}

// ── // now: what's currently in rotation ─────────────────────

const NOW_ICONS = {
  read: BookOpen,
  listen: Headphones,
  build: Hammer,
  watch: Clapperboard,
  play: Gamepad2,
};

function NowBlock({ profileData }) {
  const fromSanity = profileData?.nowItems?.length
    ? { updated: profileData.nowUpdated, items: profileData.nowItems }
    : HOME_CONTENT.now;
  const items = (fromSanity.items || []).filter((i) => i.text && i.text.trim());
  if (!items.length) return null;
  return (
    <section className={styles.section}>
      <SectionHeader
        cmd="cat"
        arg="./now"
        comment={fromSanity.updated ? `updated ${fromSanity.updated}` : undefined}
      />
      <div className={styles.nowList}>
        {items.map((item, i) => {
          const Icon = NOW_ICONS[item.icon] || Sparkles;
          return (
            <div key={i} className={styles.nowLine}>
              <Icon className={styles.nowIcon} />
              <span className={styles.nowLabel}>{item.label || item.icon}</span>
              <span className={styles.nowText}>{item.text}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ── selected work: compact index rows ────────────────────────

// Sanity link fields sometimes omit the protocol.
function externalUrl(url) {
  return url.startsWith('http') ? url : `https://${url}`;
}

function ProjectRows({ projects }) {
  if (!projects.length) return null;
  return (
    <section className={styles.section}>
      <SectionHeader cmd="ls" arg="./projects" comment="selected" count={projects.length} />
      <div className={styles.rowList}>
        {projects.map((p) => {
          const primary = p.demo || p.github || null;
          const blurb = ptToText(p.description);
          const tags = (p.technologies || []).slice(0, 3).map((t) => t.toLowerCase()).join(' · ');
          return (
            // The whole row links to the primary destination via the
            // stretched cover; live/repo are real links layered above it.
            <div key={p._id} className={styles.row}>
              {primary ? (
                <a
                  href={externalUrl(primary)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.rowCover}
                  aria-label={p.title}
                />
              ) : (
                <Link to="/projects" className={styles.rowCover} aria-label={p.title} />
              )}
              <span className={styles.rowPerm}>drwxr-xr-x</span>
              <span className={styles.rowMain}>
                <span className={styles.rowTitleLine}>
                  <span className={styles.rowTitle}>{p.title}</span>
                  {tags && <span className={styles.rowTags}>{tags}</span>}
                </span>
                {blurb && <span className={styles.rowBlurb}>{blurb}</span>}
              </span>
              <span className={styles.rowAside}>
                {p.demo && (
                  <a href={externalUrl(p.demo)} target="_blank" rel="noopener noreferrer" className={styles.rowLink}>
                    live ↗
                  </a>
                )}
                {p.github && (
                  <a href={externalUrl(p.github)} target="_blank" rel="noopener noreferrer" className={styles.rowLink}>
                    repo ↗
                  </a>
                )}
                <span className={styles.rowArrow}>→</span>
              </span>
            </div>
          );
        })}
      </div>
      <div className={styles.sectionFooter}>
        <Link to="/projects" className="btn-link">all projects →</Link>
      </div>
    </section>
  );
}

// ── recent writing ───────────────────────────────────────────

function WritingRows({ posts }) {
  if (!posts.length) return null;
  return (
    <section className={styles.section}>
      <SectionHeader cmd="tail" arg={`-n ${posts.length} ./blog`} count={posts.length} />
      <div className={styles.rowList}>
        {posts.map((p) => (
          <Link key={p._id} to={`/blog/${p.slug?.current}`} className={styles.row}>
            <span className={styles.rowPerm}>-rw-r--r--</span>
            <span className={styles.rowMain}>
              <span className={styles.rowTitleLine}>
                <span className={styles.rowTitle}>{p.title}</span>
                {p.tags?.length > 0 && (
                  <span className={styles.rowTags}>{p.tags.slice(0, 2).map((t) => `#${t}`).join(' ')}</span>
                )}
              </span>
              {p.excerpt && <span className={styles.rowBlurb}>{p.excerpt}</span>}
            </span>
            <span className={styles.rowAside}>
              <span>{formatDate(p.publishedAt)}</span>
              <span className={styles.rowArrow}>→</span>
            </span>
          </Link>
        ))}
      </div>
      <div className={styles.sectionFooter}>
        <Link to="/blog" className="btn-link">all posts →</Link>
      </div>
    </section>
  );
}

// ── log teaser: latest microblog lines ───────────────────────

function LogTeaser({ entries }) {
  if (!entries.length) return null;
  return (
    <section className={styles.section}>
      <SectionHeader cmd="tail" arg="-f ~/lab/log.txt" comment="microblog" />
      <div className={styles.logList}>
        {entries.map((e, i) => (
          <div key={e._id || i} className={styles.logLine}>
            <span className={styles.logTime}>[{formatDate(e.postedAt)}]</span>
            <span className={styles.logText}>
              {e.text}
              {i === 0 && <span className="blink" style={{ color: 'var(--cyan)', width: 6, height: 13 }} />}
            </span>
            {e.mood && <span className={styles.logMood}>{e.mood}</span>}
          </div>
        ))}
      </div>
      <div className={styles.sectionFooter}>
        <Link to="/lab" className="btn-link">cd ~/lab →</Link>
      </div>
    </section>
  );
}

// ── main ─────────────────────────────────────────────────────

export default function Home() {
  const [profileData, setProfileData] = useState(null);
  const [projects, setProjects]       = useState([]);
  const [posts, setPosts]             = useState([]);
  const [logEntries, setLogEntries]   = useState([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    Promise.allSettled([
      getProfile(),
      getProjects(),
      getBlogPosts(),
      getMicroblogs(),
    ]).then(([profileRes, projectsRes, postsRes, logsRes]) => {
      if (profileRes.status  === 'fulfilled') setProfileData(profileRes.value);
      if (projectsRes.status === 'fulfilled') setProjects((projectsRes.value || []).slice(0, 3));
      if (postsRes.status    === 'fulfilled') setPosts((postsRes.value || []).slice(0, 3));

      const logs = logsRes.status === 'fulfilled' && logsRes.value?.length
        ? logsRes.value
        : LOG_FALLBACK;
      setLogEntries(logs.slice(0, 3));

      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <span style={{ color: 'var(--pink)' }}>$</span>
        &nbsp;loading...
        <span className="blink" style={{ color: 'var(--pink)' }} />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Seo path="/" />

      <Hero profileData={profileData} />

      <Reveal>
        <div className={styles.statusDuo}>
          <NowBlock profileData={profileData} />
          <LogTeaser entries={logEntries} />
        </div>
      </Reveal>

      <Reveal><ProjectRows projects={projects} /></Reveal>

      <Reveal><WritingRows posts={posts} /></Reveal>

      <Reveal>
        <SectionHeader cmd="git" arg="contributions --year" comment="synced from github" />
        {profileData && <GitHubActivityCard github={profileData.github} />}
      </Reveal>

    </div>
  );
}
