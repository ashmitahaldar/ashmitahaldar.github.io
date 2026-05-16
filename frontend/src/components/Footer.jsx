import React, { useEffect, useState } from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';
import { getProfile } from '../services/sanityClient';

export default function Footer() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    getProfile().then(setProfile).catch(() => {});
  }, []);

  const year = new Date().getFullYear();

  const socials = profile ? [
    { href: profile.email    ? `mailto:${profile.email}` : null, Icon: Mail,     accent: 'pink',  label: 'Email' },
    { href: profile.github   || null,                            Icon: Github,   accent: 'cyan',  label: 'GitHub' },
    { href: profile.linkedin || null,                            Icon: Linkedin, accent: 'pink',  label: 'LinkedIn' },
  ].filter((s) => s.href) : [];

  return (
    <footer style={{ fontFamily: 'var(--mono)' }}>
      {/* Top border — matches nav's bottom border */}
      <div style={{ borderTop: '1px solid rgba(255, 61, 140, 0.08)', background: 'rgba(8, 8, 26, 0.92)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '20px clamp(16px, 4vw, 48px)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>

            {/* Brand + copyright */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: 'var(--cyan)', fontWeight: 600 }}>{'>_'}</span>
              <span style={{ color: 'var(--pink)', fontWeight: 600, fontSize: 15 }}>
                {profile?.name ? profile.name.trim().toLowerCase().replace(/\s+/g, '.') : 'ashmita.haldar'}
              </span>
              <span style={{ color: 'var(--text-faint)' }}>·</span>
              <span style={{ color: 'var(--text-dim)', fontSize: 12 }}>© {year}</span>
            </div>

            {/* Social icon buttons */}
            {socials.length > 0 && (
              <div style={{ display: 'flex', gap: 8 }}>
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target={s.label !== 'Email' ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className={`ds-icon-btn${s.accent === 'cyan' ? ' cyan' : ''}`}
                    style={{ width: 36, height: 36 }}
                  >
                    <s.Icon style={{ width: 16, height: 16 }} />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4px accent bar — mirrors the nav's top bar */}
      <div style={{
        height: 4,
        background: 'linear-gradient(90deg, transparent 0%, var(--pink) 8%, var(--pink) 92%, transparent 100%)',
        boxShadow: '0 0 24px var(--pink-glow)',
      }} />
    </footer>
  );
}
