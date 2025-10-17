import React from 'react';
import { Github, Linkedin, Mail, Heart } from 'lucide-react';
import { profileData } from '../data/mock';

const Footer = () => {
  return (
    <footer className="bg-[#0A0E27] border-t-2 border-pink-500 py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Copyright */}
          <div className="text-gray-400 font-mono text-sm">
            <div className="flex items-center gap-2">
              © {new Date().getFullYear()} {profileData.name}
              <span className="text-pink-400">•</span>
              Made with <Heart className="w-4 h-4 text-pink-400 inline" /> and lots of ☕
            </div>
          </div>

          {/* Social Links */}
          <div className="flex gap-4">
            <a
              href={`mailto:${profileData.email}`}
              className="p-2 bg-[#1A1B26] border border-pink-500 rounded hover:bg-pink-500/10 transition-all duration-200"
              aria-label="Email"
            >
              <Mail className="w-5 h-5 text-pink-400" />
            </a>
            <a
              href={`https://${profileData.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-[#1A1B26] border border-teal-500 rounded hover:bg-teal-500/10 transition-all duration-200"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5 text-teal-400" />
            </a>
            <a
              href={`https://${profileData.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-[#1A1B26] border border-pink-500 rounded hover:bg-pink-500/10 transition-all duration-200"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5 text-pink-400" />
            </a>
          </div>
        </div>

        {/* Easter Egg */}
        <div className="text-center mt-6">
          <p className="text-gray-500 font-mono text-xs">
            <span className="text-teal-400">// </span>
            Powered by retro vibes and pixel dreams 👾
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;