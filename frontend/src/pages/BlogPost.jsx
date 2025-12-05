import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Tag, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import PixelCard from '../components/PixelCard';
import PortableText from '../components/PortableText';
import { useTypingEffect } from '../hooks/useTypingEffect';
import { getBlogPostBySlug } from '../services/sanityClient';
import styles from '../styles/BlogPost.module.css';

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { displayedText: typedTitle, isComplete: titleComplete } = useTypingEffect(
    post?.title || '',
    100,
    1000
  );

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getBlogPostBySlug(slug);
        console.log('Fetched blog post:', data);
        setPost(data);
      } catch (error) {
        console.error('Error fetching blog post from Sanity:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingText}>Loading...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className={styles.notFoundContainer}>
        <div className={styles.notFoundContent}>
          <h1 className={styles.notFoundTitle}>Post Not Found</h1>
          <button
            onClick={() => navigate('/blog')}
            className={styles.notFoundButton}
          >
            &larr; Back to Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Back Button */}
        <button
          onClick={() => navigate('/blog')}
          className={styles.backButton}
        >
          <ArrowLeft className={styles.backIcon} />
          Back to Blog
        </button>

        {/* Post Header */}
        <PixelCard className={styles.headerCard}>
          <motion.h1 
            className={styles.postTitle}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {typedTitle}
            {!titleComplete && <span className={styles.cursor}>_</span>}
          </motion.h1>
          
          <div className={styles.postMeta}>
            <div className={styles.postDate}>
              <Calendar className={styles.calendarIcon} />
              <span className={styles.postDateText}>{new Date(post.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>

          {/* Tags */}
          {post.tags && Array.isArray(post.tags) && post.tags.length > 0 ? (
            <div className={styles.tagsContainer}>
              <Tag className={styles.tagIcon} />
              {post.tags.map(tag => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            <p className={styles.noTags}>No tags</p>
          )}
  </PixelCard>

        {/* Post Content - Sanity Portable Text */}
        <PixelCard className={styles.contentCard}>
          <div className={styles.postContent}>
            {Array.isArray(post.content) ? (
              <PortableText value={post.content} />
            ) : (
              <p>{post.content}</p>
            )}
          </div>
        </PixelCard>
      </div>
    </div>
  );
};

export default BlogPost;