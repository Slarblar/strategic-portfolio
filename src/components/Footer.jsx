import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 w-full bg-ink/5 backdrop-blur-sm py-3 sm:py-2 px-3 sm:px-0">
      <div className="max-w-[2400px] mx-auto flex flex-col">
        {/* Menu Items - Distributed evenly in four columns */}
        <nav className="w-full grid grid-cols-4 gap-2 sm:gap-0 items-center mix-blend-exclusion">
          <Link 
            to="/about-me" 
            className="group font-header font-bold text-[10px] sm:text-sm md:text-base lg:text-[18px] uppercase tracking-wider text-white py-1 sm:py-2 text-center"
          >
            <span className="relative z-10 transition-colors duration-300 ease-in-out group-hover:text-[#f27127] leading-none whitespace-nowrap">
              Based in SLC, UT
            </span>
          </Link>
          <a 
            href="/resume/JordanNguyen-Resume-2025.pdf" 
            target="_blank"
            rel="noopener noreferrer"
            className="group font-header font-bold text-[10px] sm:text-sm md:text-base lg:text-[18px] uppercase tracking-wider text-white py-1 sm:py-2 text-center"
          >
            <span className="relative z-10 transition-colors duration-300 ease-in-out group-hover:text-[#f27127] leading-none whitespace-nowrap">
              RESUME
            </span>
          </a>
          <a 
            href="https://www.linkedin.com/in/jordan-nguyen" 
            target="_blank"
            rel="noopener noreferrer"
            className="group font-header font-bold text-[10px] sm:text-sm md:text-base lg:text-[18px] uppercase tracking-wider text-white py-1 sm:py-2 text-center"
          >
            <span className="relative z-10 transition-colors duration-300 ease-in-out group-hover:text-[#f27127] leading-none whitespace-nowrap">
              LinkedIn
            </span>
          </a>
          <div className="font-header font-normal text-[10px] sm:text-sm md:text-base lg:text-[18px] uppercase tracking-wider text-white/80 py-1 sm:py-2 text-center">
            <span className="whitespace-nowrap">© {new Date().getFullYear()} SLARBAR</span>
          </div>
        </nav>
      </div>
    </footer>
  );
};

export default Footer; 