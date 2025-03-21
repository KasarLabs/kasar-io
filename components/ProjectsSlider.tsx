"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import UnifiedAsciiAnimation from "./AsciiAnimation";
import Link from "next/link";
import Image from "next/image";

const slides = [
  {
    id: 1,
    title: "SN Stack",
    subtitle: "",
    description:
      "As Core Developers of Starknet, we built Madara, the open-source Rust client for the SN Stack. Designed for performance, security, and ease of use as a Sequencer or Full Node, it ensures efficiency and reliability. By defining next-gen specifications for decentralization, scalability, and privacy, we further strengthen the AppChain ecosystem.",
    asciiState: 1,
    logo: "/images/sn-logo-white.png",
    isMainSlide: false,
    primaryLink: {
      text: "Website",
      url: "https://starknet.io/sn-stack",
    },
    secondaryLink: {
      text: "GitHub",
      url: "https://github.com/madara-alliance/madara",
    },
    terceraryLink: {
      text: "Docs",
      url: "https://docs.madara.build",
    },
    quartenaryLink: {
      text: "Blog",
      url: "/blog",
    },
  },
  {
    id: 2,
    title: "",
    subtitle: "",
    description:
      "Powered by Starknet's performance and security, Snak is a next-gen AI agent framework integrating the latest innovations. With a native communication network, lifetime memory, and 1,000+ plugin compatibility, it's built for scalability, efficiency, and adaptability. Your adventure with AI agents starts here.",
    asciiState: 2,
    logo: "/images/snak-logo.webp",
    isMainSlide: false,
    primaryLink: {
      text: "Website",
      url: "https://starkagent.ai",
    },
    secondaryLink: {
      text: "GitHub",
      url: "https://github.com/kasarlabs/snak",
    },
    terceraryLink: {
      text: "Docs",
      url: "https://docs.kasar.io/snak",
    },
    quartenaryLink: {
      text: "Blog",
      url: "/blog",
    },
  },
  {
    id: 3,
    title: "Quaza",
    subtitle: "",
    description:
      "As a key player in the SN Stack, we aim to push its limits by deploying a network that integrates all upcoming features of the ecosystem. Meet Quaza, your Starknet L3 on steroids, designed for Agents and developers.",
    asciiState: 3,
    logo: "/images/quaza-no-bg.png",
    isMainSlide: false,
    primaryLink: {
      text: "Website",
      url: "https://quaza.io",
    },
    secondaryLink: {
      text: "GitHub",
      url: "https://github.com/kasarlabs/quaza",
    },
    terceraryLink: {
      text: "Docs",
      url: "https://docs.kasar.io/quaza",
    },
    quartenaryLink: {
      text: "Blog",
      url: "/blog",
    },
  },
];

interface ProjectProps {
  // Ajoutez les propriétés nécessaires ici
  // Par exemple:
  id?: string;
  title?: string;
  // etc.
}

