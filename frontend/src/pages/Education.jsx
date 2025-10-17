import React, { useState, useEffect } from 'react';
import { GraduationCap, MapPin, Calendar, BookOpen } from 'lucide-react';
import { api } from '../services/api';

const Education = () => {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);

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
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold font-mono mb-4 bg-gradient-to-r from-pink-400 to-teal-400 bg-clip-text text-transparent">
            &gt; Education_
          </h1>
          <p className="text-gray-400 font-mono">// Academic background</p>
        </div>

        {/* Education Items */}
        <div className="space-y-8">
          {education.map((edu, index) => (
            <div key={edu.id} className={`bg-[#1A1B26] border-2 ${
              index % 2 === 0 ? 'border-teal-500' : 'border-pink-500'
            } rounded-lg p-8 transition-all duration-300`}>
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Education;