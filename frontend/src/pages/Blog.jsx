import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Tag, ArrowRight, Terminal, Camera, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import PixelCard from '../components/PixelCard';
import { getBlogPosts, getArtPhotos } from '../services/sanityClient';
import { useTypingEffect } from '../hooks/useTypingEffect';
import ArtLightboxModal from '../components/ArtLightboxModal';
import styles from '../styles/Blog.module.css';

const Blog = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [blogPosts, setBlogPosts] = useState([]);
  const [artPhotos, setArtPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const { displayedText: typedTitle, isComplete: titleComplete } = useTypingEffect('Blog', 100);
  const { displayedText: typedSubtitle } = useTypingEffect('tail -f ~/thoughts/blog.log', 50, 1000);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [posts, photos] = await Promise.all([
          getBlogPosts(),
          getArtPhotos(),
        ]);
        setBlogPosts(posts || []);
        setArtPhotos(photos || []);
      } catch (error) {
        console.error('Error fetching blog content from Sanity:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mode = params.get('view');
    if (mode === 'posts' || mode === 'gallery' || mode === 'all') {
      setViewMode(mode);
      return;
    }
    setViewMode('all');
  }, [location.search]);

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    const params = new URLSearchParams(location.search);
    if (mode === 'all') {
      params.delete('view');
    } else {
      params.set('view', mode);
    }
    const query = params.toString();
    navigate(`/blog${query ? `?${query}` : ''}`, { replace: true });
  };

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

  const allCategories = useMemo(() => {
    const categories = new Set();
    artPhotos.forEach((item) => {
      if (item.category) categories.add(item.category);
    });
    return ['All', ...Array.from(categories)];
  }, [artPhotos]);

  const filteredPhotos = useMemo(() => {
    if (selectedCategory === 'All') return artPhotos;
    return artPhotos.filter((item) => item.category === selectedCategory);
  }, [selectedCategory, artPhotos]);

  const openLightboxById = (id) => {
    const idx = filteredPhotos.findIndex((item) => item._id === id);
    if (idx >= 0) {
      setLightboxIndex(idx);
      setLightboxOpen(true);
    }
  };

  const goToPrevImage = () => {
    setLightboxIndex((prev) => (prev === 0 ? filteredPhotos.length - 1 : prev - 1));
  };

  const goToNextImage = () => {
    setLightboxIndex((prev) => (prev === filteredPhotos.length - 1 ? 0 : prev + 1));
  };

  const isAllView = viewMode === 'all';
  const showPosts = viewMode === 'all' || viewMode === 'posts';
  const showGallery = viewMode === 'all' || viewMode === 'gallery';

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

        {/* Mode Toggle */}
        <div className={styles.modeToggle}>
          <button
            onClick={() => handleViewModeChange('all')}
            className={`${styles.modeButton} ${viewMode === 'all' ? styles.modeButtonActive : styles.modeButtonInactive}`}
          >
            All
          </button>
          <button
            onClick={() => handleViewModeChange('posts')}
            className={`${styles.modeButton} ${viewMode === 'posts' ? styles.modeButtonActive : styles.modeButtonInactive}`}
          >
            Blog Posts
          </button>
          <button
            onClick={() => handleViewModeChange('gallery')}
            className={`${styles.modeButton} ${viewMode === 'gallery' ? styles.modeButtonActive : styles.modeButtonInactive}`}
          >
            Photography & Art
          </button>
        </div>

        {isAllView ? (
          <div className={styles.splitLayout}>
            <div className={styles.splitColumn}>
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
                        selectedTag === tag
                          ? styles.tagButtonActive
                          : styles.tagButtonInactive
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.sectionHeading}>
                <Terminal className={styles.sectionHeadingIcon} />
                <h2 className={styles.sectionHeadingText}>Writing</h2>
              </div>
              {filteredPosts.length === 0 ? (
                <div className={styles.emptyState}>
                  No posts found with tag "{selectedTag}"
                </div>
              ) : (
                <div className={styles.postsList}>
                  {filteredPosts.map((post) => (
                    <Link key={post._id} to={`/blog/${post.slug.current}`} className={`${styles.postLink} group`}>
                      <PixelCard className={styles.postCard}>
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
                      </PixelCard>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.splitColumn}>
              <div className={styles.tagFilter}>
                <div className={styles.tagFilterHeader}>
                  <Camera className={styles.tagIcon} />
                  <span className={styles.tagFilterLabel}>Filter gallery by category:</span>
                </div>
                <div className={styles.tagButtons}>
                  {allCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`${styles.tagButton} ${
                        selectedCategory === category
                          ? styles.tagButtonActive
                          : styles.tagButtonInactive
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.sectionHeading}>
                <Camera className={styles.sectionHeadingIcon} />
                <h2 className={styles.sectionHeadingText}>Photography & Art</h2>
              </div>
              {filteredPhotos.length === 0 ? (
                <div className={styles.emptyState}>
                  No gallery entries found for "{selectedCategory}"
                </div>
              ) : (
                <div className={styles.galleryGridCompact}>
                  {filteredPhotos.map((item) => (
                    <PixelCard
                      key={item._id}
                      className={`${styles.galleryCard} ${styles.galleryCardInteractive}`}
                      onClick={() => openLightboxById(item._id)}
                    >
                      <div className={styles.galleryImageWrap}>
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.altText || item.title}
                            className={styles.galleryImage}
                          />
                        ) : (
                          <div className={styles.galleryImageFallback}>
                            <Camera className={styles.galleryFallbackIcon} />
                          </div>
                        )}
                      </div>
                      <div className={styles.galleryCardBody}>
                        <h3 className={styles.galleryTitle}>{item.title}</h3>
                        <div className={styles.galleryMeta}>
                          <span className={styles.galleryBadge}>{item.category}</span>
                          {item.capturedAt && (
                            <span className={styles.galleryDate}>
                              <Calendar className={styles.calendarIcon} />
                              {new Date(item.capturedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                            </span>
                          )}
                        </div>
                        {item.location && (
                          <div className={styles.galleryLocation}>
                            <MapPin className={styles.galleryLocationIcon} />
                            <span>{item.location}</span>
                          </div>
                        )}
                        {item.description && (
                          <p className={styles.galleryDescription}>{item.description}</p>
                        )}
                        {item.tags && item.tags.length > 0 && (
                          <div className={styles.postTags}>
                            <Tag className={styles.postTagIcon} />
                            {item.tags.map((tag) => (
                              <span key={tag} className={styles.postTag}>{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </PixelCard>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            {showPosts && (
              <>
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
                          selectedTag === tag
                            ? styles.tagButtonActive
                            : styles.tagButtonInactive
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
                <div className={styles.sectionHeading}>
                  <Terminal className={styles.sectionHeadingIcon} />
                  <h2 className={styles.sectionHeadingText}>Writing</h2>
                </div>
                {filteredPosts.length === 0 ? (
                  <div className={styles.emptyState}>
                    No posts found with tag "{selectedTag}"
                  </div>
                ) : (
                  <div className={styles.postsList}>
                    {filteredPosts.map((post) => (
                      <Link key={post._id} to={`/blog/${post.slug.current}`} className={`${styles.postLink} group`}>
                        <PixelCard className={styles.postCard}>
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
                        </PixelCard>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}

            {showGallery && (
              <>
                <div className={styles.tagFilter}>
                  <div className={styles.tagFilterHeader}>
                    <Camera className={styles.tagIcon} />
                    <span className={styles.tagFilterLabel}>Filter gallery by category:</span>
                  </div>
                  <div className={styles.tagButtons}>
                    {allCategories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`${styles.tagButton} ${
                          selectedCategory === category
                            ? styles.tagButtonActive
                            : styles.tagButtonInactive
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
                <div className={styles.sectionHeading}>
                  <Camera className={styles.sectionHeadingIcon} />
                  <h2 className={styles.sectionHeadingText}>Photography & Art</h2>
                </div>
                {filteredPhotos.length === 0 ? (
                  <div className={styles.emptyState}>
                    No gallery entries found for "{selectedCategory}"
                  </div>
                ) : (
                  <div className={styles.galleryGrid}>
                  {filteredPhotos.map((item) => (
                    <PixelCard
                      key={item._id}
                      className={`${styles.galleryCard} ${styles.galleryCardInteractive}`}
                      onClick={() => openLightboxById(item._id)}
                    >
                      <div className={styles.galleryImageWrap}>
                        {item.imageUrl ? (
                          <img
                              src={item.imageUrl}
                              alt={item.altText || item.title}
                              className={styles.galleryImage}
                            />
                          ) : (
                            <div className={styles.galleryImageFallback}>
                              <Camera className={styles.galleryFallbackIcon} />
                            </div>
                          )}
                        </div>
                        <div className={styles.galleryCardBody}>
                          <h3 className={styles.galleryTitle}>{item.title}</h3>
                          <div className={styles.galleryMeta}>
                            <span className={styles.galleryBadge}>{item.category}</span>
                            {item.capturedAt && (
                              <span className={styles.galleryDate}>
                                <Calendar className={styles.calendarIcon} />
                                {new Date(item.capturedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                              </span>
                            )}
                          </div>
                          {item.location && (
                            <div className={styles.galleryLocation}>
                              <MapPin className={styles.galleryLocationIcon} />
                              <span>{item.location}</span>
                            </div>
                          )}
                          {item.description && (
                            <p className={styles.galleryDescription}>{item.description}</p>
                          )}
                          {item.tags && item.tags.length > 0 && (
                            <div className={styles.postTags}>
                              <Tag className={styles.postTagIcon} />
                              {item.tags.map((tag) => (
                                <span key={tag} className={styles.postTag}>{tag}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </PixelCard>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
      <ArtLightboxModal
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        items={filteredPhotos}
        currentIndex={lightboxIndex}
        onPrev={goToPrevImage}
        onNext={goToNextImage}
      />
    </div>
  );
};

export default Blog;
