import React, { useState } from 'react';
import { projects } from '../data/mock';
import { ExternalLink, Github, Code2, Gamepad2, Palette, FileCode } from 'lucide-react';

const Projects = () => {
  const [hoveredProject, setHoveredProject] = useState(null);

  const getProjectIcon = (imageType) => {
    switch(imageType) {
      case 'game': return Gamepad2;
      case 'paint': return Palette;
      case 'code': return FileCode;
      default: return Code2;
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold font-mono mb-4 bg-gradient-to-r from-pink-400 to-teal-400 bg-clip-text text-transparent">
            &gt; Projects_
          </h1>
          <p className="text-gray-400 font-mono">// Things I've built</p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => {
            const Icon = getProjectIcon(project.image);
            return (
              <div
                key={project.id}
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
                className={`bg-[#1A1B26] border-2 ${
                  index % 2 === 0 ? 'border-pink-500' : 'border-teal-500'
                } rounded-lg overflow-hidden transition-all duration-300`}
              >
                {/* Project Icon/Image */}
                <div className={`h-48 flex items-center justify-center ${
                  index % 2 === 0 
                    ? 'bg-gradient-to-br from-pink-900/30 to-pink-600/30' 
                    : 'bg-gradient-to-br from-teal-900/30 to-teal-600/30'
                }`}>
                  <Icon className={`w-24 h-24 ${
                    index % 2 === 0 ? 'text-pink-400' : 'text-teal-400'
                  } ${hoveredProject === project.id ? 'scale-110' : 'scale-100'} transition-transform duration-300`} />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold font-mono text-pink-400 mb-3">
                    {project.title}
                  </h3>
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map(tech => (
                        <span key={tech} className="px-2 py-1 bg-[#0A0E27] border border-teal-500/50 rounded text-teal-300 font-mono text-xs hover:border-teal-500 transition-all duration-200">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Links */}
                  <div className="flex gap-3">
                    <a
                      href={`https://${project.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-[#0A0E27] border-2 border-pink-500 rounded-lg text-pink-400 font-mono text-sm hover:bg-pink-500/10 transition-all duration-200"
                    >
                      <Github className="w-4 h-4" />
                      Code
                    </a>
                    {project.demo && (
                      <a
                        href={`https://${project.demo}`}
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
              </div>
            );
          })}
        </div>

        {/* Add Project Note */}
        <div className="mt-12 bg-[#1A1B26] border-2 border-pink-500/30 rounded-lg p-6 font-mono text-center">
          <p className="text-gray-400">
            <span className="text-teal-400">// </span>
            Want to add more projects? Edit the data in 
            <code className="text-pink-300 mx-1">/frontend/src/data/mock.js</code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Projects;