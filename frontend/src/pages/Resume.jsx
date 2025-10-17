import React from 'react';
import { Download, Github, Linkedin, Mail } from 'lucide-react';
import { profileData, skills, experience, education } from '../data/mock';

const Resume = () => {
  const handleDownload = () => {
    // Placeholder for PDF download
    alert('PDF download functionality - Add your resume PDF to /public/resume.pdf');
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold font-mono mb-4 bg-gradient-to-r from-pink-400 to-teal-400 bg-clip-text text-transparent">
            &gt; Resume_
          </h1>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-600 to-teal-600 text-white font-mono rounded-lg hover:shadow-[0_0_30px_rgba(236,72,153,0.4)] transition-all duration-300"
          >
            <Download className="w-5 h-5" />
            Download PDF
          </button>
        </div>

        {/* Resume Content */}
        <div className="bg-[#1A1B26] border-2 border-pink-500 rounded-lg shadow-[0_0_30px_rgba(236,72,153,0.2)]">
          {/* Header Section */}
          <div className="border-b-2 border-teal-500/30 p-8 text-center">
            <h2 className="text-4xl font-bold font-mono text-pink-400 mb-2">{profileData.name}</h2>
            <p className="text-xl text-teal-400 font-mono mb-4">{profileData.title}</p>
            <div className="flex justify-center gap-6 text-sm">
              <span className="text-gray-400 font-mono">{profileData.email}</span>
              <span className="text-gray-400 font-mono">{profileData.location}</span>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              <a href={`https://${profileData.github}`} target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:text-teal-300 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href={`https://${profileData.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:text-pink-300 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href={`mailto:${profileData.email}`} className="text-teal-400 hover:text-teal-300 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Education Section */}
          <div className="border-b-2 border-teal-500/30 p-8">
            <h3 className="text-2xl font-bold font-mono text-teal-400 mb-4 flex items-center gap-2">
              <span>&gt;&gt;</span> Education
            </h3>
            {education.map(edu => (
              <div key={edu.id} className="mb-4 last:mb-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-lg font-bold text-pink-400 font-mono">{edu.degree}</h4>
                    <p className="text-gray-300">{edu.school}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 font-mono text-sm">{edu.period}</p>
                    <p className="text-teal-400 font-mono text-sm">GPA: {edu.gpa}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Experience Section */}
          <div className="border-b-2 border-teal-500/30 p-8">
            <h3 className="text-2xl font-bold font-mono text-teal-400 mb-4 flex items-center gap-2">
              <span>&gt;&gt;</span> Experience
            </h3>
            {experience.map(exp => (
              <div key={exp.id} className="mb-6 last:mb-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-lg font-bold text-pink-400 font-mono">{exp.title}</h4>
                    <p className="text-gray-300">{exp.company} | {exp.location}</p>
                  </div>
                  <p className="text-gray-400 font-mono text-sm">{exp.period}</p>
                </div>
                <p className="text-gray-300 mb-2">{exp.description}</p>
                <div className="flex flex-wrap gap-2">
                  {exp.technologies.map(tech => (
                    <span key={tech} className="px-2 py-1 bg-[#0A0E27] border border-teal-500/50 rounded text-teal-300 font-mono text-xs">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Skills Section */}
          <div className="p-8">
            <h3 className="text-2xl font-bold font-mono text-teal-400 mb-4 flex items-center gap-2">
              <span>&gt;&gt;</span> Technical Skills
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-pink-400 font-mono mb-2">Languages:</h4>
                <p className="text-gray-300 font-mono text-sm">{skills.languages.join(', ')}</p>
              </div>
              <div>
                <h4 className="text-pink-400 font-mono mb-2">Frameworks:</h4>
                <p className="text-gray-300 font-mono text-sm">{skills.frameworks.join(', ')}</p>
              </div>
              <div>
                <h4 className="text-pink-400 font-mono mb-2">Tools:</h4>
                <p className="text-gray-300 font-mono text-sm">{skills.tools.join(', ')}</p>
              </div>
              <div>
                <h4 className="text-pink-400 font-mono mb-2">Interests:</h4>
                <p className="text-gray-300 font-mono text-sm">{skills.interests.join(', ')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resume;