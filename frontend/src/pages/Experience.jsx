import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, Calendar, Code2, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';
import PixelCard from '../components/PixelCard';
import { getExperiences } from '../services/sanityClient';
import PortableText from '../components/PortableText';
import { useTypingEffect } from '../hooks/useTypingEffect';
import styles from '../styles/Experience.module.css';

const Experience = () => {
  const [experience, setExperience] = useState([]);
  const [loading, setLoading] = useState(true);
  const { displayedText: typedTitle, isComplete: titleComplete } = useTypingEffect('Experience', 100);
  const { displayedText: typedSubtitle } = useTypingEffect('cat ~/.work/timeline.log', 50, 1000);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const data = await getExperiences();
        setExperience(data);
      } catch (error) {
        console.error('Error fetching experience from Sanity:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchExperience();
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingText}>Loading...</div>
      </div>
    );
  } else if (experience.length === 0) {
    return (
      <PixelCard className={styles.emptyCard}>
          <Briefcase className={styles.emptyIcon} />
          <p className={styles.emptyText}>No experience records found.</p>
      </PixelCard>
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

        {/* Timeline */}
        <div className={styles.timeline}>
          {/* Timeline Line */}
          <div className={styles.timelineLine}></div>

          {/* Experience Items */}
          <div className={styles.experienceList}>
            {experience.map((exp, index) => (
              <div key={exp._id || index} className={styles.experienceItem}>
                {/* Timeline Dot */}
                <div className={styles.timelineDot}></div>

                {/* Content Card */}
                <PixelCard className={styles.experienceCard}>
                  {/* Header */}
                  <div className={styles.experienceHeader}>
                    <h3 className={styles.jobTitle}>
                      {exp.title}
                    </h3>
                    <div className={styles.metadata}>
                      <div className={`${styles.metadataItem} ${styles.metadataItemPrimary}`}>
                        <Briefcase className={styles.metadataIcon} />
                        <span>{exp.company}</span>
                      </div>
                      <div className={`${styles.metadataItem} ${styles.metadataItemSecondary}`}>
                        <MapPin className={styles.metadataIcon} />
                        <span>{exp.location}</span>
                      </div>
                      <div className={`${styles.metadataItem} ${styles.metadataItemSecondary}`}>
                        <Calendar className={styles.metadataIcon} />
                        <span>
                          {(() => {
                            // Handle both string and object for period/dateRange
                            const dr = exp.period || exp.dateRange;
                            if (!dr) return '';
                            if (typeof dr === 'string') return dr;
                            if (typeof dr === 'object') {
                              // Sanity dateRange object: { _type, from, to, isCurrent }
                              const from = dr.from ? new Date(dr.from).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : '';
                              const to = dr.isCurrent ? 'Present' : (dr.to ? new Date(dr.to).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : '');
                              return from && to ? `${from} - ${to}` : from || to || '';
                            }
                            return '';
                          })()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {Array.isArray(exp.description) ? (
                    <div className={styles.description}>
                      <PortableText value={exp.description} />
                    </div>
                  ) : (
                    <p className={styles.description}>{exp.description}</p>
                  )}

                  {/* Technologies */}
                  <div className={styles.techHeader}>
                    <Code2 className={styles.techIcon} />
                    <span className={styles.techLabel}>Tech Stack:</span>
                  </div>
                  <div className={styles.techTags}>
                    {exp.technologies.map(tech => (
                      <span key={tech} className={styles.techTag}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </PixelCard>
              </div>
            ))}
          </div>
        </div>
        {/* Command Tip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={styles.footerMessage}
        >
          <p>ACHIEVEMENT UNLOCKED: Professional career journey documented!</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Experience;