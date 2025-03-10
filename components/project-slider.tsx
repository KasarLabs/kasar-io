"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import UnifiedAsciiAnimation from "./ascii-animation";

const slides = [
  {
    id: 0,
    title: "Build your next gen Starknet project with Kasar²",
    description:
      "An engineering and research laboratory of Starknet core devs solving your high and low-level problems.",
    asciiState: 0, // Rain state
  },
  {
    id: 1,
    title: "Sn Stack exploration",
    description:
      "L'exploration de solutions client and blockchain for the Starknet Stack.",
    asciiState: 1, // Cloud state
  },
  {
    id: 2,
    title: "Snak",
    description: "Le Starknet agent kit framework pour build des agents.",
    asciiState: 2, // Grid state
  },
  {
    id: 3,
    title: "Quaza",
    description: "Une L3 Starknet pour agents et développeurs.",
    asciiState: 3, // Spiral state - using ASCII animation instead of MP4
  },
];

export default function ProjectSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState("left");
  const slideContainerRef = useRef<HTMLDivElement>(null);
  
  // ASCII state for animation
  const [asciiState, setAsciiState] = useState(slides[0].asciiState);
  const [asciiVisible, setAsciiVisible] = useState(true); // Always visible now that we use ASCII for all slides
  
  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);

      if (
        index > currentSlide ||
        (currentSlide === slides.length - 1 && index === 0)
      ) {
        setDirection("left");
      } else {
        setDirection("right");
      }

      if (slideContainerRef.current) {
        slideContainerRef.current.classList.add("slide-exit");
      }
      
      // Update ASCII state to trigger transition
      console.log(`Transitioning ASCII from ${slides[currentSlide].asciiState} to ${slides[index].asciiState}`);
      setAsciiState(slides[index].asciiState);

      setTimeout(() => {
        setCurrentSlide(index);
        if (slideContainerRef.current) {
          slideContainerRef.current.classList.remove("slide-exit");
          slideContainerRef.current.classList.add("slide-enter");

          setTimeout(() => {
            if (slideContainerRef.current) {
              slideContainerRef.current.classList.remove("slide-enter");
            }
            setIsTransitioning(false);
          }, 800);
        }
      }, 600);
    },
    [currentSlide, isTransitioning],
  );

  const nextSlide = useCallback(() => {
    const nextIndex = currentSlide === slides.length - 1 ? 0 : currentSlide + 1;
    goToSlide(nextIndex);
  }, [currentSlide, goToSlide]);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <div className="w-full min-h-[calc(100vh-5rem)] flex flex-col justify-center overflow-hidden relative">
      {/* ASCII Animation - now used for all slides */}
      <div
        className="absolute inset-0 w-screen h-screen"
        style={{ top: "-5rem" }}
      >
        <UnifiedAsciiAnimation currentSlide={asciiState} />
      </div>

      <div
        ref={slideContainerRef}
        className={`w-full flex items-center justify-center transition-all duration-800 relative z-10 ${
          direction === "left"
            ? "slide-direction-left"
            : "slide-direction-right"
        }`}
      >
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center px-6 md:px-20">
          <div className="text-left slide-element slide-element-1">
            <h1 className="text-3xl md:text-5xl font-semibold mb-8">
              {slides[currentSlide].title}
            </h1>
            <p className="text-neutral-300 text-lg md:text-xl">
              {slides[currentSlide].description}
            </p>
          </div>

          <div className="md:block hidden">
            {/* Empty div to maintain layout */}
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="pb-12 pt-8 flex justify-center space-x-3 relative z-20">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide ? "bg-white w-4" : "bg-neutral-600"
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}