import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail, MapPin } from 'lucide-react';
import Spline from '@splinetool/react-spline';
import SplineErrorBoundary from '../components/SplineErrorBoundary';
import GitHubActivityCard from '../components/GitHubActivityCard';
import Terminal from '../components/Terminal';
import CornerCard from '../components/CornerCard';
import SectionHeader from '../components/SectionHeader';
import Reveal from '../components/Reveal';
import { useTypingEffect } from '../hooks/useTypingEffect';
import { getBlogPosts, getExperiences, getProfile, getProjects, getSkills } from '../services/sanityClient';
import { HOME_CONTENT } from '../content/home';
import styles from '../styles/Home.module.css';

// ── helpers ──────────────────────────────────────────────────

function ptToText(blocks) {
  if (!Array.isArray(blocks)) return typeof blocks === 'string' ? blocks : '';
  return blocks
    .filter((b) => b._type === 'block')
    .map((b) => (b.children || []).map((c) => c.text || '').join(''))
    .join(' ');
}

function formatPeriod(period) {
  if (!period) return '';
  const from = period.from ? period.from.slice(0, 4) : '';
  const to   = period.isCurrent || !period.to ? 'now' : period.to.slice(0, 4);
  return from === to ? from : `${from} — ${to}`;
}

function formatBlogDate(publishedAt) {
  if (!publishedAt) return '';
  try {
    const d = new Date(publishedAt);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  } catch {
    return '';
  }
}

// Map flat Sanity skills doc → grouped array used by SkillsSection.
// TODO: the Sanity `skills` schema has no per-item "currently learning" flag.
//       Add a separate `learningItems: string[]` field to the schema if you
//       want the † indicator to be data-driven rather than hardcoded.
function sanitySkillsToGroups(doc) {
  if (!doc) return null;
  const map = [
    { group: 'languages',  key: 'languages' },
    { group: 'frameworks', key: 'frameworks' },
    { group: 'tools',      key: 'tools' },
    { group: 'interests',  key: 'interests' },
  ];
  const groups = map
    .map(({ group, key }) => ({ group, items: doc[key] || [] }))
    .filter((g) => g.items.length > 0);
  return groups.length > 0 ? groups : null;
}

// ── now icons ────────────────────────────────────────────────

const NOW_ICONS = {
  build: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...p}>
      <path d="M14 6l6 6-9 9H5v-6l9-9z" /><path d="M13 7l4 4" />
    </svg>
  ),
  read: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...p}>
      <path d="M4 4h11a4 4 0 0 1 4 4v12H8a4 4 0 0 1-4-4V4z" />
      <path d="M4 16a4 4 0 0 1 4-4h11" />
    </svg>
  ),
  learn: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M12 2l1.6 5.4L19 9l-5.4 1.6L12 16l-1.6-5.4L5 9l5.4-1.6z" />
    </svg>
  ),
  listen: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...p}>
      <path d="M4 14v-2a8 8 0 1 1 16 0v2" />
      <path d="M4 14h3v6H5a1 1 0 0 1-1-1v-5zM20 14h-3v6h2a1 1 0 0 0 1-1v-5z" />
    </svg>
  ),
  travel: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...p}>
      <path d="M3 11l18-7-7 18-2-8-9-3z" />
    </svg>
  ),
};

// ── hero typewriter: role first, tagline after 900ms ─────────

function HeroTypewriter({ role, tagline }) {
  const [phase, setPhase] = useState(0);

  const { displayedText: roleTxt,     isComplete: roleDone     } = useTypingEffect(role,                    22, 600);
  const { displayedText: taglineTxt,  isComplete: taglineDone  } = useTypingEffect(
    phase >= 1 ? `// ${tagline}` : '', 14, 0,
  );

  useEffect(() => {
    if (roleDone && phase === 0) {
      const t = setTimeout(() => setPhase(1), 900);
      return () => clearTimeout(t);
    }
  }, [roleDone, phase]);

  return (
    <>
      <div className={styles.typeRole}>
        {roleTxt}
        {!roleDone && <span className="blink" />}
      </div>
      <div className={styles.typeTagline}>
        {phase >= 1 && taglineTxt}
        {phase >= 1 && !taglineDone && <span className="blink" />}
      </div>
    </>
  );
}

// ── Hero ─────────────────────────────────────────────────────

