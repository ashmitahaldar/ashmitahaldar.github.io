import React, { useState, useEffect } from 'react';
import { ExternalLink, Github, Code2, Gamepad2, Palette, FileCode, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';
import PixelCard from '../components/PixelCard';
import { getProjects } from '../services/sanityClient';
import PortableText from '../components/PortableText';
import { useTypingEffect } from '../hooks/useTypingEffect';
import styles from '../styles/Projects.module.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredProject, setHoveredProject] = useState(null);
  const { displayedText: typedTitle, isComplete: titleComplete } = useTypingEffect('Projects', 100);
  const { displayedText: typedSubtitle } = useTypingEffect("ls -la ~/projects/ | grep awesome", 50, 1000);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects from Sanity:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const getProjectIcon = (imageType) => {
    switch(imageType) {
      case 'game': return Gamepad2;
      case 'paint': return Palette;
      case 'code': return FileCode;
      default: return Code2;
    }
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

        {/* Projects Grid */}
        <div className={styles.projectsGrid}>
          {projects.map((project, index) => {
            // Use _id for key, and imageUrl for image if available
            const Icon = getProjectIcon(project.image || 'code');
            return (
              <PixelCard
                key={project._id}
                onMouseEnter={() => setHoveredProject(project._id)}
                onMouseLeave={() => setHoveredProject(null)}
                className={styles.projectCard}
              >
                {/* Project Icon/Image */}
                <div className={`${styles.projectImage} ${
                  index % 2 === 0 
                    ? styles.projectImagePink
                    : styles.projectImageTeal
                }`}>
                  {project.imageUrl ? (
                    <img src={project.imageUrl} alt={project.title} className={styles.projectImageImg} />
                  ) : (
                    <Icon className={`${styles.projectIcon} ${
                      index % 2 === 0 ? styles.projectIconPink : styles.projectIconTeal
                    } ${hoveredProject === project._id ? styles.projectIconHovered : styles.projectIconNormal}`} />
                  )}
                </div>

                {/* Content */}
                <div className={styles.projectContent}>
                  <h3 className={styles.projectTitle}>
                    {project.title}
                  </h3>
                  {Array.isArray(project.description) ? (
                    <div className={styles.projectDescription}>
                      <PortableText value={project.description} />
                    </div>
                  ) : (
                    <p className={styles.projectDescription}>
                      {project.description}
                    </p>
                  )}

                  {/* Technologies */}
                  <div className={styles.techSection}>
                    <div className={styles.techTags}>
                      {project.technologies && project.technologies.map(tech => (
                        <span key={tech} className={styles.techTag}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Links */}
                  <div className={styles.projectLinks}>
                    {project.github && (
                      <a
                        href={project.github.startsWith('http') ? project.github : `https://${project.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.projectLinkGithub}
                      >
                        <Github className={styles.linkIcon} />
                        Code
                      </a>
                    )}
                    {project.demo && (
                      <a
                        href={project.demo.startsWith('http') ? project.demo : `https://${project.demo}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.projectLinkDemo}
                      >
                        <ExternalLink className={styles.linkIcon} />
                        Demo
                      </a>
                    )}
                  </div>
                </div>
              </PixelCard>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Projects;