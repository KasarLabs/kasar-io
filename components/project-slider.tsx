"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import VideoAsciiArt from "./video-ascii-art";
import UnifiedAsciiAnimation from "./ascii-animation";

const slides = [
  {
    id: 0,
    title: "Build your next gen Starknet project with Kasar²",
    description:
      "An engineering and research laboratory of Starknet core devs solving your high and low-level problems.",
    videoSrc: "/placeholder-kasar.mp4",
  },
  {
    id: 1,
    title: "Sn Stack exploration",
    description: "L'exploration de solutions client and blockchain for the Starknet Stack.",
    videoSrc: "/placeholder-stack.mp4",
  },
  {
    id: 2,
    title: "Snak",
    description: "Le Starknet agent kit framework pour build des agents.",
    videoSrc: "/placeholder-snak.mp4",
  },
  {
    id: 3,
    title: "Quaza",
    description: "Une L3 Starknet pour agents et développeurs.",
    videoSrc: "/videos/dragon.webm",
  },
];

export default function ProjectSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState("left");
  const slideContainerRef = useRef<HTMLDivElement>(null);

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);

      if (index > currentSlide || (currentSlide === slides.length - 1 && index === 0)) {
        setDirection("left");
      } else {
        setDirection("right");
      }

      if (slideContainerRef.current) {
        slideContainerRef.current.classList.add("slide-exit");
      }

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
    [currentSlide, isTransitioning]
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
      {/* Unified ASCII Animation - visible on slides 0, 1, and 3 */}
      {(currentSlide === 0 || currentSlide === 1 || currentSlide === 2) && (
        <div 
          className="absolute inset-0 w-screen h-screen"
          style={{ top: "-5rem" }}
        >
          <UnifiedAsciiAnimation currentSlide={currentSlide} />
        </div>
      )}

      <div
        ref={slideContainerRef}
        className={`w-full flex items-center justify-center transition-all duration-800 relative z-10 ${
          direction === "left" ? "slide-direction-left" : "slide-direction-right"
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
          
          {/* Empty right column for slide 0, 1, and 3 to maintain layout */}
          {(currentSlide === 0 || currentSlide === 1 || currentSlide === 2) ? (
            <div className="md:block hidden">
              {/* Intentionally empty to maintain grid layout */}
            </div>
          ) : (
            <div className="flex justify-center md:justify-end slide-element slide-element-2 relative">
              <div className="w-full h-72 md:h-96 relative">
                <VideoAsciiArt videoSrc={slides[currentSlide].videoSrc} />
              </div>
            </div>
          )}
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