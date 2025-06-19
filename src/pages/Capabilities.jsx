import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import GlitchText from '../components/GlitchText';

export default function Capabilities() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Leadership text and color options that will cycle
  const leadershipOptions = [
    {
      text: "Strategic + Technical Leadership",
      color: "#FF5C1A" // Orange
    },
    {
      text: "Scaling + Creative Branding", 
      color: "#591902" // Dark rust
    },
    {
      text: "Operations + Systems Building",
      color: "#ACC2FF" // Sky blue
    }
  ];

  // Cycle through leadership texts and colors - slower on mobile to reduce updates
  useEffect(() => {
    if (prefersReducedMotion) return; // Respect user preferences
    
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % leadershipOptions.length);
    }, isMobile ? 8000 : 5000); // Slower cycling on mobile

    return () => clearInterval(interval);
  }, [leadershipOptions.length, isMobile, prefersReducedMotion]);

  // Function to get readable text color for badges based on accent color
  const getReadableTextColor = (accentColor) => {
    const colorMap = {
      '#591902': '#D4885A', // Dark rust -> lighter rust/orange
      '#7D8A8A': '#B5C2C2', // Gray -> lighter gray
      '#465902': '#8FA830', // Olive -> brighter olive (already good)
      '#FF5C1A': '#FF5C1A', // Orange -> keep as is (bright enough)
      '#ACC2FF': '#ACC2FF', // Sky blue -> keep as is (bright enough)
      '#C4B84A': '#C4B84A'  // Subdued yellow -> keep as is (bright enough)
    };
    return colorMap[accentColor] || accentColor;
  };

  const capabilities = [
    {
      id: 1,
      title: "Zero-to-Scale Execution",
      frameworkLabel: "Growth Engine",
      description: "Transform ideas into market-leading ventures through proven methodologies that accelerate growth while minimizing risk",
      strategicEvidence: "Developed creative systems and co founded ventures that helped bring Spacestation from $10M to $22M peak revenue. Co-founded Quarter Machine generating $1M in 90 days. Scaled teams from 3 to 140+ people across multiple ventures using systematic hiring and culture frameworks.",
      technicalFluency: "Hands-on contribution from initial prototypes to production deployment. Deep technical involvement ensures realistic timelines, informed architecture decisions, and seamless handoffs between creative and engineering teams.",
      tools: ["Figma", "Adobe Creative Suite", "Web Development", "Unreal Engine", "Shopify", "Monday.com"],
      metrics: ["$22M Peak Revenue", "140+ Team Scale"],
      accentColor: "#FF5C1A" // Orange
    },
    {
      id: 2,
      title: "Cross-Industry Pattern Recognition",
      frameworkLabel: "Market Intel",
      description: "Decode market signals and transferable strategies across diverse sectors to identify untapped opportunities before competitors",
      strategicEvidence: "Pioneered cannabis market entry (Proper Hemp $30K/month), dominated creator economy ($22M revenue), launched Web3 ventures ($1M NFT sales). Pattern recognition across regulatory cycles and consumer behavior shifts drives first-mover advantages.",
      technicalFluency: "Rapid platform evaluation and technology assessment across domains. Technical due diligence capabilities allow for informed investment decisions and realistic feasibility analysis in emerging markets.",
      tools: ["Solidity", "Market Research Platforms", "Google Analytics", "Trend Analysis Tools", "Adobe Creative Suite"],
      metrics: ["4 Industries Mastered", "First-Mover Edge"],
      accentColor: "#465902" // Olive
    },
    {
      id: 3,
      title: "Organizational Architecture",
      frameworkLabel: "Team Design",
      description: "Design self-sustaining teams and processes that operate independently while maintaining quality and cultural alignment",
      strategicEvidence: "Created 30-person animation studio with autonomous production pipeline. Established Nebula, a design team for Spacestation from 2 to 15 staff members that operated without direct oversight while achieving 300% channel growth and millions in merch revenue. Systems outlasted founder involvement.",
      technicalFluency: "Workflow optimization through direct system design experience. Technical understanding of collaboration tools and automation enables creation of efficient processes that actually get adopted by teams.",
      tools: ["Process Design", "Workflow Automation", "Team Collaboration Systems", "Performance Analytics"],
      metrics: ["300% Growth Achieved", "Autonomous Operations"],
      accentColor: "#ACC2FF" // Sky blue
    },
    {
      id: 4,
      title: "Cultural Bridge Building",
      frameworkLabel: "Bridge Work",
      description: "Navigate complex stakeholder ecosystems by aligning creative vision with business objectives across organizational boundaries",
      strategicEvidence: "Facilitated partnerships between artists and Fortune 500 executives. Secured high-value collaborations with Disney, NBC Universal, Nike RTFKT by understanding both creative and corporate languages. Translated vision into actionable business strategies.",
      technicalFluency: "Technical literacy across creative and business domains eliminates communication barriers. Understanding of both artistic processes and corporate constraints enables practical solutions that satisfy all stakeholders.",
      tools: ["Presentation Systems", "Creative Platforms", "Business Intelligence", "Stakeholder Management"],
      metrics: ["Fortune 500 Partnerships", "Cross-Cultural Success"],
      accentColor: "#591902" // Dark rust
    },
    {
      id: 5,
      title: "Emerging Market Navigation",
      frameworkLabel: "Market Pioneer",
      description: "Thrive in uncertainty by building adaptable strategies for markets that don't yet have established playbooks or clear regulations",
      strategicEvidence: "Early success in CBD market (2018), creator economy optimization, Web3 infrastructure development, NFT experiential design. Developed frameworks for regulatory uncertainty, timing market entry, and building in ambiguous environments.",
      technicalFluency: "Rapid prototyping and technical evaluation of bleeding-edge platforms. Ability to assess new technologies, understand their limitations, and build accordingly reduces risk in experimental ventures.",
      tools: ["Blockchain Development", "AI/ML Platforms", "Experimental Tech Stacks", "Risk Assessment Tools"],
      metrics: ["Early Market Entry", "Regulatory Navigation"],
      accentColor: "#7D8A8A" // Gray
    },
    {
      id: 6,
      title: "Systems Integration Thinking",
      frameworkLabel: "System Sync",
      description: "Create compound value by connecting disparate systems into cohesive ecosystems that generate multiple revenue streams and network effects",
      strategicEvidence: "Orchestrated animation production → gaming platforms → NFT distribution → mobile apps → merchandise → live events pipeline. Each component amplified the others, creating sustainable competitive advantages and diversified revenue streams.",
      technicalFluency: "Full-stack perspective enables integration decisions across disparate systems. API evaluation, system interoperability assessment, and technical architecture planning ensure seamless connections between platforms.",
      tools: ["API Integration", "Analytics Integration", "Multi-platform Development", "System Architecture"],
      metrics: ["1.48M App Downloads", "Ecosystem Synergy"],
      accentColor: "#C4B84A" // Subdued yellow
    }
  ];

  const creativeCapabilities = [
    {
      id: 1,
      title: "Visual Identity & Brand Systems",
      frameworkLabel: "Brand Design",
      description: "Create comprehensive brand ecosystems that drive recognition, conversion, and market positioning across industries",
      strategicEvidence: "Designed 15+ complete brand identities from Soy's Sushi Bar to High Times magazine products. Built comprehensive brand guides for Seon Grill (franchise-ready system), GoodGoods (50+ SKUs), and Big Game Energy (Walmart retail placement). Established visual systems that increased fundraising by $85K and conversion rates by 45%.",
      technicalFluency: "End-to-end brand development from concept sketches to production-ready assets. Expertise in logo design, typography systems, color theory, and brand guide creation. Experience with print production, packaging design, and retail compliance across cannabis, CPG, hospitality, and tech industries.",
      tools: ["Adobe Creative Suite", "Figma", "Brand Guidelines", "Print Production", "Packaging Design"],
      metrics: ["15+ Brand Systems", "Walmart Retail Placement"],
      accentColor: "#591902" // Dark rust
    },
    {
      id: 2,
      title: "Digital Product Design",
      frameworkLabel: "UI/UX Systems",
      description: "Design scalable digital experiences that combine user-centered design with technical feasibility and business objectives",
      strategicEvidence: "Designed UI/UX for Spacestation mobile apps achieving 1M+ downloads. Created comprehensive design system for Virtual Rain agricultural app including custom iconography and developer handoff documentation. Built e-commerce systems for Proper Hemp Co generating $25-30K monthly revenue through specialty payment processing and compliance-focused UX.",
      technicalFluency: "Full-stack design approach from wireframing to developer collaboration. Proficient in design systems, component libraries, responsive design, and accessibility standards. Experience with complex user flows, payment processing integration, and industry-specific compliance requirements.",
      tools: ["Figma", "Design Systems", "Prototyping", "Web Development", "UX Research"],
      metrics: ["1M+ App Downloads", "30K Monthly Revenue"],
      accentColor: "#465902" // Olive
    },
    {
      id: 3,
      title: "Creative Direction & Operations",
      frameworkLabel: "Creative Ops",
      description: "Build and scale creative teams while establishing production workflows that maintain quality at high velocity",
      strategicEvidence: "Established and led Nebula creative team at Spacestation, scaling from 2 to 15 staff members while supporting company growth from $10M to $22M revenue. Created production pipelines for animation studio, merchandise design, event management, and cross-platform content creation. Mentored teams across multiple ventures while maintaining creative excellence.",
      technicalFluency: "Creative operations expertise combining project management, team development, and technical workflow optimization. Experience with creative briefs, asset management, version control, and cross-departmental collaboration between creative, engineering, and business teams.",
      tools: ["Creative Pipeline Design", "Team Management", "TouchDesigner", "Production Workflows", "Asset Management"],
      metrics: ["15-Person Team Scale", "$22M Revenue Support"],
      accentColor: "#ACC2FF" // Sky blue
    }
  ];

  // Function to handle mobile card tap
  const handleMobileCardTap = (cardId) => {
    if (isMobile) {
      setExpandedCard(expandedCard === cardId ? null : cardId);
    }
  };

  return (
    <div className="min-h-screen pt-16 sm:pt-20 md:pt-24 lg:pt-32 pb-24 sm:pb-28 md:pb-32 lg:pb-40 px-4 sm:px-6 lg:px-12 relative overflow-hidden">
      {/* Background with radial gradient using website colors */}
      <div className="absolute inset-0 bg-gradient-radial from-[#2a2a2a] via-[#1a1a1a] to-[#151717]"></div>
      
      {/* Ambient glow effects - reduced on mobile */}
      {!isMobile && (
        <>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FF5C1A] opacity-5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#465902] opacity-5 rounded-full blur-3xl"></div>
        </>
      )}
      {/* Simpler mobile background */}
      {isMobile && (
        <div className="absolute inset-0 bg-[#FF5C1A] opacity-[0.02]"></div>
      )}
      
      <div className="relative z-10 max-w-[2400px] mx-auto">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="max-w-5xl mb-16 sm:mb-20 md:mb-32 pt-8 sm:pt-12 md:pt-16"
        >
          <h1 className="font-display font-black text-[clamp(3.5rem,9vw,10rem)] sm:text-[clamp(4rem,10vw,10rem)] md:text-[clamp(4.5rem,11vw,10rem)] mb-8 sm:mb-12 md:mb-16 text-[#E4E2DE] leading-[0.85] !tracking-[0em]">
            <GlitchText text="STRATEGIC" /><br className="sm:hidden" /><span className="sm:inline"> </span><GlitchText text="CAPABILITIES" />
          </h1>
          <div className="space-y-6">
            <p className="font-body text-[#E4E2DE] text-lg sm:text-xl md:text-2xl leading-relaxed max-w-4xl font-light tracking-wide">
              Executive-level frameworks for systematic value creation across emerging markets and established industries
            </p>
            <div className="relative overflow-hidden rounded-full">
              {!prefersReducedMotion && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTextIndex}
                    initial={{ 
                      y: isMobile ? 30 : 60, 
                      opacity: 0.3
                    }}
                    animate={{ 
                      y: 0, 
                      opacity: 1
                    }}
                    exit={{ 
                      y: isMobile ? -30 : -60, 
                      opacity: 0.3
                    }}
                    transition={{ 
                      duration: isMobile ? 0.4 : 0.8, 
                      ease: [0.25, 0.46, 0.45, 0.94] // More mechanical easing
                    }}
                  className="inline-flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-2 rounded-full backdrop-blur-sm border min-w-fit"
                  style={{
                    backgroundColor: `${leadershipOptions[currentTextIndex].color}10`,
                    borderColor: `${leadershipOptions[currentTextIndex].color}20`
                  }}
                >
                  <motion.div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: leadershipOptions[currentTextIndex].color }}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ 
                      delay: 0.2, 
                      duration: 0.5,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                  />
                  <motion.span
                    className="font-body text-[#B5B8B8] text-xs sm:text-sm uppercase tracking-widest font-medium whitespace-nowrap"
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ 
                      delay: 0.3, 
                      duration: 0.6,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                  >
                    {leadershipOptions[currentTextIndex].text}
                  </motion.span>
                </motion.div>
              </AnimatePresence>
              )}
              {/* Static text for reduced motion */}
              {prefersReducedMotion && (
                <div className="inline-flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-2 rounded-full backdrop-blur-sm border"
                  style={{
                    backgroundColor: `${leadershipOptions[0].color}10`,
                    borderColor: `${leadershipOptions[0].color}20`
                  }}>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: leadershipOptions[0].color }}></div>
                  <span className="font-body text-[#B5B8B8] text-xs sm:text-sm uppercase tracking-widest font-medium whitespace-nowrap">
                    {leadershipOptions[0].text}
                  </span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Strategic Capabilities Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 mb-24 sm:mb-32 md:mb-40">
          {capabilities.map((capability, index) => (
            <motion.div
              key={capability.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.1,
                ease: [0.4, 0, 0.2, 1]
              }}
              className="group relative"
              onMouseEnter={() => setHoveredCard(capability.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => handleMobileCardTap(capability.id)}
            >
              {/* Glass Card - optimized for mobile */}
              <div className={`relative ${expandedCard === capability.id ? 'min-h-[600px]' : 'min-h-[350px]'} rounded-2xl bg-white/[0.03] border border-white/[0.08] overflow-hidden transition-all duration-300 ease-out ${
                isMobile 
                  ? `cursor-pointer ${expandedCard === capability.id ? 'border-white/20' : 'hover:border-white/15'}`
                  : 'backdrop-blur-xl group-hover:transform group-hover:translateY-[-12px] group-hover:shadow-2xl group-hover:shadow-black/20 group-hover:border-white/20'
              }`}>
                
                {/* Glow effect on hover - desktop only */}
                {!isMobile && (
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div 
                      className="absolute inset-0 rounded-2xl opacity-20 blur-xl"
                      style={{ backgroundColor: capability.accentColor }}
                    ></div>
                  </div>
                )}

                {/* Mobile glow effect when expanded */}
                {isMobile && expandedCard === capability.id && (
                  <div className="absolute inset-0 opacity-30 transition-opacity duration-300">
                    <div 
                      className="absolute inset-0 rounded-2xl opacity-10 blur-xl"
                      style={{ backgroundColor: capability.accentColor }}
                    ></div>
                  </div>
                )}

                {/* Main Content */}
                <div className="relative z-10 p-8 h-full flex flex-col">
                  {/* Strategic Framework Indicator */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: capability.accentColor }}
                      ></div>
                      <span className="font-body text-[#B5B8B8] text-xs uppercase tracking-widest font-medium">
                        {capability.frameworkLabel}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-[#B5B8B8] text-sm font-mono">
                        {String(capability.id).padStart(2, '0')}
                      </div>
                      {/* Mobile expand indicator */}
                      {isMobile && (
                        <motion.div
                          animate={{ rotate: expandedCard === capability.id ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="text-[#B5B8B8] text-sm"
                        >
                          ↓
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-subheader text-[#E4E2DE] text-xl sm:text-2xl mb-4 leading-tight font-medium tracking-wide">
                    {capability.title}
                  </h3>

                  {/* Description */}
                  <p className="font-body text-[#B5B8B8] text-sm sm:text-base leading-relaxed mb-6 flex-grow tracking-wide">
                    {capability.description}
                  </p>

                  {/* Mobile Expanded Content */}
                  {isMobile && expandedCard === capability.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                      className="mb-6 space-y-4"
                    >
                      {/* Strategic Evidence */}
                      <div>
                        <h4 className="font-subheader text-[#E4E2DE] text-sm uppercase tracking-widest mb-2 font-medium">
                          Strategic Evidence
                        </h4>
                        <p className="font-body text-[#B5B8B8] text-sm leading-relaxed">
                          {capability.strategicEvidence}
                        </p>
                      </div>

                      {/* Technical Fluency */}
                      <div>
                        <h4 className="font-subheader text-[#E4E2DE] text-sm uppercase tracking-widest mb-2 font-medium">
                          Technical Fluency
                        </h4>
                        <p className="font-body text-[#B5B8B8] text-sm leading-relaxed">
                          {capability.technicalFluency}
                        </p>
                      </div>

                      {/* Tools */}
                      <div>
                        <h4 className="font-subheader text-[#E4E2DE] text-sm uppercase tracking-widest mb-2 font-medium">
                          Tools & Systems
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {capability.tools.map((tool, idx) => (
                            <span 
                              key={idx}
                              className="px-2 py-1 rounded-md text-xs font-medium tracking-wide"
                              style={{
                                backgroundColor: `${capability.accentColor}25`,
                                color: getReadableTextColor(capability.accentColor),
                                border: `1px solid ${capability.accentColor}40`
                              }}
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Metrics */}
                  <div className="flex flex-wrap gap-2">
                    {capability.metrics.map((metric, idx) => (
                      <span 
                        key={idx}
                        className="px-3 py-1 rounded-full text-xs font-medium tracking-wide"
                        style={{ 
                          backgroundColor: `${capability.accentColor}25`,
                          color: getReadableTextColor(capability.accentColor),
                          border: `1px solid ${capability.accentColor}40`
                        }}
                      >
                        {metric}
                      </span>
                    ))}
                  </div>

                  {/* Mobile tap hint */}
                  {isMobile && expandedCard !== capability.id && (
                    <div className="mt-4 text-[#B5B8B8] text-xs uppercase tracking-widest opacity-60">
                      Tap to read more
                    </div>
                  )}
                </div>

                {/* Hover Overlay - desktop only for performance */}
                {!isMobile && (
                  <motion.div
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ 
                      y: hoveredCard === capability.id ? '0%' : '100%', 
                      opacity: hoveredCard === capability.id ? 1 : 0 
                    }}
                    transition={{ duration: prefersReducedMotion ? 0.1 : 0.4, ease: [0.4, 0, 0.2, 1] }}
                    className="absolute inset-0 bg-[#151717]/95 backdrop-blur-xl border-t border-white/10 z-20"
                    style={{ contain: 'layout style paint' }}
                  >
                    <div 
                      className="p-8 h-full overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20 hover:scrollbar-thumb-white/30"
                      style={{ 
                        overscrollBehavior: 'contain',
                        scrollbarGutter: 'stable'
                      }}
                      onWheel={(e) => {
                        // Prevent scroll from bubbling to parent when at scroll boundaries
                        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
                        const isAtTop = scrollTop === 0;
                        const isAtBottom = scrollTop + clientHeight >= scrollHeight;
                        
                        if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
                          e.stopPropagation();
                        }
                      }}
                    >
                      <div className="space-y-6">
                        {/* Strategic Evidence */}
                        <div>
                          <h4 className="font-subheader text-[#E4E2DE] text-sm uppercase tracking-widest mb-3 font-medium">
                            Strategic Evidence
                          </h4>
                          <p className="font-body text-[#B5B8B8] text-sm leading-relaxed">
                            {capability.strategicEvidence}
                          </p>
                        </div>

                        {/* Technical Fluency */}
                        <div>
                          <h4 className="font-subheader text-[#E4E2DE] text-sm uppercase tracking-widest mb-3 font-medium">
                            Technical Fluency
                          </h4>
                          <p className="font-body text-[#B5B8B8] text-sm leading-relaxed">
                            {capability.technicalFluency}
                          </p>
                        </div>

                        {/* Tools */}
                        <div>
                          <h4 className="font-subheader text-[#E4E2DE] text-sm uppercase tracking-widest mb-3 font-medium">
                            Tools & Systems
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {capability.tools.map((tool, idx) => (
                              <span 
                                key={idx}
                                className="px-2 py-1 rounded-md text-xs font-medium tracking-wide"
                                style={{
                                  backgroundColor: `${capability.accentColor}25`,
                                  color: getReadableTextColor(capability.accentColor),
                                  border: `1px solid ${capability.accentColor}40`
                                }}
                              >
                                {tool}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Creative Execution Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="mb-16 sm:mb-20 md:mb-32"
        >
          <div className="max-w-3xl mb-12 sm:mb-16 md:mb-20">
            <h2 className="font-display font-black text-[clamp(3rem,8vw,8rem)] sm:text-[clamp(3.5rem,9vw,8rem)] md:text-[clamp(4rem,10vw,8rem)] mb-6 sm:mb-8 md:mb-10 text-[#E4E2DE] leading-[0.85] !tracking-[0em]">
              <GlitchText text="CREATIVE" /><br /><GlitchText text="EXECUTION" />
            </h2>
            <p className="font-body text-[#B5B8B8] text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl font-light tracking-wide">
              Hands-on design expertise spanning brand identity, digital products, and creative operations with measurable business impact
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {creativeCapabilities.map((creative, index) => (
              <motion.div
                key={`creative-${creative.id}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.8 + (index * 0.1),
                  ease: [0.4, 0, 0.2, 1]
                }}
                className="group relative"
                onMouseEnter={() => setHoveredCard(`creative-${creative.id}`)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => handleMobileCardTap(`creative-${creative.id}`)}
              >
                {/* Glass Card - optimized for mobile */}
                <div className={`relative ${expandedCard === `creative-${creative.id}` ? 'min-h-[600px]' : 'min-h-[350px]'} rounded-2xl bg-white/[0.03] border border-white/[0.08] overflow-hidden transition-all duration-300 ease-out ${
                  isMobile 
                    ? `cursor-pointer ${expandedCard === `creative-${creative.id}` ? 'border-white/20' : 'hover:border-white/15'}`
                    : 'backdrop-blur-xl group-hover:transform group-hover:translateY-[-12px] group-hover:shadow-2xl group-hover:shadow-black/20 group-hover:border-white/20'
                }`}>
                  
                  {/* Glow effect on hover - desktop only */}
                  {!isMobile && (
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div 
                        className="absolute inset-0 rounded-2xl opacity-20 blur-xl"
                        style={{ backgroundColor: creative.accentColor }}
                      ></div>
                    </div>
                  )}

                  {/* Mobile glow effect when expanded */}
                  {isMobile && expandedCard === `creative-${creative.id}` && (
                    <div className="absolute inset-0 opacity-30 transition-opacity duration-300">
                      <div 
                        className="absolute inset-0 rounded-2xl opacity-10 blur-xl"
                        style={{ backgroundColor: creative.accentColor }}
                      ></div>
                    </div>
                  )}

                  {/* Main Content */}
                  <div className="relative z-10 p-8 h-full flex flex-col">
                    {/* Creative Framework Indicator */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: creative.accentColor }}
                        ></div>
                        <span className="font-body text-[#B5B8B8] text-xs uppercase tracking-widest font-medium">
                          {creative.frameworkLabel}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-[#B5B8B8] text-sm font-mono">
                          {String(creative.id).padStart(2, '0')}
                        </div>
                        {/* Mobile expand indicator */}
                        {isMobile && (
                          <motion.div
                            animate={{ rotate: expandedCard === `creative-${creative.id}` ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="text-[#B5B8B8] text-sm"
                          >
                            ↓
                          </motion.div>
                        )}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-subheader text-[#E4E2DE] text-xl sm:text-2xl mb-4 leading-tight font-medium tracking-wide">
                      {creative.title}
                    </h3>

                    {/* Description */}
                    <p className="font-body text-[#B5B8B8] text-sm sm:text-base leading-relaxed mb-6 flex-grow tracking-wide">
                      {creative.description}
                    </p>

                    {/* Mobile Expanded Content for Creative Cards */}
                    {isMobile && expandedCard === `creative-${creative.id}` && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                        className="mb-6 space-y-4"
                      >
                        {/* Project Evidence */}
                        <div>
                          <h4 className="font-subheader text-[#E4E2DE] text-sm uppercase tracking-widest mb-2 font-medium">
                            Project Evidence
                          </h4>
                          <p className="font-body text-[#B5B8B8] text-sm leading-relaxed">
                            {creative.strategicEvidence}
                          </p>
                        </div>

                        {/* Design Process */}
                        <div>
                          <h4 className="font-subheader text-[#E4E2DE] text-sm uppercase tracking-widest mb-2 font-medium">
                            Design Process
                          </h4>
                          <p className="font-body text-[#B5B8B8] text-sm leading-relaxed">
                            {creative.technicalFluency}
                          </p>
                        </div>

                        {/* Creative Tools */}
                        <div>
                          <h4 className="font-subheader text-[#E4E2DE] text-sm uppercase tracking-widest mb-2 font-medium">
                            Creative Tools
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {creative.tools.map((tool, idx) => (
                              <span 
                                key={idx}
                                className="px-2 py-1 rounded-md text-xs font-medium tracking-wide"
                                style={{
                                  backgroundColor: `${creative.accentColor}25`,
                                  color: getReadableTextColor(creative.accentColor),
                                  border: `1px solid ${creative.accentColor}40`
                                }}
                              >
                                {tool}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Metrics */}
                    <div className="flex flex-wrap gap-2">
                      {creative.metrics.map((metric, idx) => (
                        <span 
                          key={idx}
                          className="px-3 py-1 rounded-full text-xs font-medium tracking-wide"
                          style={{ 
                            backgroundColor: `${creative.accentColor}25`,
                            color: getReadableTextColor(creative.accentColor),
                            border: `1px solid ${creative.accentColor}40`
                          }}
                        >
                          {metric}
                        </span>
                      ))}
                    </div>

                    {/* Mobile tap hint */}
                    {isMobile && expandedCard !== `creative-${creative.id}` && (
                      <div className="mt-4 text-[#B5B8B8] text-xs uppercase tracking-widest opacity-60">
                        Tap to read more
                      </div>
                    )}
                  </div>

                  {/* Hover Overlay - desktop only for performance */}
                  {!isMobile && (
                    <motion.div
                      initial={{ y: '100%', opacity: 0 }}
                      animate={{ 
                        y: hoveredCard === `creative-${creative.id}` ? '0%' : '100%', 
                        opacity: hoveredCard === `creative-${creative.id}` ? 1 : 0 
                      }}
                      transition={{ duration: prefersReducedMotion ? 0.1 : 0.4, ease: [0.4, 0, 0.2, 1] }}
                      className="absolute inset-0 bg-[#151717]/95 backdrop-blur-xl border-t border-white/10 z-20"
                      style={{ contain: 'layout style paint' }}
                    >
                    <div 
                      className="p-8 h-full overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20 hover:scrollbar-thumb-white/30"
                      style={{ 
                        overscrollBehavior: 'contain',
                        scrollbarGutter: 'stable'
                      }}
                      onWheel={(e) => {
                        // Prevent scroll from bubbling to parent when at scroll boundaries
                        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
                        const isAtTop = scrollTop === 0;
                        const isAtBottom = scrollTop + clientHeight >= scrollHeight;
                        
                        if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
                          e.stopPropagation();
                        }
                      }}
                    >
                      <div className="space-y-6">
                        {/* Strategic Evidence */}
                        <div>
                          <h4 className="font-subheader text-[#E4E2DE] text-sm uppercase tracking-widest mb-3 font-medium">
                            Project Evidence
                          </h4>
                          <p className="font-body text-[#B5B8B8] text-sm leading-relaxed">
                            {creative.strategicEvidence}
                          </p>
                        </div>

                        {/* Technical Fluency */}
                        <div>
                          <h4 className="font-subheader text-[#E4E2DE] text-sm uppercase tracking-widest mb-3 font-medium">
                            Design Process
                          </h4>
                          <p className="font-body text-[#B5B8B8] text-sm leading-relaxed">
                            {creative.technicalFluency}
                          </p>
                        </div>

                        {/* Tools */}
                        <div>
                          <h4 className="font-subheader text-[#E4E2DE] text-sm uppercase tracking-widest mb-3 font-medium">
                            Creative Tools
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {creative.tools.map((tool, idx) => (
                              <span 
                                key={idx}
                                className="px-2 py-1 rounded-md text-xs font-medium tracking-wide"
                                style={{
                                  backgroundColor: `${creative.accentColor}25`,
                                  color: getReadableTextColor(creative.accentColor),
                                  border: `1px solid ${creative.accentColor}40`
                                }}
                              >
                                {tool}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .bg-gradient-radial {
          background: radial-gradient(ellipse at center, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
} 