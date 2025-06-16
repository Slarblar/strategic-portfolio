import React, { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import GlitchText from '../components/GlitchText';

const AboutMe = () => {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: mapContainerRef,
    offset: ["start end", "end start"]
  });

  // Create a more precise mask position that follows scroll
  const maskYProgress = useTransform(scrollYProgress, [0.2, 0.8], [0, 100]);
  
  // Create dynamic mask gradient that reveals from top to bottom
  const maskGradient = useTransform(maskYProgress, (value) => 
    `linear-gradient(to bottom, transparent ${value}%, black ${value + 0.5}%)`
  );
  
  // Orange line should be positioned exactly at the reveal edge (top to bottom)
  const linePosition = useTransform(maskYProgress, (value) => `${value}%`);
  
  // Fade the line in during transition and out at edges
  const lineOpacity = useTransform(scrollYProgress, [0.15, 0.25, 0.75, 0.85], [0, 1, 1, 0]);



  return (
    <div className="min-h-screen bg-ink text-sand relative overflow-hidden px-4 sm:px-0">
      {/* Seamless Background Flow - Extends across all sections */}
      <div className="absolute inset-0 z-0">
        {/* Primary flowing gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/95 to-ink/90" />
        
        {/* Floating real photo elements that flow across sections - with proper spacing */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={{ opacity: 0.15, scale: 1, rotate: -3 }}
          transition={{ duration: 4, delay: 0.5 }}
          whileHover={{ 
            opacity: 0.8, 
            scale: 1.02,
            transition: { duration: 0.3, ease: "easeOut" }
          }}
          className="absolute bottom-20 left-8 sm:left-24 max-w-80 rounded-3xl backdrop-blur-sm border border-sand/5 overflow-hidden cursor-pointer group hidden md:block"
        >
          <div className="relative aspect-[4/3]">
            <img 
              src="/images/based/img/nature_1.webp" 
              alt="Utah wilderness"
              className="w-full h-full opacity-20 group-hover:opacity-90 object-cover transition-all duration-300 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-orange/10 via-olive/15 to-sky/10 group-hover:opacity-30 transition-opacity duration-300" />
            <div className="absolute inset-0 rounded-3xl group-hover:shadow-[0_0_30px_rgba(255,138,76,0.3)] transition-all duration-300" />
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 8 }}
          animate={{ opacity: 0.12, scale: 1, rotate: 5 }}
          transition={{ duration: 4, delay: 1 }}
          whileHover={{ 
            opacity: 0.75, 
            scale: 1.02,
            transition: { duration: 0.3, ease: "easeOut" }
          }}
          className="absolute top-32 sm:top-20 right-4 sm:right-24 max-w-48 sm:max-w-64 rounded-3xl backdrop-blur-sm border border-sand/5 overflow-hidden cursor-pointer group"
        >
          <div className="relative aspect-[3/4]">
            <img 
              src="/images/based/img/work_4.webp" 
              alt="Studio workspace"
              className="w-full h-full opacity-18 group-hover:opacity-85 object-cover transition-all duration-300 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-sky/10 via-orange/15 to-olive/10 group-hover:opacity-25 transition-opacity duration-300" />
            <div className="absolute inset-0 rounded-3xl group-hover:shadow-[0_0_25px_rgba(135,206,235,0.25)] transition-all duration-300" />
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -12 }}
          animate={{ opacity: 0.1, scale: 1, rotate: -8 }}
          transition={{ duration: 4, delay: 1.5 }}
          whileHover={{ 
            opacity: 0.7, 
            scale: 1.02,
            transition: { duration: 0.3, ease: "easeOut" }
          }}
          className="absolute top-1/2 left-8 sm:left-32 max-w-72 rounded-3xl backdrop-blur-sm border border-sand/5 overflow-hidden cursor-pointer group"
        >
          <div className="relative aspect-[4/5]">
            <img 
              src="/images/based/img/travel_6.webp" 
              alt="Travel moments in nature"
              className="w-full h-full object-cover opacity-16 group-hover:opacity-80 transition-all duration-300 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-olive/10 via-sky/15 to-orange/10 group-hover:opacity-20 transition-opacity duration-300" />
            <div className="absolute inset-0 rounded-3xl group-hover:shadow-[0_0_25px_rgba(107,142,35,0.25)] transition-all duration-300" />
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 15 }}
          animate={{ opacity: 0.08, scale: 1, rotate: 12 }}
          transition={{ duration: 4, delay: 2 }}
          whileHover={{ 
            opacity: 0.65, 
            scale: 1.02,
            transition: { duration: 0.3, ease: "easeOut" }
          }}
          className="absolute bottom-24 right-16 sm:right-1/4 max-w-80 rounded-3xl backdrop-blur-sm border border-sand/5 overflow-hidden cursor-pointer group"
        >
          <div className="relative aspect-[5/3]">
            <img 
              src="/images/based/img/portrait_1.webp" 
              alt="Portrait"
              className="w-full h-full object-cover opacity-14 group-hover:opacity-75 transition-all duration-300 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-orange/8 via-olive/12 to-sky/8 group-hover:opacity-15 transition-opacity duration-300" />
            <div className="absolute inset-0 rounded-3xl group-hover:shadow-[0_0_20px_rgba(255,138,76,0.2)] transition-all duration-300" />
          </div>
        </motion.div>
      </div>

      {/* Hero Section - Flows seamlessly */}
      <section className="relative min-h-[85vh] sm:min-h-screen flex items-center justify-center">
        {/* Additional flowing elements specific to hero */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 0.2, y: 0 }}
          transition={{ duration: 3, delay: 0.8 }}
          whileHover={{ 
            opacity: 0.8, 
            scale: 1.03,
            transition: { duration: 0.3, ease: "easeOut" }
          }}
          className="absolute top-20 left-20 sm:top-24 sm:left-40 max-w-64 rounded-2xl backdrop-blur-sm border border-sand/10 overflow-hidden cursor-pointer group hidden lg:block"
          style={{ transform: 'rotate(-3deg)' }}
        >
          <div className="relative aspect-[4/3]">
            <img 
              src="/images/based/img/work_3.webp" 
              alt="Creative workspace"
              className="w-full h-full opacity-20 group-hover:opacity-85 object-cover transition-all duration-300 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-orange/15 to-olive/15 group-hover:opacity-25 transition-opacity duration-300" />
            <div className="absolute inset-0 rounded-2xl group-hover:shadow-[0_0_25px_rgba(255,138,76,0.3)] transition-all duration-300" />
          </div>
        </motion.div>

        {/* Hero Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 text-center relative z-10 pt-12 sm:pt-16 md:pt-20 lg:pt-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.215, 0.610, 0.355, 1.000] }}
          >
            <h1 className="font-display font-bold text-[3rem] xs:text-[4rem] sm:text-[5rem] md:text-[6rem] lg:text-[8rem] xl:text-[10rem] leading-[0.85] tracking-tight mb-6 sm:mb-8">
              <div className="inline-block whitespace-nowrap"><GlitchText text="BASED IN" /></div>
              <br />
              <div className="inline-block whitespace-nowrap"><GlitchText text="SALT LAKE CITY" /></div>
            </h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="font-martian-mono text-base sm:text-lg md:text-xl lg:text-2xl text-sand/80 max-w-4xl mx-auto leading-relaxed px-4"
            >
              Creative operations leader working at the intersection of imagination and profit. I help ambitious and growing companies turn bold visions into sustainable, scalable businesses that drive meaningful impact.
            </motion.p>
          </motion.div>
        </div>

        {/* Seamless transition gradient to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-ink/80 to-transparent pointer-events-none" />
      </section>

      {/* Interactive Map Section - Overlaps with hero */}
      <section ref={mapRef} className="relative -mt-12 sm:-mt-16 py-24 sm:py-32 overflow-hidden">
        {/* Flowing elements that connect sections */}
        <motion.div
          initial={{ opacity: 0, x: -100, rotate: -15 }}
          whileInView={{ opacity: 0.15, x: 0, rotate: -10 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: [0.4, 0, 0.2, 1] }}
          whileHover={{ 
            opacity: 0.75, 
            scale: 1.02,
            transition: { duration: 0.3, ease: "easeOut" }
          }}
          className="absolute top-12 -left-16 max-w-72 rounded-3xl backdrop-blur-sm border border-sand/5 overflow-hidden cursor-pointer group"
        >
          <div className="relative aspect-[4/3]">
            <img 
              src="/images/based/img/travel_8.webp" 
              alt="Global adventures"
              className="w-full h-full opacity-20 group-hover:opacity-85 object-cover transition-all duration-300 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-orange/10 to-olive/10 group-hover:opacity-20 transition-opacity duration-300" />
            <div className="absolute inset-0 rounded-3xl group-hover:shadow-[0_0_30px_rgba(255,138,76,0.25)] transition-all duration-300" />
          </div>
        </motion.div>

        {/* Additional sporadic images around map section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6, rotate: 25 }}
          animate={{ opacity: 0.12, scale: 1, rotate: 18 }}
          transition={{ duration: 2.5, delay: 0.3 }}
          whileHover={{ 
            opacity: 0.7, 
            scale: 1.02,
            transition: { duration: 0.3, ease: "easeOut" }
          }}
          className="absolute top-28 right-20 sm:right-32 max-w-64 rounded-3xl backdrop-blur-sm border border-sand/5 overflow-hidden cursor-pointer group"
        >
          <div className="relative aspect-[4/3]">
            <img 
              src="/images/based/img/work_2.webp" 
              alt="Creative process"
              className="w-full h-full object-cover opacity-16 group-hover:opacity-80 transition-all duration-300 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-sky/8 to-orange/8 group-hover:opacity-15 transition-opacity duration-300" />
            <div className="absolute inset-0 rounded-3xl group-hover:shadow-[0_0_25px_rgba(135,206,235,0.25)] transition-all duration-300" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50, rotate: -20 }}
          animate={{ opacity: 0.1, y: 0, rotate: -15 }}
          transition={{ duration: 2, delay: 0.8 }}
          whileHover={{ 
            opacity: 0.65, 
            scale: 1.02,
            transition: { duration: 0.3, ease: "easeOut" }
          }}
          className="absolute bottom-40 left-20 sm:left-32 max-w-64 rounded-2xl backdrop-blur-sm border border-sand/5 overflow-hidden cursor-pointer group"
        >
          <div className="relative aspect-[4/5]">
            <img 
              src="/images/based/img/travel_2.webp" 
              alt="Travel adventures"
              className="w-full h-full object-cover opacity-18 group-hover:opacity-78 transition-all duration-300 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-olive/8 to-sky/8 group-hover:opacity-18 transition-opacity duration-300" />
            <div className="absolute inset-0 rounded-2xl group-hover:shadow-[0_0_20px_rgba(107,142,35,0.2)] transition-all duration-300" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 8 }}
          animate={{ opacity: 0.12, scale: 1, rotate: 5 }}
          transition={{ duration: 2, delay: 0.5 }}
          whileHover={{ 
            opacity: 0.7, 
            scale: 1.02,
            transition: { duration: 0.3, ease: "easeOut" }
          }}
          className="absolute bottom-8 right-8 max-w-72 rounded-3xl backdrop-blur-sm border border-sand/5 overflow-hidden cursor-pointer group rotate-3"
          style={{ bottom: 'calc(2rem + 15rem)' }}
        >
          <div className="relative aspect-[4/3]">
            <img 
              src="/images/based/img/travel_4.webp" 
              alt="Travel adventure"
              className="w-full h-full object-cover opacity-16 group-hover:opacity-80 transition-all duration-300 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-sky/8 to-orange/8 group-hover:opacity-18 transition-opacity duration-300" />
            <div className="absolute inset-0 rounded-3xl group-hover:shadow-[0_0_20px_rgba(135,206,235,0.2)] transition-all duration-300" />
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="font-display font-bold text-[2.5rem] md:text-[3.5rem] lg:text-[4.5rem] leading-[0.85] mb-6">
              <div className="inline-block whitespace-nowrap"><GlitchText text="FROM UTAH" /></div>
              <br />
              <div className="inline-block whitespace-nowrap"><GlitchText text="TO THE WORLD" /></div>
            </h2>
            <p className="font-martian-mono text-lg md:text-xl text-sand/70 max-w-3xl mx-auto">
              Rooted in Utah, ready to work with ambitious teams anywhere
            </p>
          </motion.div>

          {/* Map Container - A simple wrapper for positioning */}
          <div className="relative max-w-4xl mx-auto" ref={mapContainerRef}>
            {/* The single container that provides the shape and overflow control */}
            <div className="relative h-96 md:h-[500px] rounded-3xl overflow-hidden">
              
              {/* Scene 1: World Map (Bottom Layer - Gets Revealed) */}
              <div className="absolute inset-0 flex items-center justify-center bg-sand/5 backdrop-blur-md border border-sand/10 p-8 md:p-12">
                <div className="absolute inset-0 bg-gradient-to-br from-orange/5 via-transparent to-sky/5" />
                <img 
                  src="/images/based/world-1-01.svg" 
                  alt="World Map showing global collaboration locations"
                  className="w-full h-full max-w-2xl object-contain relative z-10"
                  style={{
                    filter: 'brightness(0) saturate(100%) invert(53%) sepia(96%) saturate(1867%) hue-rotate(360deg) brightness(98%) contrast(91%)'
                  }}
                />
              </div>

              {/* Scene 2: Utah Map (Top Layer - Starts Visible, Gets Wiped Away) */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center bg-sand/5 backdrop-blur-md border border-sand/10 p-8 md:p-12"
                style={{
                  maskImage: maskGradient,
                  WebkitMaskImage: maskGradient,
                  zIndex: 10,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange/5 via-transparent to-sky/5" />
                <img 
                  src="/images/based/utah-1-01.svg" 
                  alt="Utah Map with Salt Lake City highlighted"
                  className="w-full h-full max-w-xs object-contain relative z-10"
                  style={{
                    filter: 'brightness(0) saturate(100%) invert(96%) sepia(8%) saturate(202%) hue-rotate(349deg) brightness(105%) contrast(102%)'
                  }}
                />
              </motion.div>

              {/* Animated Wipe Line */}
              <motion.div
                className="absolute left-0 right-0 h-0.5 bg-orange shadow-[0_0_12px_1px_theme(colors.orange)]"
                style={{
                  top: linePosition,
                  opacity: lineOpacity,
                  zIndex: 20,
                }}
              />

              {/* Progress Indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30">
                <div className="flex items-center space-x-2 bg-ink/30 backdrop-blur-sm rounded-full px-4 py-2 border border-sand/10">
                  <span className="font-martian-mono text-xs text-sand/60">
                    UTAH → WORLD
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Flowing transition to bio section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 0.1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2 }}
          className="absolute bottom-0 right-0 w-full h-40 bg-gradient-to-t from-ink/60 to-transparent"
        />
      </section>

      {/* Bio Sections - Flows from map section */}
      <section className="relative -mt-20 py-32 overflow-hidden">
        {/* Continuous flowing elements */}
        <motion.div
          initial={{ opacity: 0, y: 100, rotate: 20 }}
          animate={{ opacity: 0.12, y: 0, rotate: 15 }}
          transition={{ duration: 2.5 }}
          whileHover={{ 
            opacity: 0.75, 
            scale: 1.02,
            transition: { duration: 0.3, ease: "easeOut" }
          }}
          className="absolute top-16 -left-40 max-w-96 rounded-3xl backdrop-blur-sm border border-sand/5 overflow-hidden cursor-pointer group"
        >
          <div className="relative aspect-[5/3]">
            <img 
              src="/images/based/img/nature_7.webp" 
              alt="Mountain adventure"
              className="w-full h-full object-cover opacity-18 group-hover:opacity-82 transition-all duration-300 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-olive/8 to-orange/8 group-hover:opacity-20 transition-opacity duration-300" />
            <div className="absolute inset-0 rounded-3xl group-hover:shadow-[0_0_35px_rgba(107,142,35,0.3)] transition-all duration-300" />
          </div>
        </motion.div>

        {/* More sporadic images in bio section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7, rotate: -25 }}
          animate={{ opacity: 0.1, scale: 1, rotate: -18 }}
          transition={{ duration: 2, delay: 0.5 }}
          whileHover={{ 
            opacity: 0.68, 
            scale: 1.02,
            transition: { duration: 0.3, ease: "easeOut" }
          }}
          className="absolute right-3 max-w-64 rounded-3xl backdrop-blur-sm border border-sand/5 overflow-hidden cursor-pointer group rotate-[-6deg]"
          style={{ top: 'calc(50% - 20rem)' }}
        >
          <div className="relative aspect-[3/2]">
            <img 
              src="/images/based/img/work_6.webp" 
              alt="Design work"
              className="w-full h-full object-cover opacity-14 group-hover:opacity-75 transition-all duration-300 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-orange/6 to-sky/6 group-hover:opacity-15 transition-opacity duration-300" />
            <div className="absolute inset-0 rounded-3xl group-hover:shadow-[0_0_25px_rgba(255,138,76,0.25)] transition-all duration-300" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 80, rotate: 12 }}
          animate={{ opacity: 0.08, x: 0, rotate: 8 }}
          transition={{ duration: 2.2, delay: 1 }}
          whileHover={{ 
            opacity: 0.62, 
            scale: 1.02,
            transition: { duration: 0.3, ease: "easeOut" }
          }}
          className="absolute bottom-10 right-10 max-w-64 rounded-2xl backdrop-blur-sm border border-sand/5 overflow-hidden cursor-pointer group"
        >
          <div className="relative aspect-[3/4]">
            <img 
              src="/images/based/img/travel_7.webp" 
              alt="Global travel"
              className="w-full h-full object-cover opacity-16 group-hover:opacity-72 transition-all duration-300 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-sky/8 to-olive/8 group-hover:opacity-18 transition-opacity duration-300" />
            <div className="absolute inset-0 rounded-2xl group-hover:shadow-[0_0_20px_rgba(135,206,235,0.2)] transition-all duration-300" />
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6 2xl:gap-8">
            {/* Mountain Perspective */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative group lg:col-span-1"
            >
              {/* Adjust bleeding element positioning */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, rotate: -15 }}
                whileInView={{ opacity: 0.2, scale: 1, rotate: -10 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5 }}
                className="absolute -top-12 -right-12 w-40 h-32 bg-gradient-to-br from-orange/20 to-olive/20 rounded-3xl backdrop-blur-sm border border-sand/5 group-hover:opacity-40 transition-all duration-700 hidden lg:block" 
              />
              
              <div className="relative bg-sand/5 backdrop-blur-md rounded-2xl border border-sand/10 p-8 md:p-10 h-full overflow-hidden flex flex-col min-h-[420px]">
                <div className="absolute inset-0 bg-gradient-to-br from-orange/5 via-transparent to-olive/5" />
                <div className="relative z-10 flex-1">
                  <h3 className="font-display font-bold text-2xl md:text-3xl mb-8 text-orange">
                    <div className="inline-block whitespace-nowrap"><GlitchText text="ELEVATED" /></div>
                    <br />
                    <div className="inline-block whitespace-nowrap"><GlitchText text="PERSPECTIVE" /></div>
                  </h3>
                  <p className="font-martian-mono text-sm md:text-base leading-relaxed text-sand/80 mb-16">
                    Growing up in Utah shaped how I see the world, always looking for the bigger picture while obsessing over the details. From the Creator Economy to AI, I love being on the front lines of what's next. Utah's where crazy ideas get built, and I can't help but be part of that energy.
                  </p>
                </div>
                <div className="relative z-10 border-t border-sand/10 pt-6 mt-auto">
                  <div className="font-martian-mono text-xs text-sand/60 tracking-wider">
                    ELEVATION: 4,226 FT
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Global Collaboration */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative group"
            >
              {/* Flowing bleeding element */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
                whileInView={{ opacity: 0.18, scale: 1, rotate: 8 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.3 }}
                className="absolute -bottom-8 -left-8 w-36 h-44 bg-gradient-to-br from-sky/20 to-orange/20 rounded-3xl backdrop-blur-sm border border-sand/5 group-hover:opacity-35 transition-all duration-700" 
              />
              
              <div className="relative bg-sand/5 backdrop-blur-md rounded-2xl border border-sand/10 p-8 md:p-10 h-full overflow-hidden flex flex-col min-h-[420px]">
                <div className="absolute inset-0 bg-gradient-to-br from-sky/5 via-transparent to-orange/5" />
                <div className="relative z-10 flex-1">
                  <h3 className="font-display font-bold text-2xl md:text-3xl mb-8 text-sky">
                    <div className="inline-block whitespace-nowrap"><GlitchText text="GLOBAL" /></div>
                    <br />
                    <div className="inline-block whitespace-nowrap"><GlitchText text="COLLABORATION" /></div>
                  </h3>
                  <p className="font-martian-mono text-sm md:text-base leading-relaxed text-sand/80 mb-16">
                    From Takashi Murakami and NIKE RTFKT in Tokyo to late-night calls across time zones, I've learned that great work happens when you can translate wild ideas into shared excitement. Distance fades when you're building something amazing together.
                  </p>
                </div>
                <div className="relative z-10 border-t border-sand/10 pt-6 mt-auto">
                  <div className="font-martian-mono text-xs text-sand/60 tracking-wider">
                    TIMEZONE: UTC-7 (MST)
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Beyond the Work */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative group"
            >
              {/* Flowing bleeding element */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
                whileInView={{ opacity: 0.15, scale: 1, rotate: -5 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.6 }}
                className="absolute -top-6 -left-6 w-32 h-40 bg-gradient-to-br from-olive/20 to-sky/20 rounded-3xl backdrop-blur-sm border border-sand/5 group-hover:opacity-30 transition-all duration-700" 
              />
              
              <div className="relative bg-sand/5 backdrop-blur-md rounded-2xl border border-sand/10 p-8 md:p-10 h-full overflow-hidden flex flex-col min-h-[420px]">
                <div className="absolute inset-0 bg-gradient-to-br from-olive/5 via-transparent to-sky/5" />
                <div className="relative z-10 flex-1">
                  <h3 className="font-display font-bold text-2xl md:text-3xl mb-8 text-[#98B06F]">
                    <div className="inline-block whitespace-nowrap"><GlitchText text="BEYOND" /></div>
                    <br />
                    <div className="inline-block whitespace-nowrap"><GlitchText text="THE WORK" /></div>
                  </h3>
                  <p className="font-martian-mono text-sm md:text-base leading-relaxed text-sand/80 mb-16">
                    When I'm not glued to my screen, you'll find me hiking Utah's backcountry, experimenting in TouchDesigner, or spinning Techno as "Slarblar." I get equally excited about finding the perfect pour-over spot and diving into new creative tools. Always exploring, always learning.
                  </p>
                </div>
                <div className="relative z-10 border-t border-sand/10 pt-6 mt-auto">
                  <div className="font-martian-mono text-xs text-sand/60 tracking-wider">
                    INTERESTS: MUSIC PRODUCTION, FILM, NATURE, TECH
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Seamless flow to photo section */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-ink/40 to-transparent" />
      </section>

      {/* Photo Collage Section - Flows seamlessly */}
      <section className="relative -mt-12 py-32 overflow-hidden">
        {/* Large flowing background elements */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6, rotate: -25 }}
          whileInView={{ opacity: 0.08, scale: 1, rotate: -20 }}
          viewport={{ once: true }}
          transition={{ duration: 3 }}
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange/8 via-olive/8 to-sky/8 rounded-[8rem]"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="font-display font-bold text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[3.5rem] leading-[0.85] mb-6">
              <div className="inline-block whitespace-nowrap"><GlitchText text="LIFE IN" /></div>
              <br />
              <div className="inline-block whitespace-nowrap"><GlitchText text="MOTION" /></div>
            </h2>
            <p className="font-martian-mono text-base sm:text-lg md:text-xl text-sand/70 max-w-3xl mx-auto">
              Getting inspiration from the studio, the mountains, and everywhere in between
            </p>
          </motion.div>

          {/* Enhanced Photo Grid with Unique Real Images */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 relative">
            {/* Large feature image - Nature landscape (2x2 square) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -3 }}
              whileInView={{ opacity: 1, scale: 1, rotate: -1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0, ease: [0.4, 0, 0.2, 1] }}
              whileHover={{ scale: 1.05, rotate: 0, zIndex: 10, transition: { duration: 0.3 } }}
              className="relative sm:col-span-2 md:row-span-2 aspect-square rounded-2xl overflow-hidden cursor-pointer"
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileHover={{ opacity: 1, scale: 1.2 }}
                transition={{ duration: 0.5 }}
                className="absolute -inset-6 bg-gradient-to-br from-orange/15 via-olive/15 to-sky/15 rounded-3xl -z-10" 
              />
              <img src="/images/based/img/nature_5.webp" alt="Utah landscapes" className="w-full h-full object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="font-martian-mono text-xs text-sand/80 tracking-wider">UTAH LANDSCAPES</div>
              </div>
            </motion.div>

            {/* Work image (square) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 2 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
              whileHover={{ scale: 1.05, rotate: 0, zIndex: 10, transition: { duration: 0.3 } }}
              className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer"
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileHover={{ opacity: 1, scale: 1.2 }}
                transition={{ duration: 0.5 }}
                className="absolute -inset-6 bg-gradient-to-br from-sky/15 via-orange/15 to-olive/15 rounded-3xl -z-10" 
              />
              <img src="/images/based/img/nature_6.webp" alt="Creative work" className="w-full h-full object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="font-martian-mono text-xs text-sand/80 tracking-wider">EXPLORATION</div>
              </div>
            </motion.div>

            {/* Travel image (square) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -2 }}
              whileInView={{ opacity: 1, scale: 1, rotate: -1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
              whileHover={{ scale: 1.05, rotate: 0, zIndex: 10, transition: { duration: 0.3 } }}
              className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer"
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileHover={{ opacity: 1, scale: 1.2 }}
                transition={{ duration: 0.5 }}
                className="absolute -inset-6 bg-gradient-to-br from-olive/15 via-sky/15 to-orange/15 rounded-3xl -z-10" 
              />
              <img src="/images/based/img/travel_9.webp" alt="Global travel" className="w-full h-full object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="font-martian-mono text-xs text-sand/80 tracking-wider">GLOBAL TRAVEL</div>
              </div>
            </motion.div>

            {/* Wide work image (2x1 rectangle) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 1 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
              whileHover={{ scale: 1.05, rotate: 0, zIndex: 10, transition: { duration: 0.3 } }}
              className="relative md:col-span-2 aspect-square rounded-2xl overflow-hidden cursor-pointer"
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileHover={{ opacity: 1, scale: 1.2 }}
                transition={{ duration: 0.5 }}
                className="absolute -inset-6 bg-gradient-to-br from-orange/15 via-olive/15 to-sky/15 rounded-3xl -z-10" 
              />
              <img src="/images/based/img/work_10.webp" alt="Design process" className="w-full h-full object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="font-martian-mono text-xs text-sand/80 tracking-wider">CREATIVE PROCESS</div>
              </div>
            </motion.div>

            {/* Travel adventure (square) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -1 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
              whileHover={{ scale: 1.05, rotate: 0, zIndex: 10, transition: { duration: 0.3 } }}
              className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer"
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileHover={{ opacity: 1, scale: 1.2 }}
                transition={{ duration: 0.5 }}
                className="absolute -inset-6 bg-gradient-to-br from-sky/15 via-orange/15 to-olive/15 rounded-3xl -z-10" 
              />
              <img src="/images/based/img/travel_10.webp" alt="Adventure moments" className="w-full h-full object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="font-martian-mono text-xs text-sand/80 tracking-wider">ADVENTURES</div>
              </div>
            </motion.div>

            {/* Portrait image (square) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 3 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 2 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.4, 0, 0.2, 1] }}
              whileHover={{ scale: 1.05, rotate: 0, zIndex: 10, transition: { duration: 0.3 } }}
              className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer"
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileHover={{ opacity: 1, scale: 1.2 }}
                transition={{ duration: 0.5 }}
                className="absolute -inset-6 bg-gradient-to-br from-olive/15 via-sky/15 to-orange/15 rounded-3xl -z-10" 
              />
              <img src="/images/based/img/portrait_2.webp" alt="Portrait work" className="w-full h-full object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="font-martian-mono text-xs text-sand/80 tracking-wider">PORTRAITS</div>
              </div>
            </motion.div>

            {/* Work detail (square) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -2 }}
              whileInView={{ opacity: 1, scale: 1, rotate: -1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.4, 0, 0.2, 1] }}
              whileHover={{ scale: 1.05, rotate: 0, zIndex: 10, transition: { duration: 0.3 } }}
              className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer"
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileHover={{ opacity: 1, scale: 1.2 }}
                transition={{ duration: 0.5 }}
                className="absolute -inset-6 bg-gradient-to-br from-orange/15 via-olive/15 to-sky/15 rounded-3xl -z-10" 
              />
              <img src="/images/based/img/work_9.webp" alt="INSPIRATION" className="w-full h-full object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="font-martian-mono text-xs text-sand/80 tracking-wider">INSPRIATION</div>
              </div>
            </motion.div>

            {/* Creative work (square) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 1 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.7, ease: [0.4, 0, 0.2, 1] }}
              whileHover={{ scale: 1.05, rotate: 0, zIndex: 10, transition: { duration: 0.3 } }}
              className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer"
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileHover={{ opacity: 1, scale: 1.2 }}
                transition={{ duration: 0.5 }}
                className="absolute -inset-6 bg-gradient-to-br from-sky/15 via-orange/15 to-olive/15 rounded-3xl -z-10" 
              />
              <img src="/images/based/img/work_11.webp" alt="Creative projects" className="w-full h-full object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="font-martian-mono text-xs text-sand/80 tracking-wider">CREATIVE PROJECTS</div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Flow to CTA */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-ink/50 to-transparent" />
      </section>

      {/* Call to Action - Final flowing section */}
      <section className="relative -mt-16 py-32 overflow-hidden">
        {/* Final flowing elements */}
        <motion.div
          initial={{ opacity: 0, rotate: -30, scale: 0.5 }}
          whileInView={{ opacity: 0.1, rotate: -25, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 3 }}
          className="absolute top-0 left-0 w-80 h-64 bg-gradient-to-br from-orange/15 to-olive/15 rounded-[4rem] backdrop-blur-sm border border-sand/5"
        />
        
        <motion.div
          initial={{ opacity: 0, rotate: 20, scale: 0.5 }}
          whileInView={{ opacity: 0.08, rotate: 15, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 3, delay: 0.5 }}
          className="absolute bottom-0 right-0 w-96 h-80 bg-gradient-to-br from-sky/15 to-orange/15 rounded-[4rem] backdrop-blur-sm border border-sand/5"
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-12 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative bg-sand/5 backdrop-blur-md rounded-3xl border border-sand/10 p-12 sm:p-16 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange/5 via-olive/5 to-sky/5" />
            <div className="relative z-10">
              <h2 className="font-display font-bold text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[3.5rem] leading-[0.85] mb-8">
                <div className="inline-block whitespace-nowrap"><GlitchText text="LET'S CREATE" /></div>
                <br />
                <div className="inline-block whitespace-nowrap"><GlitchText text="SOMETHING" /></div>
                <br />
                <div className="inline-block whitespace-nowrap"><GlitchText text="TOGETHER" /></div>
              </h2>
              
              <p className="font-martian-mono text-base sm:text-lg md:text-xl text-sand/70 mb-12 max-w-2xl mx-auto">
                Ready to bring your vision to life? Let's start a conversation about your next project.
              </p>
              
              <motion.div
                className="relative inline-block group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange/20 via-olive/20 to-sky/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />
                <a
                  href="/connect"
                  className="relative inline-block bg-sand/5 backdrop-blur-md font-martian-mono text-lg px-12 py-4 rounded-full border border-sand/10 text-sand group-hover:text-white group-hover:border-sand/20 transition-all duration-500 tracking-wider"
                >
                  <span className="relative z-10">GET IN TOUCH</span>
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Reduced Motion Support */}
      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AboutMe;
