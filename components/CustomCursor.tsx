import React, { useEffect, useState } from 'react';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      const target = e.target as HTMLElement;
      const isClickable = target.tagName === 'BUTTON' || 
                          target.tagName === 'A' || 
                          target.closest('button') || 
                          target.closest('a') ||
                          target.classList.contains('cursor-interactive');
      
      setIsPointer(!!isClickable);
    };

    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Hide on mobile/touch devices
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setIsTouch(true);
    }
  }, []);

  if (isTouch) return null;

  return (
    <>
      {/* Main Cursor Dot */}
      <div 
        className="fixed top-0 left-0 w-4 h-4 rounded-full bg-white mix-blend-difference pointer-events-none z-50 transition-transform duration-100 ease-out will-change-transform"
        style={{
          transform: `translate(${position.x - 8}px, ${position.y - 8}px) scale(${isPointer ? 1.5 : 1})`,
        }}
      />
      
      {/* Trailing Ring */}
      <div 
        className={`fixed top-0 left-0 w-8 h-8 rounded-full border border-neon-blue pointer-events-none z-50 transition-all duration-300 ease-out will-change-transform ${isMouseDown ? 'scale-50 bg-neon-blue/20' : ''}`}
        style={{
          transform: `translate(${position.x - 16}px, ${position.y - 16}px) scale(${isPointer ? 1.5 : 1})`,
          opacity: isPointer ? 0.8 : 0.4,
        }}
      />
    </>
  );
};

export default CustomCursor;
