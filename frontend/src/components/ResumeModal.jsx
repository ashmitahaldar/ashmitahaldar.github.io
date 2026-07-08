import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Download } from 'lucide-react';
import { useResizable } from '../hooks/useResizable';
import styles from './ResumeModal.module.css';

const ResumeModal = ({ isOpen, onClose, resumeData }) => {
  const { size, resizeHandlers, isResizing } = useResizable(
    { width: 900, height: window.innerHeight * 0.9 },
    {
      minWidth: 400,
      minHeight: 300,
      maxWidth: window.innerWidth - 40,
      maxHeight: window.innerHeight - 40,
    }
  );

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleDownload = () => {
    if (!resumeData?.pdfUrl) {
      alert('Resume PDF not available yet. Please check back soon!');
      return;
    }

    const link = document.createElement('a');
    link.href = resumeData.pdfUrl;
    link.download = `Resume.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  // Portal to <body> so transformed ancestors (page transitions)
  // can't trap the fixed-position overlay.
  return createPortal(
    <div className={`${styles.overlay} win-overlay`} onClick={onClose}>
      <div
        className={`${styles.modal} win-zoom`}
        onClick={(e) => e.stopPropagation()}
        style={{ width: size.width, height: size.height }}
      >
        <div className={styles.titlebar}>
          <div className={styles.dots}>
            <button type="button" className={`${styles.dot} ${styles.dotRed}`} onClick={onClose} aria-label="Close" />
            <span className={`${styles.dot} ${styles.dotYellow}`} />
            <span className={`${styles.dot} ${styles.dotGreen}`} />
          </div>
          <span className={styles.headerTitle}>~/resume.pdf</span>
          <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close">
            <X size={14} />
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {resumeData?.pdfUrl ? (
            <>
              {/* PDF Viewer */}
              <div className={styles.pdfContainer}>
                <iframe
                  src={`${resumeData.pdfUrl}#toolbar=0`}
                  title="Resume PDF"
                  className={styles.pdfViewer}
                />
              </div>

              {/* Download Button */}
              <div className={styles.footer}>
                <button
                  type="button"
                  onClick={handleDownload}
                  className={styles.downloadButton}
                >
                  <Download className={styles.downloadIcon} />
                  <span>Download Resume</span>
                </button>
              </div>
            </>
          ) : (
            <div className={styles.noResume}>
              <p>Resume not available</p>
            </div>
          )}
        </div>

        {/* Resize Handles */}
        <div className={styles.resizeTop} onMouseDown={resizeHandlers.top} />
        <div className={styles.resizeRight} onMouseDown={resizeHandlers.right} />
        <div className={styles.resizeBottom} onMouseDown={resizeHandlers.bottom} />
        <div className={styles.resizeLeft} onMouseDown={resizeHandlers.left} />
        <div className={styles.resizeTopLeft} onMouseDown={resizeHandlers.topLeft} />
        <div className={styles.resizeTopRight} onMouseDown={resizeHandlers.topRight} />
        <div className={styles.resizeBottomLeft} onMouseDown={resizeHandlers.bottomLeft} />
        <div className={styles.resizeBottomRight} onMouseDown={resizeHandlers.bottomRight} />
      </div>
    </div>,
    document.body,
  );
};

export default ResumeModal;
