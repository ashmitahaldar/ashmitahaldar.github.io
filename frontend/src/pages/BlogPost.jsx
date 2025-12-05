import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Tag, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import PixelCard from '../components/PixelCard';
import PortableText from '../components/PortableText';
import { useTypingEffect } from '../hooks/useTypingEffect';
import { getBlogPostBySlug } from '../services/sanityClient';

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
      <div className="min-h-screen pt-20 pb-12 px-4 flex items-center justify-center">
        <div className="text-pink-400 font-mono">Loading...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen pt-20 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold font-mono text-pink-400 mb-4">Post Not Found</h1>
          <button
            onClick={() => navigate('/blog')}
            className="text-teal-400 hover:text-teal-300 font-mono"
          >
            &larr; Back to Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/blog')}
          className="flex items-center gap-2 text-teal-400 hover:text-teal-300 font-mono mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </button>

        {/* Post Header */}
        <PixelCard className="rounded-lg p-8 mb-8">
          <motion.h1 
            className="text-4xl font-bold font-mono text-pink-400 mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {typedTitle}
            {!titleComplete && <span className="text-teal-400 animate-pulse">_</span>}
          </motion.h1>
          
          <div className="flex items-center gap-4 mb-4 text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar className="w-4 h-4" />
              <span className="font-mono">{new Date(post.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>

          {/* Tags */}
          {post.tags && Array.isArray(post.tags) && post.tags.length > 0 ? (
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="w-4 h-4 text-teal-400" />
              {post.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-[#0A0E27] border border-teal-500/50 rounded text-teal-300 font-mono text-sm">
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No tags</p>
          )}
  </PixelCard>

        {/* Post Content - Sanity Portable Text */}
        <PixelCard className="rounded-lg p-8">
          <div className="text-gray-300 leading-relaxed">
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