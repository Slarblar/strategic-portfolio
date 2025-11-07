import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingBar from '../components/LoadingBar';
import UniversalVideoBackground from '../components/UniversalVideoBackground';
import { getProjectVideoConfig } from '../data/videoBackgrounds';
import { projectsData } from '../data/projectsData';
import { motion } from 'framer-motion';
import GlitchText from '../components/GlitchText';
import GlitchNumber from '../components/GlitchNumber';
import MetricsBackground from '../components/MetricsBackground';
import ImpactLegacy from '../components/ImpactLegacy';
import { getProjectComponent } from '../utils/componentMapper';
import LazyApproachVideo from '../components/LazyApproachVideo';
import Challenge from '../components/Challenge';
import Approach from '../components/Approach';
import ModularVideoPlayer from '../components/ModularVideoPlayer';
import { getGumletBackgroundUrl, GUMLET_IFRAME_ATTRS } from '../utils/gumletHelper';

const AForAdleyCase = () => {
  const navigate = useNavigate();
  const project = projectsData['a-for-adley'];
  const id = 'a-for-adley'; // Set the id for the component

  useEffect(() => {
    if (!project) {
      navigate('/archives');
    }
  }, [project, navigate]);

  if (!project) {
    return (
      <div className="min-h-screen bg-ink text-cream flex items-center justify-center">
        <LoadingBar 
  isLoading={true}
  title="A for Adley"
  subtitle="Loading case study..."
  className="bg-ink/90"
/>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink text-cream">
      {/* Hero Section with Video */}
      <div className="relative md:h-[150vh]">
        <div className="md:sticky top-0 h-screen w-full md:overflow-hidden">
          <UniversalVideoBackground 
            {...getProjectVideoConfig('a-for-adley')}
            enableMobileVideo={true}
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
                <h1 className="!font-display !font-black text-[5.5rem] xs:text-[6rem] sm:text-[6.5rem] md:text-[7rem] lg:text-[8rem] xl:text-[12.65rem] 2xl:text-[12rem] !tracking-[0em] leading-[0.9] md:leading-[0.95] lg:leading-[1.05] text-cream">
                  <GlitchText text={project.title.toUpperCase()} />
                </h1>
                
                {project.tagline && (
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.8,
                      delay: 0.2,
                      ease: [0.215, 0.610, 0.355, 1.000]
                    }}
                    className="font-martian-mono text-xl sm:text-2xl md:text-2xl lg:text-3xl mt-4 text-cream opacity-80"
                  >
                    {project.tagline}
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
                <div className="font-martian-mono text-base xs:text-lg sm:text-xl md:text-xl lg:text-2xl text-cream/90 tracking-[0.1em] sm:tracking-[0.15em] mt-3 xs:mt-4 md:mt-6">
                  FROM YOUTUBE BRAND TO MULTIMEDIA POWERHOUSE
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Info Section */}
      <div className="bg-[#465902]">
        <div className="max-w-[2400px] mx-auto px-4 xs:px-6 sm:px-8 md:px-12 pb-8 sm:pb-12 lg:pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 pt-4 sm:pt-6 md:pt-8">
            {/* Left Column */}
            <div>
              <div className="mb-6 sm:mb-8">
                <div className="font-martian-mono font-bold text-xl sm:text-2xl tracking-wider mb-4 sm:mb-6 py-2 text-cream">
                  CREATIVE DIRECTOR / DESIGNER / OPERATIONS
                </div>
                <div className="font-martian-mono space-y-3 text-xs sm:text-sm leading-relaxed max-w-3xl text-cream/90">
                  <p>
                    A for Adley began as a YouTube channel featuring creative, educational content for children. As Creative Operations Director, I was tasked with transforming this emerging channel into a comprehensive digital brand with multiple revenue streams while maintaining creative integrity and accelerating growth.
                  </p>
                  <p>
                    When I joined the project in 2020, A for Adley faced several significant challenges:
                  </p>
                </div>
              </div>

              <Challenge 
                id={id} 
                bgColor="bg-[#465902]" 
              />
            </div>

            {/* Right Column */}
            <div>
              <div className="font-martian-mono font-bold text-xl sm:text-2xl tracking-wider text-right mb-4 sm:mb-6 py-2 text-cream">
                YOUTUBE BRAND / YEAR 2020 - 2023
              </div>
              
              {/* Split Screen Layout for DESKTOP (xl and up) */}
              <div className="hidden xl:flex gap-6">
                {/* Primary Image */}
                <motion.div 
                  className="w-7/12 relative min-h-[calc(100vh+2rem)]"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.8,
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                    mass: 1
                  }}
                >
                  <div 
                    className="md:sticky w-full aspect-[16/9] rounded-xl overflow-hidden"
                                style={{ 
              top: "calc(72px + 2rem)",
              bottom: "2rem",
              maxHeight: "calc(var(--vh, 1vh) * 100 - 72px - 4rem)"
            }}
                  >
                    <motion.a
                      href="https://aforadley.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full h-full"
                      whileHover={{ 
                        scale: 1.05,
                      }}
                      transition={{
                        scale: {
                          type: "spring",
                          stiffness: 300,
                          damping: 20
                        }
                      }}
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 1 }}
                        animate={{ opacity: 1 }}
                        whileHover={{ 
                          scale: [1, 1.03, 1],
                          transition: {
                            scale: {
                              repeat: Infinity,
                              duration: 1.5,
                              ease: "easeInOut"
                            }
                          }
                        }}
                        className="w-full h-full flex items-center justify-center p-8 cursor-pointer"
                      >
                        <img 
                          src="/images/a4/a4-logo-opt.png"
                          alt="A4 logo showcase"
                          className="w-full h-full object-contain scale-125"
                        />
                      </motion.div>
                    </motion.a>
                  </div>
                </motion.div>

                {/* Supporting Images Column */}
                <div className="w-5/12 space-y-6">
                  {/* Supporting Image 1 */}
                  <motion.div 
                    className="aspect-[2/3] bg-ink rounded-xl overflow-hidden relative"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ 
                      duration: 0.6,
                      delay: 0.2,
                      type: "spring",
                      stiffness: 100,
                      damping: 20
                    }}
                  >
                    <iframe 
                      loading="lazy" 
                      title="Gumlet video player"
                      src={getGumletBackgroundUrl('6840a1250f8d7a051834fe38')}
                      className="w-full h-full object-cover pointer-events-none"
                      style={{
                        border: 'none',
                        transform: 'scale(1.20)', 
                        transformOrigin: 'center center',
                        pointerEvents: 'none' 
                      }}
                      allow={GUMLET_IFRAME_ATTRS.allow}
                      allowFullScreen={GUMLET_IFRAME_ATTRS.allowFullScreen}
                    ></iframe>
                  </motion.div>

                  {/* Supporting Image 2 */}
                  <motion.div 
                    className="aspect-square bg-ink rounded-xl overflow-hidden relative"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ 
                      duration: 0.6,
                      delay: 0.3,
                      type: "spring",
                      stiffness: 100,
                      damping: 20
                    }}
                  >
                    <motion.div
                      className="w-full h-full absolute inset-0"
                      initial={{ scale: 1.1 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ 
                        duration: 0.8,
                        type: "spring",
                        stiffness: 80,
                        damping: 20
                      }}
                    >
                      <ModularVideoPlayer
                        projectId="a-for-adley"
                        section="default"
                        className="w-full h-full"
                      />
                    </motion.div>
                  </motion.div>
                </div>
              </div>

              {/* Mobile, Tablet, & Large Tablet/iPad Pro Layout (hidden on xl and up) */}
              <div className="xl:hidden space-y-4">
                <motion.a
                  href="https://aforadley.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full"
                  whileHover={{ 
                    scale: 1.05,
                  }}
                  transition={{
                    scale: {
                      type: "spring",
                      stiffness: 300,
                      damping: 20
                    }
                  }}
                >
                  <motion.div 
                    className="w-full aspect-[16/9] rounded-xl overflow-hidden flex items-center justify-center p-8"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    whileHover={{ 
                      scale: [1, 1.03, 1],
                      transition: {
                        scale: {
                          repeat: Infinity,
                          duration: 1.5,
                          ease: "easeInOut"
                        }
                      }
                    }}
                  >
                    <img 
                      src="/images/a4/a4-logo-opt.png"
                      alt="A4 logo showcase"
                      className="w-full h-full object-contain scale-125"
                    />
                  </motion.div>
                </motion.a>
                
                {/* Supporting Video 1 */}
                <motion.div 
                  className="w-full aspect-[2/3] bg-ink rounded-xl overflow-hidden"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <motion.div
                    className="w-full h-full"
                    initial={{ scale: 1.1 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ 
                      duration: 0.8,
                      type: "spring",
                      stiffness: 80,
                      damping: 20
                    }}
                  >
                    <iframe 
                      loading="lazy" 
                      title="Gumlet video player"
                      src={getGumletBackgroundUrl('6840a1250f8d7a051834fe38')}
                      className="w-full h-full object-cover pointer-events-none"
                      style={{
                        transform: 'scale(1.25)',
                        transformOrigin: 'center center',
                        pointerEvents: 'none'
                      }}
                      allow={GUMLET_IFRAME_ATTRS.allow}
                      allowFullScreen={GUMLET_IFRAME_ATTRS.allowFullScreen}
                    ></iframe>
                  </motion.div>
                </motion.div>
                
                {/* Supporting Video 2 */}
                <motion.div 
                  className="w-full aspect-square bg-ink rounded-xl overflow-hidden relative"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <motion.div
                    className="w-full h-full absolute inset-0"
                    initial={{ scale: 1.1 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ 
                      duration: 0.8,
                      type: "spring",
                      stiffness: 80,
                      damping: 20
                    }}
                  >
                    <ModularVideoPlayer
                      projectId="a-for-adley"
                      section="default"
                      className="w-full h-full"
                    />
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rest of the sections */}
      <div className="max-w-[2400px] mx-auto px-6 lg:px-12">
        {/* My Approach Section */}
        <Approach 
          projectId="a-for-adley"
          bgColor="bg-sand"
          textColor="text-ink"
        />

        {/* Execution & Results Section */}
        <section className="mb-16 sm:mb-24 md:mb-32">
          <h2 className="font-display font-black text-[2rem] xs:text-[2.25rem] sm:text-[2.5rem] leading-none mb-8 xs:mb-12 sm:mb-16">
            <GlitchText text="EXECUTION & RESULTS" />
          </h2>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-5 sm:gap-6 lg:gap-8 mb-8 xs:mb-10 sm:mb-12 lg:mb-16">
            {project.execution.metrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-orange rounded-xl sm:rounded-2xl p-4 xs:p-5 sm:p-6 md:p-8 text-ink relative overflow-hidden"
              >
                <MetricsBackground />
                <div className="relative z-10">
                  <div className="font-display font-semibold text-2xl xs:text-3xl sm:text-4xl mb-1 xs:mb-2">
                    <GlitchNumber value={metric.value} />
                  </div>
                  <div className="font-martian-mono text-[0.65rem] xs:text-xs sm:text-sm tracking-wider mb-2 xs:mb-3 sm:mb-4">{metric.label}</div>
                  <div className="font-martian-mono text-[0.65rem] xs:text-xs sm:text-sm leading-relaxed opacity-90">{metric.description}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Key Results */}
          <div className="bg-ink/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 xs:p-5 sm:p-6 md:p-8">
            <h3 className="font-martian-mono text-sm xs:text-base sm:text-lg tracking-wider mb-4 xs:mb-5 sm:mb-6 md:mb-8">
              <GlitchText text="KEY RESULTS" />
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 xs:gap-x-6 sm:gap-x-8 md:gap-x-16 gap-y-2 xs:gap-y-3 sm:gap-y-4">
              {project.execution.keyResults.map((result, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="font-martian-mono text-xs sm:text-sm leading-relaxed opacity-90 flex items-start"
                >
                  <span className="mr-2 opacity-60">•</span>
                  <span>{result}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Visual Archives Section */}
        <section className="mb-8 xs:mb-10 sm:mb-12 lg:mb-16">
          {(() => {
            const VisualArchivesComponent = getProjectComponent(project, 'visualArchives', 'VisualWorks');
            return <VisualArchivesComponent media={project.visualArchives} />;
          })()}
        </section>

        {/* Impact and Legacy Section */}
        <section className="mb-12 xs:mb-16 sm:mb-24 lg:mb-32">
          <ImpactLegacy impact={project.impact} />
        </section>
      </div>
    </div>
  );
};

export default AForAdleyCase; 