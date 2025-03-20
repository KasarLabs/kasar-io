"use client";

import React, { useState, useEffect, useRef } from "react";
import HeroSection from "@/components/HeroSection";
import ProjectSlider from "@/components/ProjectsSlider";
import ContactSection from "@/components/ContactSection";
import TrustedBy from "@/components/TrustedBy";

export default function Home() {
  const [showProjectSlider, setShowProjectSlider] = useState(false);
  const [showContactSection, setShowContactSection] = useState(false);
  const [showTrustedBy, setShowTrustedBy] = useState(false);
  const [windowHeight, setWindowHeight] = useState(0);
  const mainRef = useRef(null);
  const projectSliderRef = useRef(null);
  const contactSectionRef = useRef(null);
  const trustedByRef = useRef(null);

  // Handler for when scroll animation completes
  const handleScrollComplete = () => {
    // Trigger the ProjectSlider visibility immediately to avoid blank screen
    setShowProjectSlider(true);
  };

  // Set up window height state once component mounts
  useEffect(() => {
    // Set window height after component mounts (client-side only)
    setWindowHeight(window.innerHeight);

    // Handle window resize
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Pre-render the ProjectSlider to avoid black screen
  useEffect(() => {
    if (typeof window === "undefined") return; // Skip on server-side

    // Set a very short timeout to ensure the ProjectSlider is ready to be shown
    const timer = setTimeout(() => {
      // Preload the ProjectSlider with very low opacity to prevent the black flash
      const projectSliderElement =
        mainRef.current &&
        (mainRef.current as HTMLElement).querySelector(
          '[class*="ProjectSlider"]',
        );
      if (projectSliderElement) {
        (projectSliderElement as HTMLElement).style.opacity = "0.01"; // Just enough to force render
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Calculate heights and set up scroll areas
  useEffect(() => {
    if (typeof window === "undefined" || !mainRef.current) return;

    // Ensure the document has enough height for all scrolling sections
    const scrollAnimationElement = document.querySelector(".HeroSection")
      ?.parentElement as HTMLElement | null;
    const scrollAnimationHeight = scrollAnimationElement
      ? scrollAnimationElement.getBoundingClientRect().height
      : windowHeight * 2;

    // Ensure there's enough room for the main content
    const documentHeight = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight,
    );

    // Calculer la hauteur nécessaire pour le slider, TrustedBy et le footer
    const slidesCount = 3; // Nombre de slides dans ProjectSlider
    const slideHeight = windowHeight * 0.7; // Hauteur par slide
    const projectSliderHeight = slideHeight * slidesCount;
    const trustedByHeight = windowHeight; // Hauteur pour la section TrustedBy
    const contactSectionHeight = windowHeight * 2; // Hauteur pour la section de contact
    const footerHeight = windowHeight; // Hauteur approximative pour le footer

    // Hauteur totale nécessaire
    const minRequiredHeight =
      scrollAnimationHeight +
      projectSliderHeight +
      trustedByHeight +
      contactSectionHeight +
      footerHeight;

    if (documentHeight < minRequiredHeight) {
      // Add a spacer element if needed
      const spacerElement = document.createElement("div");
      spacerElement.style.height = `${minRequiredHeight - documentHeight}px`;
      spacerElement.style.width = "100%";
      spacerElement.style.position = "relative";
      spacerElement.id = "scroll-spacer";

      // Remove any existing spacer first
      const existingSpace = document.getElementById("scroll-spacer");
      if (existingSpace) existingSpace.remove();

      document.body.appendChild(spacerElement);
    }
  }, [windowHeight]);

  // Monitor scroll position to control visibility and transitions
  useEffect(() => {
    if (typeof window === "undefined") return; // Skip on server-side

    let lastScrollPosition = window.pageYOffset;

    const handleScroll = () => {
      if (!mainRef.current) return;

      // Get the current scroll position
      const scrollPosition = window.pageYOffset;
      // Determine scroll direction
      const scrollingDown = scrollPosition > lastScrollPosition;
      lastScrollPosition = scrollPosition;

      // Calculate the height of the scroll animation section
      const scrollAnimationElement = document.querySelector(".HeroSection")
        ?.parentElement as HTMLElement | null;
      const scrollAnimationHeight = scrollAnimationElement
        ? scrollAnimationElement.getBoundingClientRect().height
        : windowHeight * 2;

      // Calculate the total height for all slides in the ProjectSlider
      const slidesCount = 3; // Number of slides in ProjectSlider
      const slideTransitionHeight = windowHeight * 0.7; // Increased height to slow down transition
      const projectSliderScrollSpace = slideTransitionHeight * slidesCount;

      // Point de transition entre le slider de projets et la section TrustedBy
      const trustedByThreshold =
        scrollAnimationHeight + projectSliderScrollSpace * 0.85;

      // Point de transition entre TrustedBy et la section de contact (réduit encore plus)
      const contactSectionThreshold = trustedByThreshold + windowHeight * 0.8;

      // Calculate where the footer should start
      const footerThreshold = contactSectionThreshold + windowHeight * 1.5;

      // Gérer la visibilité de la section de contact en premier
      if (scrollPosition >= contactSectionThreshold) {
        setShowContactSection(true);
        if (contactSectionRef.current) {
          const contactElement = contactSectionRef.current as HTMLElement;
          contactElement.style.opacity = "1";
          contactElement.style.zIndex = "50";
          contactElement.style.pointerEvents = "auto";
        }
      }

      // Gérer les autres sections
      if (scrollPosition >= footerThreshold) {
        // Scrolled to footer
        setShowTrustedBy(true);

        // Masquer progressivement le slider lorsqu'on approche du footer
        if (projectSliderRef.current) {
          (projectSliderRef.current as HTMLElement).style.opacity = "0";
        }
      } else if (scrollPosition >= contactSectionThreshold) {
        // Transition entre TrustedBy et la section de contact
        setShowTrustedBy(true);

        // Faire disparaître progressivement TrustedBy
        if (trustedByRef.current) {
          const fadeOutStart = contactSectionThreshold;
          const fadeOutEnd = contactSectionThreshold + windowHeight * 0.02;
          const fadeProgress = Math.min(
            1,
            Math.max(
              0,
              (scrollPosition - fadeOutStart) / (fadeOutEnd - fadeOutStart),
            ),
          );

          // Réduire l'opacité de TrustedBy progressivement et ajuster le z-index
          const trustedByElement = trustedByRef.current as HTMLElement;
          trustedByElement.style.opacity = `${1 - fadeProgress}`;
          if (fadeProgress > 0.5) {
            trustedByElement.style.zIndex = "10";
            trustedByElement.style.pointerEvents = "none";
          }
        }
      } else if (scrollPosition >= trustedByThreshold) {
        // Transition entre le slider de projets et TrustedBy
        setShowContactSection(false);
        setShowTrustedBy(true);

        console.log("TrustedBy devrait être visible maintenant!");

        // Faire disparaître progressivement le slider de projets
        if (projectSliderRef.current) {
          const fadeOutStart = trustedByThreshold;
          const fadeOutEnd = trustedByThreshold + windowHeight * 0.3;
          const fadeProgress = Math.min(
            1,
            Math.max(
              0,
              (scrollPosition - fadeOutStart) / (fadeOutEnd - fadeOutStart),
            ),
          );

          // Réduire l'opacité du slider progressivement
          (projectSliderRef.current as HTMLElement).style.opacity =
            `${1 - fadeProgress}`;
        }

        // Faire apparaître progressivement TrustedBy
        if (trustedByRef.current) {
          const fadeInStart = trustedByThreshold;
          const fadeInEnd = trustedByThreshold + windowHeight * 0.3;
          const fadeProgress = Math.min(
            1,
            Math.max(
              0,
              (scrollPosition - fadeInStart) / (fadeInEnd - fadeInStart),
            ),
          );

          // Augmenter l'opacité de TrustedBy progressivement et s'assurer qu'il est visible
          const trustedByElement = trustedByRef.current as HTMLElement;
          trustedByElement.style.opacity = `${fadeProgress}`;
          trustedByElement.style.display = "block";
          trustedByElement.style.zIndex = "30"; // Augmenter le z-index pour s'assurer qu'il est au-dessus des autres éléments
        }
      } else if (scrollPosition >= scrollAnimationHeight * 0.97) {
        // Start showing ProjectSlider slightly before HeroSection ends
        setShowContactSection(false);
        setShowTrustedBy(false);

        // Ensure ProjectSlider is visible when in this section
        if (!showProjectSlider && scrollingDown) {
          setShowProjectSlider(true);
        }

        // Restaurer l'opacité complète du slider
        if (projectSliderRef.current) {
          (projectSliderRef.current as HTMLElement).style.opacity = "1";
        }
      } else if (scrollPosition < scrollAnimationHeight * 0.8) {
        // Still firmly in the HeroSection section

        // If scrolling up and we're back in the HeroSection area
        if (!scrollingDown) {
          // Hide ProjectSlider when scrolling back up to HeroSection
          if (
            showProjectSlider &&
            scrollPosition < scrollAnimationHeight * 0.7
          ) {
            setShowProjectSlider(false);
          }

          // Find the HeroSection component and call its reverse method if available
          const scrollAnimationComponent =
            mainRef.current &&
            (mainRef.current as HTMLElement).querySelector(".HeroSection");
          if (
            scrollAnimationComponent &&
            "reverseAnimation" in scrollAnimationComponent
          ) {
            (
              scrollAnimationComponent as {
                reverseAnimation: (progress: number) => void;
              }
            ).reverseAnimation(scrollPosition / scrollAnimationHeight);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Initial check
    handleScroll();

    // Clean up
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [showProjectSlider, showContactSection, showTrustedBy, windowHeight]);

  return (
    <div ref={mainRef} className="bg-black text-white">
      {/* First section with scroll animation */}
      <div className="relative">
        <HeroSection onScrollComplete={handleScrollComplete} />
      </div>

      {/* Project slider section */}
      <div
        ref={projectSliderRef}
        className="relative z-20 w-full"
        style={{
          opacity: showProjectSlider ? 1 : 0,
          visibility: "visible", // Always keep in DOM to avoid rendering issues
          transition: "opacity 1s ease-in-out",
          pointerEvents: showProjectSlider ? "auto" : "none",
          minHeight: windowHeight ? `${windowHeight * 1.5}px` : "150vh",
        }}
      >
        <ProjectSlider />
      </div>

      {/* Section TrustedBy entre le slider et la section de contact */}
      <div
        ref={trustedByRef}
        className="fixed top-0 left-0 w-full min-h-screen z-30"
        style={{
          opacity: showTrustedBy ? 1 : 0,
          visibility: "visible",
          transition: "opacity 1s ease-in-out, transform 1s ease-in-out",
          pointerEvents: showTrustedBy ? "auto" : "none",
          transform: `translateY(${showTrustedBy ? "0" : "100vh"})`,
          backgroundColor: "black", // Assurer un fond noir
        }}
      >
        <TrustedBy />
      </div>

      {/* Contact section après TrustedBy */}
      <div
        ref={contactSectionRef}
        className="relative z-50"
        style={{
          opacity: showContactSection ? 1 : 0,
          visibility: "visible",
          transition: "opacity 1s ease-in-out",
          pointerEvents: showContactSection ? "auto" : "none",
          marginTop: windowHeight * 0.5 + "px",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          paddingBottom: "100vh", // Ajoute de l'espace après la section Contact
        }}
      >
        <ContactSection />
      </div>
    </div>
  );
}
