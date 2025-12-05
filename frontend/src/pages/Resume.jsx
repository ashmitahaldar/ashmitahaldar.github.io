import React, { useState, useEffect } from 'react';
import { Download, Github, Linkedin, Mail, Terminal } from 'lucide-react';
import { useTypingEffect } from '../hooks/useTypingEffect';
import PixelCard from '../components/PixelCard';
import { getProfile, getSkills, getExperiences, getEducation } from '../services/sanityClient';
import styles from '../styles/Resume.module.css';

const Resume = () => {
  const [profileData, setProfileData] = useState(null);
  const [skills, setSkills] = useState(null);
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const { displayedText: typedTitle, isComplete: titleComplete } = useTypingEffect('Resume', 100);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profile, skills, exp, edu] = await Promise.all([
          getProfile(),
          getSkills(),
          getExperiences(),
          getEducation()
        ]);
        setProfileData(profile);
        setSkills(skills);
        setExperience(exp);
        setEducation(edu);
      } catch (error) {
        console.error('Error fetching data from Sanity:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDownload = () => {
    // Placeholder for PDF download
    alert('PDF download functionality to be added soon!');
  };

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
        <div className={styles.header}>
          <h1 className={styles.title}>
            <Terminal className={styles.titleIcon} />
            <span>
              {typedTitle}
              {!titleComplete && <span className={styles.cursor}>_</span>}
            </span>
          </h1>
          <button
            onClick={handleDownload}
            className={styles.downloadButton}
          >
            <Download className={styles.downloadIcon} />
            Download PDF
          </button>
        </div>

        {/* Resume Content */}
        <PixelCard className={styles.resumeCard}>
          {/* Header Section */}
          <div className={styles.resumeHeader}>
            <h2 className={styles.resumeName}>{profileData?.name}</h2>
            <p className={styles.resumeTitle}>{profileData?.title}</p>
            <div className={styles.resumeContactInfo}>
              <span className={styles.contactText}>{profileData?.email}</span>
              <span className={styles.contactText}>{profileData?.location}</span>
            </div>
            <div className={styles.resumeSocialLinks}>
              <a href={`https://${profileData?.github}`} target="_blank" rel="noopener noreferrer" className={styles.socialLinkTeal}>
                <Github className={styles.socialIcon} />
              </a>
              <a href={`https://${profileData?.linkedin}`} target="_blank" rel="noopener noreferrer" className={styles.socialLinkPink}>
                <Linkedin className={styles.socialIcon} />
              </a>
              <a href={`mailto:${profileData?.email}`} className={styles.socialLinkTeal}>
                <Mail className={styles.socialIcon} />
              </a>
            </div>
          </div>

          {/* Education Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <span>&gt;&gt;</span> Education
            </h3>
            {education.map(edu => (
              <div key={edu._id} className={styles.educationItem}>
                <div className={styles.educationHeader}>
                  <div>
                    <h4 className={styles.educationDegree}>{edu.degree}</h4>
                    <p className={styles.educationSchool}>{edu.school}</p>
                  </div>
                  <div className={styles.educationDates}>
                    <p className={styles.educationDate}>
                      {(() => {
                        const dr = edu.period || edu.dateRange;
                        if (!dr) return '';
                        if (typeof dr === 'string') return dr;
                        if (typeof dr === 'object') {
                          const from = dr.from ? new Date(dr.from).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : '';
                          const to = dr.isCurrent ? 'Present' : (dr.to ? new Date(dr.to).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : '');
                          return from && to ? `${from} - ${to}` : from || to || '';
                        }
                        return '';
                      })()}
                    </p>
                    <p className={styles.educationGpa}>GPA: {edu.gpa}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Experience Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <span>&gt;&gt;</span> Experience
            </h3>
            {experience.map(exp => (
              <div key={exp._id} className={styles.experienceItem}>
                <div className={styles.experienceHeader}>
                  <div>
                    <h4 className={styles.experienceTitle}>{exp.title}</h4>
                    <p className={styles.experienceCompany}>{exp.company} | {exp.location}</p>
                  </div>
                  <p className={styles.experienceDate}>
                    {(() => {
                      const dr = exp.period || exp.dateRange;
                      if (!dr) return '';
                      if (typeof dr === 'string') return dr;
                      if (typeof dr === 'object') {
                        const from = dr.from ? new Date(dr.from).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : '';
                        const to = dr.isCurrent ? 'Present' : (dr.to ? new Date(dr.to).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : '');
                        return from && to ? `${from} - ${to}` : from || to || '';
                      }
                      return '';
                    })()}
                  </p>
                </div>
                <div className={styles.experienceDescription}>
                  {Array.isArray(exp.description) ? (
                    <ul className={styles.experienceList}>
                      {exp.description.map((item, idx) => (
                        <li key={idx}>{typeof item === 'string' ? item : ''}</li>
                      ))}
                    </ul>
                  ) : (
                    <span>{exp.description}</span>
                  )}
                </div>
                <div className={styles.experienceTechTags}>
                  {exp.technologies && exp.technologies.map(tech => (
                    <span key={tech} className={styles.techTag}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Skills Section */}
          <div className={styles.sectionLast}>
            <h3 className={styles.sectionTitle}>
              <span>&gt;&gt;</span> Technical Skills
            </h3>
            <div className={styles.skillsGrid}>
              <div>
                <h4 className={styles.skillCategory}>Languages:</h4>
                <p className={styles.skillList}>{skills?.languages?.join(', ')}</p>
              </div>
              <div>
                <h4 className={styles.skillCategory}>Frameworks:</h4>
                <p className={styles.skillList}>{skills?.frameworks?.join(', ')}</p>
              </div>
              <div>
                <h4 className={styles.skillCategory}>Tools:</h4>
                <p className={styles.skillList}>{skills?.tools?.join(', ')}</p>
              </div>
              <div>
                <h4 className={styles.skillCategory}>Interests:</h4>
                <p className={styles.skillList}>{skills?.interests?.join(', ')}</p>
              </div>
            </div>
          </div>
        </PixelCard>
      </div>
    </div>
  );
};

export default Resume;