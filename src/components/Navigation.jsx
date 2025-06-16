import { useState, useEffect } from 'react';
import { Link, useLocation, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navPosition, setNavPosition] = useState({ top: 0, isTransitioning: false });
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle mobile viewport height changes for smooth nav repositioning
  useEffect(() => {
    let lastViewportHeight = window.visualViewport?.height || window.innerHeight;
    let lastScrollTop = window.scrollY;
    let repositionTimeout;
    let isScrolling = false;
    let scrollTimeout;

    const handleViewportChange = () => {
      const currentViewportHeight = window.visualViewport?.height || window.innerHeight;
      const heightDifference = Math.abs(currentViewportHeight - lastViewportHeight);
      const currentScrollTop = window.scrollY;
      
      // Detect if this is likely a mobile browser UI change vs user scrolling
      const isLikelyBrowserUI = heightDifference > 50 && Math.abs(currentScrollTop - lastScrollTop) < 10;
      
      if (isLikelyBrowserUI && !isScrolling) {
        setNavPosition(prev => ({ 
          ...prev, 
          isTransitioning: true,
          top: 0 // Always reset to top
        }));
        
        // Clear any existing timeout
        clearTimeout(repositionTimeout);
        
        // Reset transition state after animation completes
        repositionTimeout = setTimeout(() => {
          setNavPosition(prev => ({ ...prev, isTransitioning: false }));
        }, 300);
        
        lastViewportHeight = currentViewportHeight;
      }
      
      lastScrollTop = currentScrollTop;
    };

    const handleScroll = () => {
      isScrolling = true;
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
      }, 150);
    };

    // Use Visual Viewport API if available (better for mobile)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        window.visualViewport.removeEventListener('resize', handleViewportChange);
        window.removeEventListener('scroll', handleScroll);
        clearTimeout(repositionTimeout);
        clearTimeout(scrollTimeout);
      };
    } else {
      // Fallback for browsers without Visual Viewport API
      window.addEventListener('resize', handleViewportChange);
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        window.removeEventListener('resize', handleViewportChange);
        window.removeEventListener('scroll', handleScroll);
        clearTimeout(repositionTimeout);
        clearTimeout(scrollTimeout);
      };
    }
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const menuItems = [
    { path: '/archives', label: 'Archives' },
    { path: '/capabilities', label: 'Capabilities' },
    { path: '/connect', label: "Connect" }
  ];

  return (
    <header 
      className={`fixed left-0 right-0 z-[9999] w-full ${
        navPosition.isTransitioning 
          ? 'navbar-smooth-reposition' 
          : ''
      }`}
      style={{
        top: navPosition.top
      }}
    >
      <nav 
        className="w-full transition-all duration-500 relative"
      >
        {/* Semi-transparent overlay for better text readability */}
        <div className={`absolute inset-0 bg-ink/5 backdrop-blur-sm transition-opacity duration-500 ${
          isScrolled ? 'opacity-100' : 'opacity-0'
        }`} />

        <div className="relative z-[9999] w-full">
          <div className="w-full px-6 lg:px-12">
            <div className="flex items-center justify-between h-[72px]">
              {/* Desktop Navigation with Logo */}
              <div className="hidden md:grid grid-cols-4 w-full gap-8 lg:gap-12">
                {/* Logo */}
                <Link
                  to="/"
                  className="group relative font-header font-black text-xl uppercase tracking-wider text-[#ffec00] text-center"
                >
                  <span className="relative z-10 group-hover:text-[#f27127] leading-none">
                    JORDAN NGUYEN
                  </span>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-0 text-[#ff3333] opacity-0 mix-blend-screen transition-all duration-75 transform group-hover:opacity-60 group-hover:animate-gentle-static-layer1 leading-none"
                  >
                    JORDAN NGUYEN
                  </span>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-0 text-[#3333ff] opacity-0 mix-blend-screen transition-all duration-75 transform group-hover:opacity-60 group-hover:animate-gentle-static-layer2 leading-none"
                  >
                    JORDAN NGUYEN
                  </span>
                </Link>

                {/* Navigation Items */}
                {menuItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className="group relative font-header font-bold text-lg uppercase tracking-wider text-white text-center"
                  >
                    <span className="relative z-10 group-hover:text-[#f27127] leading-none">
                      {item.label}
                    </span>
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 z-0 text-[#ff3333] opacity-0 mix-blend-screen transition-all duration-75 transform group-hover:opacity-60 group-hover:animate-gentle-static-layer1 leading-none"
                    >
                      {item.label}
                    </span>
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 z-0 text-[#3333ff] opacity-0 mix-blend-screen transition-all duration-75 transform group-hover:opacity-60 group-hover:animate-gentle-static-layer2 leading-none"
                    >
                      {item.label}
                    </span>
                  </NavLink>
                ))}
              </div>

              {/* Mobile Logo */}
              <div className="md:hidden">
                <Link
                  to="/"
                  className="group relative font-header font-black text-xl uppercase tracking-wider text-[#ffec00]"
                >
                  <span className="relative z-10 group-hover:text-[#f27127] leading-none">
                    JORDAN NGUYEN
                  </span>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-0 text-[#ff3333] opacity-0 mix-blend-screen transition-all duration-75 transform group-hover:opacity-60 group-hover:animate-gentle-static-layer1 leading-none"
                  >
                    JORDAN NGUYEN
                  </span>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-0 text-[#3333ff] opacity-0 mix-blend-screen transition-all duration-75 transform group-hover:opacity-60 group-hover:animate-gentle-static-layer2 leading-none"
                  >
                    JORDAN NGUYEN
                  </span>
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button 
                  className="relative z-[9999] w-12 h-12 flex items-center justify-center focus:outline-none transition-colors duration-300"
                  aria-label="Toggle menu"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <div className="relative w-6 h-4">
                    <span 
                      className={`absolute w-6 h-0.5 bg-sand transform transition-all duration-300 ease-in-out ${
                        isMobileMenuOpen ? 'rotate-45 top-2' : 'top-0'
                      }`}
                    />
                    <span 
                      className={`absolute w-6 h-0.5 bg-sand transform transition-all duration-300 ease-in-out ${
                        isMobileMenuOpen ? 'opacity-0' : 'top-2'
                      }`}
                    />
                    <span 
                      className={`absolute w-6 h-0.5 bg-sand transform transition-all duration-300 ease-in-out ${
                        isMobileMenuOpen ? '-rotate-45 top-2' : 'top-4'
                      }`}
                    />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence mode="wait">
          {isMobileMenuOpen && (
            <>
              {/* Black background that extends under the nav */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ 
                  duration: 0.3,
                  ease: [0.32, 0.72, 0, 1]
                }}
                className="fixed top-0 left-0 right-0 h-[72px] bg-ink z-[9997]"
              />
              {/* Main menu content */}
              <motion.div
                initial={{ opacity: 0, y: "-100%" }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: "-100%" }}
                transition={{ 
                  duration: 0.5,
                  ease: [0.32, 0.72, 0, 1],
                  opacity: { 
                    duration: 0.3,
                    ease: [0.32, 0.72, 0, 1]
                  }
                }}
                className="fixed inset-0 bg-ink z-[9997]"
              >
                <motion.div 
                  className="h-full flex flex-col pt-[72px]"
                  initial="closed"
                  animate="open"
                  exit="closed"
                  variants={{
                    open: {
                      transition: {
                        staggerChildren: 0.05,
                        delayChildren: 0.1,
                        ease: [0.32, 0.72, 0, 1]
                      }
                    },
                    closed: {
                      transition: {
                        staggerChildren: 0.03,
                        staggerDirection: -1,
                        ease: [0.32, 0.72, 0, 1]
                      }
                    }
                  }}
                >
                  <div className="flex-1 overflow-y-auto py-12">
                    <div className="container mx-auto px-6">
                      {menuItems.map((item, index) => (
                        <motion.div
                          key={item.path}
                          variants={{
                            open: { 
                              opacity: 1, 
                              y: 0,
                              transition: {
                                duration: 0.4,
                                ease: [0.32, 0.72, 0, 1]
                              }
                            },
                            closed: { 
                              opacity: 0, 
                              y: 20,
                              transition: {
                                duration: 0.3,
                                ease: [0.32, 0.72, 0, 1]
                              }
                            }
                          }}
                          className="mb-8"
                        >
                          <NavLink
                            to={item.path}
                            className="group block"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <div className="relative overflow-hidden py-6">
                              <motion.div
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                transition={{ 
                                  delay: index * 0.05,
                                  duration: 0.4,
                                  ease: [0.32, 0.72, 0, 1]
                                }}
                                className="relative"
                              >
                                <span className="font-header font-bold text-3xl uppercase tracking-wider text-sand group-hover:text-[#f27127] transition-colors duration-300">
                                  {item.label}
                                </span>
                              </motion.div>
                            </div>
                          </NavLink>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Footer Info */}
                  <motion.div
                    variants={{
                      open: { 
                        opacity: 1, 
                        y: 0,
                        transition: {
                          duration: 0.4,
                          ease: [0.32, 0.72, 0, 1],
                          delay: 0.2
                        }
                      },
                      closed: { 
                        opacity: 0, 
                        y: 20,
                        transition: {
                          duration: 0.3,
                          ease: [0.32, 0.72, 0, 1]
                        }
                      }
                    }}
                    className="border-t border-sand/10 py-8 px-6"
                  >
                    <div className="font-martian-mono text-base text-sand/60">
                      Based in SLC, UT
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Navigation; 