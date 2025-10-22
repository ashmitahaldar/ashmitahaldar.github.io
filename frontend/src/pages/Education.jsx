import React, { useState, useEffect } from 'react';
import { GraduationCap, MapPin, Calendar, BookOpen, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';
import PixelCard from '../components/PixelCard';
import { api } from '../services/api';
import { useTypingEffect } from '../hooks/useTypingEffect';

const Education = () => {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const { displayedText: typedTitle, isComplete: titleComplete } = useTypingEffect('Education', 100);
  const { displayedText: typedSubtitle } = useTypingEffect('cat ~/.education/achievements.log', 50, 1000);

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const response = await api.getEducation();
        setEducation(response.data);
      } catch (error) {
        console.error('Error fetching education:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEducation();
  }, []);

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

        {/* Education Items */}
        <div className="space-y-8">
          {education.map((edu, index) => (
            <PixelCard key={edu.id} className="rounded-lg p-8">
              {/* Icon & Degree */}
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-[#0A0E27] border-2 border-pink-500 rounded-lg">
                  <GraduationCap className="w-8 h-8 text-pink-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold font-mono text-pink-400 mb-2">
                    {edu.degree}
                  </h3>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2 text-teal-400">
                      <BookOpen className="w-4 h-4" />
                      <span className="font-mono">{edu.school}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span className="font-mono">{edu.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span className="font-mono">{edu.period}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* GPA */}
              <div className="mb-4">
                <span className="inline-block px-4 py-2 bg-[#0A0E27] border border-teal-500 rounded-lg text-teal-400 font-mono text-sm">
                  GPA: {edu.gpa}
                </span>
              </div>

              {/* Description/Highlights */}
              {edu.description && edu.description.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-lg font-mono text-pink-400 mb-2 flex items-center gap-2">
                    <span>•</span> Highlights:
                  </h4>
                  <ul className="space-y-1 text-gray-300">
                    {edu.description.map((item, idx) => (
                      <li key={idx} className="font-mono text-sm flex items-start gap-2">
                        <span className="text-teal-400 mt-1">▸</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Relevant Coursework */}
              <div>
                <h4 className="text-lg font-mono text-teal-400 mb-3 flex items-center gap-2">
                  <span>•</span> Relevant Coursework:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {edu.relevant.map(course => (
                    <span key={course} className="px-3 py-1 bg-[#0A0E27] border border-pink-500/50 rounded text-pink-300 font-mono text-sm hover:border-pink-500 transition-colors">
                      {course}
                    </span>
                  ))}
                </div>
              </div>
            </PixelCard>
          ))}
        </div>
        {/* Command Tip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center text-sm text-pink-400/50"
        >
          <p>LEVEL UP: Continuous learning achievement unlocked!</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Education;