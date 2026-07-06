import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Tag, ArrowRight, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';
import CornerCard from '../components/CornerCard';
import { getBlogPosts } from '../services/sanityClient';
import { useTypingEffect } from '../hooks/useTypingEffect';
import styles from '../styles/Blog.module.css';

const Blog = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState('All');
  const { displayedText: typedTitle, isComplete: titleComplete } = useTypingEffect('Blog', 100);
  const { displayedText: typedSubtitle } = useTypingEffect('tail -f ~/thoughts/blog.log', 50, 1000);

  // The gallery now lives in ~/lab — honour old links.
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('view') === 'gallery') {
      navigate('/lab#gallery', { replace: true });
    }
  }, [location.search, navigate]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const posts = await getBlogPosts();
        setBlogPosts(posts || []);
      } catch (error) {
        console.error('Error fetching blog content from Sanity:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set();
    blogPosts.forEach(post => {
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach(tag => tags.add(tag));
      }
    });
    return ['All', ...Array.from(tags)];
  }, [blogPosts]);

  // Filter posts by selected tag
  const filteredPosts = useMemo(() => {
    if (selectedTag === 'All') return blogPosts;
    return blogPosts.filter(post => post.tags && Array.isArray(post.tags) && post.tags.includes(selectedTag));
  }, [selectedTag, blogPosts]);

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

        {/* Tag filter */}
        {allTags.length > 1 && (
          <div className={styles.tagFilter}>
            <div className={styles.tagFilterHeader}>
              <Tag className={styles.tagIcon} />
              <span className={styles.tagFilterLabel}>Filter posts by tag:</span>
            </div>
            <div className={styles.tagButtons}>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`${styles.tagButton} ${
                    selectedTag === tag ? styles.tagButtonActive : styles.tagButtonInactive
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Posts */}
        {filteredPosts.length === 0 ? (
          <div className={styles.emptyState}>
            No posts found with tag "{selectedTag}"
          </div>
        ) : (
          <div className={styles.postsList}>
            {filteredPosts.map((post) => (
              <Link key={post._id} to={`/blog/${post.slug.current}`} className={`${styles.postLink} group`}>
                <CornerCard tone="pink" className={styles.postCard}>
                  <div className={styles.postContent}>
                    <div className={styles.postMain}>
                      <h2 className={styles.postTitle}>
                        {post.title}
                      </h2>

                      <div className={styles.postMeta}>
                        <div className={styles.postDate}>
                          <Calendar className={styles.calendarIcon} />
                          <span className={styles.postDateText}>{new Date(post.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                        </div>
                      </div>

                      <p className={styles.postExcerpt}>
                        {post.excerpt}
                      </p>

                      {post.tags && post.tags.length > 0 && (
                        <div className={styles.postTags}>
                          <Tag className={styles.postTagIcon} />
                          {post.tags.map(tag => (
                            <span key={tag} className={styles.postTag}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className={styles.postArrow}>
                      <ArrowRight className={styles.arrowIcon} />
                    </div>
                  </div>
                </CornerCard>
              </Link>
            ))}
          </div>
        )}

        {/* Pointer to the gallery's new home */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Link to="/lab#gallery" className="btn-link">photography &amp; art moved to ~/lab →</Link>
        </div>
      </div>
    </div>
  );
};

export default Blog;
