import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Tag, ArrowLeft } from 'lucide-react';
import { api } from '../services/api';

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

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
        <div className="bg-[#1A1B26] border-2 border-pink-500 rounded-lg p-8 mb-8">
          <h1 className="text-4xl font-bold font-mono text-pink-400 mb-4">
            {post.title}
          </h1>
          
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
        </div>

        {/* Post Content - Raw Markdown */}
        <div className="bg-[#1A1B26] border-2 border-teal-500 rounded-lg p-8">
          <div className="font-mono text-sm">
            <pre className="text-gray-300 whitespace-pre-wrap leading-relaxed overflow-x-auto">
              {post.content}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;