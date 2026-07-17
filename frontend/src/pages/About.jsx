import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FileText, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CornerCard from '../components/CornerCard';
import PageHeader from '../components/PageHeader';
import QuickNav from '../components/QuickNav';
import SectionHeader from '../components/SectionHeader';
import Reveal from '../components/Reveal';
import { getEducation, getExperiences, getProfile, getResume, getSkills } from '../services/sanityClient';
import PortableText from '../components/PortableText';
import ResumeModal from '../components/ResumeModal';
import { HOME_CONTENT } from '../content/home';
import Seo from '../components/Seo';
import { personLd } from '../lib/seo';
import styles from '../styles/About.module.css';

// ── helpers ──────────────────────────────────────────────────

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

// ── quick nav links ──────────────────────────────────────────

const QUICK_LINKS = [
  { id: 'story',      label: 'story' },
  { id: 'skills',     label: 'skills' },
  { id: 'experience', label: 'experience' },
  { id: 'education',  label: 'education' },
  { id: 'resume',     label: 'resume' },
];

// ── collapsible body ─────────────────────────────────────────

function Expandable({ open, children }) {
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.32, ease: [0.2, 0.7, 0.2, 1] }}
          style={{ overflow: 'hidden' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── skills as a JS object literal ────────────────────────────

function SkillsBlock({ groups }) {
  if (!groups || !groups.length) return null;
  const total = groups.reduce((n, g) => n + g.items.length, 0);
  return (
    <section id="skills" className={styles.anchorSection}>
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

// ── experience: collapsed timeline, expand for detail ────────

function ExperienceTimeline({ experiences }) {
  const [openIdx, setOpenIdx] = useState(0); // most recent open by default
  if (!experiences.length) return null;
  return (
    <section id="experience" className={styles.anchorSection}>
      <SectionHeader cmd="git" arg="log --experience" comment="click to expand" count={experiences.length} />
      <CornerCard tone="pink">
        {experiences.map((e, i) => {
          const tone = i % 2 === 0 ? 'pink' : 'cyan';
          const open = openIdx === i;
          return (
            <div
              key={e._id}
              className={styles.accRow}
              style={{ borderBottom: i < experiences.length - 1 ? '1px dashed var(--line-soft)' : 'none' }}
            >
              <button
                className={styles.accHeader}
                onClick={() => setOpenIdx(open ? -1 : i)}
                aria-expanded={open}
              >
                <span className={styles.accWhen}>{formatPeriod(e.period)}</span>
                <span className={styles.accDot} style={{ background: `var(--${tone})`, boxShadow: `0 0 12px var(--${tone}-dim)` }} />
                <span className={styles.accTitleWrap}>
                  <span className={styles.accTitle}>
                    {e.title}{' '}
                    <span style={{ color: 'var(--text-dim)' }}>@</span>{' '}
                    <span style={{ color: `var(--${tone})` }}>{e.company}</span>
                  </span>
                  {e.location && <span className={styles.accCity}>{e.location}</span>}
                </span>
                <ChevronDown className={`${styles.accChevron} ${open ? styles.accChevronOpen : ''}`} />
              </button>

              <Expandable open={open}>
                <div className={styles.accBody}>
                  {Array.isArray(e.description) ? (
                    <div className={styles.accWhat}><PortableText value={e.description} /></div>
                  ) : (
                    e.description && <p className={styles.accWhat}>{e.description}</p>
                  )}
                  {e.technologies?.length > 0 && (
                    <div className={styles.accTech}>
                      {e.technologies.map((t) => (
                        <span key={t} className={`ds-tag${tone === 'cyan' ? ' cyan' : ''}`}>{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              </Expandable>
            </div>
          );
        })}
      </CornerCard>
    </section>
  );
}

// ── education: same collapsed pattern ────────────────────────

function EducationList({ education }) {
  const [openIdx, setOpenIdx] = useState(0);
  if (!education.length) return null;
  return (
    <section id="education" className={styles.anchorSection}>
      <SectionHeader cmd="cat" arg="education.log" comment="click to expand" count={education.length} />
      <CornerCard tone="cyan">
        {education.map((edu, i) => {
          const open = openIdx === i;
          return (
            <div
              key={edu._id || i}
              className={styles.accRow}
              style={{ borderBottom: i < education.length - 1 ? '1px dashed var(--line-soft)' : 'none' }}
            >
              <button
                className={styles.accHeader}
                onClick={() => setOpenIdx(open ? -1 : i)}
                aria-expanded={open}
              >
                <span className={styles.accWhen}>{formatPeriod(edu.period || edu.dateRange)}</span>
                <span className={styles.accDot} style={{ background: 'var(--cyan)', boxShadow: '0 0 12px var(--cyan-dim)' }} />
                <span className={styles.accTitleWrap}>
                  <span className={styles.accTitle}>{edu.degree}</span>
                  <span className={styles.accCity}>
                    <span style={{ color: 'var(--cyan)' }}>{edu.school}</span>
                    {edu.location && <> · {edu.location}</>}
                    {edu.gpa && <span className={styles.eduGpa}>{edu.gpa}</span>}
                  </span>
                </span>
                <ChevronDown className={`${styles.accChevron} ${open ? styles.accChevronOpen : ''}`} />
              </button>

              <Expandable open={open}>
                <div className={styles.accBody}>
                  {edu.description?.length > 0 && (
                    <ul className={styles.eduHighlights}>
                      {edu.description.map((item, idx) => (
                        <li key={idx}><span className={styles.eduBullet}>▸</span> {item}</li>
                      ))}
                    </ul>
                  )}
                  {edu.relevant?.length > 0 && (
                    <div className={styles.accTech}>
                      {edu.relevant.map((course) => (
                        <span key={course} className="ds-tag cyan">{course}</span>
                      ))}
                    </div>
                  )}
                </div>
              </Expandable>
            </div>
          );
        })}
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
    if (!el) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const t = setTimeout(
      () => el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' }),
      60,
    );
    return () => clearTimeout(t);
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
      <Seo
        title="About"
        path="/about"
        description="Ashmita Haldar's story, skills, experience, and education — a CS student and builder working across code, design, and 3D."
        jsonLd={personLd({
          name: profileData?.name,
          sameAs: [profileData?.github, profileData?.linkedin],
        })}
      />
      <div className={styles.content}>
        <PageHeader word="about" command="cat ~/.profile/about.txt" />

        <QuickNav
          links={QUICK_LINKS.filter((l) => {
            if (l.id === 'skills') return !!skillGroups?.length;
            if (l.id === 'experience') return experiences.length > 0;
            if (l.id === 'education') return education.length > 0;
            if (l.id === 'resume') return !!resumeData?.pdfUrl;
            return true;
          })}
        />

        {/* Story */}
        <section id="story" className={styles.anchorSection}>
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
          <div id="resume" className={styles.anchorSection}>
            <button
              className={styles.viewResumeButton}
              onClick={() => setIsResumeModalOpen(true)}
            >
              <FileText className={styles.resumeIcon} />
              <span>View Resume</span>
            </button>
          </div>
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