export default function ProjectSlider({}: ProjectProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const slideContainerRef = useRef<HTMLDivElement>(null);
  const scrollControlRef = useRef<HTMLDivElement>(null);

  const [asciiState, setAsciiState] = useState(slides[0].asciiState);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Style pour l'animation d'horloge numérique
  const digitClockStyle = {
    transition:
      "transform 0.8s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.8s cubic-bezier(0.23, 1, 0.32, 1)",
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
    // and visible (after HeroSection completes)
    const initTimer = setTimeout(() => {
      setHasInitialized(true);
    }, 1000);

    return () => clearTimeout(initTimer);
  }, []);

  // Set up scroll control after initialization
  useEffect(() => {
    if (!hasInitialized || !scrollControlRef.current) return;

    // Ajuster la hauteur par slide pour une transition plus fluide
    const slideHeight = window.innerHeight * 1.5; // Hauteur par slide augmentée (de 0.75 à 1.5)

    // Ajouter un espace pour le dernier slide qui permet une transition plus douce
    const lastSlideExtraSpace = window.innerHeight * 0.5; // Augmenté de 0.3 à 0.5
    const totalHeight = slideHeight * slides.length + lastSlideExtraSpace;

    // Set height of scroll control element
    scrollControlRef.current.style.height = `${totalHeight}px`;

    const handleScroll = () => {
      if (!slideContainerRef.current || !scrollControlRef.current) return;

      // Get current scroll position
      const scrollPosition = window.pageYOffset;

      // Find where the scroll animation ends - we need to find the parent element
      // that contains the HeroSection and get its height
      const parentElement = slideContainerRef.current.parentElement;
      const scrollAnimationHeight = parentElement
        ? parentElement.previousElementSibling?.getBoundingClientRect()
            .height || window.innerHeight
        : window.innerHeight;

      // If we haven't scrolled past the animation section yet, reset to first slide
      if (scrollPosition < scrollAnimationHeight * 0.9) {
        if (currentSlide !== 0 && !isTransitioning) {
          goToSlide(0); // Reset to first slide when scrolling back to animation
        }
        return;
      }

      // Calculate relative scroll position after the HeroSection
      const sliderStart = scrollPosition - scrollAnimationHeight;
      const viewportHeight = window.innerHeight;

      // Calculer l'index de slide avec une sensibilité réduite pour ralentir les transitions
      const slideIndex = Math.min(
        Math.floor(sliderStart / (viewportHeight * 1.2)), // Seuil considérablement augmenté (de 0.6 à 1.2) pour transitions plus lentes
        slides.length - 1,
      );

      // Ensure we're working with valid values
      const validSlideIndex = Math.max(
        0,
        Math.min(slideIndex, slides.length - 1),
      );

      // Only change if we're moving to a different slide
      if (validSlideIndex !== currentSlide && !isTransitioning) {
        goToSlide(validSlideIndex);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [currentSlide, goToSlide, isTransitioning, hasInitialized]);

  return (
    <div
      id="projects-slider"
      ref={slideContainerRef}
      className="w-full min-h-screen flex flex-col justify-center bg-black overflow-hidden relative"
      style={{
        // Ajouter une propriété pour permettre au footer d'être visible
        zIndex: 20,
      }}
    >
      {/* Scroll control div - invisible but controls height for scrolling */}
      <div ref={scrollControlRef} className="w-full absolute top-0 left-0" />

      {/* Animation en arrière-plan complète - fixed to keep it on screen while scrolling */}
      <div className="fixed inset-0" style={{ pointerEvents: "none" }}>
        <UnifiedAsciiAnimation currentSlide={asciiState} />
      </div>

      <div
        className="w-full px-6 md:px-12 lg:px-16 py-16 fixed top-0 left-0 z-10 min-h-screen flex flex-col justify-center"
        style={{ pointerEvents: "auto" }}
      >
        <div className="max-w-4xl mx-auto lg:mx-0 w-full">
          <div className="flex items-center gap-4 mb-4">
            {/* Conteneur pour l'animation du sous-titre */}
            <div className="h-12 overflow-hidden relative flex-grow">
              {/* Sous-titre actuel */}
              <div
                className="absolute w-full"
                style={{
                  ...digitClockStyle,
                  transform: isTransitioning
                    ? "translateY(-100%)"
                    : "translateY(0)",
                  opacity: isTransitioning ? 0 : 1,
                }}
              >
                <h2 className="text-lg lg:text-xl text-neutral-400">
                  {slides[currentSlide].subtitle &&
                    slides[currentSlide].subtitle}
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
                    animation:
                      "slideUp 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards",
                  }}
                >
                  <h2 className="text-lg lg:text-xl text-neutral-400">
                    {slides[(currentSlide + 1) % slides.length].subtitle &&
                      slides[(currentSlide + 1) % slides.length].subtitle}
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
                transition:
                  "transform 1s cubic-bezier(0.16, 1, 0.3, 1), opacity 1s cubic-bezier(0.16, 1, 0.3, 1)",
                transform: isTransitioning
                  ? "translateY(-100%)"
                  : "translateY(0)",
                opacity: isTransitioning ? 0 : 1,
              }}
            >
              <div className="flex items-center gap-4">
                {currentSlide === 1 && (
                  <a
                    href="https://www.starkagent.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    <Image
                      src="/images/snak-logo.png"
                      alt="SNAK Logo"
                      width={84}
                      height={84}
                      className="hover:opacity-80 transition-opacity"
                    />
                  </a>
                )}
                {currentSlide === 2 && (
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    <Image
                      src="/images/quaza-no-bg.png"
                      alt="Quaza Logo"
                      width={60}
                      height={60}
                      className="hover:opacity-80 transition-opacity mr-3"
                    />
                  </a>
                )}
                <h1 className="text-4xl lg:text-5xl font-bold">
                  {currentSlide !== 2 ? slides[currentSlide].title : ""}
                </h1>
              </div>
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
                  animation:
                    "slideUp 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards",
                }}
              >
                <div className="flex items-center gap-4">
                  {(currentSlide + 1) % slides.length === 0 && (
                    <div className="mr-3">
                      <Image
                        src="/images/sn-logo-white.png"
                        alt="SN Stack Logo"
                        width={128}
                        height={128}
                      />
                    </div>
                  )}
                  {(currentSlide + 1) % slides.length === 1 && (
                    <a
                      href="https://www.starkagent.ai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center"
                    >
                      <Image
                        src="/images/snak-logo.png"
                        alt="SNAK Logo"
                        width={48}
                        height={48}
                        className="hover:opacity-80 transition-opacity mr-3"
                      />
                    </a>
                  )}
                  {(currentSlide + 1) % slides.length === 2 && (
                    <a
                      href="#"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center"
                    >
                      <Image
                        src="/images/quaza-no-bg.png"
                        alt="Quaza Logo"
                        width={80}
                        height={80}
                        className="hover:opacity-80 transition-opacity mr-3"
                      />
                    </a>
                  )}
                  <h1 className="text-4xl lg:text-5xl font-bold">
                    {(currentSlide + 1) % slides.length !== 2
                      ? slides[(currentSlide + 1) % slides.length].title
                      : ""}
                  </h1>
                </div>
              </div>
            )}
          </div>

          {/* Conteneur pour l'animation de description avec hauteur auto */}
          <div className="mb-8 overflow-hidden relative">
            {/* Description actuelle */}
            <div
              className="w-full"
              style={{
                ...digitClockStyle,
                transform: isTransitioning
                  ? "translateY(-100%)"
                  : "translateY(0)",
                opacity: isTransitioning ? 0 : 1,
                position: isTransitioning ? "absolute" : "relative",
              }}
            >
              <p className="text-base text-neutral-300 max-w-2xl leading-relaxed">
                {slides[currentSlide].description}
              </p>
            </div>

            {/* Description suivante */}
            {isTransitioning && (
              <div
                className="w-full absolute"
                style={{
                  ...digitClockStyle,
                  transform: "translateY(0)",
                  opacity: 1,
                  top: "100%",
                  animation:
                    "slideUp 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards",
                }}
              >
                <p className="text-base text-neutral-300 max-w-2xl leading-relaxed font-light">
                  {slides[(currentSlide + 1) % slides.length].description}
                </p>
              </div>
            )}
          </div>

          {/* Boutons - avec animation de fondu simple */}
          <div
            className="flex flex-col sm:flex-row gap-3 relative"
            style={{
              transition: "opacity 0.5s ease",
              opacity: isTransitioning ? 0.5 : 1,
              zIndex: 30,
              position: "relative",
            }}
          >
            <Link
              href={slides[currentSlide].primaryLink.url}
              target="_blank"
              className="inline-flex items-center px-6 py-3 rounded-2xl bg-white text-black font-medium transition-all hover:bg-neutral-200 hover:scale-105 text-sm"
            >
              {slides[currentSlide].primaryLink.text}{" "}
            </Link>

            <Link
              href={slides[currentSlide].secondaryLink.url}
              target="_blank"
              className="inline-flex items-center px-6 py-3 rounded-2xl bg-transparent border border-white text-white font-medium transition-all hover:bg-white hover:bg-opacity-5 hover:scale-105 text-sm"
            >
              {slides[currentSlide].secondaryLink.text}{" "}
            </Link>

            {/* Afficher le troisième lien seulement s'il existe */}
            {slides[currentSlide].terceraryLink && (
              <Link
                href={slides[currentSlide].terceraryLink.url}
                target="_blank"
                className="inline-flex items-center px-6 py-3 rounded-2xl bg-transparent border border-white text-white font-medium transition-all hover:bg-white hover:bg-opacity-5 hover:scale-105 text-sm"
              >
                {slides[currentSlide].terceraryLink.text}{" "}
              </Link>
            )}

            {/* Afficher le quatrième lien seulement s'il existe */}
            {slides[currentSlide].quartenaryLink && (
              <Link
                href={slides[currentSlide].quartenaryLink.url}
                className="inline-flex items-center px-6 py-3 rounded-2xl bg-transparent border border-white text-white font-medium transition-all hover:bg-white hover:bg-opacity-5 hover:scale-105 text-sm"
              >
                {slides[currentSlide].quartenaryLink.text}{" "}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Indicateurs de slide déplacés à gauche */}
      <div className="fixed left-8 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            className={`h-1.5 transition-all duration-300 ${
              index === currentSlide ? "bg-white w-4" : "bg-neutral-600 w-1.5"
            } rounded-full`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Indicateur de défilement combiné (original + icône) */}
      <div className="fixed bottom-24 right-8 hidden md:flex items-center gap-3">
        {/* Animation originale de défilement */}
        {/* <div className="flex flex-col items-center space-y-2 bg-black bg-opacity-30 p-3 rounded-full backdrop-blur-sm">
          <span className="text-xs text-neutral-400">Scroll</span>
          <div className="w-0.5 h-16 bg-neutral-800 relative overflow-hidden">
            <div
              className="w-full bg-white absolute top-0 h-8"
              style={{
                animation: "scrollDown 2s infinite",
              }}
            />
          </div>
        </div> */}
      </div>

      {/* Animation CSS pour le défilement vertical, scroll indicator et scrollbar personnalisée */}
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

        @keyframes bounce-subtle {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(3px);
          }
        }

        .animate-bounce-subtle {
          animation: bounce-subtle 1.5s infinite ease-in-out;
        }

        /* Personnalisation de la barre de défilement */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 4px;
          transition: background 0.3s ease;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }

        /* Pour Firefox */
        html {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.3) rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
}
