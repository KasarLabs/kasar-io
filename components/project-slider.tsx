"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import UnifiedAsciiAnimation from "./ascii-animation";
import Link from "next/link";
import Image from "next/image";
import { FiArrowRight } from "react-icons/fi";

const slides = [
  {
    id: 1,
    title: "Sn Stack Exploration",
    subtitle: "Client & Blockchain Solutions",
    description:
      "Notre exploration de la stack Starknet vise à développer des outils et des bibliothèques pour faciliter l'intégration et l'utilisation de Starknet par les développeurs. Nous travaillons sur des solutions client robustes et des implémentations blockchain optimisées.",
    asciiState: 1,
    logo: "/images/snstack-logo.webp",
    isMainSlide: false,
    primaryLink: {
      text: "SnStack GitHub",
      url: "https://github.com/kasarlabs/snstack"
    },
    secondaryLink: {
      text: "Documentation",
      url: "https://docs.kasar.io/snstack"
    }
  },
  {
    id: 2,
    title: "Snak Framework",
    subtitle: "Starknet Agent Kit",
    description: 
      "Snak est un framework complet pour la création d'agents autonomes sur Starknet. Il fournit les outils nécessaires pour développer, tester et déployer des agents intelligents capables d'interagir avec la blockchain Starknet de manière autonome et efficace.",
    asciiState: 2,
    logo: "/images/snak-logo.webp",
    isMainSlide: false,
    primaryLink: {
      text: "Snak GitHub",
      url: "https://github.com/kasarlabs/snak"
    },
    secondaryLink: {
      text: "Documentation",
      url: "https://docs.kasar.io/snak"
    }
  },
  {
    id: 3,
    title: "Quaza",
    subtitle: "L3 Solution for Starknet",
    description: 
      "Quaza est une solution de layer 3 construite sur Starknet, spécialement conçue pour les agents autonomes et les développeurs. Elle offre des performances améliorées, des frais réduits et des fonctionnalités avancées pour les applications décentralisées modernes.",
    asciiState: 3,
    logo: "/images/quaza-logo.webp",
    isMainSlide: false,
    primaryLink: {
      text: "Quaza GitHub",
      url: "https://github.com/kasarlabs/quaza"
    },
    secondaryLink: {
      text: "Documentation",
      url: "https://docs.quaza.io"
    }
  },
];

interface ProjectSliderProps {
  // You can add custom props if needed
}

