'use client';

import React, { useState, useEffect } from 'react';
import ScrollAnimation from '@/components/ScrollAnimation';
import ProjectSlider from '@/components/project-slider';

export default function Home() {
  const [showProjectSlider, setShowProjectSlider] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  
  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.pageYOffset);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Handler for when scroll animation completes
  const handleScrollComplete = () => {
    setShowProjectSlider(true);
  };
  
  return (
    <main className="bg-black text-white min-h-screen">
      <ScrollAnimation onScrollComplete={handleScrollComplete} />
      
      {/* Project slider with conditional visibility */}
      <div 
        style={{
          opacity: showProjectSlider ? 1 : 0,
          transition: 'opacity 0.8s ease-in-out',
          position: 'relative',
          // Place it after the scroll animation
          marginTop: '100vh',
          pointerEvents: showProjectSlider ? 'auto' : 'none',
          zIndex: 20,
        }}
      >
        <ProjectSlider />
      </div>
    </main>
  );
}