function Hero({ profileData }) {
  const [splineLoading, setSplineLoading] = useState(true);
  if (!profileData) return null;

  const socials = [
    { kind: 'email',    href: profileData.email    ? `mailto:${profileData.email}` : null, Icon: Mail,     accent: 'pink' },
    { kind: 'github',   href: profileData.github   || null,                                Icon: Github,   accent: 'cyan' },
    { kind: 'linkedin', href: profileData.linkedin || null,                                Icon: Linkedin, accent: 'pink' },
  ].filter((s) => s.href);

  return (
    <div className={styles.heroRow}>

      {/* Left: bio card */}
      <div className={styles.heroLeft}>
        <CornerCard tone="pink" className={styles.bioCard}>

          {/* Avatar + name + status */}
          <div className={styles.avatarRow}>
            <div className={styles.avatarWrap}>
              <div className={styles.avatarImg}>
                {profileData.avatarUrl
                  ? <img src={profileData.avatarUrl} alt={profileData.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ fontSize: 40 }}>👾</span>}
              </div>
            </div>
            <div className={styles.nameBlock}>
              <span className={styles.hello}>// hello, i'm</span>
              <h1 className={styles.name}>{profileData.name}</h1>
            </div>
          </div>

          <HeroTypewriter role={profileData.title || ''} tagline={profileData.tagline || ''} />

          {(profileData.summary || profileData.bio) && (
            <p className={styles.bio}>{profileData.summary || profileData.bio}</p>
          )}

          {profileData.location && (
            <div className={styles.location}>
              <MapPin style={{ width: 14, height: 14, flexShrink: 0 }} />
              <span>{profileData.location}</span>
            </div>
          )}

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
                >
                  <s.Icon style={{ width: 18, height: 18 }} />
                </a>
              ))}
            </div>
          )}
        </CornerCard>
      </div>

      {/* Right: Spline only (stats strip removed) */}
      <div className={styles.heroRight}>
        <SplineErrorBoundary
          fallback={
            <div className={styles.splineFallback}>
              <span style={{ color: 'var(--pink)', fontSize: 11 }}>// 3D scene unavailable</span>
              <span style={{ color: 'var(--text-dim)', fontSize: 12 }}>desk · monitor · flowers</span>
            </div>
          }
        >
          {splineLoading && (
            <div className={styles.splineLoader}>
              <span style={{ color: 'var(--pink)' }}>$</span>&nbsp;loading scene...
              <span className="blink" style={{ color: 'var(--text-dim)' }} />
            </div>
          )}
          <Spline
            scene="https://prod.spline.design/PZ-RH4uPUyHnb9mI/scene.splinecode"
            onLoad={() => setSplineLoading(false)}
            style={{ width: '100%', height: '100%' }}
          />
        </SplineErrorBoundary>
      </div>
    </div>
  );
}

// ── // now ───────────────────────────────────────────────────

function NowSection({ nowItems, nowUpdated }) {
  const items   = (nowItems   && nowItems.length)   ? nowItems   : HOME_CONTENT.now.items;
  const updated = nowUpdated || HOME_CONTENT.now.updated;
  return (
    <>
      <SectionHeader cmd="now" arg="--current" comment={`updated ${updated}`} count={items.length} />
      <CornerCard tone="pink">
        <div className={styles.nowGrid}>
          {items.map((it, i) => {
            const IconComp = NOW_ICONS[it.icon] || NOW_ICONS.learn;
            return (
              <div key={i} className={styles.nowItem}>
                <div className={styles.nowLabel}>
                  <IconComp style={{ width: 14, height: 14, flexShrink: 0 }} />
                  <span>// {it.label}</span>
                </div>
                <div className={styles.nowText}>{it.text}</div>
              </div>
            );
          })}
        </div>
      </CornerCard>
    </>
  );
}

// ── featured projects ────────────────────────────────────────

