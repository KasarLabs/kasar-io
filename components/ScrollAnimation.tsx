import React, { useState, useEffect, useRef, useImperativeHandle } from "react";

// Interface pour les propriétés du composant
interface ScrollAnimationProps {
  onScrollComplete?: () => void; // Callback when scroll is complete
}

const ScrollAnimation: React.FC<ScrollAnimationProps> = ({
  onScrollComplete,
}) => {
  // Référence au conteneur principal
  const containerRef = useRef<HTMLDivElement>(null);
  // Référence à l'élément de contrôle de défilement
  const scrollControlRef = useRef<HTMLDivElement>(null);

  // Définition de la liste des mots qui vont défiler (points retirés)
  const words = [
    "Infrastructure",
    "Rust Project",
    "Full Node Client",
    "App Chain",
    "Sequencer",
    "AI Agent",
    "Provable program",
    "Cairo Contract",
  ];

  // Couleurs pour chaque mot (une couleur différente par mot)
  const colors = ["#FFF"];

  // État pour suivre l'index du mot actuellement affiché
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  // État pour suivre si la section est complètement défilée
  const [isScrollComplete, setIsScrollComplete] = useState(false);

  // Fonction pour calculer la hauteur de la section de défilement
  useEffect(() => {
    // Définit la hauteur totale de l'élément de contrôle de défilement
    // pour créer suffisamment d'espace pour tous les mots, mais avec une hauteur réduite
    if (scrollControlRef.current) {
      // Réduction de la hauteur de défilement à 35% de la hauteur originale
      // On ajoute 50% à la taille totale pour l'espace supplémentaire nécessaire avant la fin
      const scrollHeight = window.innerHeight * words.length * 0.35 * 1.5;
      scrollControlRef.current.style.height = `${scrollHeight}px`;
    }

    // Set initial scroll
    window.scrollTo(0, 0);
  }, [words.length]);

  // Gestionnaire de défilement avec détection du mot actif
  useEffect(() => {
    const handleScroll = () => {
      // Si l'élément de référence n'existe pas encore, ne rien faire
      if (!containerRef.current || !scrollControlRef.current) return;

      // Position de défilement par rapport au sommet de la page
      const scrollPosition = window.pageYOffset;

      // Position du haut du conteneur par rapport au sommet de la page
      const containerTop =
        containerRef.current.getBoundingClientRect().top + scrollPosition;

      // Hauteur totale de la zone de défilement
      const scrollHeight = scrollControlRef.current.clientHeight;

      // Position relative dans notre conteneur de défilement (0 à 1)
      const relativeScroll = Math.max(
        0,
        Math.min(1, (scrollPosition - containerTop) / scrollHeight),
      );

      // Calcul de l'index du mot actif basé sur la position de défilement
      const wordIndex = Math.min(
        Math.floor(relativeScroll * words.length),
        words.length - 1,
      );

      // Mise à jour de l'état
      setActiveWordIndex(wordIndex);

      // Vérification si la section est complètement défilée
      // Augmenté à 100% pour s'assurer que l'animation est vraiment terminée
      const isComplete = relativeScroll >= 1.0;

      if (isComplete && !isScrollComplete) {
        setIsScrollComplete(true);
        // Call the callback if provided
        if (onScrollComplete) {
          onScrollComplete();
        }
      } else if (!isComplete && isScrollComplete) {
        setIsScrollComplete(false);
      }
    };

    // Ajoute l'écouteur d'événement
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Appel initial pour configurer l'état correct au chargement
    handleScroll();

    // Nettoyage de l'écouteur lors du démontage
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [words.length, isScrollComplete, onScrollComplete]);

  // Calculer la nouvelle taille de police (80% de l'original)
  const baseFontSize = 4.8; // 6rem * 0.8 = 4.8rem (réduction de 20%)
  const secondaryFontSize = 3.5; // Taille pour "with us"

  // Augmente l'espacement vertical entre les mots
  const verticalSpacing = 90; // Augmenté depuis 80px

  const animationRef = useRef(null);

  // Exposer une méthode pour inverser l'animation
  useImperativeHandle(animationRef, () => ({
    reverseAnimation: (progress) => {
      // Calculer l'index du mot basé sur la progression
      const wordIndex = Math.min(
        Math.floor(progress * words.length),
        words.length - 1,
      );
      // Mettre à jour l'index du mot actif
      setActiveWordIndex(wordIndex);
    },
  }));

  return (
    <div ref={containerRef} className="relative w-full ScrollAnimation">
      {/* Élément qui contrôle la hauteur totale de défilement */}
      <div ref={scrollControlRef} className="w-full" />

      {/* Contenu fixe qui reste à l'écran pendant le défilement */}
      <div
        className="fixed top-0 left-0 w-full h-screen flex items-center p-8"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(50, 50, 50, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(50, 50, 50, 0.1) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
          opacity: isScrollComplete ? 0 : 1,
          transition: "opacity 0.5s ease-in-out",
          pointerEvents: isScrollComplete ? "none" : "auto",
          zIndex: 10,
        }}
      >
        {/* Conteneur aligné à gauche avec marge */}
        <div className="flex flex-col ml-12">
          {/* Conteneur pour aligner "Build your next gen" et les mots */}
          <div className="flex items-center">
            {/* Texte principal avec taille réduite de 20% */}
            <h1
              className="text-white font-bold m-0 p-0 leading-tight"
              style={{ fontSize: `${baseFontSize}rem` }}
            >
              Build your next gen
            </h1>

            {/* Espace entre le texte et les mots */}
            <div className="w-4"></div>

            {/* Conteneur des mots qui défilent - augmenté en hauteur */}
            <div className="relative h-32 flex items-center">
              {words.map((word, index) => (
                <div
                  key={index}
                  className="absolute"
                  style={{
                    fontSize: `${baseFontSize}rem`,
                    fontWeight: "bold",
                    color: colors[index % colors.length],
                    // Inverse l'opacité: le mot actif est à 100%, les autres à 50%
                    opacity: index === activeWordIndex ? 1 : 0.2,
                    // Animation de déplacement vertical avec espacement augmenté
                    transform: `translateY(${(index - activeWordIndex) * verticalSpacing}px)`,
                    transition: "transform 0.5s ease, opacity 0.3s ease",
                    lineHeight: 1.3, // Augmenté pour plus d'espacement vertical
                    whiteSpace: "nowrap",
                  }}
                >
                  {word}
                </div>
              ))}
            </div>
          </div>

          {/* Ajout de "with us" en dessous */}
          <h1
            className="text-white font-bold mt-2 ml-0 p-0"
            style={{ fontSize: `${baseFontSize}rem` }}
          >
            with us.
          </h1>
        </div>
      </div>
    </div>
  );
};

export default ScrollAnimation;
