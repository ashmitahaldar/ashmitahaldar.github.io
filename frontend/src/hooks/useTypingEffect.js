import { useState, useEffect } from 'react';

// True while react-snap is prerendering (it sets this UA). We skip the
// typewriter then so the static HTML captures the full text — otherwise
// crawlers would see a half-typed heading.
const PRERENDER =
  typeof navigator !== 'undefined' && navigator.userAgent === 'ReactSnap';

export const useTypingEffect = (text, speed = 50, delay = 0) => {
  const [displayedText, setDisplayedText] = useState(PRERENDER ? text : '');
  const [isComplete, setIsComplete] = useState(PRERENDER);

  useEffect(() => {
    if (PRERENDER) {
      setDisplayedText(text);
      setIsComplete(true);
      return undefined;
    }

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
