import React from 'react';
import { motion } from 'framer-motion';
import CaseStudyLayout from '../components/CaseStudyLayout';
import Challenge from '../components/Challenge';
import BulletList from '../components/BulletList';
// Import your case study data file here
// import yourCaseStudyData from '../data/yourCaseStudyData';

const YourCaseStudyTemplate = () => {
  // Replace with your imported data
  const data = {
    title: "YOUR PROJECT NAME",
    subtitle: "YOUR PROJECT SUBTITLE",
    videoId: "your-video-id",
    bgColor: "bg-[#your-color]",
    textColor: "text-cream", // or text-ink
    roles: "YOUR ROLES",
    timeframe: "YOUR TIMEFRAME",
    description: [
      "First paragraph describing the project...",
      "Second paragraph with more details...",
      "Third paragraph setting up the challenge..."
    ],
    keyAchievements: [
      {
        title: "ACHIEVEMENT 1",
        description: "Description of this achievement:",
        points: [
          "Point 1",
          "Point 2", 
          "Point 3",
          "Point 4"
        ]
      },
      // Add more achievements as needed
    ],
    approach: {
      contentBased: {
        title: "Content Strategy",
        description: "Your content strategy description...",
        points: [
          "Strategy point 1",
          "Strategy point 2",
          "Strategy point 3",
          "Strategy point 4"
        ]
      },
      // Add other approach sections as needed
    },
    results: {
      metrics: [
        {
          value: "100%",
          label: "METRIC LABEL",
          description: "Metric description"
        },
        // Add more metrics
      ],
      majorProjects: [
        {
          title: "Major Project 1",
          description: "Project description",
          impact: "Impact statement"
        },
        // Add more major projects
      ]
    }
  };

  // Hero content - customize this section for your specific case study
  const heroContent = (
    <>
      {/* Desktop Layout */}
      <div className="hidden xl:flex gap-6">
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
              href="https://your-project-link.com"
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
              <img
                src="/images/your-project/your-logo.png"
                alt="Your project logo showcase"
                className="w-full h-full object-contain scale-125"
              />
            </motion.a>
          </div>
        </motion.div>

        {/* Supporting Content */}
        <motion.div 
          className="w-5/12 space-y-4"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ 
            duration: 0.8,
            delay: 0.2,
            type: "spring",
            stiffness: 100,
            damping: 20
          }}
        >
          {/* Add your supporting video or image content here */}
          <motion.div 
            className="w-full aspect-[2/3] bg-ink rounded-xl overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Replace with your video or image */}
            <div className="w-full h-full bg-gradient-to-br from-ink to-ink/80 flex items-center justify-center">
              <div className="text-sand/40 text-sm">Supporting Content</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Mobile Layout */}
      <div className="xl:hidden space-y-4">
        <motion.a
          href="https://your-project-link.com"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full"
          whileHover={{ scale: 1.05 }}
        >
          <img
            src="/images/your-project/your-logo.png"
            alt="Your project logo showcase"
            className="w-full h-full object-contain scale-125"
          />
        </motion.a>

        <motion.div 
          className="w-full aspect-[2/3] bg-ink rounded-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ 
            duration: 0.8,
            type: "spring",
            stiffness: 80,
            damping: 20
          }}
        >
          {/* Replace with your mobile video or image */}
          <div className="w-full h-full bg-gradient-to-br from-ink to-ink/80 flex items-center justify-center">
            <div className="text-sand/40 text-sm">Mobile Content</div>
          </div>
        </motion.div>
      </div>
    </>
  );

  // Challenge component - update the id and bgColor to match your project
  const challengeComponent = (
    <Challenge 
      id="your-project-id"
      bgColor="bg-[#your-color]"
    />
  );

  return (
    <CaseStudyLayout
      title={data.title}
      subtitle={data.subtitle}
      videoId={data.videoId}
      bgColor={data.bgColor}
      textColor={data.textColor}
      roles={data.roles}
      timeframe={data.timeframe}
      description={data.description}
      challengeComponent={challengeComponent}
      heroContent={heroContent}
    >
      {/* My Approach Section */}
      <section className="pt-8 sm:pt-12 md:pt-16 lg:pt-20 mb-12 sm:mb-16 md:mb-24 lg:mb-32">
        <div className="max-w-[2400px] mx-auto px-4 xs:px-6 sm:px-8 md:px-12">
          <h2 className="font-display font-black text-[1.75rem] xs:text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[4rem] xl:text-[5rem] !tracking-[0em] leading-[1.1] mb-8 sm:mb-12 md:mb-16 lg:mb-20 text-center text-cream uppercase">
            MY APPROACH
          </h2>
          
          {/* Approach Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {/* Key Achievements */}
            {data.keyAchievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
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
                className="bg-olive rounded-xl sm:rounded-2xl p-4 xs:p-5 sm:p-6 md:p-8 flex flex-col min-h-full transform-gpu"
              >
                <div className="flex-1">
                  <h3 className="font-martian-mono font-bold text-sm xs:text-base sm:text-lg tracking-wider text-sand mb-3 sm:mb-4">
                    {achievement.title}
                  </h3>
                  <p className="font-martian-mono text-xs sm:text-sm leading-relaxed text-sand/90 mb-4">
                    {achievement.description}
                  </p>
                  <BulletList
                    items={achievement.points}
                    textColor="text-sand/90"
                    bulletColor="text-sand/60"
                    isAnimated={true}
                  />
                </div>
              </motion.div>
            ))}

            {/* Approach Sections */}
            {Object.values(data.approach).map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: (data.keyAchievements.length + index) * 0.1,
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
                className="bg-olive rounded-xl sm:rounded-2xl p-4 xs:p-5 sm:p-6 md:p-8 flex flex-col min-h-full transform-gpu"
              >
                <div className="flex-1">
                  <h3 className="font-martian-mono font-bold text-sm xs:text-base sm:text-lg tracking-wider text-sand mb-3 sm:mb-4">
                    {section.title}
                  </h3>
                  <p className="font-martian-mono text-xs sm:text-sm leading-relaxed text-sand/90 mb-4">
                    {section.description}
                  </p>
                  <BulletList
                    items={section.points}
                    textColor="text-sand/90"
                    bulletColor="text-sand/60"
                    isAnimated={true}
                  />
                </div>
                
                {/* Video placeholder for each approach section */}
                <div className="aspect-[16/9] bg-ink rounded-lg sm:rounded-xl overflow-hidden mt-6 sm:mt-8">
                  <div className="w-full h-full bg-gradient-to-br from-ink to-ink/80 flex items-center justify-center">
                    <div className="text-sand/40 text-sm">Video Content</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12 sm:py-16 md:py-24 lg:py-32 bg-sand">
        <div className="max-w-[2400px] mx-auto px-4 xs:px-6 sm:px-8 md:px-12">
          <h2 className="font-display font-black text-[1.75rem] xs:text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[4rem] xl:text-[5rem] !tracking-[0em] leading-[1.1] mb-8 sm:mb-12 md:mb-16 lg:mb-20 text-center text-ink uppercase">
            THE RESULTS
          </h2>
          
          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-12 sm:mb-16">
            {data.results.metrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="font-display font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-ink mb-2">
                  {metric.value}
                </div>
                <div className="font-martian-mono text-xs sm:text-sm text-ink/80 uppercase tracking-wider mb-2">
                  {metric.label}
                </div>
                <div className="font-martian-mono text-xs text-ink/60 leading-relaxed">
                  {metric.description}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Major Projects */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {data.results.majorProjects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-ink/10 rounded-xl p-6 sm:p-8"
              >
                <h3 className="font-martian-mono font-bold text-lg sm:text-xl text-ink mb-3">
                  {project.title}
                </h3>
                <p className="font-martian-mono text-sm text-ink/80 mb-4">
                  {project.description}
                </p>
                <p className="font-martian-mono text-xs text-ink/60 italic">
                  {project.impact}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </CaseStudyLayout>
  );
};

export default YourCaseStudyTemplate; 