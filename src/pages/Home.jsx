import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProjectCard from '../components/ProjectCard';
import { projects } from '../data/projects';
import GlitchText from '../components/GlitchText';
import UniversalVideoBackground from '../components/UniversalVideoBackground';
import { getHomeVideoConfig } from '../data/videoBackgrounds';
import '../styles/animations.css';

const Home = () => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  // Disable scroll restoration
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  const handleScrollClick = () => {
    const aboutSection = document.getElementById('about-section');
    if (aboutSection) {
      // Add smooth-scroll class temporarily
      document.documentElement.classList.add('smooth-scroll');
      aboutSection.scrollIntoView();
      // Remove the class after animation
      setTimeout(() => {
        document.documentElement.classList.remove('smooth-scroll');
      }, 1000); // 1 second should be enough for the scroll animation
    }
  };

  return (
    <div className="min-h-screen bg-ink text-cream">
      {/* Hero Section with Video */}
      <div className="relative h-[150vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <UniversalVideoBackground 
            {...getHomeVideoConfig()}
            enableMobileVideo={true}
            overlayOpacity={0.4}
            onLoad={() => setIsVideoLoaded(true)}
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
                <h1 className="!font-display !font-black text-[5.5rem] xs:text-[6rem] sm:text-[6.5rem] md:text-[7rem] xl:text-[12.65rem] 2xl:text-[12rem] !tracking-[0em] leading-[0.9] md:leading-[0.95] lg:leading-[1.05] text-sand">
                  <GlitchText text="Strategic vision" /><br />
                  <GlitchText text="meets creative" /><br />
                  <GlitchText text="execution" />
                </h1>
              </motion.div>

              {/* Scroll Indicator */}
              <motion.div 
                className="absolute bottom-8 md:bottom-[57px] left-1/2 transform -translate-x-1/2 text-center cursor-pointer group"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
                onClick={handleScrollClick}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => e.key === 'Enter' && handleScrollClick()}
              >
                <span className="font-martian-mono text-white text-xs xl:text-base uppercase tracking-wider block mb-2 group-hover:text-sky transition-colors duration-300">
                  Scroll to explore
                </span>
                <span className="text-white group-hover:text-sky transition-colors duration-300 animate-bounce text-xl xl:text-2xl inline-block">↓</span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections with Background */}
      <div className="bg-ink">
        {/* About Section */}
        <section 
          id="about-section"
          className="w-full text-sand pt-24 sm:pt-28 md:pt-[180px] pb-10 sm:pb-14 md:pb-[50px] px-6 sm:px-8 lg:px-12"
        >
          <div className="max-w-[1800px]">
            <h2 className="font-display font-black text-[1.75rem] xs:text-[2rem] sm:text-[2.25rem] md:text-[2.75rem] lg:text-[3.5rem] tracking-[0.01em] leading-[1.3] xs:leading-[1.25] sm:leading-[1.2] md:leading-[1.15] mb-8 sm:mb-10">
              Hi! I'm Jordan Nguyen – Fractional COO & Creative Director – equal parts dreamer & doer <span className="inline-block transform scale-90 origin-bottom-left">👾</span> I get energized by creating production systems that help ventures scale beyond what they thought possible. <span className="inline-block transform scale-90 origin-bottom-left">🪐</span> Check out my portfolio and let me know what you think! <span className="inline-block transform scale-90 origin-bottom-left">👽</span>
            </h2>
          </div>
        </section>

        {/* Projects Section */}
        <div className="w-full px-4 sm:px-6 lg:px-12 py-12 sm:py-24 md:py-32">
          <h2 className="font-display font-black text-[2rem] sm:text-[3rem] md:text-[4rem] lg:text-[5.5rem] tracking-[0em] leading-[1.1] mb-4 sm:mb-6 md:mb-8 text-center uppercase">
            <GlitchText text="CASE STUDIES" />
          </h2>
          <div className="relative group">
            <h3 className="font-martian-mono text-stone text-center text-xs sm:text-sm md:text-base lg:text-2xl uppercase tracking-[0.15em] mb-8 sm:mb-12 md:mb-16 lg:mb-24 mix-blend-exclusion">
              <span className="opacity-60 group-hover:opacity-90 transition-opacity duration-300">[ </span>
              <GlitchText text="Some of my Favorites" />
              <span className="opacity-60 group-hover:opacity-90 transition-opacity duration-300"> ]</span>
            </h3>
            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-30 transition-opacity duration-300">
              <div className="w-full h-full animate-gentle-static-layer1"></div>
              <div className="w-full h-full animate-gentle-static-layer2"></div>
            </div>
          </div>
          <div className="space-y-6 sm:space-y-8 max-w-[2400px]">
            {projects.filter(project => project.type === 'CASE_STUDY').map(project => (
              <ProjectCard 
                key={project.id}
                title={project.title}
                description={project.description}
                roles={project.roles}
                bgColor={project.bgColor}
                projectSlug={project.id}
                project={project}
                videoId={project.videoId}
                images={project.images}
              />
            ))}
          </div>
        </div>

        {/* View Archives Section */}
        <section className="w-full px-4 sm:px-6 lg:px-12 py-16 sm:py-20 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative bg-sand/5 backdrop-blur-md rounded-3xl border border-sand/10 p-12 sm:p-16 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange/5 via-olive/5 to-sky/5" />
              <div className="relative z-10">
                <h2 className="font-display font-black text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[3.5rem] leading-[0.85] mb-8 text-sand">
                  <GlitchText text="EXPLORE MORE" />
                </h2>
                
                <p className="font-martian-mono text-base sm:text-lg md:text-xl text-sand/70 mb-12 max-w-2xl mx-auto">
                  Dive deeper into my complete portfolio spanning years of creative work and strategic projects.
                </p>
                
                <motion.div
                  className="relative inline-block group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-orange/20 via-olive/20 to-sky/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  <Link
                    to="/archives"
                    className="relative inline-block bg-sand/5 backdrop-blur-md font-martian-mono text-lg px-12 py-4 rounded-full border border-sand/10 text-sand group-hover:text-white group-hover:border-sand/20 transition-all duration-500 tracking-wider"
                  >
                    <span className="relative z-10">VIEW ARCHIVES</span>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home; 