export default function ProjectSlider({}: ProjectSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const slideContainerRef = useRef<HTMLDivElement>(null);
  const scrollControlRef = useRef<HTMLDivElement>(null);
  
  const [asciiState, setAsciiState] = useState(slides[0].asciiState);
  const [hasInitialized, setHasInitialized] = useState(false);
  
  // Style pour l'animation d'horloge numérique
  const digitClockStyle = {
    transition: "transform 0.8s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.8s cubic-bezier(0.23, 1, 0.32, 1)",
  };
  
  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning || index === currentSlide) return;
      setIsTransitioning(true);
      setAsciiState(slides[index].asciiState);

      setTimeout(() => {
        setCurrentSlide(index);
        setIsTransitioning(false);
      }, 800);
    },
    [isTransitioning, currentSlide],
  );

  // Setup scroll-based slide changes
  useEffect(() => {
    // Wait a moment before initializing to ensure that the component is fully mounted
    // and visible (after ScrollAnimation completes)
    const initTimer = setTimeout(() => {
      setHasInitialized(true);
    }, 1000);
    
    return () => clearTimeout(initTimer);
  }, []);
  
  // Set up scroll control after initialization
  useEffect(() => {
    if (!hasInitialized || !scrollControlRef.current) return;
    
    // Calculate the height needed for scrolling - ensure enough space for all slides
    // Since the component is fixed, we need significantly more height to ensure all slides can be reached
    const slideHeight = window.innerHeight; // Full viewport height per slide
    const totalHeight = slideHeight * (slides.length * 2); // Significantly more space to ensure scrolling works
    
    // Set height of scroll control element
    scrollControlRef.current.style.height = `${totalHeight}px`;
    
    const handleScroll = () => {
      if (!slideContainerRef.current || !scrollControlRef.current) return;
      
      // Get current scroll position
      const scrollPosition = window.pageYOffset;
      
      // Find where the scroll animation ends - we need to find the parent element
      // that contains the ScrollAnimation and get its height
      const parentElement = slideContainerRef.current.parentElement;
      const scrollAnimationHeight = parentElement ? 
        parentElement.previousElementSibling?.getBoundingClientRect().height || window.innerHeight : 
        window.innerHeight;
        
      // If we haven't scrolled past the animation section yet, reset to first slide
      if (scrollPosition < scrollAnimationHeight * 0.9) {
        if (currentSlide !== 0 && !isTransitioning) {
          goToSlide(0); // Reset to first slide when scrolling back to animation
        }
        return;
      }
      
      // Calculate relative scroll position after the ScrollAnimation
      const sliderStart = scrollPosition - scrollAnimationHeight;
      const viewportHeight = window.innerHeight;
      
      // Calculate which slide to show based on scroll position
      // Using a smaller divisor to ensure all slides can be reached
      const slideIndex = Math.min(
        Math.floor(sliderStart / (viewportHeight * 0.5)), // Reduced threshold to ensure all slides are reachable
        slides.length - 1
      );
      
      // Ensure we're working with valid values
      const validSlideIndex = Math.max(0, Math.min(slideIndex, slides.length - 1));
      
      // Only change if we're moving to a different slide
      if (validSlideIndex !== currentSlide && !isTransitioning) {
        goToSlide(validSlideIndex);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [currentSlide, goToSlide, isTransitioning, hasInitialized]);

  return (
    <div 
      ref={slideContainerRef}
      className="w-full min-h-screen flex flex-col justify-center bg-black overflow-hidden relative"
    >
      {/* Scroll control div - invisible but controls height for scrolling */}
      <div ref={scrollControlRef} className="w-full absolute top-0 left-0" />
      
      {/* Animation en arrière-plan complète - fixed to keep it on screen while scrolling */}
      <div className="fixed inset-0">
        <UnifiedAsciiAnimation currentSlide={asciiState} />
      </div>

      <div className="w-full px-6 md:px-12 lg:px-16 py-16 fixed top-0 left-0 z-10 min-h-screen flex flex-col justify-center">
        <div className="max-w-4xl mx-auto lg:mx-0 w-full">
          <div className="flex items-center gap-4 mb-4">
            {/* Conteneur pour l'animation du sous-titre */}
            <div className="h-12 overflow-hidden relative flex-grow">
              {/* Sous-titre actuel */}
              <div 
                className="absolute w-full"
                style={{
                  ...digitClockStyle,
                  transform: isTransitioning ? "translateY(-100%)" : "translateY(0)",
                  opacity: isTransitioning ? 0 : 1
                }}
              >
                <h2 className="text-lg lg:text-xl text-neutral-400">
                  {slides[currentSlide].subtitle}
                </h2>
              </div>
              
              {/* Sous-titre suivant */}
              {isTransitioning && (
                <div 
                  className="absolute w-full"
                  style={{
                    ...digitClockStyle,
                    transform: "translateY(0)",
                    opacity: 1,
                    top: "100%",
                    animation: "slideUp 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards"
                  }}
                >
                  <h2 className="text-lg lg:text-xl text-neutral-400">
                    {slides[(currentSlide + 1) % slides.length].subtitle}
                  </h2>
                </div>
              )}
            </div>
          </div>

          {/* Conteneur pour l'animation de titre */}
          <div className="h-16 mb-4 overflow-hidden relative">
            {/* Titre actuel */}
            <div 
              className="absolute w-full"
              style={{
                ...digitClockStyle,
                transform: isTransitioning ? "translateY(-100%)" : "translateY(0)",
                opacity: isTransitioning ? 0 : 1
              }}
            >
              <h1 className="text-4xl lg:text-5xl font-bold max-w-4xl">
                {slides[currentSlide].title}
              </h1>
            </div>
            
            {/* Titre suivant */}
            {isTransitioning && (
              <div 
                className="absolute w-full"
                style={{
                  ...digitClockStyle,
                  transform: "translateY(0)",
                  opacity: 1,
                  top: "100%",
                  animation: "slideUp 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards"
                }}
              >
                <h1 className="text-4xl lg:text-5xl font-bold max-w-4xl">
                  {slides[(currentSlide + 1) % slides.length].title}
                </h1>
              </div>
            )}
          </div>
          
          {/* Conteneur pour l'animation de description */}
          <div className="h-32 mb-8 overflow-hidden relative">
            {/* Description actuelle */}
            <div 
              className="absolute w-full"
              style={{
                ...digitClockStyle,
                transform: isTransitioning ? "translateY(-100%)" : "translateY(0)",
                opacity: isTransitioning ? 0 : 1
              }}
            >
              <p className="text-base lg:text-lg text-neutral-300 max-w-2xl leading-relaxed">
                {slides[currentSlide].description}
              </p>
            </div>
            
            {/* Description suivante */}
            {isTransitioning && (
              <div 
                className="absolute w-full"
                style={{
                  ...digitClockStyle,
                  transform: "translateY(0)",
                  opacity: 1,
                  top: "100%",
                  animation: "slideUp 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards"
                }}
              >
                <p className="text-base lg:text-lg text-neutral-300 max-w-2xl leading-relaxed">
                  {slides[(currentSlide + 1) % slides.length].description}
                </p>
              </div>
            )}
          </div>
          
          {/* Boutons - avec animation de fondu simple */}
          <div 
            className="flex flex-col sm:flex-row gap-3"
            style={{
              transition: "opacity 0.5s ease",
              opacity: isTransitioning ? 0.5 : 1
            }}
          >
            <Link 
              href={slides[currentSlide].primaryLink.url}
              target="_blank"
              className="inline-flex items-center px-6 py-3 rounded-2xl bg-white text-black font-medium transition-all hover:bg-neutral-200 hover:scale-105 text-sm"
            >
              {slides[currentSlide].primaryLink.text} <FiArrowRight className="ml-2" />
            </Link>
            
            <Link 
              href={slides[currentSlide].secondaryLink.url}
              target="_blank"
              className="inline-flex items-center px-6 py-3 rounded-2xl bg-transparent border border-white text-white font-medium transition-all hover:bg-white hover:bg-opacity-5 hover:scale-105 text-sm"
            >
              {slides[currentSlide].secondaryLink.text} <FiArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </div>
      
      {/* Indicateurs de slide en bas avec possibilité de cliquer */}
      <div className="fixed bottom-8 left-0 right-0 flex justify-center space-x-2">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              index === currentSlide ? "bg-white w-4" : "bg-neutral-600"
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Scroll indicator - shows which slide you'll see next */}
      <div className="fixed bottom-24 right-8 hidden md:block">
        <div className="flex flex-col items-center space-y-2">
          <span className="text-xs text-neutral-400">Scroll</span>
          <div className="w-0.5 h-16 bg-neutral-800 relative overflow-hidden">
            <div 
              className="w-full bg-white absolute top-0 h-8"
              style={{
                animation: "scrollDown 2s infinite",
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Animation CSS pour le défilement vertical et scroll indicator */}
      <style jsx global>{`
        @keyframes slideUp {
          0% {
            transform: translateY(100%);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes scrollDown {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(200%);
          }
        }
      `}</style>
    </div>
  );
}