import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BrandPartnerships = () => {
  const [hoveredLogo, setHoveredLogo] = useState(null);
  const [animationDuration, setAnimationDuration] = useState(300);
  const [isMobile, setIsMobile] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const updateSpeed = () => {
      const width = window.innerWidth;
      const mobile = width < 768;
      setIsMobile(mobile);
      
      if (width < 640) {
        // Much slower on small mobile devices
        setAnimationDuration(120);
      } else if (width < 768) {
        // Slower on larger mobile/small tablets
        setAnimationDuration(80);
      } else if (width < 1024) {
        setAnimationDuration(60);
      } else if (width < 1440) {
        setAnimationDuration(45);
      } else {
        setAnimationDuration(35);
      }
    };

    updateSpeed();
    window.addEventListener('resize', updateSpeed);
    return () => window.removeEventListener('resize', updateSpeed);
  }, []);

  // Logo configurations with deep links
  const logos = [
    { 
      file: 'partnerlogos__VEEFRIENDS.svg',
      name: 'VeeFriends',
      link: '/archives#project-veefriends'
    },
    { 
      file: 'partnerlogos__SPACESTATION.svg',
      name: 'Spacestation',
      link: '/archives#project-the-spacestation-2020'
    },
    { 
      file: 'partnerlogos__NBCUNIVERSAL.svg',
      name: 'NBC Universal',
      link: '/archives/spacestation-animation#2'
    },
    { 
      file: 'partnerlogos__SAOHOUSE.svg',
      name: 'SAO House',
      link: '/archives#project-sao-2025'
    },
    { 
      file: 'partnerlogos__HIGHTIMES.svg',
      name: 'High Times',
      link: '/archives#project-high-times-2024'
    },
    { 
      file: 'partnerlogos__TAKASHIMURAKAMI.svg',
      name: 'Takashi Murakami',
      link: '/archives/quarter-machine#major-works'
    },
    { 
      file: 'partnerlogos__SNOOPDOGG.svg',
      name: 'Snoop Dogg',
      link: '/archives/quarter-machine#major-works'
    },
    { 
      file: 'partnerlogos__RTFKT.svg',
      name: 'RTFKT',
      link: '/archives/quarter-machine#major-works'
    }
  ];

  // Duplicate logos for seamless loop - fewer on mobile for better performance
  const duplicatedLogos = isMobile 
    ? [...logos, ...logos] // Only double on mobile
    : [...logos, ...logos, ...logos]; // Triple on desktop

  const handleLogoMouseMove = (e, uniqueId) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // More movement for floaty effect (max 15px in any direction)
    const moveX = (x / rect.width) * 15;
    const moveY = (y / rect.height) * 15;
    
    e.currentTarget.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
  };

  const handleLogoMouseLeave = (e) => {
    e.currentTarget.style.transform = 'translate(0, 0) scale(1)';
  };

  return (
    <section className="w-full bg-ink py-8 sm:py-10 md:py-12 lg:py-16 overflow-hidden">
      <div className="max-w-[2400px] mx-auto px-6 lg:px-12">
        <div className="text-center mb-1.5">
          <h2 className="font-display font-black text-[2rem] sm:text-[3rem] md:text-[4rem] lg:text-[5.5rem] tracking-[0em] leading-[1.1] text-sand uppercase">
            BRAND PARTNERSHIPS
          </h2>
        </div>

        {/* Carousel Container */}
        <div className="relative w-full -mx-6 lg:-mx-12 overflow-hidden">
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-[25%] min-w-[200px] bg-gradient-to-r from-ink from-20% via-ink/95 via-40% to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-[25%] min-w-[200px] bg-gradient-to-l from-ink from-20% via-ink/95 via-40% to-transparent z-10 pointer-events-none" />

          {/* Scrolling Logos */}
          <div className="relative py-4 sm:py-6">
            <div 
              className="marquee-wrapper"
              onTouchStart={() => setIsPaused(true)}
              onTouchEnd={() => setIsPaused(false)}
            >
              <div 
                className="marquee-content"
                style={{ 
                  animationDuration: `${animationDuration}s`,
                  animationPlayState: isPaused ? 'paused' : 'running'
                }}
              >
                {duplicatedLogos.map((logo, index) => {
                  const uniqueId = `${logo.file}-${index}`;
                  
                  return (
                    <a
                      key={uniqueId}
                      href={logo.link}
                      className="logo-item"
                      style={{ pointerEvents: 'auto' }}
                      onMouseMove={(e) => handleLogoMouseMove(e, uniqueId)}
                      onMouseEnter={() => setHoveredLogo(uniqueId)}
                      onMouseLeave={(e) => {
                        handleLogoMouseLeave(e);
                        setHoveredLogo(null);
                      }}
                    >
                      <img
                        src={`/images/partnerships/${logo.file}`}
                        alt={logo.name}
                        draggable="false"
                        style={{
                          filter: hoveredLogo === uniqueId
                            ? 'brightness(0) saturate(100%) invert(48%) sepia(89%) saturate(6493%) hue-rotate(9deg) brightness(102%) contrast(107%)' 
                            : 'brightness(0) saturate(100%) invert(75%)'
                        }}
                      />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .marquee-wrapper {
          overflow: hidden;
        }

        @keyframes scroll-mobile {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(-50%, 0, 0);
          }
        }

        @keyframes scroll-desktop {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(-33.333%, 0, 0);
          }
        }

        .marquee-content {
          display: flex;
          gap: 0;
          width: fit-content;
          animation: ${isMobile ? 'scroll-mobile' : 'scroll-desktop'} linear infinite;
          will-change: transform;
        }

        .marquee-wrapper:hover .marquee-content {
          animation-play-state: paused;
        }

        /* Touch devices: pause on touch */
        @media (hover: none) and (pointer: coarse) {
          .marquee-wrapper:active .marquee-content {
            animation-play-state: paused;
          }
        }

        .logo-item {
          position: relative;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 1.2s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .logo-item img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          user-select: none;
          pointer-events: none;
          transition: filter 0.3s ease;
        }

        /* Larger logos on mobile for better visibility */
        .logo-item {
          width: 180px;
          height: 108px;
          padding: 0 20px;
        }

        @media (min-width: 640px) {
          .logo-item {
            width: 187px;
            height: 113px;
            padding: 0 15px;
          }
        }

        @media (min-width: 768px) {
          .logo-item {
            width: 224px;
            height: 135px;
            padding: 0;
          }
        }

        @media (min-width: 1024px) {
          .logo-item {
            width: 262px;
            height: 158px;
          }
        }

        @media (min-width: 1440px) {
          .logo-item {
            width: 292px;
            height: 175px;
          }
        }
      `}</style>
    </section>
  );
};

export default BrandPartnerships;
