import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './ArtLightboxModal.module.css';

const ArtLightboxModal = ({ isOpen, onClose, items = [], currentIndex = 0, onPrev, onNext }) => {
  const item = items[currentIndex];

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft' && items.length > 1) onPrev();
      if (event.key === 'ArrowRight' && items.length > 1) onNext();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, onPrev, onNext, items.length]);

  if (!isOpen || !item) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.titlebar}>
          <div className={styles.titlebarLeft}>
            <span className={styles.systemDot} />
            <span className={styles.headerTitle}>Image Viewer</span>
          </div>
          <div className={styles.windowControls}>
            <button className={styles.windowButton} aria-label="Minimize">_</button>
            <button className={styles.windowButton} aria-label="Maximize">[]</button>
            <button className={styles.closeButton} onClick={onClose} aria-label="Close image viewer">
              <X size={14} />
            </button>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.viewerPanel}>
            {items.length > 1 && (
              <button className={`${styles.navButton} ${styles.navLeft}`} onClick={onPrev} aria-label="Previous image">
                <ChevronLeft size={18} />
              </button>
            )}

            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.altText || item.title}
                className={styles.fullImage}
              />
            ) : (
              <div className={styles.missingImage}>Image unavailable</div>
            )}

            {items.length > 1 && (
              <button className={`${styles.navButton} ${styles.navRight}`} onClick={onNext} aria-label="Next image">
                <ChevronRight size={18} />
              </button>
            )}
          </div>

          <div className={styles.infoPanel}>
            <h3 className={styles.title}>FILE INFO</h3>

            <div className={styles.propertiesTable}>
              <div className={styles.propertyRow}>
                <span className={styles.propertyLabel}>Name</span>
                <span className={styles.propertyValue}>{item.title || 'Untitled'}</span>
              </div>
              <div className={styles.propertyRow}>
                <span className={styles.propertyLabel}>Type</span>
                <span className={styles.propertyValue}>{item.category || 'Uncategorized'}</span>
              </div>
              {item.capturedAt && (
                <div className={styles.propertyRow}>
                  <span className={styles.propertyLabel}>Created</span>
                  <span className={styles.propertyValue}>{new Date(item.capturedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                </div>
              )}
              {item.location && (
                <div className={styles.propertyRow}>
                  <span className={styles.propertyLabel}>Location</span>
                  <span className={styles.propertyValue}>{item.location}</span>
                </div>
              )}
            </div>

            {(item.artDescription || item.description) && (
              <div className={styles.block}>
                <div className={styles.blockTitle}>Notes</div>
                <p className={styles.description}>{item.artDescription || item.description}</p>
              </div>
            )}
          </div>
        </div>

        <div className={styles.cornerTL} />
        <div className={styles.cornerTR} />
        <div className={styles.cornerBL} />
        <div className={styles.cornerBR} />
      </div>
    </div>
  );
};

export default ArtLightboxModal;
