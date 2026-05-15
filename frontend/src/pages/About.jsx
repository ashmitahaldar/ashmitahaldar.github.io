import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Code2, Wrench, Heart, Sparkles, Terminal, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import CornerCard from '../components/CornerCard';
import { getProfile, getSkills, getResume } from '../services/sanityClient';
import { useTypingEffect } from '../hooks/useTypingEffect';
import { PortableText } from '@portabletext/react';
import ResumeModal from '../components/ResumeModal';
import styles from '../styles/About.module.css';

const About = () => {
  const location = useLocation();
  const [profileData, setProfileData] = useState(null);
  const [skills, setSkills] = useState(null);
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const { displayedText: typedTitle, isComplete: titleComplete } = useTypingEffect('About Me', 100);
  const { displayedText: typedSubtitle } = useTypingEffect('cat ~/.profile/about.txt', 50, 1000);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileSanity, skillsSanity, resume] = await Promise.all([
          getProfile(),
          getSkills(),
          getResume()
        ]);
        setProfileData(profileSanity);
        setSkills(skillsSanity);
        setResumeData(resume);
      } catch (error) {
        console.error('Error fetching data from Sanity:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('resume') === '1') {
      setIsResumeModalOpen(true);
    }
  }, [location.search]);

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

        {/* Bio Section */}
  <CornerCard tone="pink" className={styles.bioCard}>
          <div className={styles.sectionHeader}>
            <Sparkles className={styles.sectionIcon} />
            <h2 className={styles.sectionTitle}>My Story</h2>
          </div>
          <div className={styles.bioText}>
            {profileData?.bio ? (
              <PortableText value={profileData.bio} />
            ) : (
              <p>No bio available.</p>
            )}
          </div>
  </CornerCard>

        {/* Skills Grid */}
        <div className={styles.skillsGrid}>
          {/* Languages */}
          <CornerCard tone="cyan" className={styles.skillCard}>
            <div className={styles.skillHeader}>
              <Code2 className={styles.skillIconPink} />
              <h3 className={styles.skillTitleTeal}>Languages</h3>
            </div>
            <div className={styles.skillTags}>
              {skills?.languages?.map(lang => (
                <span key={lang} className="ds-tag">{lang}</span>
              ))}
            </div>
          </CornerCard>

          {/* Frameworks */}
          <CornerCard tone="pink" className={styles.skillCard}>
            <div className={styles.skillHeader}>
              <Wrench className={styles.skillIconTeal} />
              <h3 className={styles.skillTitlePink}>Frameworks</h3>
            </div>
            <div className={styles.skillTags}>
              {skills?.frameworks?.map(framework => (
                <span key={framework} className="ds-tag cyan">{framework}</span>
              ))}
            </div>
          </CornerCard>

          {/* Tools */}
          <CornerCard tone="cyan" className={styles.skillCard}>
            <div className={styles.skillHeader}>
              <Wrench className={styles.skillIconPink} />
              <h3 className={styles.skillTitleTeal}>Tools & Technologies</h3>
            </div>
            <div className={styles.skillTags}>
              {skills?.tools?.map(tool => (
                <span key={tool} className="ds-tag">{tool}</span>
              ))}
            </div>
          </CornerCard>

          {/* Interests */}
          <CornerCard tone="pink" className={styles.skillCard}>
            <div className={styles.skillHeader}>
              <Heart className={styles.skillIconTeal} />
              <h3 className={styles.skillTitlePink}>Interests</h3>
            </div>
            <div className={styles.skillTags}>
              {skills?.interests?.map(interest => (
                <span key={interest} className="ds-tag cyan">{interest}</span>
              ))}
            </div>
          </CornerCard>
        </div>

        {/* Fun Fact */}
  <CornerCard tone="cyan" className={styles.funFactCard}>
          <div className={styles.funFactContent}>
            <span className={styles.funFactEmoji}>🎮</span>
            <div>
              <h3 className={styles.funFactTitle}>Fun Fact:</h3>
              <p className={styles.funFactText}>
                I am trying to learn Mandarin Chinese in my spare time!
              </p>
            </div>
          </div>
  </CornerCard>
      </div>

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
