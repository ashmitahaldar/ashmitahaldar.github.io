import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for making elements resizable
 * @param {Object} initialSize - Initial dimensions { width, height }
 * @param {Object} constraints - Min/max constraints { minWidth, minHeight, maxWidth, maxHeight }
 * @returns {Object} - { size, resizeHandlers, isResizing }
 */
export const useResizable = (
  initialSize = { width: 800, height: 600 },
  constraints = {}
) => {
  const [size, setSize] = useState(initialSize);
  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = useRef({
    direction: null,
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
  });

  const {
    minWidth = 400,
    minHeight = 300,
    maxWidth = window.innerWidth - 40,
    maxHeight = window.innerHeight - 40,
  } = constraints;

  const handleResizeStart = (e, direction) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    resizeRef.current = {
      direction,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: size.width,
      startHeight: size.height,
    };
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e) => {
      const { direction, startX, startY, startWidth, startHeight } = resizeRef.current;
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;

      if (direction.includes('right')) {
        newWidth = Math.max(minWidth, Math.min(maxWidth, startWidth + deltaX));
      }
      if (direction.includes('left')) {
        newWidth = Math.max(minWidth, Math.min(maxWidth, startWidth - deltaX));
      }
      if (direction.includes('bottom')) {
        newHeight = Math.max(minHeight, Math.min(maxHeight, startHeight + deltaY));
      }
      if (direction.includes('top')) {
        newHeight = Math.max(minHeight, Math.min(maxHeight, startHeight - deltaY));
      }

      setSize({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, minWidth, minHeight, maxWidth, maxHeight]);

  // Generate handlers for all resize directions
  const resizeHandlers = {
    top: (e) => handleResizeStart(e, 'top'),
    right: (e) => handleResizeStart(e, 'right'),
    bottom: (e) => handleResizeStart(e, 'bottom'),
    left: (e) => handleResizeStart(e, 'left'),
    topLeft: (e) => handleResizeStart(e, 'top-left'),
    topRight: (e) => handleResizeStart(e, 'top-right'),
    bottomLeft: (e) => handleResizeStart(e, 'bottom-left'),
    bottomRight: (e) => handleResizeStart(e, 'bottom-right'),
  };

  return {
    size,
    resizeHandlers,
    isResizing,
  };
};
