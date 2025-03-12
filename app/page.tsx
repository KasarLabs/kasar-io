'use client';

import React, { useState, useEffect, useRef } from 'react';
import ScrollAnimation from '@/components/ScrollAnimation';
import ProjectSlider from '@/components/project-slider';

export default function Home() {
  const [showProjectSlider, setShowProjectSlider] = useState(false);
  const [hasScrolledToFooter, setHasScrolledToFooter] = useState(false);
  const [showContactSection, setShowContactSection] = useState(false);
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
      const projectSliderElement = mainRef.current && (mainRef.current as HTMLElement).querySelector('[class*="ProjectSlider"]');
      if (projectSliderElement) {
        (projectSliderElement as HTMLElement).style.opacity = "0.01"; // Just enough to force render
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Calculate heights and set up scroll areas
  useEffect(() => {
    if (!mainRef.current) return;
    
    // Ensure the document has enough height for all scrolling sections
    const scrollAnimationElement = mainRef.current && (mainRef.current as HTMLElement).querySelector('[class*="ScrollAnimation"]')?.parentElement;
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
    let lastScrollPosition = window.pageYOffset;
    
    const handleScroll = () => {
      if (!mainRef.current) return;
      
      // Get the current scroll position
      const scrollPosition = window.pageYOffset;
      // Determine scroll direction
      const scrollingDown = scrollPosition > lastScrollPosition;
      lastScrollPosition = scrollPosition;
      
      // Calculate the height of the scroll animation section
      const scrollAnimationElement = mainRef.current && (mainRef.current as HTMLElement).querySelector('[class*="ScrollAnimation"]')?.parentElement;
      const scrollAnimationHeight = scrollAnimationElement ? 
        scrollAnimationElement.getBoundingClientRect().height : 
        window.innerHeight * 2;
      
      // Calculate the total height for all slides in the ProjectSlider
      const slidesCount = 3; // Number of slides in ProjectSlider
      const slideTransitionHeight = window.innerHeight * 0.7; // Increased height to slow down transition
      const projectSliderScrollSpace = slideTransitionHeight * slidesCount * 2; // Double for safety
      
      // Calculate where the contact section should start
      const contactThreshold = scrollAnimationHeight + projectSliderScrollSpace;
      
      // Calculate where the footer should start
      const footerThreshold = contactThreshold + window.innerHeight;
      
      // Determine visibility based on scroll position
      if (scrollPosition >= footerThreshold) {
        // Scrolled to footer
        setHasScrolledToFooter(true);
        setShowContactSection(true);
      } 
      else if (scrollPosition >= contactThreshold) {
        // Scrolled to contact section
        setHasScrolledToFooter(false);
        setShowContactSection(true);
        setShowProjectSlider(true); // Keep project slider visible
      }
      else if (scrollPosition >= scrollAnimationHeight * 0.97) {
        // Start showing ProjectSlider slightly before ScrollAnimation ends
        // This avoids the black screen gap
        setHasScrolledToFooter(false);
        setShowContactSection(false);
        
        // Ensure ProjectSlider is visible when in this section
        if (!showProjectSlider && scrollingDown) {
          setShowProjectSlider(true);
        }
      }
      else if (scrollPosition < scrollAnimationHeight * 0.8) {
        // Still firmly in the ScrollAnimation section
        setShowContactSection(false);
        
        // If scrolling up and we're back in the ScrollAnimation area
        if (!scrollingDown) {
          // Hide ProjectSlider when scrolling back up to ScrollAnimation
          if (showProjectSlider && scrollPosition < scrollAnimationHeight * 0.7) {
            setShowProjectSlider(false);
          }
          
          // Find the ScrollAnimation component and call its reverse method if available
          const scrollAnimationComponent = mainRef.current && (mainRef.current as HTMLElement).querySelector('.ScrollAnimation');
          if (scrollAnimationComponent && 'reverseAnimation' in scrollAnimationComponent) {
            (scrollAnimationComponent as any).reverseAnimation(scrollPosition / scrollAnimationHeight);
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check
    handleScroll();
    
    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [showProjectSlider, showContactSection]);
  
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
      
      {/* Contact Us section - minimaliste et en format paysage */}
      <div 
        className="relative z-30 w-full flex items-center justify-center"
        style={{
          opacity: showContactSection ? 1 : 0,
          visibility: showContactSection ? 'visible' : 'hidden',
          transition: 'opacity 0.8s ease-in-out',
          height: '100vh',
          backgroundColor: '#111',
        }}
      >
        <div className="max-w-4xl w-full px-8 py-12 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-8 md:mb-0 md:w-1/2">
            <h2 className="text-4xl font-bold mb-4">Contact Us</h2>
            <p className="text-gray-400 mb-6">
              Ready to build your next generation project with us? 
              Get in touch and let's create something amazing together.
            </p>
            <a 
              href="mailto:contact@yourcompany.com" 
              className="inline-block px-6 py-3 bg-white text-black font-medium rounded hover:bg-gray-200 transition-colors"
            >
              Get in Touch
            </a>
          </div>
          <div className="md:w-1/2 flex justify-center md:justify-end">
            <div className="w-64 h-64 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-xl font-bold">Let's Talk</span>
            </div>
          </div>
        </div>
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