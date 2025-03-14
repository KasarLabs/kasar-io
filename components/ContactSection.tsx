"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function ContactSection() {
  // Référence au conteneur principal
  const sectionRef = useRef<HTMLDivElement>(null);
  // Référence à l'élément de contrôle de défilement
  const scrollControlRef = useRef<HTMLDivElement>(null);

  // État pour suivre l'index du réseau social actuellement affiché
  const [activeSocialIndex, setActiveSocialIndex] = useState(0);
  // État pour déterminer si la section est visible
  const [isVisible, setIsVisible] = useState(false);

  // Réseaux sociaux avec leurs noms et URLs (icônes supprimées)
  const socialNetworks = [
    {
      name: "Twitter",
      url: "https://twitter.com/yourcompany",
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com/company/yourcompany",
    },
    {
      name: "GitHub",
      url: "https://github.com/yourcompany",
    },
    {
      name: "Discord",
      url: "https://discord.gg/yourcompany",
    },
    {
      name: "Telegram",
      url: "https://t.me/yourcompany",
    },
  ];

  // Calcule la hauteur nécessaire pour la section de défilement
  useEffect(() => {
    if (scrollControlRef.current) {
      // Définit la hauteur pour créer suffisamment d'espace pour tous les réseaux sociaux
      const scrollHeight =
        window.innerHeight * socialNetworks.length * 0.35 * 1.7;
      scrollControlRef.current.style.height = `${scrollHeight}px`;
    }
  }, []);

  // Gestionnaire de défilement pour détecter la position et animer en conséquence
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !scrollControlRef.current) return;

      const scrollPosition = window.pageYOffset;
      const viewportHeight = window.innerHeight;

      // Obtenir les positions des éléments
      const sectionRect = sectionRef.current.getBoundingClientRect();
      const sectionTop = scrollPosition + sectionRect.top;

      // Vérifier si la section est visible
      const isSectionVisible =
        sectionRect.top < viewportHeight && sectionRect.bottom > 0;
      setIsVisible(isSectionVisible);

      if (isSectionVisible) {
        // Position relative dans le conteneur de défilement (0 à 1)
        const scrollHeight = scrollControlRef.current.clientHeight;
        const relativeScroll = Math.max(
          0,
          Math.min(1, (scrollPosition - sectionTop) / scrollHeight),
        );

        // Calcul de l'index du réseau social actif basé sur la position de défilement
        const socialIndex = Math.min(
          Math.floor(relativeScroll * socialNetworks.length),
          socialNetworks.length - 1,
        );

        setActiveSocialIndex(socialIndex);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Appel initial
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [socialNetworks.length]);

  // Espacement vertical entre les réseaux sociaux
  const verticalSpacing = 90;

  // Calculer la taille de police
  const baseFontSize = 4.8; // Même taille que la HeroSection

  return (
    <div ref={sectionRef} className="relative w-full bg-black">
      {/* Élément qui contrôle la hauteur totale de défilement */}
      <div ref={scrollControlRef} className="w-full" />

      {/* Contenu fixe qui reste à l'écran pendant le défilement */}
      <div
        className="fixed top-0 left-0 w-full h-screen flex items-center p-8"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(50, 50, 50, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(50, 50, 50, 0.1) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.5s ease-in-out",
          pointerEvents: isVisible ? "auto" : "none",
          zIndex: 10,
        }}
      >
        {/* Conteneur aligné à gauche avec marge */}
        <div className="flex flex-col ml-12">
          {/* Conteneur pour aligner "Connect with us on" et les réseaux sociaux */}
          <div className="flex items-center">
            {/* Texte principal avec taille similaire à la hero section */}
            <h1
              className="text-white font-bold m-0 p-0 leading-tight"
              style={{ fontSize: `${baseFontSize}rem` }}
            >
              Connect with us on
            </h1>

            {/* Espace entre le texte et les réseaux sociaux */}
            <div className="w-4"></div>

            {/* Conteneur des réseaux sociaux qui défilent */}
            <div className="relative h-32 flex items-center">
              {socialNetworks.map((social, index) => (
                <Link
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute flex items-center hover:opacity-90 transition-opacity"
                  style={{
                    fontSize: `${baseFontSize}rem`,
                    fontWeight: "bold",
                    color: "#FFF",
                    opacity: index === activeSocialIndex ? 1 : 0.2,
                    transform: `translateY(${(index - activeSocialIndex) * verticalSpacing}px)`,
                    transition: "transform 0.5s ease, opacity 0.3s ease",
                    lineHeight: 1.3,
                    whiteSpace: "nowrap",
                    textDecoration:
                      index === activeSocialIndex ? "underline" : "none",
                    textDecorationThickness: "2px",
                    textUnderlineOffset: "8px",
                  }}
                >
                  {social.name}
                  {index === activeSocialIndex ? "." : ""}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
