import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FileText,
  FolderGit2,
  Home,
  User,
  Briefcase,
  GraduationCap,
  BookOpen,
  Camera,
  Command as CommandIcon,
  TerminalSquare,
  Mail,
  Github,
  Linkedin,
  Clock3,
  FlaskConical,
  Rss,
} from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { getProfile } from '@/services/sanityClient';

const RECENT_STORAGE_KEY = 'ashmayo_command_palette_recent';
const MAX_RECENTS = 6;

const CommandPalette = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [recentIds, setRecentIds] = useState([]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    const raw = localStorage.getItem(RECENT_STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setRecentIds(parsed);
      }
    } catch (error) {
      console.error('Failed to parse recent command history:', error);
    }
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfileData(data || null);
      } catch (error) {
        console.error('Failed to fetch profile for command palette:', error);
      }
    };
    fetchProfile();
  }, []);

  const recordRecent = (id) => {
    setRecentIds((prev) => {
      const next = [id, ...prev.filter((item) => item !== id)].slice(0, MAX_RECENTS);
      localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const runCommand = (command) => {
    setOpen(false);
    recordRecent(command.id);
    command.action();
  };

  const navCommands = useMemo(
    () => [
      { id: 'nav-home', label: 'Go: Home', path: '/', icon: Home, action: () => navigate('/') },
      { id: 'nav-about', label: 'Go: About', path: '/about', icon: User, action: () => navigate('/about') },
      { id: 'nav-exp', label: 'Go: Experience', path: '/about#experience', icon: Briefcase, action: () => navigate('/about#experience') },
      { id: 'nav-edu', label: 'Go: Education', path: '/about#education', icon: GraduationCap, action: () => navigate('/about#education') },
      { id: 'nav-projects', label: 'Go: Projects', path: '/projects', icon: FolderGit2, action: () => navigate('/projects') },
      { id: 'nav-blog', label: 'Go: Blog', path: '/blog', icon: BookOpen, action: () => navigate('/blog') },
      { id: 'nav-lab', label: 'Go: Lab', path: '/lab', icon: FlaskConical, action: () => navigate('/lab') },
      { id: 'nav-log', label: 'Go: Log (Microblog)', path: '/lab#log', icon: Rss, action: () => navigate('/lab#log') },
      { id: 'nav-gallery', label: 'Go: Gallery', path: '/lab#gallery', icon: Camera, action: () => navigate('/lab#gallery') },
    ],
    [navigate],
  );

  const actionCommands = useMemo(
    () => [
      { id: 'action-resume', label: 'Open Resume', icon: FileText, action: () => navigate('/about?resume=1') },
      { id: 'action-terminal', label: 'Open Terminal', icon: TerminalSquare, action: () => window.dispatchEvent(new Event('ashmayo:open-terminal')) },
    ],
    [navigate],
  );

  const socialCommands = useMemo(() => {
    const commands = [];
    if (profileData?.email) {
      commands.push({
        id: 'social-email',
        label: 'Contact: Email',
        icon: Mail,
        path: profileData.email,
        action: () => {
          window.location.href = `mailto:${profileData.email}`;
        },
      });
    }
    if (profileData?.github) {
      commands.push({
        id: 'social-github',
        label: 'Open: GitHub',
        icon: Github,
        path: 'github',
        action: () => window.open(profileData.github, '_blank', 'noopener,noreferrer'),
      });
    }
    if (profileData?.linkedin) {
      commands.push({
        id: 'social-linkedin',
        label: 'Open: LinkedIn',
        icon: Linkedin,
        path: 'linkedin',
        action: () => window.open(profileData.linkedin, '_blank', 'noopener,noreferrer'),
      });
    }
    return commands;
  }, [profileData]);

  const allCommands = useMemo(
    () => [...navCommands, ...actionCommands, ...socialCommands],
    [navCommands, actionCommands, socialCommands],
  );

  const recentCommands = useMemo(() => {
    const commandMap = new Map(allCommands.map((command) => [command.id, command]));
    return recentIds.map((id) => commandMap.get(id)).filter(Boolean);
  }, [allCommands, recentIds]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 font-mono text-[10px] leading-none"
        style={{
          background: 'var(--card)',
          border: '1px solid var(--cyan-dim)',
          color: 'var(--cyan)',
        }}
        aria-label="Open command palette"
        title="Open command palette (Cmd/Ctrl + K)"
      >
        <CommandIcon className="h-3 w-3" />
        <span style={{ color: 'var(--pink-soft)' }}>⌘K</span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl overflow-hidden border border-pink-500/60 bg-[#0A0E27] p-0 shadow-[0_0_0_1px_rgba(94,243,243,0.2)]">
          <Command className="rounded-none border border-teal-500/30 bg-[#0A0E27] text-gray-100">
            <CommandInput
              placeholder="Type a command or path..."
              className="font-mono text-sm text-teal-200 placeholder:text-gray-500"
            />
            <CommandList className="max-h-[360px]">
              <CommandEmpty className="font-mono text-sm text-gray-400">No results found.</CommandEmpty>

              {recentCommands.length > 0 && (
                <>
                  <CommandGroup heading="Recent">
                    {recentCommands.map((command) => {
                      const Icon = command.icon;
                      return (
                        <CommandItem
                          key={command.id}
                          value={`${command.label} ${command.path || ''}`}
                          onSelect={() => runCommand(command)}
                          className="font-mono text-sm data-[selected=true]:bg-pink-500/20 data-[selected=true]:text-teal-200"
                        >
                          <Clock3 className="h-4 w-4 text-pink-300" />
                          <span>{command.label}</span>
                          {command.path && (
                            <CommandShortcut className="text-gray-500">{command.path}</CommandShortcut>
                          )}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                  <CommandSeparator className="bg-teal-500/20" />
                </>
              )}

              <CommandGroup heading="Navigation">
                {navCommands.map((command) => {
                  const Icon = command.icon;
                  const active = command.path.split('#')[0] === location.pathname;

                  return (
                    <CommandItem
                      key={command.id}
                      value={`${command.label} ${command.path}`}
                      onSelect={() => runCommand(command)}
                      className="font-mono text-sm data-[selected=true]:bg-pink-500/20 data-[selected=true]:text-teal-200"
                    >
                      <Icon className="h-4 w-4 text-teal-300" />
                      <span>{command.label}</span>
                      <CommandShortcut className={active ? 'text-pink-300' : 'text-gray-500'}>{command.path}</CommandShortcut>
                    </CommandItem>
                  );
                })}
              </CommandGroup>

              <CommandSeparator className="bg-teal-500/20" />

              <CommandGroup heading="Actions">
                {actionCommands.map((command) => {
                  const Icon = command.icon;
                  return (
                    <CommandItem
                      key={command.id}
                      value={command.label}
                      onSelect={() => runCommand(command)}
                      className="font-mono text-sm data-[selected=true]:bg-pink-500/20 data-[selected=true]:text-teal-200"
                    >
                      <Icon className="h-4 w-4 text-pink-300" />
                      <span>{command.label}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>

              {socialCommands.length > 0 && (
                <>
                  <CommandSeparator className="bg-teal-500/20" />
                  <CommandGroup heading="Social">
                    {socialCommands.map((command) => {
                      const Icon = command.icon;
                      return (
                        <CommandItem
                          key={command.id}
                          value={`${command.label} ${command.path || ''}`}
                          onSelect={() => runCommand(command)}
                          className="font-mono text-sm data-[selected=true]:bg-pink-500/20 data-[selected=true]:text-teal-200"
                        >
                          <Icon className="h-4 w-4 text-pink-300" />
                          <span>{command.label}</span>
                          {command.path && (
                            <CommandShortcut className="text-gray-500">{command.path}</CommandShortcut>
                          )}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CommandPalette;
