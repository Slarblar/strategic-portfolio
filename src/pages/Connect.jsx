import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import emailjs from '@emailjs/browser';
import GlitchText from '../components/GlitchText';

// SVG Icons for value proposition section
const StrategyIcon = () => (
  <svg className="w-10 h-10 sm:w-12 sm:h-12 text-orange" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TechnicalIcon = () => (
  <svg className="w-10 h-10 sm:w-12 sm:h-12 text-sky" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 18L22 12L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 6L2 12L8 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ResultsIcon = () => (
  <svg className="w-10 h-10 sm:w-12 sm:h-12 text-orange" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 20V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 20V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 20V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Load Calendly script and add custom styling
const loadCalendlyWithCustomStyling = () => {
  // Load Calendly CSS and JS
  if (!document.querySelector('link[href*="calendly"]')) {
    const css = document.createElement('link');
    css.href = "https://assets.calendly.com/assets/external/widget.css";
    css.rel = "stylesheet";
    document.head.appendChild(css);
  }
  
  if (!window.Calendly && !document.querySelector('script[src*="calendly"]')) {
    const script = document.createElement('script');
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);
  }

     // Add our custom styling to make Calendly popup look like our modal
   if (!document.querySelector('#calendly-custom-styles')) {
     const style = document.createElement('style');
     style.id = 'calendly-custom-styles';
     style.textContent = `
       /* Override Calendly popup styling to match our design and force interactions */
       .calendly-popup-wrapper {
         z-index: 9999 !important;
         background-color: rgba(0, 0, 0, 0.8) !important;
         backdrop-filter: blur(4px) !important;
         pointer-events: auto !important;
         position: fixed !important;
         top: 0 !important;
         left: 0 !important;
         width: 100% !important;
         height: 100% !important;
       }
       
       .calendly-popup {
         background-color: #151717 !important;
         border: 1px solid rgba(241, 236, 220, 0.2) !important;
         border-radius: 16px !important;
         box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
         max-width: 900px !important;
         max-height: 90vh !important;
         margin: 2rem !important;
         pointer-events: auto !important;
         position: relative !important;
         z-index: 10000 !important;
       }
       
       .calendly-popup .calendly-popup-content {
         border-radius: 16px !important;
         overflow: hidden !important;
         pointer-events: auto !important;
         position: relative !important;
         z-index: 10001 !important;
       }
       
       .calendly-popup iframe {
         border-radius: 12px !important;
         pointer-events: auto !important;
         z-index: 10002 !important;
         position: relative !important;
         touch-action: auto !important;
       }
       
       /* Force all interactive elements to be clickable */
       .calendly-popup * {
         pointer-events: auto !important;
       }
       
       /* Style the close button */
       .calendly-popup .calendly-popup-close {
         background-color: rgba(241, 236, 220, 0.1) !important;
         border-radius: 8px !important;
         color: rgba(241, 236, 220, 0.6) !important;
         font-size: 24px !important;
         width: 40px !important;
         height: 40px !important;
         display: flex !important;
         align-items: center !important;
         justify-content: center !important;
         transition: all 0.3s ease !important;
         pointer-events: auto !important;
         z-index: 10003 !important;
         position: relative !important;
       }
       
       .calendly-popup .calendly-popup-close:hover {
         background-color: rgba(241, 236, 220, 0.2) !important;
         color: rgba(241, 236, 220, 1) !important;
       }
       
       /* Ensure no overlays are blocking interactions */
       body.calendly-popup-active * {
         pointer-events: auto !important;
       }
       
       /* Remove any potential blocking overlays from our site */
       .calendly-popup-wrapper ~ * {
         pointer-events: none !important;
       }
       
       .calendly-popup-wrapper * {
         pointer-events: auto !important;
       }
     `;
     document.head.appendChild(style);
   }
};

export default function Connect() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  // Load Calendly with our custom styling on mount
  useEffect(() => {
    loadCalendlyWithCustomStyling();
  }, []);

  // Function to open styled Calendly popup
  const openCalendlyPopup = (calendarType) => {
    const url = calendarType === '45min' 
      ? "https://calendly.com/j-sao/30min?hide_event_type_details=1&primary_color=4a90e2"
      : "https://calendly.com/j-sao/15-minute-discovery?hide_event_type_details=1&primary_color=ff5c1a";
    
    if (window.Calendly) {
      window.Calendly.initPopupWidget({ url });
      
      // Debug: Check interaction after popup opens
      setTimeout(() => {
        const wrapper = document.querySelector('.calendly-popup-wrapper');
        const popup = document.querySelector('.calendly-popup');
        const iframe = document.querySelector('.calendly-popup iframe');
        
        console.log('=== CALENDLY DEBUG ===');
        console.log('Wrapper found:', !!wrapper);
        console.log('Popup found:', !!popup);
        console.log('Iframe found:', !!iframe);
        
        if (wrapper) {
          console.log('Wrapper styles:', {
            pointerEvents: getComputedStyle(wrapper).pointerEvents,
            zIndex: getComputedStyle(wrapper).zIndex,
            position: getComputedStyle(wrapper).position
          });
        }
        
        if (iframe) {
          console.log('Iframe styles:', {
            pointerEvents: getComputedStyle(iframe).pointerEvents,
            zIndex: getComputedStyle(iframe).zIndex,
            position: getComputedStyle(iframe).position
          });
        }
        
        // Test if we can interact with the iframe
        const rect = iframe?.getBoundingClientRect();
        if (rect) {
          console.log('Iframe position:', rect);
          console.log('Element at iframe center:', document.elementFromPoint(
            rect.left + rect.width / 2, 
            rect.top + rect.height / 2
          ));
        }
      }, 1000);
    } else {
      console.log('Calendly not loaded, opening in new tab');
      // Fallback to new tab
      window.open(url, '_blank');
    }
  };

  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const [valueRef, valueInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const [referencesRef, referencesInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  // Expanded testimonials array
  const testimonials = [
    {
      name: "Chris Le",
      title: "Co Founder",
      company: "RTFKT",
      quote: "Working with Jordan has been awesome, he's reliable and always brings very creative solutions and ideas to the table.",
      image: "/images/testimonials/chris-le_1.webp" // Placeholder path
    },
    {
      name: "Shawn Hammond",
      title: "Co Founder",
      company: "Kata Group & Zion Cultivars",
      quote: "Jordan was instrumental in helping us launch our brand in Proper Hemp Co. and the branding for Zion Cultivars.",
      image: "/images/testimonials/shawn-hammond.webp" // Placeholder path
    },
    {
      name: "Nathan Riddle",
      title: "Co Founder & Studio Director",
      company: "Spacestation Animation",
      quote: "I've had the privilege of working closely with Jordan, and he's one of those rare people who makes every project better by just being a part of it. He's a natural creative leader — thoughtful, collaborative, and full of forward-thinking ideas. He's got a deep understanding of the creator space, the art world, and emerging tech, and he brings those perspectives together in a way that's both inspiring and practical. Jordan is the kind of person you want in the room — positive, smart, and always pushing things to the next level.",
      image: "/images/testimonials/nathan-riddle.webp" // Placeholder path
    },
    {
      name: "Scott Carpenter",
      title: "Co Founder / Head of Technology",
      company: "Quadra",
      quote: "Watching Jordan's growth path has been amazing, we've worked on a few projects together and he's consistently effective and reliable.",
      image: "/images/testimonials/scott-carpenter.webp" // Placeholder path
    },
    {
      name: "Tim Nielsen",
      title: "Co Founder",
      company: "Unnamed Technologies",
      quote: "I have worked closely with Jordan on multiple creative challenges. He combines outstanding creative vision with business acumen to deliver results that drive projects forward.",
      image: "/images/testimonials/tim-nielsen.webp" // Placeholder path
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await emailjs.send(
        'service_6qxw5td', // Your service ID
        'template_sfz1208', // Your template ID
        {
          from_name: formData.name,
          from_email: formData.email,
          company: formData.company,
          message: formData.description,
          to_email: 'J@sao.house'
        },
        'Tr7AJT9c4qc1092f1' // Your public key
      );
      
      setSubmitSuccess(true);
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        company: '',
        description: ''
      });
    } catch (error) {
      console.error('Failed to send email:', error);
      alert('Failed to send message. Please try again or email directly at J@sao.house');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };



  return (
    <div className="min-h-screen pt-20 sm:pt-24 md:pt-28 lg:pt-32 xl:pt-40 pb-16 sm:pb-20 md:pb-24 lg:pb-32 xl:pb-40 px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 bg-ink relative overflow-hidden">
      {/* Background with radial gradient using website colors */}
      <div className="absolute inset-0 bg-gradient-radial from-[#2a2a2a] via-[#1a1a1a] to-[#151717]"></div>
      
      {/* Ambient glow effects - adjusted for mobile */}
      <div className="absolute top-0 left-1/4 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-orange opacity-5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-sky opacity-5 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-[2400px] mx-auto">
        {/* Hero Section */}
        <motion.div 
          ref={heroRef}
          initial={{ opacity: 0, y: 20 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="max-w-5xl mb-12 sm:mb-16 md:mb-20 lg:mb-24 xl:mb-32"
        >
          <h1 className="font-display font-black text-[clamp(1.5rem,8vw,9rem)] sm:text-[clamp(2rem,7vw,9rem)] md:text-[clamp(2.25rem,8vw,9rem)] lg:text-[clamp(2.25rem,9vw,9rem)] mb-6 sm:mb-8 md:mb-12 lg:mb-16 text-sand leading-[0.85] !tracking-[0em] relative">
            {/* Invisible text to reserve space and prevent layout shift */}
            <span className="invisible absolute inset-0 pointer-events-none" aria-hidden="true">
              READY TO SCALE<br />YOUR NEXT VENTURE?
            </span>
            {/* Visible glitch text */}
            <span className="relative">
              <GlitchText text="READY TO SCALE" /><br /><GlitchText text="YOUR NEXT VENTURE?" />
            </span>
          </h1>
          <div className="space-y-4 sm:space-y-6">
            <p className="font-body text-sand/60 text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed max-w-4xl font-light tracking-wide">
              Schedule a strategic session to accelerate your next breakthrough
            </p>
            <div className="relative overflow-hidden">
              <div className="inline-flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 rounded-full backdrop-blur-sm border border-sky/20 bg-sky/10">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-sky"></div>
                <span className="font-body text-sand/60 text-xs sm:text-sm uppercase tracking-widest font-medium">
                  Response within 4 hours guaranteed
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-16 sm:mb-20">
          {/* Meeting Scheduling */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/[0.03] backdrop-blur-xl rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-white/[0.08] group hover:border-white/20 transition-all duration-500 order-2 lg:order-1"
          >
            <h3 className="font-display text-xl sm:text-2xl text-sand mb-6">First one's on me</h3>
            
            <div className="space-y-4 mb-8">
              <p className="font-body text-sand/70 text-sm sm:text-base leading-relaxed">
                Choose the session type that best fits your needs:
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-4 bg-white/[0.02] rounded-lg border border-white/[0.05]">
                  <div className="w-2 h-2 rounded-full bg-orange mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="font-body text-sand text-sm font-medium">15-Minute Discovery</div>
                    <div className="font-body text-sand/60 text-xs leading-relaxed">Quick intro to discuss your project and see if we're a good fit</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 bg-white/[0.02] rounded-lg border border-white/[0.05]">
                  <div className="w-2 h-2 rounded-full bg-sky mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="font-body text-sand text-sm font-medium">45-Minute Deep Dive</div>
                    <div className="font-body text-sand/60 text-xs leading-relaxed">Comprehensive strategy session to explore opportunities and solutions</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <motion.button
                onClick={() => openCalendlyPopup('15min')}
                className="w-full bg-orange/10 border border-orange/20 hover:bg-orange/20 text-sand font-body text-sm px-6 py-4 rounded-lg transition-all duration-300 group/btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between">
                  <span>Book 15-Minute Discovery</span>
                  <span className="text-orange group-hover/btn:translate-x-1 transition-transform">→</span>
                </div>
              </motion.button>
              
              <motion.button
                onClick={() => openCalendlyPopup('45min')}
                className="w-full bg-sky/10 border border-sky/20 hover:bg-sky/20 text-sand font-body text-sm px-6 py-4 rounded-lg transition-all duration-300 group/btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between">
                  <span>Book 45-Minute Deep Dive</span>
                  <span className="text-sky group-hover/btn:translate-x-1 transition-transform">→</span>
                </div>
              </motion.button>
            </div>

            <div className="mt-6 pt-6 border-t border-white/[0.05]">
              <div className="flex items-center space-x-2 text-xs text-sand/40">
                <div className="w-1.5 h-1.5 rounded-full bg-sky"></div>
                <span>All initial sessions are conducted via Google Meet</span>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white/[0.03] backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/[0.08] group hover:border-white/20 transition-all duration-500 order-1 lg:order-2"
          >
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              <div>
                <label htmlFor="name" className="block font-body text-sm font-medium text-sand/60 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3.5 sm:py-3 bg-white/[0.03] border border-white/[0.08] rounded-lg focus:outline-none focus:border-orange transition-colors text-sand font-body text-base min-h-[48px]"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block font-body text-sm font-medium text-sand/60 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3.5 sm:py-3 bg-white/[0.03] border border-white/[0.08] rounded-lg focus:outline-none focus:border-orange transition-colors text-sand font-body text-base min-h-[48px]"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label htmlFor="company" className="block font-body text-sm font-medium text-sand/60 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3.5 sm:py-3 bg-white/[0.03] border border-white/[0.08] rounded-lg focus:outline-none focus:border-orange transition-colors text-sand font-body text-base min-h-[48px]"
                  placeholder="Your company"
                />
              </div>
              <div>
                <label htmlFor="description" className="block font-body text-sm font-medium text-sand/60 mb-2">
                  Project Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3.5 sm:py-3 bg-white/[0.03] border border-white/[0.08] rounded-lg focus:outline-none focus:border-orange transition-colors text-sand font-body resize-none text-base min-h-[120px]"
                  placeholder="Brief description of your project"
                  maxLength="500"
                />
                <div className="text-right font-body text-sm text-sand/40 mt-1">
                  {formData.description.length}/500
                </div>
              </div>
              <motion.div
                className="relative inline-block group w-full"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange/20 via-olive/20 to-sky/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="relative w-full bg-sand/5 backdrop-blur-md font-martian-mono text-base sm:text-lg px-8 sm:px-12 py-4 sm:py-4 rounded-full border border-sand/10 text-sand group-hover:text-white group-hover:border-sand/20 transition-all duration-500 tracking-wider min-h-[56px]"
                >
                  <span className="relative z-10">
                    {isSubmitting ? 'SENDING...' : submitSuccess ? 'MESSAGE SENT!' : 'SEND MESSAGE'}
                  </span>
                </button>
              </motion.div>
            </form>
          </motion.div>
        </div>

        {/* References Section */}
        <motion.section
          ref={referencesRef}
          initial={{ opacity: 0, y: 20 }}
          animate={referencesInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="pt-8 sm:pt-16 md:pt-20 pb-4 sm:pb-12 md:pb-16 px-0 max-w-7xl mx-auto"
        >
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="font-display font-light text-2xl sm:text-3xl md:text-4xl text-sand mb-2">
              What Leaders Say
            </h2>
            <p className="text-white/40 text-sm font-mono tracking-wide">
              Additional references available upon request
            </p>
          </div>
          
          <div className="relative max-w-4xl mx-auto">
            {/* Navigation Controls - Responsive positioning */}
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="inline-flex items-center space-x-3 sm:space-x-4">
                <motion.button
                  onClick={prevTestimonial}
                  className="group flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="bg-black/40 backdrop-blur-sm w-12 h-12 sm:w-10 sm:h-10 rounded-full border border-white/10 text-white/60 hover:text-white/90 transition-all duration-300 flex items-center justify-center group-hover:border-orange/30 group-hover:bg-black/60 touch-manipulation">
                    <span className="relative z-10 flex items-center justify-center text-lg sm:text-base">←</span>
                  </div>
                </motion.button>

                {/* Pagination Dots */}
                <div className="flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 bg-black/20 backdrop-blur-sm rounded-full border border-white/5">
                  {testimonials.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentTestimonialIndex(idx)}
                      className={`w-2 h-2 sm:w-1.5 sm:h-1.5 rounded-full transition-all duration-300 touch-manipulation min-w-[16px] min-h-[16px] sm:min-w-0 sm:min-h-0 ${
                        idx === currentTestimonialIndex
                          ? 'bg-orange'
                          : 'bg-white/20 hover:bg-white/30'
                      }`}
                    />
                  ))}
                </div>

                <motion.button
                  onClick={nextTestimonial}
                  className="group flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="bg-black/40 backdrop-blur-sm w-12 h-12 sm:w-10 sm:h-10 rounded-full border border-white/10 text-white/60 hover:text-white/90 transition-all duration-300 flex items-center justify-center group-hover:border-orange/30 group-hover:bg-black/60 touch-manipulation">
                    <span className="relative z-10 flex items-center justify-center text-lg sm:text-base">→</span>
                  </div>
                </motion.button>
              </div>
            </div>

            {/* Carousel Container */}
            <div className="overflow-hidden touch-pan-y">
              <motion.div
                className="flex items-start"
                animate={{ x: `-${currentTestimonialIndex * 100}%` }}
                drag="x"
                dragConstraints={{ left: -((testimonials.length - 1) * window.innerWidth), right: 0 }}
                dragElastic={0.1}
                dragMomentum={false}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = offset.x;
                  const threshold = window.innerWidth * 0.2; // 20% of screen width
                  
                  if (Math.abs(swipe) > threshold) {
                    if (swipe > 0 && currentTestimonialIndex > 0) {
                      prevTestimonial();
                    } else if (swipe < 0 && currentTestimonialIndex < testimonials.length - 1) {
                      nextTestimonial();
                    }
                  }
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 30,
                  bounce: 0 
                }}
              >
                {testimonials.map((testimonial, index) => {
                  // Calculate dynamic sizing based on quote length
                  const quoteLength = testimonial.quote.length;
                  const isLong = quoteLength > 200;  // Nathan Riddle's quote is ~400+ chars
                  const isMedium = quoteLength > 100 && quoteLength <= 200;
                  
                  return (
                    <motion.div
                      key={index}
                      className="w-full flex-shrink-0 px-2 sm:px-4"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div 
                        className={`bg-black/40 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-white/10 flex flex-col ${
                          isLong ? 'min-h-[280px] sm:min-h-[320px]' : 
                          isMedium ? 'min-h-[220px] sm:min-h-[240px]' : 
                          'min-h-[180px] sm:min-h-[200px]'
                        }`}
                      >
                        <div className="flex items-center mb-4 sm:mb-6 flex-shrink-0">
                          <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-olive/20 border border-olive/40 flex-shrink-0">
                            {testimonial.image ? (
                              <>
                                <img
                                  src={testimonial.image}
                                  alt={testimonial.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                                <div className="absolute inset-0 hidden items-center justify-center text-lg sm:text-2xl font-bold text-sand">
                                  {testimonial.name.charAt(0)}
                                </div>
                              </>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-lg sm:text-2xl font-bold text-sand">
                                {testimonial.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                            <div className="font-header text-sm sm:text-base text-white/90 truncate">{testimonial.name}</div>
                            <div className="font-mono text-xs sm:text-sm text-white/50 leading-tight">
                              <div className="truncate">{testimonial.title}</div>
                              <div className="truncate">{testimonial.company}</div>
                            </div>
                          </div>
                        </div>
                        <div className="flex-1 flex items-center">
                          <p className={`font-body text-white/70 italic leading-relaxed ${
                            isLong ? 'text-xs sm:text-sm lg:text-base' : 
                            'text-sm sm:text-base lg:text-lg'
                          }`}>
                            "{testimonial.quote}"
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>


          </div>
        </motion.section>

        {/* Value Proposition Section */}
        <motion.section
          ref={valueRef}
          initial={{ opacity: 0, y: 20 }}
          animate={valueInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="pt-4 sm:pt-12 md:pt-16 pb-8 sm:pb-16 md:pb-20 px-0 max-w-7xl mx-auto"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {[
              {
                icon: <StrategyIcon />,
                title: "Strategic Frameworks",
                description: "Systematic approach to growth with proven methodologies and scalable solutions."
              },
              {
                icon: <TechnicalIcon />,
                title: "Technical Fluency",
                description: "End-to-end execution capability with cutting-edge technical expertise."
              },
              {
                icon: <ResultsIcon />,
                title: "Proven Results",
                description: "$22M revenue growth and successful partnerships with Fortune 500 companies."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/[0.03] backdrop-blur-xl rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-white/[0.08] group hover:border-white/20 transition-all duration-500"
              >
                {item.icon}
                <h3 className="font-header text-lg sm:text-xl font-light mt-4 sm:mt-6 mb-3 sm:mb-4 text-sand">{item.title}</h3>
                <p className="font-body text-sand/60 text-sm sm:text-base leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Trust Signals */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center py-8 sm:py-12 px-0"
        >
          <div className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full bg-white/[0.03] backdrop-blur-xl border border-white/[0.08]">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-sky rounded-full mr-2"></span>
            <span className="font-body text-sand/60 text-xs sm:text-sm">Based in Salt Lake City, Available Globally</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 