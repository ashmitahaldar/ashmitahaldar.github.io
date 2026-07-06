import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Terminal, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import CornerCard from '../components/CornerCard';
import SectionHeader from '../components/SectionHeader';
import Reveal from '../components/Reveal';
import { getEducation, getExperiences, getProfile, getResume, getSkills } from '../services/sanityClient';
import { useTypingEffect } from '../hooks/useTypingEffect';
import PortableText from '../components/PortableText';
import ResumeModal from '../components/ResumeModal';
import { HOME_CONTENT } from '../content/home';
import styles from '../styles/About.module.css';

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
  if (typeof period === 'string') return period;
  const from = period.from ? period.from.slice(0, 4) : '';
  const to   = period.isCurrent || !period.to ? 'now' : period.to.slice(0, 4);
  return from === to ? from : `${from} — ${to}`;
}

// Map flat Sanity skills doc → grouped array for the JSON block.
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

// ── skills as a JS object literal ────────────────────────────

function SkillsBlock({ groups }) {
  if (!groups || !groups.length) return null;
  const total = groups.reduce((n, g) => n + g.items.length, 0);
  return (
    <section>
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
        </div>
      </CornerCard>
    </section>
  );
}

// ── experience timeline (compact) ────────────────────────────

function ExperienceTimeline({ experiences }) {
  if (!experiences.length) return null;
  return (
    <section id="experience">
      <SectionHeader cmd="git" arg="log --experience" count={experiences.length} />
      <CornerCard tone="pink">
        {experiences.map((e, i) => {
          const tone = i % 2 === 0 ? 'pink' : 'cyan';
          const what = Array.isArray(e.description) ? null : e.description;
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
                {Array.isArray(e.description) ? (
                  <div className={styles.expWhat}><PortableText value={e.description} /></div>
                ) : (
                  what && <span className={styles.expWhat}>{what}</span>
                )}
                {e.technologies?.length > 0 && (
                  <div className={styles.expTech}>
                    {e.technologies.map((t) => (
                      <span key={t} className={`ds-tag${tone === 'cyan' ? ' cyan' : ''}`}>{t}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </CornerCard>
    </section>
  );
}

// ── education (compact) ──────────────────────────────────────

function EducationList({ education }) {
  if (!education.length) return null;
  return (
    <section id="education">
      <SectionHeader cmd="cat" arg="education.log" count={education.length} />
      <CornerCard tone="cyan">
        {education.map((edu, i) => (
          <div
            key={edu._id || i}
            className={styles.eduRow}
            style={{ borderBottom: i < education.length - 1 ? '1px dashed rgba(45,212,191,0.15)' : 'none' }}
          >
            <div className={styles.eduHeader}>
              <span className={styles.eduDegree}>{edu.degree}</span>
              <span className={styles.eduWhen}>{formatPeriod(edu.period || edu.dateRange)}</span>
            </div>
            <div className={styles.eduMeta}>
              <span style={{ color: 'var(--cyan)' }}>{edu.school}</span>
              {edu.location && <span className={styles.eduDim}> · {edu.location}</span>}
              {edu.gpa && <span className={styles.eduGpa}>gpa {edu.gpa}</span>}
            </div>
            {edu.description?.length > 0 && (
              <ul className={styles.eduHighlights}>
                {edu.description.map((item, idx) => (
                  <li key={idx}><span className={styles.eduBullet}>▸</span> {item}</li>
                ))}
              </ul>
            )}
            {edu.relevant?.length > 0 && (
              <div className={styles.eduCoursework}>
                {edu.relevant.map((course) => (
                  <span key={course} className="ds-tag cyan">{course}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </CornerCard>
    </section>
  );
}

// ── main ─────────────────────────────────────────────────────

const About = () => {
  const location = useLocation();
  const [profileData, setProfileData]   = useState(null);
  const [skillGroups, setSkillGroups]   = useState(null);
  const [experiences, setExperiences]   = useState([]);
  const [education, setEducation]       = useState([]);
  const [resumeData, setResumeData]     = useState(null);
  const [loading, setLoading]           = useState(true);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const { displayedText: typedTitle, isComplete: titleComplete } = useTypingEffect('About Me', 100);
  const { displayedText: typedSubtitle } = useTypingEffect('cat ~/.profile/about.txt', 50, 1000);

  useEffect(() => {
    Promise.allSettled([
      getProfile(),
      getSkills(),
      getResume(),
      getExperiences(),
      getEducation(),
    ]).then(([profileRes, skillsRes, resumeRes, expRes, eduRes]) => {
      if (profileRes.status === 'fulfilled') setProfileData(profileRes.value);
      if (resumeRes.status  === 'fulfilled') setResumeData(resumeRes.value);
      if (expRes.status     === 'fulfilled') setExperiences(expRes.value || []);
      if (eduRes.status     === 'fulfilled') setEducation(eduRes.value || []);

      if (skillsRes.status === 'fulfilled') {
        setSkillGroups(sanitySkillsToGroups(skillsRes.value) ?? HOME_CONTENT.skills);
      } else {
        setSkillGroups(HOME_CONTENT.skills);
      }

      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('resume') === '1') {
      setIsResumeModalOpen(true);
    }
  }, [location.search]);

  // Honour #experience / #education deep links once content is in.
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
        <div className={styles.loadingText}>Loading...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className={styles.title}>
            <Terminal className={styles.titleIcon} />
            <span>
              {typedTitle}
              {!titleComplete && <span className={styles.cursor}>_</span>}
            </span>
          </h1>
          <p className={styles.subtitle}>
            <span className={styles.subtitlePrompt}>$ </span>
            <span className={styles.subtitleCommand}>{typedSubtitle}</span>
          </p>
        </motion.div>

        {/* Story */}
        <section>
          <SectionHeader cmd="cat" arg="story.md" />
          <CornerCard tone="pink" className={styles.bioCard}>
            <div className={styles.bioText}>
              {profileData?.bio ? (
                <PortableText value={profileData.bio} />
              ) : (
                <p>No bio available.</p>
              )}
            </div>
          </CornerCard>
        </section>

        <Reveal><SkillsBlock groups={skillGroups} /></Reveal>

        <Reveal><ExperienceTimeline experiences={experiences} /></Reveal>

        <Reveal><EducationList education={education} /></Reveal>

        {/* View Resume Button */}
        {resumeData?.pdfUrl && (
          <button
            className={styles.viewResumeButton}
            onClick={() => setIsResumeModalOpen(true)}
          >
            <FileText className={styles.resumeIcon} />
            <span>View Resume</span>
          </button>
        )}
      </div>

      {/* Resume Modal */}
      <ResumeModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
        resumeData={resumeData}
      />
    </div>
  );
};

export default About;
