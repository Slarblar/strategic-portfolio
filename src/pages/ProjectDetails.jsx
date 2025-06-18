import React, { Suspense, lazy, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ErrorBoundary from '../components/ErrorBoundary';
import UniversalVideoBackground from '../components/UniversalVideoBackground';
import { getProjectVideoConfig } from '../data/videoBackgrounds';
import styled from 'styled-components';
import { projectsData } from '../data/projectsData';
import { motion } from 'framer-motion';
import GlitchText from '../components/GlitchText';
import GlitchNumber from '../components/GlitchNumber';
import MetricsBackground from '../components/MetricsBackground';
import GlitchCarousel from '../components/GlitchCarousel';
import MajorProjects from '../components/MajorProjects';
import ImpactLegacy from '../components/ImpactLegacy';
import { getProjectComponent } from '../utils/componentMapper';
import VimeoPlayer from '../components/VimeoPlayer';
import HoverVimeoPlayer from '../components/HoverVimeoPlayer';
import ModularVideoPlayer from '../components/ModularVideoPlayer';
import LazyVimeoPlayer from '../components/LazyVimeoPlayer';
import ApproachVideo from '../components/ApproachVideo';
import LazyApproachVideo from '../components/LazyApproachVideo';

import VisualArchives from '../components/VisualArchives';
import Challenge from '../components/Challenge';

// Lazy load project-specific components as a single chunk
const ProjectSpecificComponents = lazy(() => 
  Promise.all([
    import('../components/InnovationMethodology'),
    import('../components/LessonsInsights'),
    import('../components/ProjectEvolution'),
    import('../components/AdditionalChallenges')
  ]).then(([innovation, lessons, evolution, challenges]) => ({
    default: {
      InnovationMethodology: innovation.default,
      LessonsInsights: lessons.default,
      ProjectEvolution: evolution.default,
      AdditionalChallenges: challenges.default
    }
  }))
);

const ProjectContainer = styled(motion.div)`
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 1rem;
  
  @media (min-width: 640px) {
    padding: 0 1.5rem;
  }
  
  @media (min-width: 768px) {
    padding: 0 2rem;
  }
`;

const Section = styled(motion.section)`
  margin: 4rem 0;
`;

const ApproachGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
`;

const ApproachCard = styled(motion.div)`
  background: rgba(26, 26, 26, 0.9);
  padding: 2rem;
  border-radius: 8px;
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  h3 {
    color: var(--color-orange);
    margin-bottom: 1rem;
    font-family: var(--font-header);
  }

  p {
    font-family: var(--font-martian-mono);
    line-height: 1.6;
    margin-bottom: 1rem;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    font-family: var(--font-martian-mono);
    margin-bottom: 0.5rem;
    padding-left: 1.5rem;
    position: relative;

    &:before {
      content: '•';
      position: absolute;
      left: 0;
      color: var(--color-orange);
    }
  }
`;

const Results = styled(motion.div)`
  background: var(--color-orange);
  padding: 2rem;
  border-radius: 8px;
  color: var(--color-ink);
  margin: 2rem 0;

  h2 {
    color: var(--color-ink);
    margin-bottom: 1.5rem;
    font-family: var(--font-header);
  }

  .metrics {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
    margin: 2rem 0;
  }

  .metric {
    text-align: center;
    
    .value {
      font-size: 2.5rem;
      font-weight: bold;
      color: var(--color-ink);
      font-family: var(--font-header);
    }

    .label {
      font-family: var(--font-martian-mono);
      margin-top: 0.5rem;
    }
  }
`;

const Impact = styled(motion.div)`
  background: rgba(26, 26, 26, 0.9);
  padding: 2rem;
  border-radius: 8px;
  margin: 2rem 0;
  backdrop-filter: blur(10px);

  h2 {
    color: var(--color-orange);
    margin-bottom: 1.5rem;
    font-family: var(--font-header);
  }

  p {
    font-family: var(--font-martian-mono);
    line-height: 1.6;
  }
`;

// Component mapping is now handled by the componentMapper utility

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = projectsData[id];



  // Handle invalid project ID
  useEffect(() => {
    if (!project) {
      navigate('/archives');
    }
  }, [project, navigate]);



  if (!project) {
    return (
      <div className="min-h-screen bg-ink text-cream flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink text-cream">
      {/* Hero Section with Video */}
      <div className="relative h-[150vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
                    <UniversalVideoBackground 
            {...getProjectVideoConfig(id)}
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
                <h1 className={`!font-display !font-black text-[5.5rem] xs:text-[6rem] sm:text-[6.5rem] md:text-[7rem] lg:text-[8rem] xl:text-[12.65rem] 2xl:text-[12rem] !tracking-[0em] ${id === 'spacestation-animation' || id === 'quarter-machine' ? 'leading-[0.85] md:leading-[0.85] lg:leading-[0.85]' : 'leading-[0.9] md:leading-[0.95] lg:leading-[1.05]'} text-cream`}>
                  {id === 'spacestation-animation' ? (
                    <>
                      <GlitchText text="SPACESTATION" />
                      <br />
                      <GlitchText text="ANIMATION" />
                    </>
                  ) : id === 'quarter-machine' ? (
                    <>
                      <GlitchText text="QUARTER" />
                      <br />
                      <GlitchText text="MACHINE" />
                    </>
                  ) : (
                    <GlitchText text={project.title.toUpperCase()} />
                  )}
                </h1>
                
                {project.tagline && id !== 'quarter-machine' && (
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
                  {id === 'spacestation-animation' ? 'A CASE STUDY ON INNOVATION FROM THE GROUND UP' : 
                   id === 'quarter-machine' ? 'BRIDGING THE GAP BETWEEN DIGITAL AND PHYSICAL WORLDS' :
                   'FROM YOUTUBE BRAND TO MULTIMEDIA POWERHOUSE'}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Info Section */}
      <div className={`${
        id === 'spacestation-animation' ? 'bg-[#eae2df]' : 
        id === 'quarter-machine' ? 'bg-[#591902]' : 
        'bg-[#465902]'
      }`}>
        <div className="max-w-[2400px] mx-auto px-4 xs:px-6 sm:px-8 md:px-12 pb-8 sm:pb-12 lg:pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 pt-4 sm:pt-6 md:pt-8">
            {/* Left Column */}
            <div>
              <div className="mb-6 sm:mb-8">
                <div className={`font-martian-mono font-bold text-xl sm:text-2xl tracking-wider mb-4 sm:mb-6 py-2 ${
                  id === 'spacestation-animation' ? 'text-ink' : 
                  id === 'quarter-machine' ? 'text-sand' : 
                  'text-cream'
                }`}>
                  {id === 'spacestation-animation' ? 'CO FOUNDER / CREATIVE DIRECTOR / OPERATIONS' : 
                   id === 'quarter-machine' ? 'CO-FOUNDER / CREATIVE OPERATOR / DESIGNER' :
                   'CREATIVE DIRECTOR / DESIGNER / OPERATIONS'}
                </div>
                <div className={`font-martian-mono space-y-3 text-xs sm:text-sm leading-relaxed max-w-3xl ${
                  id === 'spacestation-animation' ? 'text-ink/90' : 
                  id === 'quarter-machine' ? 'text-cream/90' : 
                  'text-cream/90'
                }`}>
                  {id === 'spacestation-animation' ? (
                    <>
                      <p>
                        Spacestation Animation began as an ambitious vision to create high-quality animated content that could compete with major studios while serving the unique needs of digital content creators starting with the A for Adley brand.
                      </p>
                      <p>
                        As Co-Founder and Creative Operations Director, I was tasked with building a complete animation studio from the ground up, establishing production pipelines, recruiting talent, and creating content that would drive both audience engagement and business growth across multiple platforms.
                      </p>
                      <p>
                        When we launched Spacestation Animation in 2021, the animation landscape presented several significant obstacles:
                      </p>
                    </>
                  ) : id === 'quarter-machine' ? (
                    <>
                      <p>
                        Quarter Machine emerged from a vision to bridge the gap between digital collectibles and physical experiences in the rapidly evolving Web3 landscape. As Co-Founder and Creative Operations Director, I was tasked with creating an innovative NFT venture that would stand out in an increasingly crowded marketplace while establishing genuine utility and community value. The project required developing both digital assets and groundbreaking physical distribution technology within an extremely compressed timeline.
                      </p>
                      <p>
                        When we began development in late 2021, we faced several significant obstacles in the competitive NFT market.
                      </p>
                    </>
                  ) : (
                    <>
                      <p>
                        A for Adley started as a successful YouTube channel but faced limitations in revenue streams and brand cohesion across platforms.
                      </p>
                      <p>
                        As Creative Director, I was tasked with transforming the channel into a multi-platform brand powerhouse while maintaining authenticity and expanding revenue opportunities.
                      </p>
                      <p>
                        When we began the transformation in 2022, several key challenges needed to be addressed:
                      </p>
                    </>
                  )}
                </div>
              </div>

              <Challenge 
                id={id} 
                bgColor={id === 'spacestation-animation' ? 'bg-[#eae2df]' : 
                          id === 'quarter-machine' ? 'bg-[#591902]' : 
                          'bg-[#465902]'} 
              />
            </div>

            {/* Right Column */}
            <div>
              <div className={`font-martian-mono font-bold text-xl sm:text-2xl tracking-wider text-right mb-4 sm:mb-6 py-2 ${id === 'spacestation-animation' ? 'text-ink' : 'text-cream'}`}>
                {id === 'spacestation-animation' ? 'START UP / YEAR 2021 - 2025' : 'YOUTUBE BRAND / YEAR 2020 - 2023'}
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
                    className="sticky w-full aspect-[16/9] rounded-xl overflow-hidden"
                                style={{ 
              top: "calc(72px + 2rem)",
              bottom: "2rem",
              maxHeight: "calc(var(--vh, 1vh) * 100 - 72px - 4rem)"
            }}
                  >
                    <motion.a
                      href={id === 'spacestation-animation' ? 'https://spacestationanimation.com' : 'https://aforadley.com'}
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
                        onClick={() => {
                          const element = document.getElementById('additional-challenges');
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }
                        }}
                      >
                        <img 
                          src={id === 'spacestation-animation' ? '/images/ssa/spacestation-animation-logo.png' : 
                              id === 'quarter-machine' ? '/images/qm/qm-logo.png' :
                              '/images/a4/a4-logo-16-9.png'}
                          alt={id === 'spacestation-animation' ? 'Spacestation Animation logo showcase' : 
                              id === 'quarter-machine' ? 'Quarter Machine logo showcase' :
                              'A4 logo showcase'}
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
                      loading="lazy" title="Gumlet video player"
                      src="https://play.gumlet.io/embed/6840a1250f8d7a051834fe38?preload=true&autoplay=true&loop=true&background=true&disable_player_controls=true"
                      className="w-full h-full object-cover pointer-events-none"
                      style={{
                        border: 'none',
                        transform: 'scale(1.20)', 
                        transformOrigin: 'center center',
                        pointerEvents: 'none' 
                      }}
                      allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
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
                        projectId={id === 'a-for-adley' ? 'a-for-adley' : id === 'quarter-machine' ? 'quarter-machine' : 'spacestation-animation'}
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
                  href={id === 'spacestation-animation' ? 'https://spacestationanimation.com' : 'https://aforadley.com'}
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
                      src={id === 'spacestation-animation' ? '/images/ssa/spacestation-animation-logo.png' : 
                          id === 'quarter-machine' ? '/images/qm/qm-logo.png' :
                          '/images/a4/a4-logo-16-9.png'}
                      alt={id === 'spacestation-animation' ? 'Spacestation Animation logo showcase' : 
                          id === 'quarter-machine' ? 'Quarter Machine logo showcase' :
                          'A4 logo showcase'}
                      className="w-full h-full object-contain scale-125"
                    />
                  </motion.div>
                </motion.a>
                
                {/* Supporting Video 1 (formerly placeholder) */}
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
                      src={id === 'spacestation-animation' 
                        ? "https://player.vimeo.com/video/1089583774?h=517565da46&background=1&autoplay=1&loop=1&byline=0&title=0&portrait=0&badge=0&autopause=0"
                        : "https://player.vimeo.com/video/1088896913?h=38d3c73e32&background=1&autoplay=1&loop=1&byline=0&title=0"
                      }
                      className="w-full h-full object-cover pointer-events-none"
                      style={{
                        transform: 'scale(1.25)',
                        transformOrigin: 'center center',
                        pointerEvents: 'none'
                      }}
                      allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                      allowFullScreen
                    ></iframe>
                  </motion.div>
                </motion.div>
                
                                  {/* Supporting Video 2 (SimpleHoverVideoPlayer) */}
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
                        projectId={id === 'a-for-adley' ? 'a-for-adley' : id === 'quarter-machine' ? 'quarter-machine' : 'spacestation-animation'}
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
        {/* Quarter Machine specific sections */}
        {id === 'quarter-machine' && (
          <Suspense fallback={<div className="h-32 bg-ink/10 rounded-xl animate-pulse" />}>
            <ProjectSpecificComponents>
              {(components) => <components.AdditionalChallenges />}
            </ProjectSpecificComponents>
          </Suspense>
        )}

        {/* My Approach Section */}
        <section className={`${
          id === 'spacestation-animation' 
            ? 'pt-8 sm:pt-12 md:pt-16 lg:pt-20' 
            : 'pt-2.5 sm:pt-4 md:pt-5 lg:pt-6'
        } mb-12 sm:mb-16 md:mb-24 lg:mb-32`}>
          <h2 className="font-display font-black text-[1.75rem] xs:text-[2rem] sm:text-[2.25rem] lg:text-[2.5rem] leading-none mb-12 xs:mb-14 sm:mb-14 lg:mb-16">
            <GlitchText text="MY APPROACH" />
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-4 gap-6 xs:gap-6 sm:gap-6 lg:gap-8">
            {id === 'spacestation-animation' ? (
              <>
                {/* Strategic Team Building & Talent Development */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.6,
                    y: {
                      type: "spring",
                      stiffness: 400,
                      damping: 25
                    }
                  }}
                  whileHover={{ 
                    y: -12,
                    transition: {
                      type: "spring",
                      stiffness: 400,
                      damping: 25
                    }
                  }}
                  className={`${
                    id === 'spacestation-animation' ? 'bg-olive' :
                    id === 'quarter-machine' ? 'bg-[#ACC3F2]' :
                    'bg-sand'
                  } rounded-xl sm:rounded-2xl p-4 xs:p-5 sm:p-6 md:p-8 flex flex-col min-h-full transform-gpu`}
                >
                  <div className="space-y-4 xs:space-y-5 sm:space-y-6 flex-1">
                    <h3 className={`font-martian-mono text-base sm:text-lg tracking-wider ${
                      id === 'spacestation-animation' ? 'text-sand' :
                      id === 'quarter-machine' ? 'text-ink' :
                      'text-ink'
                    }`}>
                      STRATEGIC TEAM BUILDING & TALENT DEVELOPMENT
                    </h3>
                    <p className={`font-martian-mono text-xs sm:text-sm leading-relaxed ${
                      id === 'spacestation-animation' ? 'text-sand/90' :
                      id === 'quarter-machine' ? 'text-ink/90' :
                      'text-ink/90'
                    }`}>
                      Built a talent pipeline focused on developing emerging local artists:
                    </p>
                    <ul className="space-y-2 sm:space-y-3">
                      <li className={`font-martian-mono text-xs sm:text-sm leading-relaxed ${
                        id === 'spacestation-animation' ? 'text-sand/90' :
                        id === 'quarter-machine' ? 'text-ink/90' :
                        'text-ink/90'
                      } flex items-start`}>
                        <span className={`mr-2 ${
                          id === 'spacestation-animation' ? 'text-sand/60' :
                          id === 'quarter-machine' ? 'text-ink/60' :
                          'text-ink/60'
                        }`}>•</span>
                        <span>Recruited diverse talent from graduates and veterans</span>
                      </li>
                      <li className={`font-martian-mono text-xs sm:text-sm leading-relaxed ${
                        id === 'spacestation-animation' ? 'text-sand/90' :
                        id === 'quarter-machine' ? 'text-ink/90' :
                        'text-ink/90'
                      } flex items-start`}>
                        <span className={`mr-2 ${
                          id === 'spacestation-animation' ? 'text-sand/60' :
                          id === 'quarter-machine' ? 'text-ink/60' :
                          'text-ink/60'
                        }`}>•</span>
                        <span>Paired junior artists with experienced mentors</span>
                      </li>
                      <li className={`font-martian-mono text-xs sm:text-sm leading-relaxed ${
                        id === 'spacestation-animation' ? 'text-sand/90' :
                        id === 'quarter-machine' ? 'text-ink/90' :
                        'text-ink/90'
                      } flex items-start`}>
                        <span className={`mr-2 ${
                          id === 'spacestation-animation' ? 'text-sand/60' :
                          id === 'quarter-machine' ? 'text-ink/60' :
                          'text-ink/60'
                        }`}>•</span>
                        <span>Created growth-focused career pathways</span>
                      </li>
                      <li className={`font-martian-mono text-xs sm:text-sm leading-relaxed ${
                        id === 'spacestation-animation' ? 'text-sand/90' :
                        id === 'quarter-machine' ? 'text-ink/90' :
                        'text-ink/90'
                      } flex items-start`}>
                        <span className={`mr-2 ${
                          id === 'spacestation-animation' ? 'text-sand/60' :
                          id === 'quarter-machine' ? 'text-ink/60' :
                          'text-ink/60'
                        }`}>•</span>
                        <span>Fostered learning-driven creative culture</span>
                      </li>
                    </ul>
                  </div>
                  <div className="aspect-[16/9] bg-ink rounded-lg sm:rounded-xl overflow-hidden mt-6 sm:mt-8">
                    <LazyApproachVideo 
                      videoId="6840072a0f8d7a05183029b8"
                      section="strategic-team"
                      className="w-full h-full"
                    />
                  </div>
                </motion.div>

                {/* Production Pipeline Architecture */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.6,
                    delay: 0.1,
                    y: {
                      type: "spring",
                      stiffness: 400,
                      damping: 25
                    }
                  }}
                  whileHover={{ 
                    y: -12,
                    transition: {
                      type: "spring",
                      stiffness: 400,
                      damping: 25
                    }
                  }}
                  className={`${
                    id === 'spacestation-animation' ? 'bg-olive' :
                    id === 'quarter-machine' ? 'bg-[#ACC3F2]' :
                    'bg-sand'
                  } rounded-xl sm:rounded-2xl p-4 xs:p-5 sm:p-6 md:p-8 flex flex-col min-h-full transform-gpu`}
                >
                  <div className="space-y-4 xs:space-y-5 sm:space-y-6 flex-1">
                    <h3 className={`font-martian-mono text-base sm:text-lg tracking-wider ${
                      id === 'spacestation-animation' ? 'text-sand' :
                      id === 'quarter-machine' ? 'text-ink' :
                      'text-ink'
                    }`}>
                      PRODUCTION PIPELINE ARCHITECTURE
                    </h3>
                    <p className={`font-martian-mono text-xs sm:text-sm leading-relaxed ${
                      id === 'spacestation-animation' ? 'text-sand/90' :
                      id === 'quarter-machine' ? 'text-ink/90' :
                      'text-ink/90'
                    }`}>
                      Designed scalable production systems from the ground up:
                    </p>
                    <ul className="space-y-2 sm:space-y-3">
                      <li className={`font-martian-mono text-xs sm:text-sm leading-relaxed ${
                        id === 'spacestation-animation' ? 'text-sand/90' :
                        id === 'quarter-machine' ? 'text-ink/90' :
                        'text-ink/90'
                      } flex items-start`}>
                        <span className={`mr-2 ${
                          id === 'spacestation-animation' ? 'text-sand/60' :
                          id === 'quarter-machine' ? 'text-ink/60' :
                          'text-ink/60'
                        }`}>•</span>
                        <span>Optimized cross functional workflows</span>
                      </li>
                      <li className={`font-martian-mono text-xs sm:text-sm leading-relaxed ${
                        id === 'spacestation-animation' ? 'text-sand/90' :
                        id === 'quarter-machine' ? 'text-ink/90' :
                        'text-ink/90'
                      } flex items-start`}>
                        <span className={`mr-2 ${
                          id === 'spacestation-animation' ? 'text-sand/60' :
                          id === 'quarter-machine' ? 'text-ink/60' :
                          'text-ink/60'
                        }`}>•</span>
                        <span>Implemented efficient cross departmental communication</span>
                      </li>
                      <li className={`font-martian-mono text-xs sm:text-sm leading-relaxed ${
                        id === 'spacestation-animation' ? 'text-sand/90' :
                        id === 'quarter-machine' ? 'text-ink/90' :
                        'text-ink/90'
                      } flex items-start`}>
                        <span className={`mr-2 ${
                          id === 'spacestation-animation' ? 'text-sand/60' :
                          id === 'quarter-machine' ? 'text-ink/60' :
                          'text-ink/60'
                        }`}>•</span>
                        <span>Developed reusable asset management</span>
                      </li>
                      <li className={`font-martian-mono text-xs sm:text-sm leading-relaxed ${
                        id === 'spacestation-animation' ? 'text-sand/90' :
                        id === 'quarter-machine' ? 'text-ink/90' :
                        'text-ink/90'
                      } flex items-start`}>
                        <span className={`mr-2 ${
                          id === 'spacestation-animation' ? 'text-sand/60' :
                          id === 'quarter-machine' ? 'text-ink/60' :
                          'text-ink/60'
                        }`}>•</span>
                        <span>Balanced creativity with production timelines</span>
                      </li>
                    </ul>
                  </div>
                  <div className="aspect-[16/9] bg-ink rounded-lg sm:rounded-xl overflow-hidden mt-6 sm:mt-8">
                    <LazyApproachVideo 
                      videoId="683ff9330f8d7a05182fb176"
                      section="production-pipeline"
                      className="w-full h-full"
                    />
                  </div>
                </motion.div>

                {/* Diversified Content Strategy */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.6,
                    delay: 0.2,
                    y: {
                      type: "spring",
                      stiffness: 400,
                      damping: 25
                    }
                  }}
                  whileHover={{ 
                    y: -12,
                    boxShadow: "0 12px 24px rgba(255, 102, 0, 0.15)",
                    transition: {
                      type: "spring",
                      stiffness: 400,
                      damping: 25
                    }
                  }}
                  className={`${
                    id === 'spacestation-animation' ? 'bg-olive' :
                    id === 'quarter-machine' ? 'bg-[#ACC3F2]' :
                    'bg-sand'
                  } rounded-xl sm:rounded-2xl p-4 xs:p-5 sm:p-6 md:p-8 flex flex-col min-h-full transform-gpu`}
                >
                  <div className="space-y-4 xs:space-y-5 sm:space-y-6 flex-1">
                    <h3 className={`font-martian-mono text-base sm:text-lg tracking-wider ${
                      id === 'spacestation-animation' ? 'text-sand' :
                      id === 'quarter-machine' ? 'text-ink' :
                      'text-ink'
                    }`}>
                      DIVERSIFIED CONTENT STRATEGY
                    </h3>
                    <p className={`font-martian-mono text-xs sm:text-sm leading-relaxed ${
                      id === 'spacestation-animation' ? 'text-sand/90' :
                      id === 'quarter-machine' ? 'text-ink/90' :
                      'text-ink/90'
                    }`}>
                      Positioned the studio to serve multiple market needs simultaneously:
                    </p>
                    <ul className="space-y-2 sm:space-y-3">
                      <li className={`font-martian-mono text-xs sm:text-sm leading-relaxed ${
                        id === 'spacestation-animation' ? 'text-sand/90' :
                        id === 'quarter-machine' ? 'text-ink/90' :
                        'text-ink/90'
                      } flex items-start`}>
                        <span className={`mr-2 ${
                          id === 'spacestation-animation' ? 'text-sand/60' :
                          id === 'quarter-machine' ? 'text-ink/60' :
                          'text-ink/60'
                        }`}>•</span>
                        <span>Original content for brand expansion</span>
                      </li>
                      <li className={`font-martian-mono text-xs sm:text-sm leading-relaxed ${
                        id === 'spacestation-animation' ? 'text-sand/90' :
                        id === 'quarter-machine' ? 'text-ink/90' :
                        'text-ink/90'
                      } flex items-start`}>
                        <span className={`mr-2 ${
                          id === 'spacestation-animation' ? 'text-sand/60' :
                          id === 'quarter-machine' ? 'text-ink/60' :
                          'text-ink/60'
                        }`}>•</span>
                        <span>Cross-platform asset optimization enabling multi-format content distribution</span>
                      </li>
                      <li className={`font-martian-mono text-xs sm:text-sm leading-relaxed ${
                        id === 'spacestation-animation' ? 'text-sand/90' :
                        id === 'quarter-machine' ? 'text-ink/90' :
                        'text-ink/90'
                      } flex items-start`}>
                        <span className={`mr-2 ${
                          id === 'spacestation-animation' ? 'text-sand/60' :
                          id === 'quarter-machine' ? 'text-ink/60' :
                          'text-ink/60'
                        }`}>•</span>
                        <span>Long-term IP development</span>
                      </li>
                      <li className={`font-martian-mono text-xs sm:text-sm leading-relaxed ${
                        id === 'spacestation-animation' ? 'text-sand/90' :
                        id === 'quarter-machine' ? 'text-ink/90' :
                        'text-ink/90'
                      } flex items-start`}>
                        <span className={`mr-2 ${
                          id === 'spacestation-animation' ? 'text-sand/60' :
                          id === 'quarter-machine' ? 'text-ink/60' :
                          'text-ink/60'
                        }`}>•</span>
                        <span>Cross-platform content adaptation</span>
                      </li>
                    </ul>
                  </div>
                  <div className="aspect-[16/9] bg-ink rounded-lg sm:rounded-xl overflow-hidden mt-6 sm:mt-8">
                    <LazyApproachVideo 
                      videoId="6840affaed94500acc2ced6a"
                      section="diversified-content"
                      className="w-full h-full"
                    />
                  </div>
                </motion.div>

                {/* Business Development & Client Relations */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.6,
                    delay: 0.3,
                    y: {
                      type: "spring",
                      stiffness: 400,
                      damping: 25
                    }
                  }}
                  whileHover={{ 
                    y: -12,
                    transition: {
                      type: "spring",
                      stiffness: 400,
                      damping: 25
                    }
                  }}
                  className={`${
                    id === 'spacestation-animation' ? 'bg-olive' :
                    id === 'quarter-machine' ? 'bg-[#ACC3F2]' :
                    'bg-sand'
                  } rounded-xl sm:rounded-2xl p-4 xs:p-5 sm:p-6 md:p-8 flex flex-col min-h-full transform-gpu`}
                >
                  <div className="space-y-4 xs:space-y-5 sm:space-y-6 flex-1">
                    <h3 className={`font-martian-mono text-base sm:text-lg tracking-wider ${
                      id === 'spacestation-animation' ? 'text-sand' :
                      id === 'quarter-machine' ? 'text-ink' :
                      'text-ink'
                    }`}>
                      BUSINESS DEVELOPMENT & CLIENT RELATIONS
                    </h3>
                    <p className={`font-martian-mono text-xs sm:text-sm leading-relaxed ${
                      id === 'spacestation-animation' ? 'text-sand/90' :
                      id === 'quarter-machine' ? 'text-ink/90' :
                      'text-ink/90'
                    }`}>
                      Established the studio's reputation through strategic partnerships and exceptional delivery:
                    </p>
                    <ul className="space-y-2 sm:space-y-3">
                      <li className={`font-martian-mono text-xs sm:text-sm leading-relaxed ${
                        id === 'spacestation-animation' ? 'text-sand/90' :
                        id === 'quarter-machine' ? 'text-ink/90' :
                        'text-ink/90'
                      } flex items-start`}>
                        <span className={`mr-2 ${
                          id === 'spacestation-animation' ? 'text-sand/60' :
                          id === 'quarter-machine' ? 'text-ink/60' :
                          'text-ink/60'
                        }`}>•</span>
                        <span>Key entertainment industry partnerships</span>
                      </li>
                      <li className={`font-martian-mono text-xs sm:text-sm leading-relaxed ${
                        id === 'spacestation-animation' ? 'text-sand/90' :
                        id === 'quarter-machine' ? 'text-ink/90' :
                        'text-ink/90'
                      } flex items-start`}>
                        <span className={`mr-2 ${
                          id === 'spacestation-animation' ? 'text-sand/60' :
                          id === 'quarter-machine' ? 'text-ink/60' :
                          'text-ink/60'
                        }`}>•</span>
                        <span>High-profile client service projects</span>
                      </li>
                      <li className={`font-martian-mono text-xs sm:text-sm leading-relaxed ${
                        id === 'spacestation-animation' ? 'text-sand/90' :
                        id === 'quarter-machine' ? 'text-ink/90' :
                        'text-ink/90'
                      } flex items-start`}>
                        <span className={`mr-2 ${
                          id === 'spacestation-animation' ? 'text-sand/60' :
                          id === 'quarter-machine' ? 'text-ink/60' :
                          'text-ink/60'
                        }`}>•</span>
                        <span>Strategic pricing and profit models</span>
                      </li>
                      <li className={`font-martian-mono text-xs sm:text-sm leading-relaxed ${
                        id === 'spacestation-animation' ? 'text-sand/90' :
                        id === 'quarter-machine' ? 'text-ink/90' :
                        'text-ink/90'
                      } flex items-start`}>
                        <span className={`mr-2 ${
                          id === 'spacestation-animation' ? 'text-sand/60' :
                          id === 'quarter-machine' ? 'text-ink/60' :
                          'text-ink/60'
                        }`}>•</span>
                        <span>Strong client relationship development</span>
                      </li>
                    </ul>
                  </div>
                  <div className="aspect-[16/9] bg-ink rounded-lg sm:rounded-xl overflow-hidden mt-6 sm:mt-8">
                    <LazyApproachVideo 
                      videoId="6840b27b0f8d7a0518359b12"
                      section="business-development"
                      className="w-full h-full"
                    />
                  </div>
                </motion.div>
              </>
            ) : id === 'quarter-machine' ? (
              <>
                {/* Technical Architecture */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.6,
                    y: {
                      type: "spring",
                      stiffness: 400,
                      damping: 25
                    }
                  }}
                  whileHover={{ 
                    y: -12,
                    transition: {
                      type: "spring",
                      stiffness: 400,
                      damping: 25
                    }
                  }}
                  className={`${
                    id === 'spacestation-animation' ? 'bg-[#eae2df]' :
                    id === 'quarter-machine' ? 'bg-[#ACC3F2]' :
                    'bg-sand'
                  } rounded-xl sm:rounded-2xl p-4 xs:p-5 sm:p-6 md:p-8 flex flex-col min-h-full transform-gpu`}
                >
                  <div className="space-y-4 xs:space-y-5 sm:space-y-6 flex-1">
                    <h3 className={`font-martian-mono text-base sm:text-lg tracking-wider ${
                      id === 'spacestation-animation' ? 'text-ink' :
                      id === 'quarter-machine' ? 'text-ink' :
                      'text-ink'
                    }`}>
                      TECHNICAL ARCHITECTURE
                    </h3>
                    <p className="font-martian-mono text-xs sm:text-sm leading-relaxed text-ink/90">
                      Built a robust technical foundation team and partnered with Aaron Guyett and Tim Nielsen to support seamless NFT distribution and management.
                    </p>
                    <ul className="space-y-2 sm:space-y-3">
                      <li className="font-martian-mono text-xs sm:text-sm leading-relaxed text-ink/90 flex items-start">
                        <span className="mr-2 text-ink/60">•</span>
                        <span>Smart contract development</span>
                      </li>
                      <li className="font-martian-mono text-xs sm:text-sm leading-relaxed text-ink/90 flex items-start">
                        <span className="mr-2 text-ink/60">•</span>
                        <span>Secure crypto payment processing</span>
                      </li>
                      <li className="font-martian-mono text-xs sm:text-sm leading-relaxed text-ink/90 flex items-start">
                        <span className="mr-2 text-ink/60">•</span>
                        <span>Real-time inventory tracking</span>
                      </li>
                      <li className="font-martian-mono text-xs sm:text-sm leading-relaxed text-ink/90 flex items-start">
                        <span className="mr-2 text-ink/60">•</span>
                        <span>Analytics and reporting systems</span>
                      </li>
                    </ul>
                  </div>
                  <div className="aspect-[16/9] bg-ink rounded-lg sm:rounded-xl overflow-hidden mt-6 sm:mt-8">
                    <iframe 
                      src="https://player.vimeo.com/video/1090277957?h=b49a61abb7&background=1&autoplay=1&loop=1&byline=0&title=0&muted=1"
                      className="w-full h-full object-cover pointer-events-none"
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      style={{ pointerEvents: 'none' }}
                    ></iframe>
                  </div>
                </motion.div>

                {/* Brand Development */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.6,
                    delay: 0.1,
                    y: {
                      type: "spring",
                      stiffness: 400,
                      damping: 25
                    }
                  }}
                  whileHover={{ 
                    y: -12,
                    transition: {
                      type: "spring",
                      stiffness: 400,
                      damping: 25
                    }
                  }}
                  className={`${
                    id === 'spacestation-animation' ? 'bg-[#eae2df]' :
                    id === 'quarter-machine' ? 'bg-[#ACC3F2]' :
                    'bg-sand'
                  } rounded-xl sm:rounded-2xl p-4 xs:p-5 sm:p-6 md:p-8 flex flex-col min-h-full transform-gpu`}
                >
                  <div className="space-y-4 xs:space-y-5 sm:space-y-6 flex-1">
                    <h3 className={`font-martian-mono text-base sm:text-lg tracking-wider ${
                      id === 'spacestation-animation' ? 'text-ink' :
                      id === 'quarter-machine' ? 'text-ink' :
                      'text-ink'
                    }`}>
                      BRAND DEVELOPMENT
                    </h3>
                    <p className="font-martian-mono text-xs sm:text-sm leading-relaxed text-ink/90">
                      Created a distinctive brand identity that resonates with both Web3 enthusiasts and mainstream audiences. Special thanks to Vincent Howard for web development and James Thomas for our 3D visuals.
                    </p>
                    <ul className="space-y-2 sm:space-y-3">
                      <li className="font-martian-mono text-xs sm:text-sm leading-relaxed text-ink/90 flex items-start">
                        <span className="mr-2 text-ink/60">•</span>
                        <span>Retro-futuristic aesthetic</span>
                      </li>
                      <li className="font-martian-mono text-xs sm:text-sm leading-relaxed text-ink/90 flex items-start">
                        <span className="mr-2 text-ink/60">•</span>
                        <span>Cohesive visual system</span>
                      </li>
                      <li className="font-martian-mono text-xs sm:text-sm leading-relaxed text-ink/90 flex items-start">
                        <span className="mr-2 text-ink/60">•</span>
                        <span>Cross-platform consistency</span>
                      </li>
                      <li className="font-martian-mono text-xs sm:text-sm leading-relaxed text-ink/90 flex items-start">
                        <span className="mr-2 text-ink/60">•</span>
                        <span>Engaging brand storytelling</span>
                      </li>
                    </ul>
                  </div>
                  <div className="aspect-[16/9] bg-ink rounded-lg sm:rounded-xl overflow-hidden mt-6 sm:mt-8">
                    <iframe 
                      src="https://player.vimeo.com/video/1090277957?h=b49a61abb7&background=1&autoplay=1&loop=1&byline=0&title=0&muted=1"
                      className="w-full h-full object-cover pointer-events-none"
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      style={{ pointerEvents: 'none' }}
                    ></iframe>
                  </div>
                </motion.div>

                {/* Hardware Innovation */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.6,
                    delay: 0.2,
                    y: {
                      type: "spring",
                      stiffness: 400,
                      damping: 25
                    }
                  }}
                  whileHover={{ 
                    y: -12,
                    transition: {
                      type: "spring",
                      stiffness: 400,
                      damping: 25
                    }
                  }}
                  className={`${
                    id === 'spacestation-animation' ? 'bg-[#eae2df]' :
                    id === 'quarter-machine' ? 'bg-[#ACC3F2]' :
                    'bg-sand'
                  } rounded-xl sm:rounded-2xl p-4 xs:p-5 sm:p-6 md:p-8 flex flex-col min-h-full transform-gpu`}
                >
                  <div className="space-y-4 xs:space-y-5 sm:space-y-6 flex-1">
                    <h3 className={`font-martian-mono text-base sm:text-lg tracking-wider ${
                      id === 'spacestation-animation' ? 'text-ink' :
                      id === 'quarter-machine' ? 'text-ink' :
                      'text-ink'
                    }`}>
                      HARDWARE INNOVATION
                    </h3>
                    <p className="font-martian-mono text-xs sm:text-sm leading-relaxed text-ink/90">
                      Developed groundbreaking physical NFT distribution hardware that reimagined how people interact with digital collectibles. This debuted at Gary Vaynerchuk's Veecon 2022.
                    </p>
                    <ul className="space-y-2 sm:space-y-3">
                      <li className="font-martian-mono text-xs sm:text-sm leading-relaxed text-ink/90 flex items-start">
                        <span className="mr-2 text-ink/60">•</span>
                        <span>Custom vending machine architecture</span>
                      </li>
                      <li className="font-martian-mono text-xs sm:text-sm leading-relaxed text-ink/90 flex items-start">
                        <span className="mr-2 text-ink/60">•</span>
                        <span>Seamless Web3 integration</span>
                      </li>
                      <li className="font-martian-mono text-xs sm:text-sm leading-relaxed text-ink/90 flex items-start">
                        <span className="mr-2 text-ink/60">•</span>
                        <span>Physical-digital hybrid experience</span>
                      </li>
                      <li className="font-martian-mono text-xs sm:text-sm leading-relaxed text-ink/90 flex items-start">
                        <span className="mr-2 text-ink/60">•</span>
                        <span>Interactive user interface design</span>
                      </li>
                    </ul>
                  </div>
                  <div className="aspect-[16/9] bg-ink rounded-lg sm:rounded-xl overflow-hidden mt-6 sm:mt-8">
                    <iframe 
                      src="https://player.vimeo.com/video/1090277957?h=b49a61abb7&background=1&autoplay=1&loop=1&byline=0&title=0&muted=1"
                      className="w-full h-full object-cover pointer-events-none"
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      style={{ pointerEvents: 'none' }}
                    ></iframe>
                  </div>
                </motion.div>

                {/* Market Strategy */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.6,
                    delay: 0.3,
                    y: {
                      type: "spring",
                      stiffness: 400,
                      damping: 25
                    }
                  }}
                  whileHover={{ 
                    y: -12,
                    transition: {
                      type: "spring",
                      stiffness: 400,
                      damping: 25
                    }
                  }}
                  className={`${
                    id === 'spacestation-animation' ? 'bg-[#eae2df]' :
                    id === 'quarter-machine' ? 'bg-[#ACC3F2]' :
                    'bg-sand'
                  } rounded-xl sm:rounded-2xl p-4 xs:p-5 sm:p-6 md:p-8 flex flex-col min-h-full transform-gpu`}
                >
                  <div className="space-y-4 xs:space-y-5 sm:space-y-6 flex-1">
                    <h3 className={`font-martian-mono text-base sm:text-lg tracking-wider ${
                      id === 'spacestation-animation' ? 'text-ink' :
                      id === 'quarter-machine' ? 'text-ink' :
                      'text-ink'
                    }`}>
                      MARKET STRATEGY
                    </h3>
                    <p className="font-martian-mono text-xs sm:text-sm leading-relaxed text-ink/90">
                      Executed a comprehensive go-to-market strategy focused on community and engagement.
                    </p>
                    <ul className="space-y-2 sm:space-y-3">
                      <li className="font-martian-mono text-xs sm:text-sm leading-relaxed text-ink/90 flex items-start">
                        <span className="mr-2 text-ink/60">•</span>
                        <span>Event-driven launches</span>
                      </li>
                      <li className="font-martian-mono text-xs sm:text-sm leading-relaxed text-ink/90 flex items-start">
                        <span className="mr-2 text-ink/60">•</span>
                        <span>Creator partnerships</span>
                      </li>
                      <li className="font-martian-mono text-xs sm:text-sm leading-relaxed text-ink/90 flex items-start">
                        <span className="mr-2 text-ink/60">•</span>
                        <span>Gamified community building</span>
                      </li>
                      <li className="font-martian-mono text-xs sm:text-sm leading-relaxed text-ink/90 flex items-start">
                        <span className="mr-2 text-ink/60">•</span>
                        <span>Strategic venue partnerships</span>
                      </li>
                    </ul>
                  </div>
                  <div className="aspect-[16/9] bg-ink rounded-lg sm:rounded-xl overflow-hidden mt-6 sm:mt-8">
                    <iframe 
                      src="https://player.vimeo.com/video/1090277957?h=b49a61abb7&background=1&autoplay=1&loop=1&byline=0&title=0&muted=1"
                      className="w-full h-full object-cover pointer-events-none"
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      style={{ pointerEvents: 'none' }}
                    ></iframe>
                  </div>
                </motion.div>
              </>
            ) : (
              <>
                {/* Content Strategy */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.6,
                    y: {
                      type: "spring",
                      stiffness: 400,
                      damping: 25
                    }
                  }}
                  whileHover={{ 
                    y: -12,
                    boxShadow: "0 12px 24px rgba(255, 102, 0, 0.15)",
                    transition: {
                      type: "spring",
                      stiffness: 400,
                      damping: 25
                    }
                  }}
                  className={`${
                    id === 'spacestation-animation' ? 'bg-olive' :
                    id === 'quarter-machine' ? 'bg-[#ACC3F2]' :
                    'bg-sand'
                  } rounded-xl sm:rounded-2xl p-4 xs:p-5 sm:p-6 md:p-8 flex flex-col min-h-full transform-gpu`}
                >
                  <div className="space-y-4 xs:space-y-5 sm:space-y-6 flex-1">
                    <h3 className={`font-martian-mono text-base sm:text-lg tracking-wider ${
                      id === 'spacestation-animation' ? 'text-sand' :
                      id === 'quarter-machine' ? 'text-ink' :
                      'text-ink'
                    }`}>
                      CONTENT STRATEGY
                    </h3>
                    <p className={`font-martian-mono text-xs sm:text-sm leading-relaxed ${
                      id === 'spacestation-animation' ? 'text-sand/90' :
                      id === 'quarter-machine' ? 'text-ink/90' :
                      'text-ink/90'
                    }`}>
                      {project.approach.contentBased.description}
                    </p>
                    <ul className="space-y-2 sm:space-y-3">
                      {project.approach.contentBased.points.map((point, index) => (
                        <li key={index} className={`font-martian-mono text-xs sm:text-sm leading-relaxed ${
                          id === 'spacestation-animation' ? 'text-sand/90' :
                          id === 'quarter-machine' ? 'text-ink/90' :
                          'text-ink/90'
                        } flex items-start`}>
                          <span className={`mr-2 ${
                            id === 'spacestation-animation' ? 'text-sand/60' :
                            id === 'quarter-machine' ? 'text-ink/60' :
                            'text-ink/60'
                          }`}>•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="aspect-[16/9] bg-ink rounded-lg sm:rounded-xl overflow-hidden mt-6 sm:mt-8">
                    <iframe 
                      src="https://player.vimeo.com/video/1088910218?h=83ad204ec5&background=1&autoplay=1&loop=1&byline=0&title=0&muted=1"
                      className="w-full h-full object-cover pointer-events-none"
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      style={{ pointerEvents: 'none' }}
                    ></iframe>
                  </div>
                </motion.div>

                {/* Brand Development */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.6,
                    delay: 0.1,
                    y: {
                      type: "spring",
                      stiffness: 400,
                      damping: 25
                    }
                  }}
                  whileHover={{ 
                    y: -12,
                    boxShadow: "0 12px 24px rgba(255, 102, 0, 0.15)",
                    transition: {
                      type: "spring",
                      stiffness: 400,
                      damping: 25
                    }
                  }}
                  className={`${
                    id === 'spacestation-animation' ? 'bg-olive' :
                    id === 'quarter-machine' ? 'bg-[#ACC3F2]' :
                    'bg-sand'
                  } rounded-xl sm:rounded-2xl p-4 xs:p-5 sm:p-6 md:p-8 flex flex-col min-h-full transform-gpu`}
                >
                  <div className="space-y-4 xs:space-y-5 sm:space-y-6 flex-1">
                    <h3 className={`font-martian-mono text-base sm:text-lg tracking-wider ${
                      id === 'spacestation-animation' ? 'text-sand' :
                      id === 'quarter-machine' ? 'text-ink' :
                      'text-ink'
                    }`}>
                      BRAND DEVELOPMENT
                    </h3>
                    <p className={`font-martian-mono text-xs sm:text-sm leading-relaxed ${
                      id === 'spacestation-animation' ? 'text-sand/90' :
                      id === 'quarter-machine' ? 'text-ink/90' :
                      'text-ink/90'
                    }`}>
                      {project.approach.visualIdentity.description}
                    </p>
                    <ul className="space-y-2 sm:space-y-3">
                      {project.approach.visualIdentity.points.map((point, index) => (
                        <li key={index} className={`font-martian-mono text-xs sm:text-sm leading-relaxed ${
                          id === 'spacestation-animation' ? 'text-sand/90' :
                          id === 'quarter-machine' ? 'text-ink/90' :
                          'text-ink/90'
                        } flex items-start`}>
                          <span className={`mr-2 ${
                            id === 'spacestation-animation' ? 'text-sand/60' :
                            id === 'quarter-machine' ? 'text-ink/60' :
                            'text-ink/60'
                          }`}>•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="aspect-[16/9] bg-ink rounded-lg sm:rounded-xl overflow-hidden mt-6 sm:mt-8">
                    <iframe 
                      src="https://player.vimeo.com/video/1088923080?h=7771779499&background=1&autoplay=1&loop=1&byline=0&title=0&muted=1"
                      className="w-full h-full object-cover pointer-events-none"
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      style={{ pointerEvents: 'none' }}
                    ></iframe>
                  </div>
                </motion.div>

                {/* Digital Experience */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.6,
                    delay: 0.2,
                    y: {
                      type: "spring",
                      stiffness: 400,
                      damping: 25
                    }
                  }}
                  whileHover={{ 
                    y: -12,
                    boxShadow: "0 12px 24px rgba(255, 102, 0, 0.15)",
                    transition: {
                      type: "spring",
                      stiffness: 400,
                      damping: 25
                    }
                  }}
                  className={`${
                    id === 'spacestation-animation' ? 'bg-olive' :
                    id === 'quarter-machine' ? 'bg-[#ACC3F2]' :
                    'bg-sand'
                  } rounded-xl sm:rounded-2xl p-4 xs:p-5 sm:p-6 md:p-8 flex flex-col min-h-full transform-gpu`}
                >
                  <div className="space-y-4 xs:space-y-5 sm:space-y-6 flex-1">
                    <h3 className={`font-martian-mono text-base sm:text-lg tracking-wider ${
                      id === 'spacestation-animation' ? 'text-sand' :
                      id === 'quarter-machine' ? 'text-ink' :
                      'text-ink'
                    }`}>
                      DIGITAL EXPERIENCE
                    </h3>
                    <p className={`font-martian-mono text-xs sm:text-sm leading-relaxed ${
                      id === 'spacestation-animation' ? 'text-sand/90' :
                      id === 'quarter-machine' ? 'text-ink/90' :
                      'text-ink/90'
                    }`}>
                      {project.approach.platformInnovation.description}
                    </p>
                    <ul className="space-y-2 sm:space-y-3">
                      {project.approach.platformInnovation.points.map((point, index) => (
                        <li key={index} className={`font-martian-mono text-xs sm:text-sm leading-relaxed ${
                          id === 'spacestation-animation' ? 'text-sand/90' :
                          id === 'quarter-machine' ? 'text-ink/90' :
                          'text-ink/90'
                        } flex items-start`}>
                          <span className={`mr-2 ${
                            id === 'spacestation-animation' ? 'text-sand/60' :
                            id === 'quarter-machine' ? 'text-ink/60' :
                            'text-ink/60'
                          }`}>•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="aspect-[16/9] bg-ink rounded-lg sm:rounded-xl overflow-hidden mt-6 sm:mt-8">
                    <iframe 
                      src="https://player.vimeo.com/video/1088917116?h=b8cc737662&background=1&autoplay=1&loop=1&byline=0&title=0&muted=1"
                      className="w-full h-full object-cover pointer-events-none"
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      style={{ pointerEvents: 'none' }}
                    ></iframe>
                  </div>
                </motion.div>

                {/* Business Operations */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.6,
                    delay: 0.3,
                    y: {
                      type: "spring",
                      stiffness: 400,
                      damping: 25
                    }
                  }}
                  whileHover={{ 
                    y: -12,
                    boxShadow: "0 12px 24px rgba(255, 102, 0, 0.15)",
                    transition: {
                      type: "spring",
                      stiffness: 400,
                      damping: 25
                    }
                  }}
                  className={`${
                    id === 'spacestation-animation' ? 'bg-olive' :
                    id === 'quarter-machine' ? 'bg-[#ACC3F2]' :
                    'bg-sand'
                  } rounded-xl sm:rounded-2xl p-4 xs:p-5 sm:p-6 md:p-8 flex flex-col min-h-full transform-gpu`}
                >
                  <div className="space-y-4 xs:space-y-5 sm:space-y-6 flex-1">
                    <h3 className={`font-martian-mono text-base sm:text-lg tracking-wider ${
                      id === 'spacestation-animation' ? 'text-sand' :
                      id === 'quarter-machine' ? 'text-ink' :
                      'text-ink'
                    }`}>
                      BUSINESS OPERATIONS
                    </h3>
                    <p className={`font-martian-mono text-xs sm:text-sm leading-relaxed ${
                      id === 'spacestation-animation' ? 'text-sand/90' :
                      id === 'quarter-machine' ? 'text-ink/90' :
                      'text-ink/90'
                    }`}>
                      {project.approach.productionSystems.description}
                    </p>
                    <ul className="space-y-2 sm:space-y-3">
                      {project.approach.productionSystems.points.map((point, index) => (
                        <li key={index} className={`font-martian-mono text-xs sm:text-sm leading-relaxed ${
                          id === 'spacestation-animation' ? 'text-sand/90' :
                          id === 'quarter-machine' ? 'text-ink/90' :
                          'text-ink/90'
                        } flex items-start`}>
                          <span className={`mr-2 ${
                            id === 'spacestation-animation' ? 'text-sand/60' :
                            id === 'quarter-machine' ? 'text-ink/60' :
                            'text-ink/60'
                          }`}>•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="aspect-[16/9] bg-ink rounded-lg sm:rounded-xl overflow-hidden mt-6 sm:mt-8">
                    <iframe 
                      src="https://player.vimeo.com/video/1088915422?h=e1b4ee974f&background=1&autoplay=1&loop=1&byline=0&title=0&muted=1"
                      className="w-full h-full object-cover pointer-events-none"
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      style={{ pointerEvents: 'none' }}
                    ></iframe>
                  </div>
                </motion.div>
              </>
            )}
          </div>
        </section>

        {/* Execution & Results Section */}
        <section className="mb-16 sm:mb-24 md:mb-32">
          <h2 className="font-display font-black text-[2rem] xs:text-[2.25rem] sm:text-[2.5rem] leading-none mb-8 xs:mb-12 sm:mb-16">
            <GlitchText text="EXECUTION & RESULTS" />
          </h2>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-5 sm:gap-6 lg:gap-8 mb-8 xs:mb-10 sm:mb-12 lg:mb-16">
            {id === 'spacestation-animation' ? (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="bg-orange rounded-xl sm:rounded-2xl p-4 xs:p-5 sm:p-6 md:p-8 text-ink relative overflow-hidden"
                >
                  <MetricsBackground />
                  <div className="relative z-10">
                    <div className="font-display font-semibold text-2xl xs:text-3xl sm:text-4xl mb-1 xs:mb-2">
                      <GlitchNumber value="70+" />
                    </div>
                    <div className="font-martian-mono text-[0.65rem] xs:text-xs sm:text-sm tracking-wider mb-2 xs:mb-3 sm:mb-4">YOUTUBE VIDEOS</div>
                    <div className="font-martian-mono text-[0.65rem] xs:text-xs sm:text-sm leading-relaxed opacity-90">Produced by Spacestation Animation</div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="bg-orange rounded-xl sm:rounded-2xl p-4 xs:p-5 sm:p-6 md:p-8 text-ink relative overflow-hidden"
                >
                  <MetricsBackground />
                  <div className="relative z-10">
                    <div className="font-display font-semibold text-2xl xs:text-3xl sm:text-4xl mb-1 xs:mb-2">
                      <GlitchNumber 
                        value="417.83M+" 
                        duration={2}
                        calmMode={true}
                      />
                    </div>
                    <div className="font-martian-mono text-[0.65rem] xs:text-xs sm:text-sm tracking-wider mb-2 xs:mb-3 sm:mb-4">VIEWS</div>
                    <div className="font-martian-mono text-[0.65rem] xs:text-xs sm:text-sm leading-relaxed opacity-90">On YouTube</div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-orange rounded-xl sm:rounded-2xl p-4 xs:p-5 sm:p-6 md:p-8 text-ink relative overflow-hidden"
                >
                  <MetricsBackground />
                  <div className="relative z-10">
                    <div className="font-display font-semibold text-2xl xs:text-3xl sm:text-4xl mb-1 xs:mb-2">
                      <GlitchNumber value="1.6BN+" />
                    </div>
                    <div className="font-martian-mono text-[0.65rem] xs:text-xs sm:text-sm tracking-wider mb-2 xs:mb-3 sm:mb-4">VIEWS</div>
                    <div className="font-martian-mono text-[0.65rem] xs:text-xs sm:text-sm leading-relaxed opacity-90">On YouTube Shorts</div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="bg-orange rounded-xl sm:rounded-2xl p-4 xs:p-5 sm:p-6 md:p-8 text-ink relative overflow-hidden"
                >
                  <MetricsBackground />
                  <div className="relative z-10">
                    <div className="font-display font-semibold text-2xl xs:text-3xl sm:text-4xl mb-1 xs:mb-2">
                      <GlitchNumber value="900k+" />
                    </div>
                    <div className="font-martian-mono text-[0.65rem] xs:text-xs sm:text-sm tracking-wider mb-2 xs:mb-3 sm:mb-4">SUBSCRIBERS</div>
                    <div className="font-martian-mono text-[0.65rem] xs:text-xs sm:text-sm leading-relaxed opacity-90">On YouTube</div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="bg-orange rounded-xl sm:rounded-2xl p-4 xs:p-5 sm:p-6 md:p-8 text-ink relative overflow-hidden"
                >
                  <MetricsBackground />
                  <div className="relative z-10">
                    <div className="font-display font-semibold text-2xl xs:text-3xl sm:text-4xl mb-1 xs:mb-2">
                      <GlitchNumber value="1.54M+" />
                    </div>
                    <div className="font-martian-mono text-[0.65rem] xs:text-xs sm:text-sm tracking-wider mb-2 xs:mb-3 sm:mb-4">SUBSCRIBERS</div>
                    <div className="font-martian-mono text-[0.65rem] xs:text-xs sm:text-sm leading-relaxed opacity-90">On YouTube Shorts</div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="bg-orange rounded-xl sm:rounded-2xl p-4 xs:p-5 sm:p-6 md:p-8 text-ink relative overflow-hidden"
                >
                  <MetricsBackground />
                  <div className="relative z-10">
                    <div className="font-display font-semibold text-2xl xs:text-3xl sm:text-4xl mb-1 xs:mb-2 flex items-baseline">
                      <motion.span
                        initial={{ opacity: 1 }}
                        animate={{
                          opacity: [1, 0, 1, 0, 1],
                          x: [0, -2, 2, -1, 0],
                        }}
                        transition={{
                          duration: 0.5,
                          times: [0, 0.25, 0.5, 0.75, 1],
                          repeat: 2,
                          repeatDelay: 0.1
                        }}
                        className="currency-symbol"
                      >
                        $
                      </motion.span>
                      <motion.span
                        className="absolute left-0"
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: [0, 1, 0],
                          x: [0, -1, 1, 0],
                        }}
                        transition={{
                          duration: 0.5,
                          times: [0, 0.25, 0.5, 0.75, 1],
                          repeat: 2,
                          repeatDelay: 0.1
                        }}
                      >
                        {['¥', '€', '£', '₿'][Math.floor(Math.random() * 4)]}
                      </motion.span>
                      <GlitchNumber 
                        value="8.34M+"
                        glitchChars={['7.34', '8.56', '9.12', '8.34']}
                        glitchSuffixes={['M+', 'MM+', 'M+']}
                      />
                    </div>
                    <div className="font-martian-mono text-[0.65rem] xs:text-xs sm:text-sm tracking-wider mb-2 xs:mb-3 sm:mb-4">MERCH REVENUE</div>
                    <div className="font-martian-mono text-[0.65rem] xs:text-xs sm:text-sm leading-relaxed opacity-90">With A for Adley Brand</div>
                  </div>
                </motion.div>
              </>
            ) : (
              <>
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
              </>
            )}
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
                  <span>{result === "Built immersive digital portfolio platform" ? "Utilized assets for merchandise and product increasing sales" : 
                         result === "Created efficient production pipeline reducing delivery time by 40%" ? "Created efficient production pipeline reducing delivery time by approx. 40%" :
                         result === "Established Spacestation Animation as a premier animation studio" ? "Successfully recruited and trained a team of 20-30 professionals across all animation disciplines and placed an industry veteran as Studio Director" :
                         result}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Quarter Machine specific sections */}
        {id === 'quarter-machine' && (
          <div className="space-y-32">
            <ErrorBoundary fallback={<div>Error loading Innovation Methodology section</div>}>
              <Suspense fallback={
                <div className="h-96 bg-ink/10 rounded-xl animate-pulse">
                  <div className="h-full flex items-center justify-center text-sand/50">Loading Innovation Methodology...</div>
                </div>
              }>
                <ProjectSpecificComponents>
                  {(components) => <components.InnovationMethodology />}
                </ProjectSpecificComponents>
              </Suspense>
            </ErrorBoundary>
            
            <ErrorBoundary fallback={<div>Error loading Lessons & Insights section</div>}>
              <Suspense fallback={
                <div className="h-96 bg-ink/10 rounded-xl animate-pulse">
                  <div className="h-full flex items-center justify-center text-sand/50">Loading Lessons & Insights...</div>
                </div>
              }>
                <ProjectSpecificComponents>
                  {(components) => <components.LessonsInsights />}
                </ProjectSpecificComponents>
              </Suspense>
            </ErrorBoundary>
          </div>
        )}

                  {/* Visual Archives Section */}
        <section className="mb-8 xs:mb-10 sm:mb-12 lg:mb-16">
          {(() => {
            const VisualArchivesComponent = getProjectComponent(project, 'visualArchives', 'MajorProjects');
            return <VisualArchivesComponent media={project.visualArchives} />;
          })()}
        </section>

        {/* Impact and Legacy Section */}
        <section className="mb-12 xs:mb-16 sm:mb-24 lg:mb-32">
          <ImpactLegacy impact={project.impact} />
        </section>

        {/* Project Evolution Section - Quarter Machine Only */}
        {id === 'quarter-machine' && (
          <section className="mb-12 xs:mb-16 sm:mb-24 lg:mb-32">
            <Suspense fallback={<div className="h-64 bg-ink/10 rounded-xl animate-pulse" />}>
              <ProjectSpecificComponents>
                {(components) => <components.ProjectEvolution />}
              </ProjectSpecificComponents>
            </Suspense>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails; 