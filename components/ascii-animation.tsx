"use client";

import { useEffect, useRef, useState } from "react";

export default function UnifiedAsciiAnimation({ currentSlide = 0 }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [previousSlide, setPreviousSlide] = useState(currentSlide);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionProgress, setTransitionProgress] = useState(0);

  // Reference to store animation state
  const animationRef = useRef({
    animationFrame: 0,
    time: 0,
    characters: [] as Character[],
    initialized: false,
  });

  // Character type definition
  type Character = {
    id: number;
    char: string;
    x: number;
    y: number;
    z: number;
    startX: number;
    startY: number;
    startZ: number;
    targetX: number;
    targetY: number;
    targetZ: number;
    speed: number;
    size: number;
    opacity: number;
  };

  // Calculate target positions for the new state
  const calculateTargetPositions = (targetState: number) => {
    const characters = animationRef.current.characters;
    if (!characters.length) return;

    // Get canvas dimensions
    const canvas = canvasRef.current;
    const width = canvas ? canvas.clientWidth : window.innerWidth;
    const height = canvas ? canvas.clientHeight : window.innerHeight;

    characters.forEach((char, index) => {
      // Save current position as starting point
      char.startX = char.x;
      char.startY = char.y;
      char.startZ = char.z;

      // Calculate target position based on the target state
      if (targetState === 0) {
        // Target: Rain state - maintain vertical alignment from previous state
        if (previousSlide === 1) {
          // When coming from cloud, maintain some of the x position to make transition smoother
          const randomOffset = Math.random() * 100 - 50;
          char.targetX = (char.x * width) / 4 + randomOffset;
          char.targetY = Math.random() * height;
          char.targetZ = 0;
        } else {
          // Normal rain positioning
          char.targetX = Math.random() * width;
          char.targetY = Math.random() * height;
          char.targetZ = 0;
        }
      } else if (targetState === 1) {
        // Target: Cloud state - maintain some positional relationship from rain state
        if (previousSlide === 0) {
          // When coming from rain, use x position to inform the cloud position
          const normalizedX = char.x / width; // 0 to 1 based on screen position
          const phi = Math.PI * normalizedX;
          const theta = Math.PI * 2 * (index / characters.length);
          const radius = 0.7 + Math.random() * 0.5; // Réduit la dispersion (était 1 + Math.random())

          // Shift the center point to the right by adding an offset
          const rightOffset = 0.7; // Ajusté de 1.0 à 0.7 pour être encore moins à droite
          
          char.targetX = radius * Math.sin(phi) * Math.cos(theta) + rightOffset;
          char.targetY = radius * Math.sin(phi) * Math.sin(theta);
          char.targetZ = radius * Math.cos(phi);
        } else {
          // Normal cloud positioning (sphere)
          const phi = Math.acos(2 * Math.random() - 1);
          const theta = Math.random() * Math.PI * 2;
          const radius = Math.random() * 1.2; // Réduit de 2 à 1.2 pour moins de dispersion

          // Shift the center point to the right by adding an offset
          const rightOffset = 0.7; // Ajusté de 1.0 à 0.7 pour être encore moins à droite
          
          char.targetX = radius * Math.sin(phi) * Math.cos(theta) + rightOffset;
          char.targetY = radius * Math.sin(phi) * Math.sin(theta);
          char.targetZ = radius * Math.cos(phi);
        }
      } else if (targetState === 2) {
        // Target: Grid state
        const gridSize = Math.ceil(Math.sqrt(characters.length));
        const row = index % gridSize;
        const col = Math.floor(index / gridSize) % gridSize;

        char.targetX = -2 + (col / gridSize) * 4;
        char.targetY = -2 + (row / gridSize) * 4;
        char.targetZ = 0;
      } else if (targetState === 3) {
        // Target: Spiral state for slide 4
        // Instead of video, create a dynamic spiral pattern
        const angle = index * 0.1; // Controls spiral spacing
        const radius = 0.2 + 0.01 * index; // Gradually increasing radius
        const height = 2 - (index / characters.length) * 4; // Decreasing height for downward spiral

        char.targetX = radius * Math.cos(angle);
        char.targetY = height;
        char.targetZ = radius * Math.sin(angle);
      }

      // Character appearance transitions
      // If transitioning to grid state, start changing characters to 0/1
      if (
        targetState === 2 &&
        (previousSlide === 0 || previousSlide === 1 || previousSlide === 3)
      ) {
        char.char = Math.random() > 0.5 ? "0" : "1";
      }

      // If transitioning from grid state, change characters back to varied ASCII
      if (
        previousSlide === 2 &&
        (targetState === 0 || targetState === 1 || targetState === 3)
      ) {
        char.char = String.fromCharCode(Math.floor(Math.random() * 93) + 33);
      }

      // For spiral state (slide 4), use special characters
      if (targetState === 3 && previousSlide !== 3) {
        const specialChars = [
          "*",
          "+",
          ".",
          "•",
          "°",
          "·",
          "✧",
          "✦",
          "★",
          "☆",
          "✬",
          "✴",
          "✹",
        ];
        char.char =
          specialChars[Math.floor(Math.random() * specialChars.length)];
      }
    });
  };

  useEffect(() => {
    // Start transition when currentSlide changes
    if (currentSlide !== previousSlide && !isTransitioning) {
      console.log(
        `Starting transition from state ${previousSlide} to ${currentSlide}`,
      );
      setIsTransitioning(true);
      setTransitionProgress(0);

      // Calculate target positions for the new state
      calculateTargetPositions(currentSlide);

      // Update previous slide after transition completes
      const transitionDuration = 2000; // 2 seconds
      setTimeout(() => {
        setPreviousSlide(currentSlide);
        setIsTransitioning(false);
      }, transitionDuration);
    }
  }, [currentSlide, previousSlide, isTransitioning]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Configuration
    const MAX_CHARS = 100;

    // Canvas dimensions
    let width = canvas.clientWidth;
    let height = canvas.clientHeight;

    // Setup canvas with proper resolution
    function setupCanvas() {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    setupCanvas();

    // Initialize characters if not already done
    if (!animationRef.current.initialized) {
      initCharacters(MAX_CHARS, width, height, previousSlide);
      animationRef.current.initialized = true;
    }

    // Function to initialize characters based on the current state
    function initCharacters(
      count: number,
      width: number,
      height: number,
      state: number,
    ) {
      const characters = [];

      for (let i = 0; i < count; i++) {
        // Generate a random character (prefer 0/1 for grid state)
        const char =
          state === 2
            ? Math.random() > 0.5
              ? "0"
              : "1"
            : String.fromCharCode(Math.floor(Math.random() * 93) + 33);

        // Position based on state
        let x, y, z;

        if (state === 0) {
          // Rain state - random positions across screen
          x = Math.random() * width;
          y = Math.random() * height;
          z = 0;
        } else if (state === 1) {
          // Cloud state - positions on a sphere
          const phi = Math.acos(2 * Math.random() - 1);
          const theta = Math.random() * Math.PI * 2;
          const radius = Math.random() * 1.2; // Réduit de 2 à 1.2 pour moins de dispersion

          // Shift the center point to the right by adding an offset
          const rightOffset = 0.7; // Ajusté de 1.0 à 0.7 pour être encore moins à droite
          
          x = radius * Math.sin(phi) * Math.cos(theta) + rightOffset;
          y = radius * Math.sin(phi) * Math.sin(theta);
          z = radius * Math.cos(phi);
        } else {
          // Grid state - organized in a grid pattern
          const gridSize = Math.ceil(Math.sqrt(count));
          const row = i % gridSize;
          const col = Math.floor(i / gridSize) % gridSize;

          x = -2 + (col / gridSize) * 4;
          y = -2 + (row / gridSize) * 4;
          z = 0;
        }

        characters.push({
          id: i,
          char,
          x,
          y,
          z,
          startX: x,
          startY: y,
          startZ: z,
          targetX: x,
          targetY: y,
          targetZ: z,
          speed: Math.random() * 1.5 + 0.5,
          size: state === 1 ? 18 : 14,
          opacity: Math.random() * 0.5 + 0.5,
        });
      }

      animationRef.current.characters = characters;
    }

    // This is now a duplicate - we've moved the calculateTargetPositions function outside
    // of this useEffect to make it accessible from the transition useEffect

    // Update characters each frame
    function updateCharacters() {
      const characters = animationRef.current.characters;

      if (isTransitioning) {
        // Update transition progress (0 to 1)
        const transitionDuration = 2000; // ms
        const progress = Math.min(
          transitionProgress + 16 / transitionDuration,
          1,
        );
        setTransitionProgress(progress);

        // Apply easing for smoother motion
        const eased = easeInOutCubic(progress);

        // Check transition type for special effects
        const isRainToCloud = previousSlide === 0 && currentSlide === 1;
        const isCloudToRain = previousSlide === 1 && currentSlide === 0;

        // Interpolate positions
        characters.forEach((char, i) => {
          // Base interpolation
          char.x = char.startX * (1 - eased) + char.targetX * eased;
          char.y = char.startY * (1 - eased) + char.targetY * eased;
          char.z = char.startZ * (1 - eased) + char.targetZ * eased;

          // Add special motion effects for rain-cloud transitions
          if (isRainToCloud) {
            // Add swirling motion during rain to cloud transition
            const swirl =
              Math.sin(eased * Math.PI * 2 + i * 0.1) * (1 - eased) * 0.5;
            char.x += swirl;
            char.z += swirl;
          } else if (isCloudToRain) {
            // Add acceleration effect for cloud to rain
            if (eased > 0.5) {
              const rainAcc = Math.pow(2 * (eased - 0.5), 2) * 50;
              char.y += rainAcc * (i % 5) * 0.01;
            }
          }

          // Character appearance transitions
          // Randomly change characters during transition (more frequently for grid)
          if (currentSlide === 2 && Math.random() < 0.03) {
            char.char = Math.random() > 0.5 ? "0" : "1";
          } else if (Math.random() < 0.01) {
            char.char = String.fromCharCode(
              Math.floor(Math.random() * 93) + 33,
            );
          }

          // For rain-cloud transitions, add special character effects
          if (
            (isRainToCloud || isCloudToRain) &&
            Math.random() < 0.02 * eased
          ) {
            // Make characters "sparkle" during transition by changing their opacity
            char.opacity = Math.random() * 0.5 + 0.5;

            // Change character more frequently during these transitions
            if (Math.random() < 0.3) {
              char.char = String.fromCharCode(
                Math.floor(Math.random() * 93) + 33,
              );
            }
          }
        });
      } else {
        // Normal behavior based on current state
        if (previousSlide === 0) {
          // Rain behavior
          characters.forEach((char) => {
            char.y += char.speed;

            // Reset characters that fall off screen
            if (char.y > height) {
              char.y = Math.random() * -100;
              char.x = Math.random() * width;
              char.char = String.fromCharCode(
                Math.floor(Math.random() * 93) + 33,
              );
            }
          });
        } else if (previousSlide === 1) {
          // Cloud behavior - slow rotation
          characters.forEach((char) => {
            // Apply rotation matrices
            const x = char.x;
            const y = char.y;
            const z = char.z;

            // Define the center of rotation (shifted to the right)
            const centerX = 0.7;  // Ajusté de 1.0 à 0.7 pour être encore moins à droite
            
            // Calculate position relative to the center
            const relX = x - centerX;
            
            // X-Z rotation
            char.x = centerX + relX * Math.cos(0.003) + z * Math.sin(0.003);
            char.z = -relX * Math.sin(0.003) + z * Math.cos(0.003);

            // Y-Z rotation
            const newY = y * Math.cos(0.002) - char.z * Math.sin(0.002);
            const newZ = y * Math.sin(0.002) + char.z * Math.cos(0.002);
            char.y = newY;
            char.z = newZ;

            // Occasionally change characters
            if (Math.random() < 0.003) {
              char.char = String.fromCharCode(
                Math.floor(Math.random() * 93) + 33
              );
            }
          });
        } else if (previousSlide === 2) {
          // Grid behavior - just random character changes
          characters.forEach((char) => {
            if (Math.random() < 0.01) {
              char.char = Math.random() > 0.5 ? "0" : "1";
            }
          });
        }
      }
    }

    // Easing function for smooth transitions
    function easeInOutCubic(t: number): number {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    // Project 3D to 2D (for cloud and grid states)
    function project(
      x: number,
      y: number,
      z: number,
    ): [number, number, number] {
      const fov = 5;
      const zOffset = 5;

      if (z + zOffset <= 0) return [0, 0, 0];

      const scale = fov / (z + zOffset);
      const xp = x * scale;
      const yp = y * scale;

      return [
        width / 2 + (xp * height) / 2,
        height / 2 + (yp * height) / 2,
        z + zOffset,
      ];
    }

    // Render characters to canvas
    function renderCharacters() {
      const characters = animationRef.current.characters;

      // Sort by depth for proper 3D rendering (cloud state or during transitions)
      if (previousSlide === 1 || currentSlide === 1 || isTransitioning) {
        characters.sort((a, b) => b.z - a.z);
      }

      // Render each character
      characters.forEach((char) => {
        let x, y, size, color;

        // For rain state without transition
        if (previousSlide === 0 && !isTransitioning) {
          x = char.x;
          y = char.y;
          size = char.size;
          color = `rgba(0, 255, 255, ${char.opacity})`;
        } else if (
          isTransitioning &&
          (previousSlide === 0 || currentSlide === 0)
        ) {
          // Special coloring for rain transitions
          const isRainToCloud = previousSlide === 0 && currentSlide === 1;
          const isCloudToRain = previousSlide === 1 && currentSlide === 0;

          if (isRainToCloud || isCloudToRain) {
            const [screenX, screenY, screenZ] = project(char.x, char.y, char.z);
            x = screenX;
            y = screenY;

            // Blend colors during transition
            const distanceScale = 5 / Math.max(1, screenZ);
            size = Math.floor(char.size * distanceScale);

            // For rain to cloud, transition from cyan to blue
            if (isRainToCloud) {
              const blueValue = 255 - Math.floor(transitionProgress * 55);
              const greenValue = 255 - Math.floor(transitionProgress * 55);
              color = `rgba(${Math.floor(180 * transitionProgress)}, ${greenValue}, ${blueValue}, ${char.opacity})`;
            }
            // For cloud to rain, transition from blue to cyan
            else {
              const blueValue = 200 + Math.floor(transitionProgress * 55);
              const greenValue = 200 + Math.floor(transitionProgress * 55);
              color = `rgba(0, ${greenValue}, ${blueValue}, ${char.opacity})`;
            }
          } else {
            x = char.x;
            y = char.y;
            size = char.size;
            color = `rgba(0, 255, 255, ${char.opacity})`;
          }
        } else {
          // For cloud, grid states and transitions
          const [screenX, screenY, screenZ] = project(char.x, char.y, char.z);

          if (screenZ <= 0) return;

          x = screenX;
          y = screenY;

          if (previousSlide === 1 && !isTransitioning) {
            // Cloud state
            const distanceScale = 5 / Math.max(1, screenZ);
            size = Math.floor(char.size * distanceScale);
            const brightness = Math.max(0.1, Math.min(1, size / 30));
            color = `rgba(180, 200, 255, ${brightness})`;
          } else if (previousSlide === 2 && !isTransitioning) {
            // Grid state
            size = char.size;
            color = `rgba(0, 255, 200, 0.8)`;
          } else {
            // Transition states
            const distanceScale = 5 / Math.max(1, screenZ);
            size = Math.floor(char.size * distanceScale);
            color = `rgba(100, 200, 255, ${char.opacity})`;
          }
        }

        // Draw the character
        ctx.font = `${size}px monospace`;
        ctx.fillStyle = color;
        ctx.textAlign = "center";
        ctx.fillText(char.char, x, y);
      });
    }

    // Main render loop
    function render() {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, width, height);

      // // Title
      // ctx.font = "24px sans-serif";
      // ctx.fillStyle = "white";
      // ctx.textAlign = "center";
      // ctx.fillText("STARKNET", width / 2, 40);

      // // Debug info
      // ctx.font = "16px sans-serif";
      // ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      // ctx.fillText(
      //   `State: ${previousSlide}${isTransitioning ? ` → ${currentSlide} (${Math.round(transitionProgress * 100)}%)` : ""}`,
      //   width / 2,
      //   70
      // );

      // Update and render characters
      updateCharacters();
      renderCharacters();

      // Next frame
      animationRef.current.time++;
      animationRef.current.animationFrame = requestAnimationFrame(render);
    }

    // Handle window resize
    const handleResize = () => {
      setupCanvas();
    };

    window.addEventListener("resize", handleResize);

    // Start the animation
    animationRef.current.animationFrame = requestAnimationFrame(render);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationRef.current.animationFrame);
    };
  }, [currentSlide, previousSlide, isTransitioning, transitionProgress]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block bg-black absolute top-0 left-0 right-0 bottom-0"
    />
  );
}
