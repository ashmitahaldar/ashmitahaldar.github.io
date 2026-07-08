import React, { useState, useEffect } from 'react';
import { ExternalLink, Github, Code2, Gamepad2, Palette, FileCode } from 'lucide-react';
import CornerCard from '../components/CornerCard';
import PageHeader from '../components/PageHeader';
import ProjectModal from '../components/ProjectModal';
import { getProjects } from '../services/sanityClient';
import PortableText from '../components/PortableText';
import styles from '../styles/Projects.module.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredProject, setHoveredProject] = useState(null);
  const [activeProject, setActiveProject] = useState(null);

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
        <PageHeader word="projects" command="ls -la ~/projects | grep awesome" />

        {/* Projects Grid */}
        <div className={styles.projectsGrid}>
          {projects.map((project, index) => {
            // Use _id for key, and imageUrl for image if available
            const Icon = getProjectIcon(project.image || 'code');
            return (
              <CornerCard
                key={project._id}
                tone={index % 2 === 0 ? 'pink' : 'cyan'}
                onMouseEnter={() => setHoveredProject(project._id)}
                onMouseLeave={() => setHoveredProject(null)}
                className={styles.projectCard}
                role="button"
                tabIndex={0}
                aria-label={`View details for ${project.title}`}
                onClick={(e) => {
                  // the Code/Demo anchors inside the card keep their
                  // own behaviour — only bare card clicks open details
                  if (e.target.closest('a')) return;
                  setActiveProject(project);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveProject(project);
                  }
                }}
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
              </CornerCard>
            );
          })}
        </div>
      </div>

      <ProjectModal
        isOpen={!!activeProject}
        project={activeProject}
        onClose={() => setActiveProject(null)}
      />
    </div>
  );
};

export default Projects;