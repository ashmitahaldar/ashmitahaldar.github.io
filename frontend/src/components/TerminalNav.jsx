import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Terminal, Home, User, Briefcase, GraduationCap, FolderGit2, BookOpen, Menu, X } from 'lucide-react';
import CommandPalette from './CommandPalette';

const TerminalNav = () => {
  const location = useLocation();
  const [hovered, setHovered] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/about', label: 'About', icon: User },
    { path: '/experience', label: 'Experience', icon: Briefcase },
    { path: '/education', label: 'Education', icon: GraduationCap },
    { path: '/projects', label: 'Projects', icon: FolderGit2 },
    { path: '/blog', label: 'Blog', icon: BookOpen },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0E27]/95 backdrop-blur-sm border-b-2 border-pink-500">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-pink-400 hover:text-teal-400 transition-colors">
            <Terminal className="w-6 h-6" />
            <span className="font-mono text-lg font-bold">ashmita.haldar</span>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onMouseEnter={() => setHovered(item.path)}
                  onMouseLeave={() => setHovered(null)}
                  className={`relative px-4 py-2 font-mono text-sm flex items-center gap-2 transition-colors ${
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

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1 font-mono text-[10px] text-teal-300/90 border border-teal-500/25 px-1.5 py-0.5 leading-none">
              <span className="text-gray-400">shortcut</span>
              <span className="text-pink-300">⌘/Ctrl + K</span>
            </div>
            <CommandPalette />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-pink-400 hover:text-teal-400 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t-2 border-teal-500/30 bg-[#1A1B26] py-2">
            <div className="px-4 py-2 font-mono text-xs text-teal-300">
              Shortcut: <span className="text-pink-300">Cmd/Ctrl + K</span>
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 font-mono text-sm transition-colors ${
                    isActive 
                      ? 'text-teal-400 bg-teal-500/10 border-l-4 border-teal-500' 
                      : 'text-pink-300 hover:text-pink-400 hover:bg-pink-500/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
};

export default TerminalNav;
