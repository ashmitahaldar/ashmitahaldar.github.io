import React from 'react';
import { experience } from '../data/mock';
import { Briefcase, MapPin, Calendar, Code2 } from 'lucide-react';

const Experience = () => {
  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold font-mono mb-4 bg-gradient-to-r from-pink-400 to-teal-400 bg-clip-text text-transparent">
            &gt; Experience_
          </h1>
          <p className="text-gray-400 font-mono">// My professional journey</p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-pink-500 via-teal-500 to-pink-500"></div>

          {/* Experience Items */}
          <div className="space-y-8">
            {experience.map((exp, index) => (
              <div key={exp.id} className="relative pl-20">
                {/* Timeline Dot */}
                <div className="absolute left-5 top-6 w-6 h-6 bg-[#0A0E27] border-4 border-teal-400 rounded-full shadow-[0_0_15px_rgba(20,184,166,0.5)] z-10"></div>

                {/* Content Card */}
                <div className={`bg-[#1A1B26] border-2 ${
                  index % 2 === 0 ? 'border-pink-500' : 'border-teal-500'
                } rounded-lg p-6 shadow-[0_0_30px_rgba(236,72,153,0.2)] hover:shadow-[0_0_40px_rgba(20,184,166,0.3)] transition-all duration-300`}>
                  {/* Header */}
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold font-mono text-pink-400 mb-2">
                      {exp.title}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2 text-teal-400">
                        <Briefcase className="w-4 h-4" />
                        <span className="font-mono">{exp.company}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <MapPin className="w-4 h-4" />
                        <span className="font-mono">{exp.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span className="font-mono">{exp.period}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    {exp.description}
                  </p>

                  {/* Technologies */}
                  <div className="flex items-center gap-2 mb-2">
                    <Code2 className="w-4 h-4 text-teal-400" />
                    <span className="text-sm font-mono text-teal-400">Tech Stack:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map(tech => (
                      <span key={tech} className="px-2 py-1 bg-[#0A0E27] border border-pink-500/50 rounded text-pink-300 font-mono text-xs hover:border-pink-500 hover:shadow-[0_0_10px_rgba(236,72,153,0.3)] transition-all duration-200">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Experience;