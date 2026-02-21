import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STORAGE_KEY = 'cookie-consent';

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(STORAGE_KEY, 'declined');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.4, ease: [0.215, 0.61, 0.355, 1] }}
          className="fixed bottom-12 sm:bottom-14 left-3 sm:left-6 z-50 max-w-[calc(100vw-1.5rem)] sm:max-w-sm"
        >
          <div className="bg-ink border border-sand/10 rounded-xl p-4 sm:p-5 shadow-2xl backdrop-blur-sm">
            <p className="font-subheader text-[11px] sm:text-xs text-sand/70 leading-relaxed mb-4">
              This site uses cookies to understand how you interact with it.{' '}
              <a
                href="https://www.cookiesandyou.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sand/50 underline underline-offset-2 hover:text-sand/80 transition-colors duration-300"
              >
                Learn more
              </a>
              .
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={handleAccept}
                className="font-header font-bold text-[10px] sm:text-xs uppercase tracking-wider text-ink bg-sand px-4 py-2 rounded-lg hover:bg-sand/80 transition-colors duration-300 whitespace-nowrap"
              >
                Accept
              </button>
              <button
                onClick={handleDecline}
                className="font-header font-bold text-[10px] sm:text-xs uppercase tracking-wider text-sand/50 hover:text-sand/80 transition-colors duration-300 whitespace-nowrap"
              >
                Decline
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieBanner;
