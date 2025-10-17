import React from 'react';
import { profileData, skills } from '../data/mock';
import { Code2, Wrench, Heart, Sparkles } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold font-mono mb-4 bg-gradient-to-r from-pink-400 to-teal-400 bg-clip-text text-transparent">
            &gt; About Me_
          </h1>
          <p className="text-gray-400 font-mono">// Getting to know the person behind the code</p>
        </div>

        {/* Bio Section */}
        <div className="bg-[#1A1B26] border-2 border-pink-500 rounded-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-teal-400" />
            <h2 className="text-2xl font-bold font-mono text-pink-400">My Story</h2>
          </div>
          <div className="text-gray-300 leading-relaxed space-y-4">
            <p>
              Hi there! I'm {profileData.name}, a computer science student with a passion for creating elegant solutions to complex problems. My journey into tech started with a curiosity about how video games work, which led me down the rabbit hole of programming.
            </p>
            <p>
              When I'm not coding, you'll find me creating pixel art, playing retro games (shoutout to all the classic RPGs!), or experimenting with new frameworks and technologies. I love the intersection of creativity and logic that programming provides.
            </p>
            <p>
              I believe in writing clean, maintainable code and always learning from the amazing developer community. My goal is to build software that not only works well but also brings joy to users.
            </p>
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Languages */}
          <div className="bg-[#1A1B26] border-2 border-teal-500 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Code2 className="w-5 h-5 text-pink-400" />
              <h3 className="text-xl font-bold font-mono text-teal-400">Languages</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.languages.map(lang => (
                <span key={lang} className="px-3 py-1 bg-[#0A0E27] border border-pink-500/50 rounded text-pink-300 font-mono text-sm hover:border-pink-500 transition-all duration-200">
                  {lang}
                </span>
              ))}
            </div>
          </div>

          {/* Frameworks */}
          <div className="bg-[#1A1B26] border-2 border-pink-500 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Wrench className="w-5 h-5 text-teal-400" />
              <h3 className="text-xl font-bold font-mono text-pink-400">Frameworks</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.frameworks.map(framework => (
                <span key={framework} className="px-3 py-1 bg-[#0A0E27] border border-teal-500/50 rounded text-teal-300 font-mono text-sm hover:border-teal-500 transition-all duration-200">
                  {framework}
                </span>
              ))}
            </div>
          </div>

          {/* Tools */}
          <div className="bg-[#1A1B26] border-2 border-pink-500 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Wrench className="w-5 h-5 text-pink-400" />
              <h3 className="text-xl font-bold font-mono text-teal-400">Tools & Technologies</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.tools.map(tool => (
                <span key={tool} className="px-3 py-1 bg-[#0A0E27] border border-pink-500/50 rounded text-pink-300 font-mono text-sm hover:border-pink-500 transition-all duration-200">
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div className="bg-[#1A1B26] border-2 border-teal-500 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-5 h-5 text-teal-400" />
              <h3 className="text-xl font-bold font-mono text-pink-400">Interests</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.interests.map(interest => (
                <span key={interest} className="px-3 py-1 bg-[#0A0E27] border border-teal-500/50 rounded text-teal-300 font-mono text-sm hover:border-teal-500 transition-all duration-200">
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Fun Fact */}
        <div className="bg-[#1A1B26] border-2 border-pink-500/30 rounded-lg p-6 font-mono">
          <div className="flex items-start gap-3">
            <span className="text-3xl">🎮</span>
            <div>
              <h3 className="text-teal-400 font-bold mb-2">Fun Fact:</h3>
              <p className="text-gray-300">
                My favorite debugging method? Explaining the problem to my rubber duck collection. They're great listeners and never judge my code! 🦆
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;