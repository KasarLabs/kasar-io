"use client";

import { useEffect, useRef, useState } from "react";

export default function UnifiedAsciiAnimation({ currentSlide = 0 }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // État interne pour suivre le dernier slide et forcer les transitions
  const [internalState, setInternalState] = useState({
    lastSlide: currentSlide,
    transitioning: false
  });

  useEffect(() => {
    // Déclencher une transition lorsque currentSlide change
    if (currentSlide !== internalState.lastSlide && !internalState.transitioning) {
      setInternalState({ lastSlide: internalState.lastSlide, transitioning: true });
      
      // Une fois la transition terminée, mettre à jour lastSlide
      setTimeout(() => {
        setInternalState({ lastSlide: currentSlide, transitioning: false });
      }, 2000); // Durée de transition de 2 secondes
    }
  }, [currentSlide, internalState]);

  useEffect(() => {
    console.log(`Animation state: from ${internalState.lastSlide} to ${currentSlide}, transitioning: ${internalState.transitioning}`);
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Configuration
    const MAX_CHARS = 300;
    
    // Canvas dimensions
    let width: number;
    let height: number;
    
    // Animation state
    let animationFrame: number;
    let time = 0;
    
    // Caractère ASCII simple
    type Character = {
      char: string,
      x: number,
      y: number,
      z: number,
      startX: number,
      startY: number,
      startZ: number,
      targetX: number,
      targetY: number,
      targetZ: number,
      speed: number,
      size: number,
      opacity: number
    };

    let characters: Character[] = [];

    // Initialisation des caractères
    function initCharacters() {
      characters = [];
      
      for (let i = 0; i < MAX_CHARS; i++) {
        const char = String.fromCharCode(Math.floor(Math.random() * 93) + 33);
        let x, y, z, targetX, targetY, targetZ;
        
        // Position initiale basée sur l'état actuel
        if (internalState.lastSlide === 0) {
          // État pluie
          x = Math.random() * width;
          y = Math.random() * height;
          z = 0;
        } else if (internalState.lastSlide === 1) {
          // État nuage
          const phi = Math.acos(2 * Math.random() - 1);
          const theta = Math.random() * Math.PI * 2;
          const radius = Math.random() * 2;
          
          x = radius * Math.sin(phi) * Math.cos(theta);
          y = radius * Math.sin(phi) * Math.sin(theta);
          z = radius * Math.cos(phi);
        } else {
          // État grille
          const gridSize = 20;
          const row = i % gridSize;
          const col = Math.floor(i / gridSize) % gridSize;
          
          x = -2 + (col / gridSize) * 4;
          y = -2 + (row / gridSize) * 4;
          z = 0;
        }
        
        // Position cible identique à la position initiale (pas de transition initialement)
        targetX = x;
        targetY = y;
        targetZ = z;
        
        characters.push({
          char,
          x, y, z,
          startX: x,
          startY: y,
          startZ: z,
          targetX, targetY, targetZ,
          speed: Math.random() * 1.5 + 0.5,
          size: internalState.lastSlide === 1 ? 18 : 14,
          opacity: Math.random() * 0.5 + 0.5
        });
      }
    }
    
    // Calculer les positions cibles pour la transition
    function calculateTargetPositions() {
      for (const char of characters) {
        // Sauvegarder la position de départ pour la transition
        char.startX = char.x;
        char.startY = char.y;
        char.startZ = char.z;
        
        // Calculer la position cible selon l'état demandé
        if (currentSlide === 0) {
          // Cible : état pluie
          char.targetX = Math.random() * width;
          char.targetY = Math.random() * -height; // Au-dessus de l'écran
          char.targetZ = 0;
        } else if (currentSlide === 1) {
          // Cible : état nuage
          const phi = Math.acos(2 * Math.random() - 1);
          const theta = Math.random() * Math.PI * 2;
          const radius = Math.random() * 2;
          
          char.targetX = radius * Math.sin(phi) * Math.cos(theta);
          char.targetY = radius * Math.sin(phi) * Math.sin(theta);
          char.targetZ = radius * Math.cos(phi);
        } else {
          // Cible : état grille
          const gridSize = 20;
          const index = characters.indexOf(char);
          const row = index % gridSize;
          const col = Math.floor(index / gridSize) % gridSize;
          
          char.targetX = -2 + (col / gridSize) * 4;
          char.targetY = -2 + (row / gridSize) * 4;
          char.targetZ = 0;
        }
      }
    }
    
    // Mettre à jour les caractères à chaque frame
    function updateCharacters() {
      if (internalState.transitioning) {
        // Progression de la transition (0 à 1)
        const transitionDuration = 2000; // ms
        const elapsedMs = time * (1000 / 60); // Conversion approximative de frames en ms
        const progress = Math.min(elapsedMs / transitionDuration, 1);
        
        // Appliquer une fonction d'accélération pour un mouvement plus naturel
        const eased = easeInOutCubic(progress);
        
        // Mettre à jour la position de chaque caractère en interpolant
        for (const char of characters) {
          char.x = char.startX * (1 - eased) + char.targetX * eased;
          char.y = char.startY * (1 - eased) + char.targetY * eased;
          char.z = char.startZ * (1 - eased) + char.targetZ * eased;
          
          // Changer aléatoirement les caractères pendant la transition
          if (Math.random() < 0.01) {
            if (currentSlide === 2) {
              char.char = Math.random() > 0.5 ? "0" : "1";
            } else {
              char.char = String.fromCharCode(Math.floor(Math.random() * 93) + 33);
            }
          }
        }
      } else {
        // Comportement normal selon l'état actuel
        if (internalState.lastSlide === 0) {
          // État pluie - les caractères tombent
          for (const char of characters) {
            char.y += char.speed;
            
            // Réinitialiser les caractères qui sortent de l'écran
            if (char.y > height) {
              char.y = Math.random() * -100;
              char.x = Math.random() * width;
              
              if (Math.random() < 0.3) {
                char.char = String.fromCharCode(Math.floor(Math.random() * 93) + 33);
              }
            }
          }
        } else if (internalState.lastSlide === 1) {
          // État nuage - rotation lente
          for (const char of characters) {
            const x = char.x;
            const y = char.y;
            const z = char.z;
            
            // Appliquer une rotation lente
            char.x = x * Math.cos(0.003) + z * Math.sin(0.003);
            char.z = -x * Math.sin(0.003) + z * Math.cos(0.003);
            
            const newY = y * Math.cos(0.002) - char.z * Math.sin(0.002);
            const newZ = y * Math.sin(0.002) + char.z * Math.cos(0.002);
            char.y = newY;
            char.z = newZ;
            
            // Changer aléatoirement les caractères
            if (Math.random() < 0.003) {
              char.char = String.fromCharCode(Math.floor(Math.random() * 93) + 33);
            }
          }
        } else if (internalState.lastSlide === 2) {
          // État grille - juste changer les caractères occasionnellement
          for (const char of characters) {
            if (Math.random() < 0.01) {
              char.char = Math.random() > 0.5 ? "0" : "1";
            }
          }
        }
      }
    }
    
    // Fonction d'accélération pour les transitions
    function easeInOutCubic(t: number): number {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    
    // Projeter un point 3D en 2D (pour les états nuage et grille)
    function project(x: number, y: number, z: number): [number, number, number] {
      const fov = 5;
      const zOffset = 5;
      
      if (z + zOffset <= 0) return [0, 0, 0];
      
      const scale = fov / (z + zOffset);
      const xp = x * scale;
      const yp = y * scale;
      
      return [width/2 + xp * height/2, height/2 + yp * height/2, z + zOffset];
    }
    
    // Dessiner les caractères
    function renderCharacters() {
      // Trier les caractères par profondeur pour l'état nuage et les transitions
      if (internalState.lastSlide === 1 || currentSlide === 1 || internalState.transitioning) {
        characters.sort((a, b) => b.z - a.z);
      }
      
      for (const char of characters) {
        let x, y, size, color;
        
        // État pluie sans transition
        if (internalState.lastSlide === 0 && !internalState.transitioning) {
          x = char.x;
          y = char.y;
          size = char.size;
          color = `rgba(0, 255, 255, ${char.opacity})`;
        } else {
          // États nuage, grille et transitions
          const [screenX, screenY, screenZ] = project(char.x, char.y, char.z);
          
          if (screenZ <= 0) continue;
          
          x = screenX;
          y = screenY;
          
          if (internalState.lastSlide === 1 && !internalState.transitioning) {
            // État nuage
            const distanceScale = 5 / Math.max(1, screenZ);
            size = Math.floor(char.size * distanceScale);
            const brightness = Math.max(0.1, Math.min(1, size / 30));
            color = `rgba(180, 200, 255, ${brightness})`;
          } else if (internalState.lastSlide === 2 && !internalState.transitioning) {
            // État grille
            size = char.size;
            color = `rgba(0, 255, 200, 0.8)`;
          } else {
            // Transition
            const distanceScale = 5 / Math.max(1, screenZ);
            size = Math.floor(char.size * distanceScale);
            color = `rgba(100, 200, 255, ${char.opacity})`;
          }
        }
        
        // Dessiner le caractère
        ctx.font = `${size}px monospace`;
        ctx.fillStyle = color;
        ctx.textAlign = "center";
        ctx.fillText(char.char, x, y);
      }
    }
    
    // Boucle de rendu principale
    function render() {
      // Nettoyer le canvas
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, width, height);
      
      // Titre
      ctx.font = "24px sans-serif";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText("STARKNET", width / 2, 40);
      
      // Informations de débogage
      ctx.font = "16px sans-serif";
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.fillText(
        `État: ${internalState.lastSlide}${internalState.transitioning ? ` → ${currentSlide}` : ""}`, 
        width / 2, 
        70
      );
      
      // Mettre à jour et dessiner les caractères
      updateCharacters();
      renderCharacters();
      
      // Incrémenter le temps et demander la prochaine frame
      time++;
      animationFrame = requestAnimationFrame(render);
    }
    
    // Définir les dimensions du canvas
    function setDimensions() {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    
    // Initialiser et démarrer l'animation
    function init() {
      console.log("Initializing animation");
      setDimensions();
      initCharacters();
      time = 0;
      
      // Si en transition, calculer les positions cibles
      if (internalState.transitioning) {
        console.log("In transition - calculating target positions");
        calculateTargetPositions();
      }
      
      animationFrame = requestAnimationFrame(render);
    }
    
    // Gérer le redimensionnement de la fenêtre
    const handleResize = () => {
      setDimensions();
    };
    
    window.addEventListener("resize", handleResize);
    init();
    
    // Nettoyage lors du démontage du composant
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrame);
    };
  }, [currentSlide, internalState]); // Réexécuter l'effet quand currentSlide ou internalState change

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block bg-black absolute top-0 left-0 right-0 bottom-0"
    />
  );
}