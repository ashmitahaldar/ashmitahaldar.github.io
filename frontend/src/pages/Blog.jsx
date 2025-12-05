import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Tag, ArrowRight, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';
import PixelCard from '../components/PixelCard';
import { getBlogPosts } from '../services/sanityClient';
import { useTypingEffect } from '../hooks/useTypingEffect';

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState('All');
  const { displayedText: typedTitle, isComplete: titleComplete } = useTypingEffect('Blog', 100);
  const { displayedText: typedSubtitle } = useTypingEffect('tail -f ~/thoughts/blog.log', 50, 1000);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const data = await getBlogPosts();
        setBlogPosts(data);
      } catch (error) {
        console.error('Error fetching blog posts from Sanity:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogPosts();
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
      <div className="min-h-screen pt-20 pb-12 px-4 flex items-center justify-center">
        <div className="text-pink-400 font-mono">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-bold font-mono mb-4 bg-gradient-to-r from-pink-400 to-teal-400 bg-clip-text text-transparent min-h-[60px] flex items-center justify-center gap-2">
            <Terminal className="w-8 h-8 text-teal-400" />
            <span>
              {typedTitle}
              {!titleComplete && <span className="text-teal-400 animate-pulse">_</span>}
            </span>
          </h1>
          <p className="text-gray-400 font-mono min-h-[24px]">
            <span className="text-pink-300">$ </span>
            <span className="text-teal-400">{typedSubtitle}</span>
          </p>
        </motion.div>

        {/* Tag Filter */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="w-4 h-4 text-teal-400" />
            <span className="text-teal-400 font-mono text-sm">Filter by tag:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 border-2 rounded-lg font-mono text-sm transition-colors ${
                  selectedTag === tag
                    ? 'bg-pink-500 border-pink-500 text-white'
                    : 'bg-[#1A1B26] border-pink-500/50 text-pink-300 hover:border-pink-500'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Posts */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12 text-gray-400 font-mono">
            No posts found with tag "{selectedTag}"
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPosts.map((post, index) => (
              <Link key={post._id} to={`/blog/${post.slug.current}`} className="block group">
                <PixelCard className="rounded-lg p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold font-mono text-pink-400 mb-3 group-hover:text-teal-400 transition-colors">
                      {post.title}
                    </h2>
                    
                    <div className="flex items-center gap-4 mb-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span className="font-mono">{new Date(post.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>

                    <p className="text-gray-300 mb-4 leading-relaxed">
                      {post.excerpt}
                    </p>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <Tag className="w-4 h-4 text-teal-400" />
                        {post.tags.map(tag => (
                          <span key={tag} className="px-2 py-1 bg-[#0A0E27] border border-teal-500/50 rounded text-teal-300 font-mono text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="text-pink-400 group-hover:text-teal-400 group-hover:translate-x-2 transition-all duration-200">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                </div>
                </PixelCard>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;