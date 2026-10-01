import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Visibility
      if (window.pageYOffset > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      // Progress
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.pageYOffset / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (scrollProgress / 100) * circumference;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20, rotate: -45 }}
          animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20, rotate: 45 }}
          whileHover={{ scale: 1.1, y: -5 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="scroll-to-top-btn"
          aria-label="Voltar ao topo"
        >
          <div className="scroll-btn-inner">
            <svg className="scroll-progress-ring" width="50" height="50">
              <circle
                className="progress-ring-bg"
                stroke="rgba(0, 229, 255, 0.1)"
                strokeWidth="2"
                fill="transparent"
                r={radius}
                cx="25"
                cy="25"
              />
              <motion.circle
                className="progress-ring-fill"
                stroke="var(--cyan)"
                strokeWidth="2"
                strokeDasharray={circumference}
                animate={{ strokeDashoffset: offset }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                strokeLinecap="round"
                fill="transparent"
                r={radius}
                cx="25"
                cy="25"
              />
            </svg>
            <ChevronUp size={20} className="scroll-icon" />
            <div className="scroll-glow"></div>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
};
