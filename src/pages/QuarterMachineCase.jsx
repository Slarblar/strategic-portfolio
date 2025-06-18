import React from 'react';
import { motion } from 'framer-motion';
import CaseStudyLayout from '../components/CaseStudyLayout';
import Challenge from '../components/Challenge';
import ImpactLegacy from '../components/ImpactLegacy';
import ModularVideoPlayer from '../components/ModularVideoPlayer';
import FlexibleVideoPlayer from '../components/FlexibleVideoPlayer';
import MajorProjects from '../components/MajorProjects';
import MetricsBackground from '../components/MetricsBackground';
import GlitchText from '../components/GlitchText';
import GlitchNumber from '../components/GlitchNumber';
import { usePerformance, optimizedAnimations } from '../hooks/usePerformance';
import quarterMachineData from '../data/quarterMachineData';

const QuarterMachineCase = () => {
  const data = quarterMachineData;
  const { shouldReduceAnimations } = usePerformance();

  // Challenge component
  const challengeComponent = (
    <Challenge 
      bgColor={data.bgColor}
      textColor={data.textColor}
      id="quarter-machine"
    />
  );

  // Hero content component using original beautiful design
  const heroContent = (
    <>
      {/* Split Screen Layout for DESKTOP (xl and up) */}
      <div className="hidden xl:flex gap-6 mb-16 sm:mb-24 md:mb-32">
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
              href="https://quartermachine.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full h-full"
              whileHover={{ scale: 1.05 }}
              transition={{
                scale: {
                  type: "spring",
                  stiffness: 300,
                  damping: 25
                }
              }}
            >
              <motion.div 
                className="w-full h-full flex items-center justify-center p-8"
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
                  src="/images/qm/qm-logo.png"
                  alt="Quarter Machine logo showcase"
                  className="w-full h-full object-contain scale-125"
                />
              </motion.div>
            </motion.a>
          </div>
        </motion.div>

        {/* Supporting Images Column */}
        <div className="w-5/12 space-y-6">
          {/* Supporting Video 1 */}
          <FlexibleVideoPlayer
            videoType="gumlet"
            videoId="6840c5fc2ea48d13d445a28e"
            aspectRatio="aspect-[2/3]"
            animationDelay={0.2}
            autoplay={true}
            loop={true}
          />

          {/* Supporting Video 2 */}
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
              projectId="quarter-machine"
              section="hero-desktop"
              className="w-full h-full"
            />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Mobile, Tablet, & Large Tablet/iPad Pro Layout (hidden on xl and up) */}
      <div className="xl:hidden space-y-4 mb-16 sm:mb-24 md:mb-32">
        <motion.a
          href="https://quartermachine.com"
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
              src="/images/qm/qm-logo.png"
              alt="Quarter Machine logo showcase"
              className="w-full h-full object-contain scale-125"
            />
          </motion.div>
        </motion.a>
        
        {/* Supporting Video 1 */}
        <FlexibleVideoPlayer
          videoType="gumlet"
          videoId="6840c5fc2ea48d13d445a28e"
          aspectRatio="aspect-[2/3]"
          className="w-full"
          animationDelay={0.2}
          autoplay={true}
          loop={true}
          initial={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />
        
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
              projectId="quarter-machine"
              section="mobile-square"
              className="w-full h-full"
            />
          </motion.div>
        </motion.div>
      </div>
    </>
  );

  return (
    <CaseStudyLayout
      title={data.title}
      subtitle={data.subtitle}
      customVideoSrc="https://play.gumlet.io/embed/684112f32ea48d13d446c58c?preload=true&autoplay=true&loop=true&background=true&disable_player_controls=true"
      bgColor={data.bgColor}
      textColor={data.textColor}
      roles={data.roles}
      timeframe={data.timeframe}
      description={data.description}
      challengeComponent={challengeComponent}
      heroContent={heroContent}
    >
      {/* Quarter Machine doesn't need additional components for now */}

      {/* My Approach Section - Using Original Beautiful Design for Quarter Machine */}
      <div className="max-w-[2400px] mx-auto px-6 lg:px-12">
        <section className="pt-12 sm:pt-16 md:pt-20 lg:pt-24 mb-12 sm:mb-16 md:mb-24 lg:mb-32">
          <h2 className="font-display font-black text-[1.75rem] xs:text-[2rem] sm:text-[2.25rem] lg:text-[2.5rem] leading-none mb-12 xs:mb-14 sm:mb-14 lg:mb-16">
            <GlitchText text="MY APPROACH" />
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-4 gap-6 xs:gap-6 sm:gap-6 lg:gap-8">
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
              className="bg-[#ACC3F2] rounded-xl sm:rounded-2xl p-4 xs:p-5 sm:p-6 md:p-8 flex flex-col min-h-full transform-gpu"
            >
              <div className="space-y-4 xs:space-y-5 sm:space-y-6 flex-1">
                <h3 className="font-martian-mono text-base sm:text-lg tracking-wider text-ink">
                  TECHNICAL ARCHITECTURE
                </h3>
                <p className="font-martian-mono text-xs sm:text-sm leading-relaxed text-ink/90">
                  Designed robust technical infrastructure to support Web3 operations:
                </p>
                <ul className="space-y-2 sm:space-y-3">
                  <li className="font-martian-mono text-xs sm:text-sm leading-relaxed text-ink/90 flex items-start">
                    <span className="mr-2 text-ink/60">•</span>
                    <span>Multi-blockchain compatibility</span>
                  </li>
                  <li className="font-martian-mono text-xs sm:text-sm leading-relaxed text-ink/90 flex items-start">
                    <span className="mr-2 text-ink/60">•</span>
                    <span>Gasless transaction implementation</span>
                  </li>
                  <li className="font-martian-mono text-xs sm:text-sm leading-relaxed text-ink/90 flex items-start">
                    <span className="mr-2 text-ink/60">•</span>
                    <span>Scalable smart contract architecture</span>
                  </li>
                  <li className="font-martian-mono text-xs sm:text-sm leading-relaxed text-ink/90 flex items-start">
                    <span className="mr-2 text-ink/60">•</span>
                    <span>Integrated payment processing</span>
                  </li>
                </ul>
              </div>
              <div className="aspect-[16/9] bg-ink rounded-lg sm:rounded-xl overflow-hidden mt-6 sm:mt-8">
                <ModularVideoPlayer
                  projectId="quarter-machine"
                  section="technical-architecture"
                  className="w-full h-full"
                />
              </div>
            </motion.div>

            {/* User Experience Design */}
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
              className="bg-[#ACC3F2] rounded-xl sm:rounded-2xl p-4 xs:p-5 sm:p-6 md:p-8 flex flex-col min-h-full transform-gpu"
            >
              <div className="space-y-4 xs:space-y-5 sm:space-y-6 flex-1">
                <h3 className="font-martian-mono text-base sm:text-lg tracking-wider text-ink">
                  USER EXPERIENCE DESIGN
                </h3>
                <p className="font-martian-mono text-xs sm:text-sm leading-relaxed text-ink/90">
                  Created intuitive interfaces that made Web3 accessible to mainstream users:
                </p>
                <ul className="space-y-2 sm:space-y-3">
                  <li className="font-martian-mono text-xs sm:text-sm leading-relaxed text-ink/90 flex items-start">
                    <span className="mr-2 text-ink/60">•</span>
                    <span>Simplified onboarding process</span>
                  </li>
                  <li className="font-martian-mono text-xs sm:text-sm leading-relaxed text-ink/90 flex items-start">
                    <span className="mr-2 text-ink/60">•</span>
                    <span>Educational content integration</span>
                  </li>
                  <li className="font-martian-mono text-xs sm:text-sm leading-relaxed text-ink/90 flex items-start">
                    <span className="mr-2 text-ink/60">•</span>
                    <span>Mobile-first responsive design</span>
                  </li>
                  <li className="font-martian-mono text-xs sm:text-sm leading-relaxed text-ink/90 flex items-start">
                    <span className="mr-2 text-ink/60">•</span>
                    <span>Accessibility compliance</span>
                  </li>
                </ul>
              </div>
              <div className="aspect-[16/9] bg-ink rounded-lg sm:rounded-xl overflow-hidden mt-6 sm:mt-8">
                <ModularVideoPlayer
                  projectId="quarter-machine"
                  section="user-experience"
                  className="w-full h-full"
                />
              </div>
            </motion.div>

            {/* Platform Innovation */}
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
              className="bg-[#ACC3F2] rounded-xl sm:rounded-2xl p-4 xs:p-5 sm:p-6 md:p-8 flex flex-col min-h-full transform-gpu"
            >
              <div className="space-y-4 xs:space-y-5 sm:space-y-6 flex-1">
                <h3 className="font-martian-mono text-base sm:text-lg tracking-wider text-ink">
                  PLATFORM INNOVATION
                </h3>
                <p className="font-martian-mono text-xs sm:text-sm leading-relaxed text-ink/90">
                  Pioneered new approaches to digital ownership and community engagement:
                </p>
                <ul className="space-y-2 sm:space-y-3">
                  <li className="font-martian-mono text-xs sm:text-sm leading-relaxed text-ink/90 flex items-start">
                    <span className="mr-2 text-ink/60">•</span>
                    <span>Hybrid physical-digital experiences</span>
                  </li>
                  <li className="font-martian-mono text-xs sm:text-sm leading-relaxed text-ink/90 flex items-start">
                    <span className="mr-2 text-ink/60">•</span>
                    <span>Community centric development</span>
                  </li>
                  <li className="font-martian-mono text-xs sm:text-sm leading-relaxed text-ink/90 flex items-start">
                    <span className="mr-2 text-ink/60">•</span>
                    <span>Unique modular tech application</span>
                  </li>
                  <li className="font-martian-mono text-xs sm:text-sm leading-relaxed text-ink/90 flex items-start">
                    <span className="mr-2 text-ink/60">•</span>
                    <span>Cross-platform interoperability</span>
                  </li>
                </ul>
              </div>
              <div className="aspect-[16/9] bg-ink rounded-lg sm:rounded-xl overflow-hidden mt-6 sm:mt-8">
                                  <ModularVideoPlayer
                    projectId="quarter-machine"
                    section="platform-innovation"
                    className="w-full h-full"
                  />
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
              className="bg-[#ACC3F2] rounded-xl sm:rounded-2xl p-4 xs:p-5 sm:p-6 md:p-8 flex flex-col min-h-full transform-gpu"
            >
              <div className="space-y-4 xs:space-y-5 sm:space-y-6 flex-1">
                <h3 className="font-martian-mono text-base sm:text-lg tracking-wider text-ink">
                  PARTNERSHIPS & COLLABORATIONS
                </h3>
                <p className="font-martian-mono text-xs sm:text-sm leading-relaxed text-ink/90">
                  Established valuable partnerships across different industries and demographics:
                </p>
                <ul className="space-y-2 sm:space-y-3">
                  <li className="font-martian-mono text-xs sm:text-sm leading-relaxed text-ink/90 flex items-start">
                    <span className="mr-2 text-ink/60">•</span>
                    <span>Compliance and legal framework</span>
                  </li>
                                      <li className="font-martian-mono text-xs sm:text-sm leading-relaxed text-ink/90 flex items-start">
                      <span className="mr-2 text-ink/60">•</span>
                      <span>Domestic and global logistics</span>
                    </li>
                    <li className="font-martian-mono text-xs sm:text-sm leading-relaxed text-ink/90 flex items-start">
                      <span className="mr-2 text-ink/60">•</span>
                      <span>Revenue diversification strategy</span>
                    </li>
                    <li className="font-martian-mono text-xs sm:text-sm leading-relaxed text-ink/90 flex items-start">
                      <span className="mr-2 text-ink/60">•</span>
                      <span>Art and Experiential event partnerships</span>
                    </li>
                </ul>
              </div>
              <div className="aspect-[16/9] bg-ink rounded-lg sm:rounded-xl overflow-hidden mt-6 sm:mt-8">
                                  <ModularVideoPlayer
                    projectId="quarter-machine"
                    section="partnerships"
                    className="w-full h-full"
                  />
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Execution & Results Section - Using Original Beautiful Design */}
      <div className="max-w-[2400px] mx-auto px-6 lg:px-12">
        <section className="mb-16 sm:mb-24 md:mb-32">
          <h2 className="font-display font-black text-[2rem] xs:text-[2.25rem] sm:text-[2.5rem] leading-none mb-8 xs:mb-12 sm:mb-16">
            <GlitchText text="EXECUTION & RESULTS" />
          </h2>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-5 sm:gap-6 lg:gap-8 mb-8 xs:mb-10 sm:mb-12 lg:mb-16">
            {data.results.metrics.map((metric, index) => (
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

          {/* Major Projects using original component */}
          <MajorProjects media={data.visualArchives} />
        </section>
      </div>

      {/* Impact & Legacy Section */}
      <div className="max-w-[2400px] mx-auto px-6 lg:px-12">
        <ImpactLegacy impact={{
          shortTerm: [
            'Immediate market validation through social community growth & collaboration',
            'Strong brand recognition in Web3 space',
            'Successful event showcases',
            'Rapid partnership development'
          ],
          longTerm: [
            'Established new model for NFT distribution',
            'Created blueprint for physical-digital experiences',
            'Built foundation for future innovations',
            'Influenced industry approach to NFT accessibility'
          ],
          legacy: "Quarter Machine's innovative approach to NFT distribution created a new paradigm for how digital collectibles can be integrated into physical spaces and experiences. By combining nostalgic arcade mechanics with cutting-edge blockchain technology, we demonstrated that complex Web3 technology could be made accessible and engaging for mainstream audiences.\n\nOur success in generating significant revenue and attracting major partnerships validated the market potential for physical-digital hybrid experiences. The systems and methodologies we developed continue to influence how the industry approaches the integration of digital assets into physical spaces, setting a standard for future innovations in the NFT space."
        }} />
      </div>
    </CaseStudyLayout>
  );
};

export default QuarterMachineCase; 