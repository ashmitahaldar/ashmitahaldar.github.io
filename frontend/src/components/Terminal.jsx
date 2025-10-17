import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const Terminal = ({ profileData }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState([
    { type: 'info', text: '╔═══════════════════════════════════════════════════════╗' },
    { type: 'info', text: '║  Welcome to ' + (profileData?.name || 'Portfolio') + '\'s Portfolio Terminal  ║' },
    { type: 'info', text: '╚═══════════════════════════════════════════════════════╝' },
    { type: 'info', text: '' },
    { type: 'success', text: 'System initialized successfully...' },
    { type: 'info', text: 'Type "help" for available commands' },
    { type: 'info', text: '' }
  ]);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [skills, setSkills] = useState(null);
  const inputRef = useRef(null);
  const outputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  useEffect(() => {
    // Fetch skills for terminal commands
    const fetchSkills = async () => {
      try {
        const response = await api.getSkills();
        setSkills(response.data);
      } catch (error) {
        console.error('Error fetching skills:', error);
      }
    };
    fetchSkills();
  }, []);

  const getTerminalOutput = (command) => {
    switch(command) {
      case 'help':
        return `Available Commands:

  help           - Show this help message
  about          - Learn more about me
  projects       - View my projects
  skills         - Display my technical skills
  contact        - Get my contact information
  clear          - Clear the terminal
  echo <text>    - Echo back the text

Navigation Shortcuts:
  /home          - Go to home page
  /about         - Go to about page
  /projects      - Go to projects page
  /experience    - Go to experience page
  /education     - Go to education page
  /blog          - Go to blog page
  /resume        - Go to resume page

Tips:
  - Use UP/DOWN arrows to cycle through command history
  - Try typing 'sudo' before any command ;)
  - There might be some hidden easter eggs...
    `;
      
      case 'about':
        return `About Me:

${profileData?.name || 'User'}
${profileData?.title || 'Developer'}

${profileData?.bio || 'Bio not available'}

Location: ${profileData?.location || 'N/A'}
Email: ${profileData?.email || 'N/A'}
GitHub: ${profileData?.github || 'N/A'}

Type 'skills' to see my technical skills!
    `;
      
      case 'skills':
        if (!skills) return 'Loading skills...';
        return `Technical Skills:

Languages:
  ${skills.languages?.join(', ') || 'N/A'}

Frameworks:
  ${skills.frameworks?.join(', ') || 'N/A'}

Tools:
  ${skills.tools?.join(', ') || 'N/A'}

Interests:
  ${skills.interests?.join(', ') || 'N/A'}
    `;
      
      case 'contact':
        return `Contact Information:

Email: ${profileData?.email || 'N/A'}
GitHub: ${profileData?.github || 'N/A'}
LinkedIn: ${profileData?.linkedin || 'N/A'}

Feel free to reach out! Always happy to chat about tech, games, or pixel art.
    `;
      
      default:
        return null;
    }
  };

  const handleCommand = (cmd) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return;

    // Add command to history
    setHistory(prev => [...prev, trimmedCmd]);
    setHistoryIndex(-1);

    // Add command to output
    setOutput(prev => [...prev, { type: 'command', text: `visitor@portfolio:~$ ${trimmedCmd}` }]);

    // Process command
    const [command, ...args] = trimmedCmd.toLowerCase().split(' ');

    // Navigation shortcuts
    if (trimmedCmd.startsWith('/')) {
      const route = trimmedCmd.toLowerCase();
      if (['/home', '/about', '/projects', '/experience', '/education', '/blog', '/resume'].includes(route)) {
        setOutput(prev => [...prev, { type: 'success', text: `Navigating to ${route}...` }, { type: 'info', text: '' }]);
        setTimeout(() => {
          if (route === '/home') navigate('/');
          else navigate(route);
        }, 500);
        return;
      } else {
        setOutput(prev => [...prev, { type: 'error', text: `Route not found: ${route}` }, { type: 'info', text: '' }]);
        return;
      }
    }

    // Handle commands
    if (command === 'clear') {
      setOutput([]);
      return;
    }

    if (command === 'echo') {
      const echoText = args.join(' ');
      setOutput(prev => [...prev, { type: 'output', text: echoText || '' }, { type: 'info', text: '' }]);
      return;
    }

    if (command === 'sudo') {
      setOutput(prev => [...prev, { type: 'error', text: 'Nice try! But you don\'t have sudo privileges here 😉' }, { type: 'info', text: '' }]);
      return;
    }

    if (command === 'ls') {
      setOutput(prev => [...prev, { type: 'output', text: 'about.txt  projects/  experience/  education/  blog/  resume.pdf' }, { type: 'info', text: '' }]);
      return;
    }

    if (command === 'whoami') {
      setOutput(prev => [...prev, { type: 'output', text: 'visitor' }, { type: 'info', text: '' }]);
      return;
    }

    if (command === 'pwd') {
      setOutput(prev => [...prev, { type: 'output', text: '/home/visitor/portfolio' }, { type: 'info', text: '' }]);
      return;
    }

    const terminalOutput = getTerminalOutput(command);
    if (terminalOutput) {
      setOutput(prev => [...prev, { type: 'output', text: terminalOutput }, { type: 'info', text: '' }]);
    } else {
      setOutput(prev => [...prev, { type: 'error', text: `Command not found: ${command}. Type 'help' for available commands.` }, { type: 'info', text: '' }]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= history.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIndex);
          setInput(history[newIndex]);
        }
      }
    }
  };

  const getOutputColor = (type) => {
    switch (type) {
      case 'command': return 'text-teal-400';
      case 'output': return 'text-pink-200';
      case 'error': return 'text-red-400';
      case 'success': return 'text-green-400';
      default: return 'text-gray-300';
    }
  };

  return (
    <div className="w-full h-full bg-[#0A0E27] border-4 border-pink-500 rounded-lg overflow-hidden">
      {/* Terminal Header */}
      <div className="bg-gradient-to-r from-pink-600 to-teal-600 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <span className="text-white text-sm font-mono">portfolio-terminal</span>
        <div className="w-16"></div>
      </div>

      {/* Terminal Body */}
      <div 
        ref={outputRef}
        className="p-4 h-[450px] overflow-y-auto font-mono text-sm scrollbar-thin scrollbar-thumb-pink-500 scrollbar-track-gray-800"
        onClick={() => inputRef.current?.focus()}
      >
        {/* Output */}
        {output.map((line, index) => (
          <div key={index} className={`${getOutputColor(line.type)} whitespace-pre-wrap mb-1`}>
            {line.text}
          </div>
        ))}

        {/* Input Line */}
        <div className="flex items-center gap-2 text-teal-400">
          <span>visitor@portfolio:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-pink-300 caret-pink-400"
            autoFocus
            spellCheck="false"
          />
          <span className="animate-pulse text-pink-400">▊</span>
        </div>
      </div>

      {/* Scanline Effect */}
      <div className="scanline"></div>
    </div>
  );
};

export default Terminal;