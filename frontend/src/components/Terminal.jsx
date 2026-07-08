import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSkills } from '../services/sanityClient';
import { useSnakeGame } from '../hooks/useSnakeGame';

const Terminal = ({ profileData, height = '480px' }) => {
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
  const { gameState, startGame, changeDirection, endGame, renderGame } = useSnakeGame();
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
        const data = await getSkills();
        setSkills(data);
      } catch (error) {
        console.error('Error fetching skills from Sanity:', error);
      }
    };
    fetchSkills();
  }, []);

  useEffect(() => {
    const handleFocusTerminal = () => {
      setTimeout(() => {
        inputRef.current?.focus();
        if (outputRef.current) {
          outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
      }, 0);
    };

    window.addEventListener('ashmayo:focus-terminal', handleFocusTerminal);
    return () => window.removeEventListener('ashmayo:focus-terminal', handleFocusTerminal);
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
  snake          - Play Snake game!
  clear          - Clear the terminal
  echo <text>    - Echo back the text

Navigation Shortcuts:
  /home          - Go to home page
  /about         - Go to about page
  /projects      - Go to projects page
  /experience    - Go to experience (on about)
  /education     - Go to education (on about)
  /blog          - Go to blog posts
  /lab           - Go to the lab
  /log           - Go to the microblog log
  /gallery       - Go to photography & art
  /resume        - Open the resume

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
      const routeMap = {
        '/home':       '/',
        '/about':      '/about',
        '/projects':   '/projects',
        '/experience': '/about#experience',
        '/education':  '/about#education',
        '/blog':       '/blog',
        '/logs':       '/blog',
        '/lab':        '/lab',
        '/log':        '/lab#log',
        '/gallery':    '/lab#gallery',
        '/resume':     '/about?resume=1',
      };
      if (routeMap[route]) {
        setOutput(prev => [...prev, { type: 'success', text: `Navigating to ${route}...` }, { type: 'info', text: '' }]);
        setTimeout(() => navigate(routeMap[route]), 500);
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

    if (command === 'snake') {
      setOutput(prev => [...prev, { type: 'success', text: 'Starting Snake game... Use WASD or Arrow keys to play!' }, { type: 'info', text: '' }]);
      setTimeout(() => startGame(), 100);
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
      setOutput(prev => [...prev, { type: 'output', text: 'about.txt  projects/  blog/  lab/  resume.pdf' }, { type: 'info', text: '' }]);
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
    // Handle Snake game controls
    if (gameState && !gameState.gameOver) {
      if (e.key === 'Escape') {
        endGame();
        setOutput(prev => [...prev, { type: 'info', text: 'Game exited.' }, { type: 'info', text: '' }]);
        return;
      }

      const directionMap = {
        'ArrowUp': 'UP', 'w': 'UP', 'W': 'UP',
        'ArrowDown': 'DOWN', 's': 'DOWN', 'S': 'DOWN',
        'ArrowLeft': 'LEFT', 'a': 'LEFT', 'A': 'LEFT',
        'ArrowRight': 'RIGHT', 'd': 'RIGHT', 'D': 'RIGHT'
      };

      const newDirection = directionMap[e.key];
      if (newDirection) {
        e.preventDefault();
        changeDirection(newDirection);
        return;
      }
    }

    // Exit game if game over
    if (gameState && gameState.gameOver && e.key === 'Escape') {
      const finalScore = gameState.score;
      endGame();
      setOutput(prev => [...prev, { type: 'info', text: `Final Score: ${finalScore}` }, { type: 'info', text: '' }]);
      return;
    }

    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
      // Scroll to bottom after command submission
      setTimeout(() => {
        if (outputRef.current) {
          outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
      }, 0);
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

  // Theme-token colors so the terminal follows light/dark mode.
  const getOutputColor = (type) => {
    switch (type) {
      case 'command': return 'var(--cyan)';
      case 'output': return 'var(--pink-soft)';
      case 'error': return 'var(--red)';
      case 'success': return 'var(--green)';
      default: return 'var(--text-mute)';
    }
  };

  return (
    <div style={{ background: 'var(--card)' }}>
      {/* Terminal Body */}
      <div
        ref={outputRef}
        className="p-4 overflow-y-auto font-mono text-sm scrollbar-thin scrollbar-thumb-pink-500 scrollbar-track-gray-800"
        style={{ height }}
        onClick={() => inputRef.current?.focus()}
        tabIndex={0}
      >
        {/* Snake Game */}
        {gameState && (
          <div className="whitespace-pre mb-4" style={{ color: 'var(--green)' }}>
            {renderGame()}
          </div>
        )}

        {/* Output */}
        {!gameState && output.map((line, index) => (
          <pre key={index} className="mb-1 font-mono text-sm" style={{ color: getOutputColor(line.type) }}>
            {line.text}
          </pre>
        ))}

        {/* Input Line */}
        {!gameState && (
          <div className="flex items-center gap-2" style={{ color: 'var(--cyan)' }}>
            <span>visitor@portfolio:~$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent outline-none"
              style={{ color: 'var(--pink-soft)', caretColor: 'var(--pink)' }}
              spellCheck="false"
            />
            <span className="animate-pulse" style={{ color: 'var(--pink)' }}>▊</span>
          </div>
        )}

        {/* Hidden input for game controls */}
        {gameState && (
          <input
            ref={inputRef}
            type="text"
            className="sr-only"
            onKeyDown={handleKeyDown}
            autoFocus
          />
        )}
      </div>

      {/* Scanline Effect */}
      <div className="scanline"></div>
    </div>
  );
};

export default Terminal;
