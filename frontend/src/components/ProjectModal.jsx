import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight, ExternalLink, Github, BookOpen, Code2 } from 'lucide-react';
import PortableText from './PortableText';
import styles from './ProjectModal.module.css';

const withProtocol = (url) => (url.startsWith('http') ? url : `https://${url}`);

const ProjectModal = ({ isOpen, onClose, project }) => {
  const [imageIndex, setImageIndex] = useState(0);

  // main card image first, then any extra carousel shots
  const images = project
    ? [project.imageUrl, ...(project.galleryUrls || [])].filter(Boolean)
    : [];

  useEffect(() => {
    setImageIndex(0);
  }, [project?._id]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft' && images.length > 1) {
        setImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      }
      if (event.key === 'ArrowRight' && images.length > 1) {
        setImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, images.length]);

  if (!isOpen || !project) return null;

  const slug = (project.title || 'project').toLowerCase().replace(/\s+/g, '-');

  // Portal to <body>: ancestors with transforms (Reveal, page
  // transitions) would otherwise trap position:fixed and break the
  // overlay's positioning and stacking.
  return createPortal(
    <div className={`${styles.overlay} win-overlay`} onClick={onClose}>
      <div
        className={`${styles.modal} win-zoom`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
      >
        <div className={styles.titlebar}>
          <div className={styles.dots}>
            <button className={`${styles.dot} ${styles.dotRed}`} onClick={onClose} aria-label="Close" />
            <span className={`${styles.dot} ${styles.dotYellow}`} />
            <span className={`${styles.dot} ${styles.dotGreen}`} />
          </div>
          <span className={styles.headerTitle}>~/projects/{slug}</span>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close project details">
            <X size={14} />
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.viewerPanel}>
            {images.length > 1 && (
              <button
                className={`${styles.navButton} ${styles.navLeft}`}
                onClick={() => setImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                aria-label="Previous image"
              >
                <ChevronLeft size={18} />
              </button>
            )}

            {images.length > 0 ? (
              <img
                key={images[imageIndex]}
                src={images[imageIndex]}
                alt={`${project.title} — screenshot ${imageIndex + 1}`}
                className={styles.fullImage}
              />
            ) : (
              <div className={styles.missingImage}>
                <Code2 className={styles.missingIcon} />
                <span>no screenshots yet</span>
              </div>
            )}

            {images.length > 1 && (
              <button
                className={`${styles.navButton} ${styles.navRight}`}
                onClick={() => setImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                aria-label="Next image"
              >
                <ChevronRight size={18} />
              </button>
            )}

            {images.length > 1 && (
              <div className={styles.filmstrip}>
                {images.map((src, i) => (
                  <button
                    key={src}
                    className={`${styles.filmDot} ${i === imageIndex ? styles.filmDotActive : ''}`}
                    onClick={() => setImageIndex(i)}
                    aria-label={`Go to image ${i + 1}`}
                  />
                ))}
                <span className={styles.filmCounter}>{imageIndex + 1}/{images.length}</span>
              </div>
            )}
          </div>

          <div className={styles.infoPanel}>
            <h3 className={styles.projectTitle}>{project.title}</h3>

            {project.technologies?.length > 0 && (
              <div className={styles.techTags}>
                {project.technologies.map((tech) => (
                  <span key={tech} className={styles.techTag}>{tech}</span>
                ))}
              </div>
            )}

            <div className={styles.block}>
              <div className={styles.blockTitle}>// readme</div>
              {Array.isArray(project.description) ? (
                <div className={styles.description}>
                  <PortableText value={project.description} />
                </div>
              ) : (
                <p className={styles.description}>{project.description}</p>
              )}
            </div>

            <div className={styles.links}>
              {project.github && (
                <a
                  href={withProtocol(project.github)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.linkButton} ${styles.linkPink}`}
                >
                  <Github className={styles.linkIcon} />
                  Code
                </a>
              )}
              {project.demo && (
                <a
                  href={withProtocol(project.demo)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.linkButton} ${styles.linkCyan}`}
                >
                  <ExternalLink className={styles.linkIcon} />
                  Demo
                </a>
              )}
              {project.blogSlug && (
                <Link
                  to={`/blog/${project.blogSlug}`}
                  onClick={onClose}
                  className={`${styles.linkButton} ${styles.linkCyan}`}
                >
                  <BookOpen className={styles.linkIcon} />
                  Read the write-up
                </Link>
              )}
            </div>

            <div className={styles.hint}>// esc to close{images.length > 1 ? ' · ←/→ to browse shots' : ''}</div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default ProjectModal;
