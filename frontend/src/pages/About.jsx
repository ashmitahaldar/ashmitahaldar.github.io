import React, { useState, useEffect } from 'react';
import { Code2, Wrench, Heart, Sparkles, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';
import PixelCard from '../components/PixelCard';
import { api } from '../services/api';
import { useTypingEffect } from '../hooks/useTypingEffect';

const About = () => {
  const [profileData, setProfileData] = useState(null);
  const [skills, setSkills] = useState(null);
  const [loading, setLoading] = useState(true);
  const { displayedText: typedTitle, isComplete: titleComplete } = useTypingEffect('About Me', 100);
  const { displayedText: typedSubtitle } = useTypingEffect('cat ~/.profile/about.txt', 50, 1000);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, skillsRes] = await Promise.all([
          api.getProfile(),
          api.getSkills()
        ]);
        setProfileData(profileRes.data);
        setSkills(skillsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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

        {/* Bio Section */}
  <PixelCard className="rounded-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-teal-400" />
            <h2 className="text-2xl font-bold font-mono text-pink-400">My Story</h2>
          </div>
          <div className="text-gray-300 leading-relaxed space-y-4">
            <p>
              Hi there! I'm {profileData?.name}, a computer science student with a passion for creating elegant solutions to complex problems. My journey into tech started with a curiosity about how video games work, which led me down the rabbit hole of programming.
            </p>
            <p>
              This page is a work in progress!
            </p>
          </div>
  </PixelCard>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Languages */}
          <PixelCard className="rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Code2 className="w-5 h-5 text-pink-400" />
              <h3 className="text-xl font-bold font-mono text-teal-400">Languages</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills?.languages?.map(lang => (
                <span key={lang} className="px-3 py-1 bg-[#0A0E27] border border-pink-500/50 rounded text-pink-300 font-mono text-sm hover:border-pink-500 transition-colors">
                  {lang}
                </span>
              ))}
            </div>
          </PixelCard>

          {/* Frameworks */}
          <PixelCard className="rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Wrench className="w-5 h-5 text-teal-400" />
              <h3 className="text-xl font-bold font-mono text-pink-400">Frameworks</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills?.frameworks?.map(framework => (
                <span key={framework} className="px-3 py-1 bg-[#0A0E27] border border-teal-500/50 rounded text-teal-300 font-mono text-sm hover:border-teal-500 transition-colors">
                  {framework}
                </span>
              ))}
            </div>
          </PixelCard>

          {/* Tools */}
          <PixelCard className="rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Wrench className="w-5 h-5 text-pink-400" />
              <h3 className="text-xl font-bold font-mono text-teal-400">Tools & Technologies</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills?.tools?.map(tool => (
                <span key={tool} className="px-3 py-1 bg-[#0A0E27] border border-pink-500/50 rounded text-pink-300 font-mono text-sm hover:border-pink-500 transition-colors">
                  {tool}
                </span>
              ))}
            </div>
          </PixelCard>

          {/* Interests */}
          <PixelCard className="rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-5 h-5 text-teal-400" />
              <h3 className="text-xl font-bold font-mono text-pink-400">Interests</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills?.interests?.map(interest => (
                <span key={interest} className="px-3 py-1 bg-[#0A0E27] border border-teal-500/50 rounded text-teal-300 font-mono text-sm hover:border-teal-500 transition-colors">
                  {interest}
                </span>
              ))}
            </div>
          </PixelCard>
        </div>

        {/* Fun Fact */}
  <PixelCard className="rounded-lg p-6 font-mono">
          <div className="flex items-start gap-3">
            <span className="text-3xl">🎮</span>
            <div>
              <h3 className="text-teal-400 font-bold mb-2">Fun Fact:</h3>
              <p className="text-gray-300">
                Still thinking about what to add here...
              </p>
            </div>
          </div>
  </PixelCard>
      </div>
    </div>
  );
};

export default About;