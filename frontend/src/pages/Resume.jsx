import React, { useState, useEffect } from 'react';
import { Download, Terminal } from 'lucide-react';
import { useTypingEffect } from '../hooks/useTypingEffect';
import PixelCard from '../components/PixelCard';
import { getResume } from '../services/sanityClient';
import styles from '../styles/Resume.module.css';

const Resume = () => {
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { displayedText: typedTitle, isComplete: titleComplete } = useTypingEffect('Resume', 100);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resume = await getResume();
        setResumeData(resume);
      } catch (error) {
        console.error('Error fetching resume from Sanity:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingText}>Loading...</div>
      </div>
    );
  }

  if (!resumeData?.pdfUrl) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.header}>
            <h1 className={styles.title}>
              <Terminal className={styles.titleIcon} />
              <span>
                {typedTitle}
                {!titleComplete && <span className={styles.cursor}>_</span>}
              </span>
            </h1>
          </div>
          <PixelCard className={styles.resumeCard}>
            <p className={styles.noResumeText}>Resume PDF not available. Please upload one in Sanity Studio.</p>
          </PixelCard>
        </div>
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

        {/* PDF Viewer */}
        <PixelCard className={styles.resumeCard}>
          <div className={styles.pdfContainer}>
            <iframe
              src={`${resumeData.pdfUrl}#toolbar=0`}
              title="Resume PDF"
              className={styles.pdfViewer}
            />
          </div>
        </PixelCard>
      </div>
    </div>
  );
};

export default Resume;