import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Terminal, Home, User, Briefcase, GraduationCap, FolderGit2, FileText, BookOpen } from 'lucide-react';

const TerminalNav = () => {
  const location = useLocation();
  const [hovered, setHovered] = useState(null);

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/about', label: 'About', icon: User },
    { path: '/experience', label: 'Experience', icon: Briefcase },
    { path: '/education', label: 'Education', icon: GraduationCap },
    { path: '/projects', label: 'Projects', icon: FolderGit2 },
    { path: '/blog', label: 'Blog', icon: BookOpen },
    { path: '/resume', label: 'Resume', icon: FileText },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0E27]/95 backdrop-blur-sm border-b-2 border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.2)]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-pink-400 hover:text-teal-400 transition-colors">
            <Terminal className="w-6 h-6" />
            <span className="font-mono text-lg font-bold">$portfolio</span>
          </Link>

          {/* Nav Items */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onMouseEnter={() => setHovered(item.path)}
                  onMouseLeave={() => setHovered(null)}
                  className={`relative px-4 py-2 font-mono text-sm flex items-center gap-2 transition-all duration-200 ${
                    isActive 
                      ? 'text-teal-400' 
                      : 'text-pink-300 hover:text-pink-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-500 to-teal-500 animate-pulse"></span>
                  )}
                  {hovered === item.path && !isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500/50"></span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TerminalNav;