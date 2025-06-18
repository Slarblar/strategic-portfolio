import React, { useState } from 'react';
import SplitLayoutModal from './SplitLayoutModal';

const SplitLayoutModalExample = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);

  // Sample project data - replace with your actual project data
  const sampleProjects = [
    {
      title: "Purple Carpet Party 2023",
      year: "2023",
      description: "The Purple Carpet Party event achieved approximately 3,500 attendees in collaboration with Station Park and Cinemark in Farmington, Utah. I co-designed the primary event logo with Brenda Hawley and led comprehensive visual direction including signage systems, event merchandise, large-format posed cutouts for photo opportunities, and creative direction for the movie poster.",
      details: "This cohesive design approach created a memorable branded experience that successfully translated the A for Adley visual language into a major public event format, demonstrating effective cross-platform brand extension and event marketing execution.",
      technologies: ["Adobe Creative Suite", "Print Design", "Event Branding", "Large Format Production"],
      images: [
        "/images/a4/visual-works/purple-carpet-party/purpleparty-1.webp",
        "/images/a4/visual-works/purple-carpet-party/purpleparty-2.webp",
        "/images/a4/visual-works/purple-carpet-party/purpleparty-3.webp"
      ]
    },
    {
      title: "Brand Development 2020",
      year: "2020",
      description: "Comprehensive brand identity development for A for Adley, establishing visual guidelines and brand architecture that would scale across multiple platforms and touchpoints.",
      details: "The brand development process involved extensive research into children's media, color psychology, and family entertainment preferences. This foundational work established the visual language that continues to guide all A for Adley creative output.",
      technologies: ["Brand Strategy", "Adobe Illustrator", "Typography", "Color Theory"],
      images: [
        "/images/a4/visual-works/brand-guide-2020/brandguide-1.webp",
        "/images/a4/visual-works/brand-guide-2020/brandguide-2.webp",
        "/images/a4/visual-works/brand-guide-2020/brandguide-3.webp"
      ]
    },
    {
      title: "Candyland Scooter 2022",
      year: "2022",
      description: "Product design and branding for the Candyland-themed scooter collaboration, featuring vibrant colors and playful design elements that appeal to the A for Adley audience.",
      details: "This project required balancing safety considerations with creative expression, resulting in a product that maintained brand consistency while meeting manufacturing and safety standards for children's recreational equipment.",
      technologies: ["Product Design", "3D Modeling", "Manufacturing Collaboration", "Brand Application"],
      images: [
        "/images/a4/visual-works/candyland-scooter-2022/candyland-1.webp",
        "/images/a4/visual-works/candyland-scooter-2022/candyland-2.webp",
        "/images/a4/visual-works/candyland-scooter-2022/candyland-3.webp"
      ]
    }
  ];

  const currentProject = sampleProjects[currentProjectIndex];

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const goToPreviousProject = () => {
    setCurrentProjectIndex((prev) => 
      prev === 0 ? sampleProjects.length - 1 : prev - 1
    );
  };

  const goToNextProject = () => {
    setCurrentProjectIndex((prev) => 
      prev === sampleProjects.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="font-header text-4xl text-sand mb-6">
          Split Layout Modal Demo
        </h1>
        
        <p className="font-body text-sand/80 mb-8 max-w-2xl mx-auto">
          This demonstrates the new split-layout modal with a fixed image area at the top 
          (optimized for 16:9 portfolio images) and scrollable content below.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {sampleProjects.map((project, index) => (
            <div 
              key={index}
              className="bg-sand rounded-xl p-6 cursor-pointer hover:shadow-lg transition-shadow duration-300"
              onClick={() => {
                setCurrentProjectIndex(index);
                setIsModalOpen(true);
              }}
            >
              <div className="aspect-video bg-stone/20 rounded-lg mb-4 overflow-hidden">
                {project.images && project.images[0] && (
                  <img 
                    src={project.images[0]} 
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <h3 className="font-header text-ink text-lg mb-2">{project.title}</h3>
              <p className="text-ink/60 text-sm font-martian-mono">{project.year}</p>
            </div>
          ))}
        </div>

        <button
          onClick={openModal}
          className="bg-orange hover:bg-rust text-sand font-header px-8 py-3 rounded-lg transition-colors duration-200"
        >
          Open Current Project: {currentProject.title}
        </button>

        <div className="mt-6 space-x-4">
          <button
            onClick={goToPreviousProject}
            className="bg-ink/20 hover:bg-ink/30 text-sand px-4 py-2 rounded border border-sand/20 transition-colors duration-200"
          >
            ← Previous Project
          </button>
          <span className="text-sand/60 font-martian-mono">
            {currentProjectIndex + 1} / {sampleProjects.length}
          </span>
          <button
            onClick={goToNextProject}
            className="bg-ink/20 hover:bg-ink/30 text-sand px-4 py-2 rounded border border-sand/20 transition-colors duration-200"
          >
            Next Project →
          </button>
        </div>
      </div>

      <SplitLayoutModal
        isOpen={isModalOpen}
        onClose={closeModal}
        project={currentProject}
        currentIndex={currentProjectIndex}
        totalImages={sampleProjects.length}
        onPrevious={goToPreviousProject}
        onNext={goToNextProject}
      />
    </div>
  );
};

export default SplitLayoutModalExample; 