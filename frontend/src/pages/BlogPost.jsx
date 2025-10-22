import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Tag, ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'framer-motion';
import PixelCard from '../components/PixelCard';
import { useTypingEffect } from '../hooks/useTypingEffect';
import { api } from '../services/api';

const BlogPost = () => {
  const { id } = useParams();
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
        const response = await api.getBlogPost(id);
        setPost(response.data);
      } catch (error) {
        console.error('Error fetching blog post:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

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
              <span className="font-mono">{post.date}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex items-center gap-2 flex-wrap">
            <Tag className="w-4 h-4 text-teal-400" />
            {post.tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-[#0A0E27] border border-teal-500/50 rounded text-teal-300 font-mono text-sm">
                {tag}
              </span>
            ))}
          </div>
  </PixelCard>

        {/* Post Content - Formatted Markdown */}
        <PixelCard className="rounded-lg p-8">
          <div className="prose prose-invert prose-pink max-w-none">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({node, ...props}) => <h1 className="text-3xl font-bold text-pink-400 font-mono mb-4 mt-8" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-pink-400 font-mono mb-3 mt-6" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-xl font-bold text-teal-400 font-mono mb-2 mt-4" {...props} />,
                p: ({node, ...props}) => <p className="text-gray-300 mb-4 leading-relaxed" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal list-inside text-gray-300 mb-4 space-y-2" {...props} />,
                li: ({node, ...props}) => <li className="text-gray-300" {...props} />,
                code: ({node, inline, ...props}) => 
                  inline 
                    ? <code className="bg-[#0A0E27] text-teal-300 px-2 py-1 rounded font-mono text-sm" {...props} />
                    : <code className="block bg-[#0A0E27] text-teal-300 p-4 rounded font-mono text-sm overflow-x-auto mb-4" {...props} />,
                a: ({node, ...props}) => <a className="text-teal-400 hover:text-teal-300 underline" {...props} />,
                strong: ({node, ...props}) => <strong className="text-pink-400 font-bold" {...props} />,
                blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-pink-500 pl-4 italic text-gray-400 my-4" {...props} />,
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </PixelCard>
      </div>
    </div>
  );
};

export default BlogPost;