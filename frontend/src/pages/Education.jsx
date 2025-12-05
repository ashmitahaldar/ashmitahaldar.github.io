import React, { useState, useEffect } from 'react';
import { GraduationCap, MapPin, Calendar, BookOpen, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';
import PixelCard from '../components/PixelCard';
import { getEducation } from '../services/sanityClient';
import { useTypingEffect } from '../hooks/useTypingEffect';
import styles from '../styles/Education.module.css';

const Education = () => {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const { displayedText: typedTitle, isComplete: titleComplete } = useTypingEffect('Education', 100);
  const { displayedText: typedSubtitle } = useTypingEffect('cat ~/.education/achievements.log', 50, 1000);

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const data = await getEducation();
        setEducation(data);
      } catch (error) {
        console.error('Error fetching education from Sanity:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEducation();
  }, []);

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

        {/* Education Items */}
        <div className={styles.educationList}>
          {education.map((edu, index) => (
            <PixelCard key={edu._id || index} className={styles.educationCard}>
              {/* Icon & Degree */}
              <div className={styles.educationHeader}>
                <div className={styles.iconContainer}>
                  <GraduationCap className={styles.icon} />
                </div>
                <div className={styles.headerContent}>
                  <h3 className={styles.degree}>
                    {edu.degree}
                  </h3>
                  <div className={styles.metadata}>
                    <div className={`${styles.metadataItem} ${styles.metadataItemPrimary}`}>
                      <BookOpen className={styles.metadataIcon} />
                      <span>{edu.school}</span>
                    </div>
                    <div className={`${styles.metadataItem} ${styles.metadataItemSecondary}`}>
                      <MapPin className={styles.metadataIcon} />
                      <span>{edu.location}</span>
                    </div>
                    <div className={`${styles.metadataItem} ${styles.metadataItemSecondary}`}>
                      <Calendar className={styles.metadataIcon} />
                      <span>
                        {(() => {
                          // Handle both string and object for period/dateRange
                          const dr = edu.period || edu.dateRange;
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
              </div>

              {/* GPA */}
              <div>
                <span className={styles.gpaBadge}>
                  GPA: {edu.gpa}
                </span>
              </div>

              {/* Description/Highlights */}
              {edu.description && edu.description.length > 0 && (
                <div className={styles.highlightsSection}>
                  <h4 className={styles.highlightsTitle}>
                    <span>•</span> Highlights:
                  </h4>
                  <ul className={styles.highlightsList}>
                    {edu.description.map((item, idx) => (
                      <li key={idx} className={styles.highlightItem}>
                        <span className={styles.highlightBullet}>▸</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Relevant Coursework */}
              <div>
                <h4 className={styles.courseworkTitle}>
                  <span>•</span> Relevant Coursework:
                </h4>
                <div className={styles.courseworkTags}>
                  {edu.relevant.map(course => (
                    <span key={course} className={styles.courseworkTag}>
                      {course}
                    </span>
                  ))}
                </div>
              </div>
            </PixelCard>
          ))}
        </div>
        {/* Command Tip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={styles.footerMessage}
        >
          <p>LEVEL UP: Continuous learning achievement unlocked!</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Education;