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
