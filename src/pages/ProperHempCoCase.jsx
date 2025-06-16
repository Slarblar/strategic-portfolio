import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import FlexibleVideoPlayer from '../components/FlexibleVideoPlayer';
import ModularVideoPlayer from '../components/ModularVideoPlayer';

const ProperHempCoCase = () => {
  const navigate = useNavigate();
  const project = projectsData['proper-hemp-co'];
  const id = 'proper-hemp-co'; // Set the id for the component

  useEffect(() => {
    if (!project) {
      navigate('/archives');
    }
  }, [project, navigate]);

  if (!project) {
    return (
      <div className="min-h-screen bg-ink text-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse mb-4">Loading...</div>
          <div className="text-sm opacity-60">
            Looking for project: proper-hemp-co
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink text-cream">
      {/* Hero Section with Video */}
      <div className="relative h-[150vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <UniversalVideoBackground 
            {...getProjectVideoConfig('proper-hemp-co')}
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
                  <GlitchText text="PROPER HEMP CO." />
                </h1>
                
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
                  Cultivating Quality, Integrity, and Wellness
                </motion.p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Info Section */}
      <div className="bg-[#6e8c03]">
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
                    Proper Hemp Co. emerged during the early days of the CBD industry following the 2018 Farm Bill legalization, when the market was rapidly evolving but lacked established standards for premium branding and e-commerce solutions.
                  </p>
                  <p>
                    As Creative Director, I was tasked with building a comprehensive brand system, developing packaging design, and creating scalable business infrastructure that could capture market opportunities while navigating the complex regulatory landscape of a newly legal industry.
                  </p>
                  <p>
                    Launching Proper Hemp Co. in 2018-2020 presented unique obstacles in the budding CBD market:
                  </p>
                </div>
              </div>

              <Challenge 
                id={id} 
                bgColor="bg-[#6e8c03]" 
              />
            </div>

            {/* Right Column */}
            <div>
                              <div className="font-martian-mono font-bold text-xl sm:text-2xl tracking-wider text-right mb-4 sm:mb-6 py-2 text-cream">
                  CANNABIS BRAND / YEAR 2018 - 2020
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
                      maxHeight: "calc(100vh - 72px - 4rem)"
                    }}
                  >
                    <motion.a
                      href="https://properhempco.com"
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
                        className="w-full h-full flex items-center justify-center p-8 cursor-pointer bg-[#6e8c03]"
                      >
                        <div className="text-center">
                          <img 
                            src="/images/properhempco/properhempco-svg-logo-01.svg" 
                            alt="Proper Hemp Co. Logo"
                            className="w-80 h-auto mx-auto filter brightness-0 invert"
                          />
                        </div>
                      </motion.div>
                    </motion.a>
                  </div>
                </motion.div>

                {/* Supporting Images Column */}
                <div className="w-5/12 space-y-6">
                  {/* Supporting Image 1 */}
                  <motion.div 
                    className="aspect-[2/3] bg-[#6e8c03] rounded-xl overflow-hidden relative"
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
                    <FlexibleVideoPlayer
                      videoType="gumlet"
                      videoId="6847bbf52f6fbe8e1137ea4a"
                      aspectRatio="aspect-[2/3]"
                      className="w-full h-full"
                      scale={1.1875}
                      autoplay={false}
                      thumbnailSrc="/images/properhempco/portrait-1.webp"
                    />
                  </motion.div>

                  {/* Supporting Image 2 */}
                  <motion.div 
                    className="aspect-square bg-[#6e8c03] rounded-xl overflow-hidden relative"
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
                    <ModularVideoPlayer
                      projectId="proper-hemp-co"
                      section="ecommerce"
                      className="w-full h-full"
                    />
                  </motion.div>
                </div>
              </div>

              {/* Mobile Layout (xl and below) */}
              <div className="xl:hidden space-y-4">
                <motion.a
                  href="https://properhempco.com"
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
                    className="w-full aspect-[16/9] rounded-xl overflow-hidden flex items-center justify-center p-8 bg-[#6e8c03]"
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
                    <div className="text-center">
                      <img 
                        src="/images/properhempco/properhempco-svg-logo-01.svg" 
                        alt="Proper Hemp Co. Logo"
                        className="w-80 h-auto mx-auto filter brightness-0 invert"
                      />
                    </div>
                  </motion.div>
                </motion.a>

                {/* Supporting Video 1 */}
                <motion.div 
                  className="w-full aspect-[2/3] bg-[#6e8c03] rounded-xl overflow-hidden relative"
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
                  <FlexibleVideoPlayer
                    videoType="gumlet"
                    videoId="6847bbf52f6fbe8e1137ea4a"
                    aspectRatio="aspect-[2/3]"
                    className="w-full h-full"
                    scale={1.1875}
                    autoplay={false}
                    thumbnailSrc="/images/properhempco/portrait-1.webp"
                  />
                </motion.div>

                {/* Supporting Video 2 */}
                <motion.div 
                  className="w-full aspect-square bg-[#6e8c03] rounded-xl overflow-hidden relative"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.6,
                    delay: 0.4,
                    type: "spring",
                    stiffness: 100,
                    damping: 20
                  }}
                >
                  <ModularVideoPlayer
                    projectId="proper-hemp-co"
                    section="ecommerce"
                    className="w-full h-full"
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rest of the sections */}
      <div className="max-w-[2400px] mx-auto px-6 lg:px-12">
        {/* My Approach Section */}
        <section className="pt-16 sm:pt-20 md:pt-24 lg:pt-32 mb-12 sm:mb-16 md:mb-24 lg:mb-32">
          <h2 className="font-display font-black text-[1.75rem] xs:text-[2rem] sm:text-[2.25rem] lg:text-[2.5rem] leading-none mb-12 xs:mb-14 sm:mb-14 lg:mb-16">
            <GlitchText text="MY APPROACH" />
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-4 gap-6 xs:gap-6 sm:gap-6 lg:gap-8">
          {/* Premium Brand Architecture & Visual Identity */}
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
              boxShadow: "0 12px 24px rgba(110, 140, 3, 0.15)",
              transition: {
                type: "spring",
                stiffness: 400,
                damping: 25
              }
            }}
            className="bg-sand rounded-xl sm:rounded-2xl p-4 xs:p-5 sm:p-6 md:p-8 flex flex-col min-h-full transform-gpu"
          >
            <div className="space-y-4 xs:space-y-5 sm:space-y-6 flex-1">
              <h3 className="font-martian-mono text-base sm:text-lg tracking-wider text-ink">
                PREMIUM BRAND ARCHITECTURE & VISUAL IDENTITY
              </h3>
              <p className="font-martian-mono text-xs sm:text-sm leading-relaxed text-ink/90">
                In collaboration with Mike Madsen, I established Proper Hemp Co. as a quality-first brand through sophisticated design:
              </p>
              <ul className="space-y-2 sm:space-y-3">
                <li className="font-martian-mono text-xs sm:text-sm leading-relaxed text-ink/90 flex items-start">
                  <span className="mr-2 text-ink/60">•</span>
                  <span>Created comprehensive brand system that differentiated from typical cannabis branding</span>
                </li>
                <li className="font-martian-mono text-xs sm:text-sm leading-relaxed text-ink/90 flex items-start">
                  <span className="mr-2 text-ink/60">•</span>
                  <span>Developed premium visual language that built consumer trust and mainstream appeal</span>
                </li>
                <li className="font-martian-mono text-xs sm:text-sm leading-relaxed text-ink/90 flex items-start">
                  <span className="mr-2 text-ink/60">•</span>
                  <span>Established brand voice and messaging that educated consumers while building confidence</span>
                </li>
              </ul>
            </div>
            <div className="aspect-[16/9] bg-ink rounded-lg sm:rounded-xl overflow-hidden mt-6 sm:mt-8">
              <LazyApproachVideo 
                videoId="684b98ebe78588ecc933719c"
                section="brand-architecture"
                thumbnailUrl="/images/properhempco/brand-architecture/brand-architecture-thumb1.webp"
                className="w-full h-full"
              />
            </div>
          </motion.div>

          {/* Award-Winning Packaging Innovation */}
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
              boxShadow: "0 12px 24px rgba(110, 140, 3, 0.15)",
              transition: {
                type: "spring",
                stiffness: 400,
                damping: 25
              }
            }}
            className="bg-sand rounded-xl sm:rounded-2xl p-4 xs:p-5 sm:p-6 md:p-8 flex flex-col min-h-full transform-gpu"
          >
            <div className="space-y-4 xs:space-y-5 sm:space-y-6 flex-1">
              <h3 className="font-martian-mono text-base sm:text-lg tracking-wider text-ink">
                AWARD-WINNING PACKAGING INNOVATION
              </h3>
              <p className="font-martian-mono text-xs sm:text-sm leading-relaxed text-ink/90">
                I designed packaging solutions that balanced regulatory compliance with market appeal:
              </p>
              <ul className="space-y-2 sm:space-y-3">
                <li className="font-martian-mono text-xs sm:text-sm leading-relaxed text-ink/90 flex items-start">
                  <span className="mr-2 text-ink/60">•</span>
                  <span>Created award-winning modular packaging system adaptable to regulatory changes</span>
                </li>
                <li className="font-martian-mono text-xs sm:text-sm leading-relaxed text-ink/90 flex items-start">
                  <span className="mr-2 text-ink/60">•</span>
                  <span>Implemented premium materials that justified higher price points and shelf presence</span>
                </li>
                <li className="font-martian-mono text-xs sm:text-sm leading-relaxed text-ink/90 flex items-start">
                  <span className="mr-2 text-ink/60">•</span>
                  <span>Designed clear information hierarchy prioritizing safety and product details</span>
                </li>
              </ul>
            </div>
            <div className="aspect-[16/9] bg-ink rounded-lg sm:rounded-xl overflow-hidden mt-6 sm:mt-8">
              <LazyApproachVideo 
                videoId="684bf34190b0148cd2446a1d"
                section="award-winning"
                thumbnailUrl="/images/properhempco/award-winning/award_1.webp"
                className="w-full h-full"
              />
            </div>
          </motion.div>

          {/* E-Commerce Infrastructure Development */}
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
              boxShadow: "0 12px 24px rgba(110, 140, 3, 0.15)",
              transition: {
                type: "spring",
                stiffness: 400,
                damping: 25
              }
            }}
            className="bg-sand rounded-xl sm:rounded-2xl p-4 xs:p-5 sm:p-6 md:p-8 flex flex-col min-h-full transform-gpu"
          >
            <div className="space-y-4 xs:space-y-5 sm:space-y-6 flex-1">
              <h3 className="font-martian-mono text-base sm:text-lg tracking-wider text-ink">
                E-COMMERCE INFRASTRUCTURE DEVELOPMENT
              </h3>
              <p className="font-martian-mono text-xs sm:text-sm leading-relaxed text-ink/90">
                I built comprehensive digital commerce solutions to overcome payment processing challenges:
              </p>
              <ul className="space-y-2 sm:space-y-3">
                <li className="font-martian-mono text-xs sm:text-sm leading-relaxed text-ink/90 flex items-start">
                  <span className="mr-2 text-ink/60">•</span>
                  <span>Researched specialised high-risk payment processing, and configured solution for B2B sales increasing revenue by approximately 45%</span>
                </li>
                <li className="font-martian-mono text-xs sm:text-sm leading-relaxed text-ink/90 flex items-start">
                  <span className="mr-2 text-ink/60">•</span>
                  <span>Built integrated compliance tracking and automated inventory management systems</span>
                </li>
                <li className="font-martian-mono text-xs sm:text-sm leading-relaxed text-ink/90 flex items-start">
                  <span className="mr-2 text-ink/60">•</span>
                  <span>Created customer education resources integrated into shopping experience</span>
                </li>
              </ul>
            </div>
            <div className="aspect-[16/9] bg-ink rounded-lg sm:rounded-xl overflow-hidden mt-6 sm:mt-8">
              <LazyApproachVideo 
                videoId="684c419a90b0148cd2478662"
                section="e-commerce-infrastructure-development"
                thumbnailUrl="/images/properhempco/e-commerce-infastructure- development/processing_1.webp"
                className="w-full h-full"
              />
            </div>
          </motion.div>

          {/* Market Development & Client Acquisition */}
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
              boxShadow: "0 12px 24px rgba(110, 140, 3, 0.15)",
              transition: {
                type: "spring",
                stiffness: 400,
                damping: 25
              }
            }}
            className="bg-sand rounded-xl sm:rounded-2xl p-4 xs:p-5 sm:p-6 md:p-8 flex flex-col min-h-full transform-gpu"
          >
            <div className="space-y-4 xs:space-y-5 sm:space-y-6 flex-1">
              <h3 className="font-martian-mono text-base sm:text-lg tracking-wider text-ink">
                MARKET DEVELOPMENT & CLIENT ACQUISITION
              </h3>
              <p className="font-martian-mono text-xs sm:text-sm leading-relaxed text-ink/90">
                I established strategic partnerships and direct sales channels:
              </p>
              <ul className="space-y-2 sm:space-y-3">
                <li className="font-martian-mono text-xs sm:text-sm leading-relaxed text-ink/90 flex items-start">
                  <span className="mr-2 text-ink/60">•</span>
                  <span>Secured key retail partnerships through professional brand presentation</span>
                </li>
                <li className="font-martian-mono text-xs sm:text-sm leading-relaxed text-ink/90 flex items-start">
                  <span className="mr-2 text-ink/60">•</span>
                  <span>Built direct-to-consumer strategies that maximized brand loyalty and margins</span>
                </li>
                <li className="font-martian-mono text-xs sm:text-sm leading-relaxed text-ink/90 flex items-start">
                  <span className="mr-2 text-ink/60">•</span>
                  <span>Developed trade show presence and B2B sales processes for wholesale growth</span>
                </li>
              </ul>
            </div>
            <div className="aspect-[16/9] bg-ink rounded-lg sm:rounded-xl overflow-hidden mt-6 sm:mt-8">
              <LazyApproachVideo 
                videoId="684be92984f5064184ad7043"
                section="market-development"
                thumbnailUrl="/images/properhempco/market-development/market_1.webp"
                className="w-full h-full"
              />
            </div>
          </motion.div>
          </div>
        </section>

        {/* Execution & Results Section */}
        <section className="mb-12 sm:mb-16 md:mb-24 lg:mb-32">
          <h2 className="font-display font-black text-[1.75rem] xs:text-[2rem] sm:text-[2.25rem] lg:text-[2.5rem] leading-none mb-12 xs:mb-14 sm:mb-14 lg:mb-16">
            <GlitchText text="EXECUTION & RESULTS" />
          </h2>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 xs:gap-6 sm:gap-6 lg:gap-8 mb-8 xs:mb-10 sm:mb-12 lg:mb-16">
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
                      <GlitchNumber 
                        value={metric.value}
                        duration={2}
                        calmMode={true}
                      />
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
              {project.execution.results.map((result, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="font-martian-mono text-xs sm:text-sm leading-relaxed flex items-start"
                >
                  <span className="mr-2 text-orange opacity-80">•</span>
                  <span>{result}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Visual Archives */}
        {project.components?.visualArchives && (() => {
          const ArchiveComponent = getProjectComponent(project, 'visualArchives', 'VisualWorks');
          return ArchiveComponent ? <ArchiveComponent id={id} /> : null;
        })()}

        {/* Impact and Legacy */}
        <ImpactLegacy 
          impact={project.impact}
        />
      </div>
    </div>
  );
};

export default ProperHempCoCase; 