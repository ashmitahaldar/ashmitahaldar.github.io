import React from 'react';
import Terminal from '../components/Terminal';
import { profileData } from '../data/mock';
import { Github, Linkedin, Mail, MapPin } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Intro Card */}
          <div className="bg-[#1A1B26] border-2 border-teal-500 rounded-lg p-8 shadow-[0_0_30px_rgba(20,184,166,0.2)] hover:shadow-[0_0_40px_rgba(20,184,166,0.3)] transition-all duration-300">
            <div className="flex flex-col items-center text-center">
              {/* Pixelated Avatar */}
              <div className="w-40 h-40 mb-6 relative">
                <div className="w-full h-full bg-gradient-to-br from-pink-500 to-teal-500 rounded-lg p-1">
                  <div className="w-full h-full bg-[#0A0E27] rounded-lg flex items-center justify-center">
                    <div className="text-6xl">👾</div>
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-[#1A1B26] animate-pulse"></div>
              </div>

              {/* Name & Title */}
              <h1 className="text-4xl font-bold font-mono mb-2 bg-gradient-to-r from-pink-400 to-teal-400 bg-clip-text text-transparent">
                {profileData.name}
              </h1>
              <p className="text-teal-400 font-mono text-lg mb-2">{profileData.title}</p>
              <p className="text-pink-300 font-mono text-sm mb-6">{profileData.tagline}</p>

              {/* Bio */}
              <p className="text-gray-300 mb-6 leading-relaxed">
                {profileData.bio}
              </p>

              {/* Location */}
              <div className="flex items-center gap-2 text-gray-400 mb-6">
                <MapPin className="w-4 h-4" />
                <span className="font-mono text-sm">{profileData.location}</span>
              </div>

              {/* Social Links */}
              <div className="flex gap-4">
                <a href={`mailto:${profileData.email}`} className="p-3 bg-[#0A0E27] border-2 border-pink-500 rounded-lg hover:bg-pink-500/10 hover:shadow-[0_0_15px_rgba(236,72,153,0.3)] transition-all duration-200">
                  <Mail className="w-5 h-5 text-pink-400" />
                </a>
                <a href={`https://${profileData.github}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-[#0A0E27] border-2 border-teal-500 rounded-lg hover:bg-teal-500/10 hover:shadow-[0_0_15px_rgba(20,184,166,0.3)] transition-all duration-200">
                  <Github className="w-5 h-5 text-teal-400" />
                </a>
                <a href={`https://${profileData.linkedin}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-[#0A0E27] border-2 border-pink-500 rounded-lg hover:bg-pink-500/10 hover:shadow-[0_0_15px_rgba(236,72,153,0.3)] transition-all duration-200">
                  <Linkedin className="w-5 h-5 text-pink-400" />
                </a>
              </div>
            </div>
          </div>

          {/* Terminal */}
          <div>
            <Terminal />
          </div>
        </div>

        {/* Usage Hint */}
        <div className="bg-[#1A1B26] border-2 border-pink-500/30 rounded-lg p-6 font-mono text-sm">
          <div className="flex items-start gap-3">
            <span className="text-teal-400 text-2xl">💡</span>
            <div>
              <h3 className="text-pink-400 font-bold mb-2">Terminal Tips:</h3>
              <ul className="text-gray-300 space-y-1">
                <li>• Type <code className="text-teal-300">help</code> to see all available commands</li>
                <li>• Use <code className="text-teal-300">UP</code> and <code className="text-teal-300">DOWN</code> arrow keys to cycle through command history</li>
                <li>• Try shortcuts like <code className="text-teal-300">/projects</code> or <code className="text-teal-300">/about</code> to navigate quickly</li>
                <li>• Some commands might have hidden surprises... 👀</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;