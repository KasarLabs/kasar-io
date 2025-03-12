'use client';

import React, { useState, useEffect, useRef } from 'react';
import ScrollAnimation from '@/components/ScrollAnimation';
import ProjectSlider from '@/components/project-slider';

export default function Home() {
  const [showProjectSlider, setShowProjectSlider] = useState(false);
  const [hasScrolledToFooter, setHasScrolledToFooter] = useState(false);
  const mainRef = useRef(null);
  const footerSpacerRef = useRef(null);
  const projectSliderRef = useRef(null);
  
  // Handler for when scroll animation completes
  const handleScrollComplete = () => {
    // Trigger the ProjectSlider visibility immediately to avoid blank screen
    setShowProjectSlider(true);
  };
  
  // Pre-render the ProjectSlider to avoid black screen
  useEffect(() => {
    // Set a very short timeout to ensure the ProjectSlider is ready to be shown
    const timer = setTimeout(() => {
      // Preload the ProjectSlider with very low opacity to prevent the black flash
      const projectSliderElement = mainRef.current?.querySelector('[class*="ProjectSlider"]');
      if (projectSliderElement) {
        projectSliderElement.style.opacity = "0.01"; // Just enough to force render
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Calculate heights and set up scroll areas
  useEffect(() => {
    if (!mainRef.current) return;
    
    // Ensure the document has enough height for all scrolling sections
    const scrollAnimationElement = mainRef.current.querySelector('[class*="ScrollAnimation"]')?.parentElement;
    const scrollAnimationHeight = scrollAnimationElement ? 
      scrollAnimationElement.getBoundingClientRect().height : 
      window.innerHeight * 2;

    // Ensure there's enough room for the main content
    const documentHeight = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    );
    
    // Check if we need to add more height to allow full scrolling
    const minRequiredHeight = scrollAnimationHeight + (window.innerHeight * 6);
    if (documentHeight < minRequiredHeight) {
      // Add a spacer element if needed
      const spacerElement = document.createElement('div');
      spacerElement.style.height = `${minRequiredHeight - documentHeight}px`;
      spacerElement.style.width = '100%';
      spacerElement.style.position = 'relative';
      spacerElement.id = 'scroll-spacer';
      
      // Remove any existing spacer first
      const existingSpace = document.getElementById('scroll-spacer');
      if (existingSpace) existingSpace.remove();
      
      document.body.appendChild(spacerElement);
    }
  }, []);
  
  // Monitor scroll position to control visibility and transitions
  useEffect(() => {
    const handleScroll = () => {
      if (!mainRef.current) return;
      
      // Get the current scroll position
      const scrollPosition = window.pageYOffset;
      
      // Calculate the height of the scroll animation section
      const scrollAnimationElement = mainRef.current.querySelector('[class*="ScrollAnimation"]')?.parentElement;
      const scrollAnimationHeight = scrollAnimationElement ? 
        scrollAnimationElement.getBoundingClientRect().height : 
        window.innerHeight * 2;
      
      // Calculate the total height for all slides in the ProjectSlider
      const slidesCount = 3; // Number of slides in ProjectSlider
      const slideTransitionHeight = window.innerHeight * 0.7; // Increased height to slow down transition
      const projectSliderScrollSpace = slideTransitionHeight * slidesCount * 2; // Double for safety
      
      // Calculate where the footer should start
      const footerThreshold = scrollAnimationHeight + projectSliderScrollSpace;
      
      // Determine visibility based on scroll position
      if (scrollPosition >= footerThreshold) {
        // Scrolled to footer
        setHasScrolledToFooter(true);
        
        // Keep ProjectSlider visible but "completed"
        // Don't hide it as that would cause UI jump
      } 
      else if (scrollPosition >= scrollAnimationHeight * 0.97 && showProjectSlider) {
        // Start showing ProjectSlider slightly before ScrollAnimation ends
        // This avoids the black screen gap
        setHasScrolledToFooter(false);
      }
      else if (scrollPosition < scrollAnimationHeight * 0.8) {
        // Still firmly in the ScrollAnimation section
        // Don't hide ProjectSlider if it's already shown by the callback
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check
    handleScroll();
    
    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [showProjectSlider]);
  
  return (
    <div ref={mainRef} className="bg-black text-white">
      {/* First section with scroll animation */}
      <div className="relative">
        <ScrollAnimation onScrollComplete={handleScrollComplete} />
      </div>
      
      {/* Project slider section */}
      <div 
        ref={projectSliderRef}
        className="relative z-20 w-full"
        style={{
          opacity: showProjectSlider ? 1 : 0,
          visibility: 'visible', // Always keep in DOM to avoid rendering issues
          transition: 'opacity 0.8s ease-in-out',
          pointerEvents: showProjectSlider ? 'auto' : 'none',
          // Set a large min-height to ensure all slides can be reached via scrolling
          minHeight: `${window.innerHeight * 4}px`,
        }}
      >
        <ProjectSlider />
      </div>
      
      {/* Spacer to trigger the global Footer visibility */}
      <div 
        ref={footerSpacerRef}
        style={{ 
          height: '100vh', 
          opacity: hasScrolledToFooter ? 1 : 0,
          transition: 'opacity 0.8s ease-in-out',
        }} 
      />
    </div>
  );
}