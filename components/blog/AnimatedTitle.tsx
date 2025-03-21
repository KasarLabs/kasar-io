"use client";

import { useEffect, useState } from "react";

interface AnimatedTitleProps {
  titles?: string[];
}

export default function AnimatedTitle({ titles = [] }: AnimatedTitleProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeState, setFadeState] = useState<"in" | "out">("in");
  const defaultTitles = ["Nos articles", "Nos tutoriels", "Nos actualités"];
  const displayTitles = titles.length > 0 ? titles : defaultTitles;

  useEffect(() => {
    // Animation de fondu
    const fadeOutTimer = setTimeout(() => {
      setFadeState("out");
    }, 3600); // Commence à disparaître après 3.6s

    const changeIndexTimer = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % displayTitles.length);
      setFadeState("in");
    }, 4000); // Change après 4s

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(changeIndexTimer);
    };
  }, [currentIndex, displayTitles]);

  // Corriger le positionnement de la page
  useEffect(() => {
    // Réinitialiser immédiatement tout style de position qui pourrait affecter l'affichage
    const parentContainer = document.querySelector(".content-page");
    if (parentContainer) {
      parentContainer.setAttribute(
        "style",
        "margin-top: 0 !important; padding-top: 1rem !important; position: relative !important; top: 0 !important; transform: none !important;",
      );
    }

    // Forcer un repositionnement de la page entière
    window.scrollTo(0, 0);
    document.documentElement.style.scrollBehavior = "auto";

    // Nettoyage des éléments potentiellement ajoutés par la page d'accueil
    const spacer = document.getElementById("scroll-spacer");
    if (spacer) spacer.remove();
  }, []);

  return (
    <div className="flex flex-col mb-12">
      <div className="h-32 flex items-center">
        <h1
          className={`text-6xl font-bold transition-opacity duration-500 ${
            fadeState === "in" ? "opacity-100" : "opacity-0"
          }`}
        >
          {displayTitles[currentIndex]}
        </h1>
      </div>
      <p className="text-gray-400 text-lg mt-4">
        Discover our latest articles, tutorials, and news about our projects.
      </p>
    </div>
  );
}