function ProjectsSection({ projects }) {
  if (!projects.length) return null;
  return (
    <>
      <SectionHeader cmd="ls" arg="./projects" count={projects.length} />
      <div className={styles.projectsGrid}>
        {projects.map((p, i) => {
          const accent = i % 2 === 0 ? 'pink' : 'cyan';
          const blurb = ptToText(p.description);
          const links = [
            p.demo   && { label: 'live →',  href: p.demo },
            p.github && { label: 'repo →',  href: p.github },
          ].filter(Boolean);

          return (
            <CornerCard key={p._id} tone={accent} className={styles.projectCard}>
              <span style={{ color: `var(--${accent})`, fontSize: 20, fontWeight: 700 }}>{p.title}</span>

              {p.imageUrl ? (
                <img src={p.imageUrl} alt={p.title} className={styles.projectImg} />
              ) : (
                <div className={`${styles.projectPlaceholder} ${accent === 'cyan' ? styles.projectPlaceholderCyan : ''}`}>
                  {p.title.toLowerCase()}.png
                </div>
              )}

              {blurb && (
                <p className={styles.projectBlurb}>
                  {blurb.length > 180 ? blurb.slice(0, 180) + '...' : blurb}
                </p>
              )}

              {(p.technologies || []).length > 0 && (
                <div className={styles.tagRow}>
                  {p.technologies.map((t) => (
                    <span key={t} className={`ds-tag${accent === 'cyan' ? ' cyan' : ''}`}>{t}</span>
                  ))}
                </div>
              )}

              <div className={styles.projectFooter}>
                {links.length > 0 && (
                  <div style={{ display: 'flex', gap: 12 }}>
                    {links.map((l, j) => (
                      <a key={j} href={l.href} target="_blank" rel="noopener noreferrer" className="btn-link">
                        {l.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </CornerCard>
          );
        })}
      </div>

      {/* "View all" link */}
      <div className={styles.sectionFooter}>
        <Link to="/projects" className="btn-link">explore all projects →</Link>
      </div>
    </>
  );
}

// ── skills ───────────────────────────────────────────────────

function SkillsSection({ groups }) {
  if (!groups || !groups.length) return null;
  const total = groups.reduce((n, g) => n + g.items.length, 0);
  return (
    <>
      <SectionHeader cmd="cat" arg="skills.json" count={total} />
      <CornerCard tone="cyan">
        <div className={styles.skillsBlock}>
          <div>
            <span style={{ color: 'var(--violet)' }}>const</span>{' '}
            <span style={{ color: 'var(--cyan)' }}>stack</span>{' '}
            <span style={{ color: 'var(--text-dim)' }}>=</span>{' '}
            {'{'}
          </div>
          {groups.map((g, i) => (
            <div key={g.group} className={styles.skillRow}>
              <span className={styles.skillKey}>
                {g.group}<span style={{ color: 'var(--text-dim)' }}>:</span>
              </span>
              <div className={styles.skillItems}>
                <span style={{ color: 'var(--text-dim)' }}>[</span>
                {g.items.map((s, j) => (
                  <React.Fragment key={s}>
                    <span style={{ color: 'var(--green)' }}>&quot;{s}&quot;</span>
                    {j < g.items.length - 1 && <span style={{ color: 'var(--text-dim)' }}>,</span>}
                  </React.Fragment>
                ))}
                <span style={{ color: 'var(--text-dim)' }}>{']'}{i < groups.length - 1 ? ',' : ''}</span>
              </div>
            </div>
          ))}
          <div>{'}'}<span style={{ color: 'var(--text-dim)' }}>;</span></div>
          <div className={styles.skillNote}>// † = currently learning</div>
        </div>
      </CornerCard>
    </>
  );
}

// ── experience timeline ──────────────────────────────────────

function ExperienceSection({ experiences }) {
  if (!experiences.length) return null;
  return (
    <>
      <SectionHeader cmd="git" arg="log --experience" count={experiences.length} />
      <CornerCard tone="pink">
        {experiences.map((e, i) => {
          const tone = i % 2 === 0 ? 'pink' : 'cyan';
          const what = ptToText(e.description);
          return (
            <div
              key={e._id}
              className={styles.expRow}
              style={{ borderBottom: i < experiences.length - 1 ? '1px dashed rgba(255,61,140,0.15)' : 'none' }}
            >
              <div className={styles.expWhen}>{formatPeriod(e.period)}</div>
              <div className={styles.expDot} style={{ background: `var(--${tone})`, boxShadow: `0 0 12px var(--${tone}-dim)` }} />
              <div className={styles.expContent}>
                <div className={styles.expHeader}>
                  <span className={styles.expTitle}>
                    {e.title}{' '}
                    <span style={{ color: 'var(--text-dim)' }}>@</span>{' '}
                    <span style={{ color: `var(--${tone})` }}>{e.company}</span>
                  </span>
                  {e.location && <span className={styles.expCity}>{e.location}</span>}
                </div>
                {what && (
                  <span className={styles.expWhat}>
                    {what.length > 220 ? what.slice(0, 220) + '...' : what}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </CornerCard>

      {/* "View all" link */}
      <div className={styles.sectionFooter}>
        <Link to="/experience" className="btn-link">view full timeline →</Link>
      </div>
    </>
  );
}

// ── recent writing ───────────────────────────────────────────

function BlogSection({ posts }) {
  if (!posts.length) return null;
  return (
    <>
      <SectionHeader cmd="cat" arg="./blog/recent.md" count={posts.length} />
      <div className={styles.blogList}>
        {posts.map((p, i) => {
          const accent = i % 2 === 0 ? 'pink' : 'cyan';
          const date   = formatBlogDate(p.publishedAt);
          return (
            <CornerCard key={p._id} tone={accent} className={styles.blogCard}>
              <div className={styles.blogMeta}>
                {date && <span>{date}</span>}
                {date && p.tags?.length > 0 && <span style={{ color: 'var(--text-faint)' }}>·</span>}
                {(p.tags || []).map((t) => <span key={t}>#{t}</span>)}
              </div>
              <Link to={`/blog/${p.slug?.current}`} className={styles.blogTitle}>{p.title}</Link>
              {p.excerpt && <p className={styles.blogBlurb}>{p.excerpt}</p>}
              <Link to={`/blog/${p.slug?.current}`} className="btn-link" style={{ alignSelf: 'flex-end' }}>read →</Link>
            </CornerCard>
          );
        })}
        <Link to="/blog" className="btn-link" style={{ alignSelf: 'flex-start', marginTop: 4 }}>
          all posts →
        </Link>
      </div>
    </>
  );
}

// ── fun facts ────────────────────────────────────────────────

function FunFactsSection({ funFacts: sanityFacts }) {
  const facts = (sanityFacts && sanityFacts.length) ? sanityFacts : HOME_CONTENT.funFacts;
  return (
    <>
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
    </>
  );
}

// ── main ─────────────────────────────────────────────────────

export default function Home() {
  const [profileData, setProfileData] = useState(null);
  const [projects, setProjects]       = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [posts, setPosts]             = useState([]);
  const [skillGroups, setSkillGroups] = useState(null); // null = loading, [] = empty
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    Promise.allSettled([
      getProfile(),
      getProjects(),
      getExperiences(),
      getBlogPosts(),
      getSkills(),
    ]).then(([profileRes, projectsRes, experiencesRes, postsRes, skillsRes]) => {
      if (profileRes.status    === 'fulfilled') setProfileData(profileRes.value);
      if (projectsRes.status   === 'fulfilled') setProjects((projectsRes.value || []).slice(0, 3));
      if (experiencesRes.status === 'fulfilled') setExperiences(experiencesRes.value || []);
      if (postsRes.status      === 'fulfilled') setPosts((postsRes.value || []).slice(0, 3));

      // Skills: prefer Sanity, fall back to HOME_CONTENT
      if (skillsRes.status === 'fulfilled') {
        setSkillGroups(sanitySkillsToGroups(skillsRes.value) ?? HOME_CONTENT.skills);
      } else {
        setSkillGroups(HOME_CONTENT.skills);
      }

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

      <Hero profileData={profileData} />

      <Reveal><NowSection nowItems={profileData?.nowItems} nowUpdated={profileData?.nowUpdated} /></Reveal>

      <Reveal><ProjectsSection projects={projects} /></Reveal>

      <Reveal><SkillsSection groups={skillGroups} /></Reveal>

      <Reveal><ExperienceSection experiences={experiences} /></Reveal>

      <Reveal><BlogSection posts={posts} /></Reveal>

      <Reveal><FunFactsSection funFacts={profileData?.funFacts} /></Reveal>

      <Reveal>
        <SectionHeader cmd="git" arg="contributions --year" comment="synced from github" />
        {profileData && <GitHubActivityCard github={profileData.github} />}
      </Reveal>

      <Reveal>
        <SectionHeader cmd="sh" arg="--interactive" comment="type help for commands" />
        <CornerCard tone="cyan" style={{ padding: 0, overflow: 'hidden' }}>
          {profileData && <Terminal profileData={profileData} />}
          <div className={styles.terminalTip}>
            <span style={{ color: 'var(--pink)' }}>tip:</span>{' '}
            type <code style={{ color: 'var(--cyan)' }}>help</code> · use{' '}
            <code style={{ color: 'var(--cyan)' }}>↑↓</code> for history · try{' '}
            <code style={{ color: 'var(--cyan)' }}>/projects</code>
          </div>
        </CornerCard>
      </Reveal>

    </div>
  );
}
