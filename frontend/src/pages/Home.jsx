import React, { useState, useEffect } from 'react';
import Terminal from '../components/Terminal';
import { Github, Linkedin, Mail, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import PixelCard from '../components/PixelCard';
import { getProfile } from '../services/sanityClient';
import { useTypingEffect } from '../hooks/useTypingEffect';
import Spline from '@splinetool/react-spline';
import styles from '../styles/Home.module.css';

const Home = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [splineLoading, setSplineLoading] = useState(true);
  
  const { displayedText: typedName, isComplete: nameComplete } = useTypingEffect(
    profileData?.name || '',
    100,
    1000
  );

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        // if (data) {
        //   console.log('✅ Profile data successfully retrieved:', data);
        // } else {
        //   console.log('⚠️ Profile data retrieved, but it was empty (null/undefined).');
        // }
        setProfileData(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingText}>Loading...</div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingText}>Error loading profile</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Top Section: Profile Card & Spline Side by Side */}
        <div className={styles.topSection}>
          {/* Profile Card */}
          <PixelCard className={styles.profileCard}>
            <div className={styles.profileContent}>
              {/* Pixelated Avatar */}
              <div className={styles.avatar}>
                <div className={styles.avatarGradientBorder}>
                  <div className={styles.avatarInner}>
                    {profileData.avatarUrl ? (
                      <img
                        src={profileData.avatarUrl}
                        alt={`${profileData.name || 'Avatar'}`}
                        className={styles.avatarImage}
                      />
                    ) : (
                      <div className={styles.avatarEmoji}>👾</div>
                    )}
                  </div>
                </div>
                <div className={styles.statusIndicator}></div>
              </div>

              {/* Name & Title */}
              <motion.h1 
                className={styles.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {typedName}
                {!nameComplete && <span className={styles.cursor}>_</span>}
              </motion.h1>
              <p className={styles.title}>{profileData.title}</p>
              <p className={styles.tagline}>{profileData.tagline}</p>

              {/* Summary */}
              <div className={styles.bio}>
                {profileData.summary && <p>{profileData.summary}</p>}
              </div>

              {/* Location */}
              <div className={styles.location}>
                <MapPin className={styles.locationIcon} />
                <span className={styles.locationText}>{profileData.location}</span>
              </div>

              {/* Social Links */}
              <div className={styles.socialLinks}>
                <a href={`mailto:${profileData.email}`} className={`${styles.socialLink} ${styles.socialLinkPink}`}>
                  <Mail className={`${styles.socialIcon} ${styles.socialIconPink}`} />
                </a>
                <a href={`https://${profileData.github}`} target="_blank" rel="noopener noreferrer" className={`${styles.socialLink} ${styles.socialLinkTeal}`}>
                  <Github className={`${styles.socialIcon} ${styles.socialIconTeal}`} />
                </a>
                <a href={`https://${profileData.linkedin}`} target="_blank" rel="noopener noreferrer" className={`${styles.socialLink} ${styles.socialLinkPink}`}>
                  <Linkedin className={`${styles.socialIcon} ${styles.socialIconPink}`} />
                </a>
              </div>
            </div>
          </PixelCard>

          {/* Spline Model */}
          <div className={styles.splineContainer}>
            {splineLoading && (
              <div className={styles.splineLoading}>
                <div className={styles.loadingText}>Loading...</div>
              </div>
            )}
            <Spline
              scene="https://prod.spline.design/PZ-RH4uPUyHnb9mI/scene.splinecode"
              onLoad={() => setSplineLoading(false)}
            />
          </div>
        </div>

        {/* Terminal Below */}
        <div className={styles.terminalSection}>
          <Terminal profileData={profileData} />
        </div>

        {/* Usage Hint */}
        <PixelCard className={styles.tipsCard}>
          <div className={styles.tipsContent}>
            <span className={styles.tipsIcon}>💡</span>
            <div>
              <h3 className={styles.tipsTitle}>Terminal Tips:</h3>
              <ul className={styles.tipsList}>
                <li>• Type <code className={styles.tipsCode}>help</code> to see all available commands</li>
                <li>• Use <code className={styles.tipsCode}>UP</code> and <code className={styles.tipsCode}>DOWN</code> arrow keys to cycle through command history</li>
                <li>• Try shortcuts like <code className={styles.tipsCode}>/projects</code> or <code className={styles.tipsCode}>/about</code> to navigate quickly</li>
                <li>• Some commands might have hidden surprises... 👀</li>
              </ul>
            </div>
          </div>
        </PixelCard>
      </div>
    </div>
  );
};

export default Home;