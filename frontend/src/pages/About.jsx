import React, { useState, useEffect } from 'react';
import { Code2, Wrench, Heart, Sparkles, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';
import PixelCard from '../components/PixelCard';
import { getProfile, getSkills } from '../services/sanityClient';
import { useTypingEffect } from '../hooks/useTypingEffect';
import { PortableText } from '@portabletext/react';
import styles from '../styles/About.module.css';

const About = () => {
  const [profileData, setProfileData] = useState(null);
  const [skills, setSkills] = useState(null);
  const [loading, setLoading] = useState(true);
  const { displayedText: typedTitle, isComplete: titleComplete } = useTypingEffect('About Me', 100);
  const { displayedText: typedSubtitle } = useTypingEffect('cat ~/.profile/about.txt', 50, 1000);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileSanity, skillsSanity] = await Promise.all([
          getProfile(),
          getSkills()
        ]);
        setProfileData(profileSanity);
        setSkills(skillsSanity);
      } catch (error) {
        console.error('Error fetching data from Sanity:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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

        {/* Bio Section */}
  <PixelCard className={styles.bioCard}>
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
  </PixelCard>

        {/* Skills Grid */}
        <div className={styles.skillsGrid}>
          {/* Languages */}
          <PixelCard className={styles.skillCard}>
            <div className={styles.skillHeader}>
              <Code2 className={styles.skillIconPink} />
              <h3 className={styles.skillTitleTeal}>Languages</h3>
            </div>
            <div className={styles.skillTags}>
              {skills?.languages?.map(lang => (
                <span key={lang} className={styles.tagPink}>
                  {lang}
                </span>
              ))}
            </div>
          </PixelCard>

          {/* Frameworks */}
          <PixelCard className={styles.skillCard}>
            <div className={styles.skillHeader}>
              <Wrench className={styles.skillIconTeal} />
              <h3 className={styles.skillTitlePink}>Frameworks</h3>
            </div>
            <div className={styles.skillTags}>
              {skills?.frameworks?.map(framework => (
                <span key={framework} className={styles.tagTeal}>
                  {framework}
                </span>
              ))}
            </div>
          </PixelCard>

          {/* Tools */}
          <PixelCard className={styles.skillCard}>
            <div className={styles.skillHeader}>
              <Wrench className={styles.skillIconPink} />
              <h3 className={styles.skillTitleTeal}>Tools & Technologies</h3>
            </div>
            <div className={styles.skillTags}>
              {skills?.tools?.map(tool => (
                <span key={tool} className={styles.tagPink}>
                  {tool}
                </span>
              ))}
            </div>
          </PixelCard>

          {/* Interests */}
          <PixelCard className={styles.skillCard}>
            <div className={styles.skillHeader}>
              <Heart className={styles.skillIconTeal} />
              <h3 className={styles.skillTitlePink}>Interests</h3>
            </div>
            <div className={styles.skillTags}>
              {skills?.interests?.map(interest => (
                <span key={interest} className={styles.tagTeal}>
                  {interest}
                </span>
              ))}
            </div>
          </PixelCard>
        </div>

        {/* Fun Fact */}
  <PixelCard className={styles.funFactCard}>
          <div className={styles.funFactContent}>
            <span className={styles.funFactEmoji}>🎮</span>
            <div>
              <h3 className={styles.funFactTitle}>Fun Fact:</h3>
              <p className={styles.funFactText}>
                I am trying to learn Mandarin Chinese in my spare time!
              </p>
            </div>
          </div>
  </PixelCard>
      </div>
    </div>
  );
};

export default About;