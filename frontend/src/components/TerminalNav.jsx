import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, User, Briefcase, GraduationCap, FolderGit2, BookOpen, Menu, X } from 'lucide-react';
import CommandPalette from './CommandPalette';

const navItems = [
  { path: '/',           label: 'Home',       Icon: Home },
  { path: '/about',      label: 'About',      Icon: User },
  { path: '/experience', label: 'Experience', Icon: Briefcase },
  { path: '/education',  label: 'Education',  Icon: GraduationCap },
  { path: '/projects',   label: 'Projects',   Icon: FolderGit2 },
  { path: '/blog',       label: 'Blog',       Icon: BookOpen },
];

export default function TerminalNav() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* 4px accent bar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 51,
        height: 4,
        background: 'linear-gradient(90deg, transparent 0%, var(--pink) 8%, var(--pink) 92%, transparent 100%)',
        boxShadow: '0 0 24px var(--pink-glow)',
      }} />

      {/* Nav */}
      <nav style={{
        position: 'fixed', top: 4, left: 0, right: 0, zIndex: 50,
        background: 'rgba(8, 8, 26, 0.88)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 61, 140, 0.08)',
      }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 clamp(16px, 4vw, 48px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>

            {/* Brand */}
            <Link
              to="/"
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                fontFamily: 'var(--mono)', fontWeight: 600, fontSize: 15,
                letterSpacing: '-0.01em', textDecoration: 'none',
              }}
            >
              <span style={{ color: 'var(--cyan)' }}>{'>_'}</span>
              <span style={{ color: 'var(--pink)' }}>ashmita.haldar</span>
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex" style={{ alignItems: 'center', gap: 'clamp(10px, 2vw, 28px)' }}>
              {navItems.map(({ path, label, Icon }) => {
                const isActive = location.pathname === path;
                return (
                  <Link
                    key={path}
                    to={path}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 7,
                      fontFamily: 'var(--mono)', fontSize: 13.5,
                      color: isActive ? 'var(--cyan)' : 'var(--text-mute)',
                      textDecoration: 'none', padding: '6px 4px',
                      position: 'relative',
                      transition: 'color 0.18s',
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = 'var(--text)'; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = 'var(--text-mute)'; }}
                  >
                    <Icon style={{ width: 14, height: 14, opacity: 0.9 }} />
                    <span>{label}</span>
                    {isActive && (
                      <span style={{
                        position: 'absolute', inset: 'auto 4px -10px 4px',
                        height: 2, background: 'var(--cyan)',
                        boxShadow: '0 0 12px var(--cyan-dim)',
                        borderRadius: 1,
                      }} />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right: shortcut badge + command palette + mobile toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div className="hidden md:flex" style={{
                alignItems: 'center', gap: 8,
                padding: '6px 10px',
                border: '1px solid rgba(255, 61, 140, 0.18)',
                borderRadius: 6,
                color: 'var(--text-dim)', fontSize: '11.5px',
                fontFamily: 'var(--mono)',
              }}>
                <span>shortcut</span>
                <kbd style={{
                  font: 'inherit', padding: '2px 6px', borderRadius: 4,
                  background: 'rgba(255, 61, 140, 0.1)',
                  color: 'var(--pink-soft)',
                }}>⌘K</kbd>
              </div>

              <CommandPalette />

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden"
                style={{
                  padding: 8, background: 'transparent', border: 'none', cursor: 'pointer',
                  color: 'var(--pink)',
                }}
              >
                {mobileOpen ? <X style={{ width: 22, height: 22 }} /> : <Menu style={{ width: 22, height: 22 }} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div
            className="md:hidden"
            style={{
              borderTop: '1px solid rgba(45,212,191,0.15)',
              background: 'var(--card-2)',
              padding: '8px 0',
            }}
          >
            <div style={{
              padding: '8px 20px',
              fontFamily: 'var(--mono)', fontSize: 11,
              color: 'var(--text-dim)',
            }}>
              shortcut: <span style={{ color: 'var(--pink-soft)' }}>⌘K</span>
            </div>
            {navItems.map(({ path, label, Icon }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 20px',
                    fontFamily: 'var(--mono)', fontSize: 13.5,
                    color: isActive ? 'var(--cyan)' : 'var(--text-mute)',
                    textDecoration: 'none',
                    borderLeft: isActive ? '3px solid var(--cyan)' : '3px solid transparent',
                    background: isActive ? 'rgba(45,212,191,0.06)' : 'transparent',
                  }}
                >
                  <Icon style={{ width: 15, height: 15 }} />
                  <span>{label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </nav>
    </>
  );
}
