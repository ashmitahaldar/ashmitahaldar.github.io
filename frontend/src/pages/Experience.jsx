import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, Calendar, Code2, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';
import PixelCard from '../components/PixelCard';
import { getExperiences } from '../services/sanityClient';
import PortableText from '../components/PortableText';
import { useTypingEffect } from '../hooks/useTypingEffect';

const Experience = () => {
  const [experience, setExperience] = useState([]);
  const [loading, setLoading] = useState(true);
  const { displayedText: typedTitle, isComplete: titleComplete } = useTypingEffect('Experience', 100);
  const { displayedText: typedSubtitle } = useTypingEffect('cat ~/.work/timeline.log', 50, 1000);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const data = await getExperiences();
        setExperience(data);
      } catch (error) {
        console.error('Error fetching experience from Sanity:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchExperience();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-12 px-4 flex items-center justify-center">
        <div className="text-pink-400 font-mono">Loading...</div>
      </div>
    );
  } else if (experience.length === 0) {
    return (
      <PixelCard className="text-center py-20">
          <Briefcase className="w-16 h-16 mx-auto mb-4 text-pink-400/50" />
          <p className="text-xl text-pink-400/70">No experience records found.</p>
      </PixelCard>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
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
          <p className="font-mono min-h-[24px]">
            <span className="text-pink-300">$ </span>
            <span className="text-teal-400">{typedSubtitle}</span>
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-pink-500 via-teal-500 to-pink-500"></div>

          {/* Experience Items */}
          <div className="space-y-8">
            {experience.map((exp, index) => (
              <div key={exp._id || index} className="relative pl-20">
                {/* Timeline Dot */}
                <div className="absolute left-5 top-6 w-6 h-6 bg-[#0A0E27] border-4 border-teal-400 rounded-full z-10"></div>

                {/* Content Card */}
                <PixelCard className="rounded-lg p-6">
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
                        <span className="font-mono">
                          {(() => {
                            // Handle both string and object for period/dateRange
                            const dr = exp.period || exp.dateRange;
                            if (!dr) return '';
                            if (typeof dr === 'string') return dr;
                            if (typeof dr === 'object') {
                              // Sanity dateRange object: { _type, from, to, isCurrent }
                              const from = dr.from ? new Date(dr.from).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : '';
                              const to = dr.isCurrent ? 'Present' : (dr.to ? new Date(dr.to).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : '');
                              return from && to ? `${from} - ${to}` : from || to || '';
                            }
                            return '';
                          })()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {Array.isArray(exp.description) ? (
                    <div className="text-gray-300 mb-4 leading-relaxed">
                      <PortableText value={exp.description} />
                    </div>
                  ) : (
                    <p className="text-gray-300 mb-4 leading-relaxed">{exp.description}</p>
                  )}

                  {/* Technologies */}
                  <div className="flex items-center gap-2 mb-2">
                    <Code2 className="w-4 h-4 text-teal-400" />
                    <span className="text-sm font-mono text-teal-400">Tech Stack:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map(tech => (
                      <span key={tech} className="px-2 py-1 bg-[#0A0E27] border border-pink-500/50 rounded text-pink-300 font-mono text-xs hover:border-pink-500 transition-colors">
                        {tech}
                      </span>
                    ))}
                  </div>
                </PixelCard>
              </div>
            ))}
          </div>
        </div>
        {/* Command Tip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center text-sm text-pink-400/50"
        >
          <p>ACHIEVEMENT UNLOCKED: Professional career journey documented!</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Experience;