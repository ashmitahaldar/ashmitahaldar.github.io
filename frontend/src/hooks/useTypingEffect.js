import { useState, useEffect } from 'react';

export const useTypingEffect = (text, speed = 50, delay = 0) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let timeout;
    let index = 0;

    const startTyping = () => {
      if (index < text.length) {
        setDisplayedText(text.substring(0, index + 1));
        index++;
        timeout = setTimeout(startTyping, speed);
      } else {
        setIsComplete(true);
      }
    };

    timeout = setTimeout(startTyping, delay);

    return () => clearTimeout(timeout);
  }, [text, speed, delay]);

  return { displayedText, isComplete };
};
