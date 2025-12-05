import React, { useState, useEffect } from 'react';
import { ExternalLink, Github, Code2, Gamepad2, Palette, FileCode, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';
import PixelCard from '../components/PixelCard';
import { getProjects } from '../services/sanityClient';
import PortableText from '../components/PortableText';
import { useTypingEffect } from '../hooks/useTypingEffect';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredProject, setHoveredProject] = useState(null);
  const { displayedText: typedTitle, isComplete: titleComplete } = useTypingEffect('Projects', 100);
  const { displayedText: typedSubtitle } = useTypingEffect("ls -la ~/projects/ | grep awesome", 50, 1000);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects from Sanity:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const getProjectIcon = (imageType) => {
    switch(imageType) {
      case 'game': return Gamepad2;
      case 'paint': return Palette;
      case 'code': return FileCode;
      default: return Code2;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-12 px-4 flex items-center justify-center">
        <div className="text-pink-400 font-mono">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
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

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => {
            // Use _id for key, and imageUrl for image if available
            const Icon = getProjectIcon(project.image || 'code');
            return (
              <PixelCard
                key={project._id}
                onMouseEnter={() => setHoveredProject(project._id)}
                onMouseLeave={() => setHoveredProject(null)}
                className="overflow-hidden"
              >
                {/* Project Icon/Image */}
                <div className={`h-48 flex items-center justify-center ${
                  index % 2 === 0 
                    ? 'bg-gradient-to-br from-pink-900/30 to-pink-600/30' 
                    : 'bg-gradient-to-br from-teal-900/30 to-teal-600/30'
                }`}>
                  {project.imageUrl ? (
                    <img src={project.imageUrl} alt={project.title} className="w-24 h-24 object-contain rounded-lg shadow-lg" />
                  ) : (
                    <Icon className={`w-24 h-24 ${
                      index % 2 === 0 ? 'text-pink-400' : 'text-teal-400'
                    } ${hoveredProject === project._id ? 'scale-110' : 'scale-100'} transition-transform duration-300`} />
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold font-mono text-pink-400 mb-3">
                    {project.title}
                  </h3>
                  {Array.isArray(project.description) ? (
                    <div className="text-gray-300 mb-4 leading-relaxed">
                      <PortableText value={project.description} />
                    </div>
                  ) : (
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      {project.description}
                    </p>
                  )}

                  {/* Technologies */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {project.technologies && project.technologies.map(tech => (
                        <span key={tech} className="px-2 py-1 bg-[#0A0E27] border border-teal-500/50 rounded text-teal-300 font-mono text-xs hover:border-teal-500 transition-colors">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Links */}
                  <div className="flex gap-3">
                    {project.github && (
                      <a
                        href={project.github.startsWith('http') ? project.github : `https://${project.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-[#0A0E27] border-2 border-pink-500 rounded-lg text-pink-400 font-mono text-sm hover:bg-pink-500/10 transition-all duration-200"
                      >
                        <Github className="w-4 h-4" />
                        Code
                      </a>
                    )}
                    {project.demo && (
                      <a
                        href={project.demo.startsWith('http') ? project.demo : `https://${project.demo}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-[#0A0E27] border-2 border-teal-500 rounded-lg text-teal-400 font-mono text-sm hover:bg-teal-500/10 transition-all duration-200"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Demo
                      </a>
                    )}
                  </div>
                </div>
              </PixelCard>
            );
          })}
        </div>

        {/* Add Project Note */}
        <div className="mt-12 bg-[#1A1B26] border-2 border-pink-500/30 rounded-lg p-6 font-mono text-center">
          <p className="text-gray-400">
            <span className="text-teal-400">// </span>
            This page is a work in progress. More projects will be added soon!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Projects;