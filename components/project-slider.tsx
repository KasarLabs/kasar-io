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
    asciiState: 0, // État pluie
  },
  {
    id: 1,
    title: "Sn Stack exploration",
    description:
      "L'exploration de solutions client and blockchain for the Starknet Stack.",
    videoSrc: "/placeholder-stack.mp4",
    asciiState: 1, // État nuage
  },
  {
    id: 2,
    title: "Snak",
    description: "Le Starknet agent kit framework pour build des agents.",
    videoSrc: "/placeholder-snak.mp4",
    asciiState: 2, // État grille
  },
  {
    id: 3,
    title: "Quaza",
    description: "Une L3 Starknet pour agents et développeurs.",
    videoSrc: "/videos/dragon.webm",
    asciiState: null, // Pas d'animation ASCII
  },
];

export default function ProjectSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState("left");
  const slideContainerRef = useRef<HTMLDivElement>(null);
  
  // État ASCII séparé pour une meilleure gestion des transitions
  const [asciiState, setAsciiState] = useState(slides[0].asciiState);
  const [asciiVisible, setAsciiVisible] = useState(slides[0].asciiState !== null);
  
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
      
      // Gérer les transitions d'animation ASCII
      const nextAsciiState = slides[index].asciiState;
      
      // Si la slide actuelle a un état ASCII et la prochaine aussi
      if (slides[currentSlide].asciiState !== null && nextAsciiState !== null) {
        // Mettre à jour l'état ASCII pour déclencher la transition
        console.log(`Transitioning ASCII from ${slides[currentSlide].asciiState} to ${nextAsciiState}`);
        setAsciiState(nextAsciiState);
      } 
      // Si on passe d'une slide sans ASCII à une slide avec ASCII
      else if (slides[currentSlide].asciiState === null && nextAsciiState !== null) {
        // Afficher l'animation ASCII
        setAsciiState(nextAsciiState);
        setAsciiVisible(true);
      }
      // Si on passe d'une slide avec ASCII à une slide sans ASCII
      else if (slides[currentSlide].asciiState !== null && nextAsciiState === null) {
        // Masquer l'animation ASCII après la transition
        setTimeout(() => {
          setAsciiVisible(false);
        }, 500);
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
      {/* Animation ASCII en arrière-plan - toujours présente mais visible selon l'état */}
      <div
        className={`absolute inset-0 w-screen h-screen transition-opacity duration-500 ${
          asciiVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{ top: "-5rem" }}
      >
        {asciiVisible && <UnifiedAsciiAnimation currentSlide={asciiState} />}
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

          {/* Afficher la vidéo ASCII pour la slide 3 uniquement */}
          {currentSlide === 3 ? (
            <div className="flex justify-center md:justify-end slide-element slide-element-2 relative">
              <div className="w-full h-72 md:h-96 relative">
                <VideoAsciiArt videoSrc={slides[currentSlide].videoSrc} />
              </div>
            </div>
          ) : (
            <div className="md:block hidden">
              {/* Intentionnellement vide pour maintenir la mise en page */}
            </div>
          )}
        </div>
      </div>

      {/* Indicateurs de slide */}
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