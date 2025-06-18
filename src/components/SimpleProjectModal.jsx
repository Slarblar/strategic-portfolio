import React, { useEffect } from 'react';

const SimpleProjectModal = ({ isOpen, onClose, project }) => {
  useEffect(() => {
    if (isOpen && project) {
      console.log('🆕 SimpleProjectModal opened!', { project: project.title });
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      // EXTREME VISIBILITY TEST - Try multiple approaches simultaneously
      const createModalWithExtremeForcing = () => {
        // Remove any existing
        const existing = document.getElementById('simple-project-modal');
        if (existing) existing.remove();
        
        // TEST 1: Create multiple modals with different approaches
        for (let i = 0; i < 3; i++) {
          const modal = document.createElement('div');
          modal.id = `simple-project-modal-${i}`;
          
          // Different extreme styling approaches
          const styles = [
            // Approach 1: Maximum contrast red background
            `
              position: fixed !important;
              top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important;
              width: 100vw !important; height: 100vh !important;
              background: red !important;
              z-index: ${2147483647 - i} !important;
              display: block !important;
              visibility: visible !important; opacity: 1 !important;
              transform: none !important; translate: none !important;
              pointer-events: auto !important;
              color: white !important; font-size: 50px !important; font-weight: bold !important;
              text-align: center !important; line-height: 100vh !important;
            `,
            // Approach 2: CSS Grid forcing
            `
              position: fixed !important;
              inset: 0 !important;
              width: 100vw !important; height: 100vh !important;
              background: linear-gradient(45deg, blue, yellow) !important;
              z-index: ${2147483646 - i} !important;
              display: grid !important; place-items: center !important;
              visibility: visible !important; opacity: 1 !important;
              color: black !important; font-size: 40px !important; font-weight: bold !important;
            `,
            // Approach 3: Flexbox with extreme overrides
            `
              position: fixed !important;
              top: 0px !important; left: 0px !important;
              width: ${window.innerWidth}px !important; height: ${window.innerHeight}px !important;
              background: green !important;
              z-index: ${2147483645 - i} !important;
              display: flex !important; align-items: center !important; justify-content: center !important;
              visibility: visible !important; opacity: 1 !important;
              color: white !important; font-size: 30px !important; font-weight: bold !important;
            `
          ];
          
          modal.style.cssText = styles[i];
          modal.innerHTML = `
            <div style="
              background: white !important; color: black !important;
              padding: 50px !important; border: 10px solid ${['red', 'blue', 'green'][i]} !important;
              border-radius: 20px !important; text-align: center !important;
              box-shadow: 0 0 100px rgba(0,0,0,0.9) !important;
              font-family: Arial, sans-serif !important;
            ">
              <h1 style="margin: 0 !important; font-size: 36px !important; color: ${['red', 'blue', 'green'][i]} !important;">
                TEST ${i + 1} - ${['RED', 'BLUE', 'GREEN'][i]}
              </h1>
              <p style="margin: 20px 0 !important; font-size: 20px !important;">
                Project: ${project.title || 'Unknown'}
              </p>
              <p style="margin: 20px 0 !important; font-size: 16px !important;">
                Screen: ${window.innerWidth}x${window.innerHeight}
              </p>
              <p style="margin: 20px 0 !important; font-size: 16px !important;">
                Time: ${new Date().toLocaleTimeString()}
              </p>
              <button 
                onclick="this.closest('[id^=simple-project-modal]').remove(); document.querySelectorAll('[id^=simple-project-modal]').forEach(el => el.remove());"
                style="
                  background: ${['red', 'blue', 'green'][i]} !important; color: white !important;
                  border: none !important; padding: 20px 40px !important;
                  font-size: 18px !important; border-radius: 10px !important;
                  cursor: pointer !important; font-weight: bold !important;
                "
              >
                CLOSE ALL TESTS
              </button>
            </div>
          `;
          
          // Force append to different containers
          const containers = [document.body, document.documentElement, document.head.parentNode];
          const container = containers[i] || document.body;
          container.appendChild(modal);
          
          // Force visibility with setTimeout
          setTimeout(() => {
            modal.style.display = ['block', 'grid', 'flex'][i];
            modal.style.visibility = 'visible';
            modal.style.opacity = '1';
            modal.style.zIndex = String(2147483647 - i);
          }, i * 100);
          
          console.log(`🧪 Test modal ${i + 1} created with ${['RED', 'BLUE', 'GREEN'][i]} background`);
        }
        
        // TEST 2: Also try setting document and html properties
        document.documentElement.style.setProperty('--modal-test', 'visible', 'important');
        document.body.style.setProperty('position', 'relative', 'important');
        
        // TEST 3: Force remove any potential hiding CSS
        const potentialHiders = [
          '.modal-overlay', '.modal-content', '[role="dialog"]', 
          '.split-modal-overlay', '.project-modal-overlay-unique'
        ];
        potentialHiders.forEach(selector => {
          document.querySelectorAll(selector).forEach(el => {
            el.style.setProperty('display', 'none', 'important');
            el.style.setProperty('visibility', 'hidden', 'important');
            el.remove();
          });
        });
        
        console.log('🧪 Extreme visibility test deployed - 3 different modals created');
      };
      
      createModalWithExtremeForcing();
      
      return () => {
        document.body.style.overflow = '';
        // Clean up all test modals
        for (let i = 0; i < 3; i++) {
          const modal = document.getElementById(`simple-project-modal-${i}`);
          if (modal) modal.remove();
        }
      };
    }
  }, [isOpen, onClose, project]);

  // Return null - we use DOM manipulation
  return null;
};

export default SimpleProjectModal; 