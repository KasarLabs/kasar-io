"use client";

import React, { useState, useEffect, useRef } from "react";
import HeroSection from "@/components/HeroSection";
import ProjectSlider from "@/components/ProjectsSlider";

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
    if (!mainRef.current) return;

    // Ensure the document has enough height for all scrolling sections
    const scrollAnimationElement = document.querySelector(
      ".HeroSection"
    )?.parentElement as HTMLElement | null;
    const scrollAnimationHeight = scrollAnimationElement
      ? scrollAnimationElement.getBoundingClientRect().height
      : window.innerHeight * 2;

    // Ensure there's enough room for the main content
    const documentHeight = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight,
    );

    // Calculer la hauteur nécessaire pour le slider et le footer
    const slidesCount = 3; // Nombre de slides dans ProjectSlider
    const slideHeight = window.innerHeight * 0.7; // Hauteur par slide
    const projectSliderHeight = slideHeight * slidesCount;
    const footerHeight = window.innerHeight; // Hauteur approximative pour le footer

    // Hauteur totale nécessaire
    const minRequiredHeight =
      scrollAnimationHeight + projectSliderHeight + footerHeight;

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
      const scrollAnimationElement = document.querySelector(
        ".HeroSection"
      )?.parentElement as HTMLElement | null;
      const scrollAnimationHeight = scrollAnimationElement
        ? scrollAnimationElement.getBoundingClientRect().height
        : window.innerHeight * 2;

      // Calculate the total height for all slides in the ProjectSlider
      const slidesCount = 3; // Number of slides in ProjectSlider
      const slideTransitionHeight = window.innerHeight * 0.7; // Increased height to slow down transition
      const projectSliderScrollSpace = slideTransitionHeight * slidesCount;

      // Calculate where the footer should start - réduire cette valeur pour atteindre le footer plus tôt
      const footerThreshold =
        scrollAnimationHeight + projectSliderScrollSpace * 0.8;

      // Determine visibility based on scroll position
      if (scrollPosition >= footerThreshold) {
        // Scrolled to footer - forcer l'affichage du footer
        setHasScrolledToFooter(true);

        // Masquer progressivement le slider lorsqu'on approche du footer
        if (projectSliderRef.current) {
          const fadeOutStart = footerThreshold;
          const fadeOutEnd = footerThreshold + window.innerHeight * 0.3;
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
      } else if (scrollPosition >= scrollAnimationHeight * 0.97) {
        // Start showing ProjectSlider slightly before HeroSection ends
        // This avoids the black screen gap
        setHasScrolledToFooter(false);

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
            (scrollAnimationComponent as { reverseAnimation: (progress: number) => void }).reverseAnimation(
              scrollPosition / scrollAnimationHeight,
            );
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
  }, [showProjectSlider]);

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
          transition: "opacity 0.8s ease-in-out",
          pointerEvents: showProjectSlider ? "auto" : "none",
          // Réduire encore plus la hauteur minimale
          minHeight: `${window.innerHeight * 2}px`,
        }}
      >
        <ProjectSlider />
      </div>

      {/* Spacer to trigger the global Footer visibility - augmenter l'opacité pour le voir */}
      <div
        ref={footerSpacerRef}
        className="relative z-30" // Ajouter un z-index plus élevé que le slider
        style={{
          height: "100vh", // Augmenter la hauteur pour s'assurer qu'il est visible
          opacity: hasScrolledToFooter ? 1 : 0,
          transition: "opacity 0.8s ease-in-out",
        }}
      />
    </div>
  );
}
