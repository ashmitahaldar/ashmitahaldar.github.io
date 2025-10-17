import React from 'react';
import { Link } from 'react-router-dom';
import { blogPosts } from '../data/mock';
import { Calendar, Tag, ArrowRight } from 'lucide-react';

const Blog = () => {
  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold font-mono mb-4 bg-gradient-to-r from-pink-400 to-teal-400 bg-clip-text text-transparent">
            &gt; Blog_
          </h1>
          <p className="text-gray-400 font-mono">// Thoughts, tutorials, and musings</p>
        </div>

        {/* Blog Posts */}
        <div className="space-y-6">
          {blogPosts.map((post, index) => (
            <Link
              key={post.id}
              to={`/blog/${post.id}`}
              className={`block bg-[#1A1B26] border-2 ${
                index % 2 === 0 ? 'border-pink-500' : 'border-teal-500'
              } rounded-lg p-6 shadow-[0_0_30px_rgba(236,72,153,0.2)] hover:shadow-[0_0_40px_rgba(20,184,166,0.3)] transition-all duration-300 group`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold font-mono text-pink-400 mb-3 group-hover:text-teal-400 transition-colors">
                    {post.title}
                  </h2>
                  
                  <div className="flex items-center gap-4 mb-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span className="font-mono">{post.date}</span>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Tag className="w-4 h-4 text-teal-400" />
                    {post.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-[#0A0E27] border border-teal-500/50 rounded text-teal-300 font-mono text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-pink-400 group-hover:text-teal-400 group-hover:translate-x-2 transition-all duration-200">
                  <ArrowRight className="w-6 h-6" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Add Post Note */}
        <div className="mt-12 bg-[#1A1B26] border-2 border-pink-500/30 rounded-lg p-6 font-mono text-center">
          <p className="text-gray-400">
            <span className="text-teal-400">// </span>
            Want to add blog posts? Edit the markdown content in 
            <code className="text-pink-300 mx-1">/frontend/src/data/mock.js</code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Blog;