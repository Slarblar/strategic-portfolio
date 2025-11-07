import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import UniversalVideoBackground from './UniversalVideoBackground';
import GlitchText from './GlitchText';

const CaseStudyLayout = ({ 
  children, 
  title, 
  subtitle,
  tagline,
  videoId,
  customVideoSrc,
  bgColor,
  textColor = 'text-cream',
  roles,
  timeframe,
  description,
  challengeComponent,
  heroContent
}) => {
  const navigate = useNavigate();
  
  // Determine project info text color based on background
  const projectInfoTextColor = bgColor === 'bg-[#591902]' ? textColor : 'text-ink';

  return (
    <div className="min-h-screen bg-ink text-cream">


      {/* Hero Section with Video */}
      <div className="relative h-[150vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <UniversalVideoBackground 
            videoId={videoId} 
            customSrc={customVideoSrc}
            enableMobileVideo={true}
            enableIntersectionObserver={false}
            overlayOpacity={0.4}
          />
          
          {/* Content */}
          <div className="absolute inset-0 z-10 flex flex-col justify-center">
            <div className="max-w-[2400px] mx-auto w-full px-6 lg:px-12">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.8,
                  ease: [0.215, 0.610, 0.355, 1.000]
                }}
              >
                <h1 className={`!font-display !font-black text-[5.5rem] xs:text-[6rem] sm:text-[6.5rem] md:text-[7rem] lg:text-[8rem] xl:text-[12.65rem] 2xl:text-[12rem] !tracking-[0em] leading-[0.85] md:leading-[0.85] lg:leading-[0.85] ${textColor}`}>
                  {typeof title === 'string' ? (
                    title.split(' ').map((word, index) => (
                      <React.Fragment key={index}>
                        <GlitchText text={word} />
                        {index < title.split(' ').length - 1 && <br />}
                      </React.Fragment>
                    ))
                  ) : (
                    title
                  )}
                </h1>
                
                {tagline && (
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.8,
                      delay: 0.2,
                      ease: [0.215, 0.610, 0.355, 1.000]
                    }}
                    className={`font-martian-mono text-lg sm:text-xl md:text-2xl lg:text-3xl mt-4 ${textColor} opacity-80`}
                  >
                    {tagline}
                  </motion.p>
                )}
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6,
                  delay: 0.2,
                  ease: [0.215, 0.610, 0.355, 1.000]
                }}
              >
                <div className={`font-martian-mono text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl ${textColor}/90 tracking-[0.1em] sm:tracking-[0.15em] mt-3 xs:mt-4 md:mt-6`}>
                  {subtitle}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Info Section */}
      <div className={bgColor}>
        <div className="max-w-[2400px] mx-auto px-4 xs:px-6 sm:px-8 md:px-12 pb-8 sm:pb-12 lg:pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 pt-4 sm:pt-6 md:pt-8">
            {/* Left Column */}
            <div>
              <div className="mb-6 sm:mb-8">
                <div className={`font-martian-mono font-bold text-xl sm:text-2xl tracking-wider mb-4 sm:mb-6 py-2 ${projectInfoTextColor}`}>
                  {Array.isArray(roles) ? roles.join(' / ') : roles}
                </div>
                <div className={`font-martian-mono space-y-3 text-xs sm:text-sm leading-relaxed max-w-3xl ${projectInfoTextColor}/90`}>
                  {Array.isArray(description) ? (
                    description.map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))
                  ) : (
                    <p>{description}</p>
                  )}
                </div>
              </div>

              {challengeComponent}
            </div>

            {/* Right Column */}
            <div>
              <div className={`font-martian-mono font-bold text-xl sm:text-2xl tracking-wider text-right mb-4 sm:mb-6 py-2 ${projectInfoTextColor}`}>
                {timeframe}
              </div>
              
              {heroContent}
            </div>
          </div>
        </div>
      </div>

      {/* Case Study Content */}
      {children}
    </div>
  );
};

export default CaseStudyLayout; 