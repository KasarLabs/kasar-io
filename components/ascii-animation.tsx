"use client";

import { useEffect, useRef } from "react";

export default function UnifiedAsciiAnimation({ currentSlide = 0 }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Configuration
    const MAX_CHARS = 200;
    const SEPARATION = 1;
    
    // Canvas dimensions
    let width: number;
    let height: number;
    
    // Animation state
    let animationFrame: number;
    let time = 0;
    let transitionProgress = 0;
    const TRANSITION_SPEED = 0.03;
    let lastSlide = currentSlide;
    
    // Grid parameters for slide 2 (grid view)
    const GRID_ROWS = 25;
    const GRID_COLS = 50;

    // Rain parameters for slide 0
    const raindrops: {
      char: string;
      x: number;
      y: number;
      speed: number;
      opacity: number;
    }[] = [];
    
    const MAX_RAINDROPS = 100;

    // Store all characters
    let characters: {
      char: string;
      originalX: number;
      originalY: number;
      originalZ: number;
      x: number;
      y: number;
      z: number;
      targetX: number;
      targetY: number;
      targetZ: number;
      gridRow: number;
      gridCol: number;
      velocity: { x: number; y: number; z: number };
    }[] = [];

    // Camera position
    const camera = {
      x: 0,
      y: 0,
      z: SEPARATION + 1
    };

    // Initialize rain effect
    function initRain() {
      for (let i = 0; i < MAX_RAINDROPS; i++) {
        createRaindrop();
      }
    }
    
    function createRaindrop() {
      const char = String.fromCharCode(Math.floor(Math.random() * 93) + 33);
      const x = Math.random() * width;
      const y = Math.random() * -height; // Start above the screen
      const speed = Math.random() * 2 + 1;
      const opacity = Math.random() * 0.5 + 0.5;
      
      raindrops.push({ char, x, y, speed, opacity });
    }
    
    function updateRain() {
      for (let i = raindrops.length - 1; i >= 0; i--) {
        const drop = raindrops[i];
        drop.y += drop.speed;
        
        // Remove drops that have fallen off-screen
        if (drop.y > height) {
          raindrops.splice(i, 1);
          createRaindrop();
        }
      }
    }
    
    function renderRain() {
      for (const drop of raindrops) {
        const size = 14;
        ctx.font = `${size}px monospace`;
        ctx.fillStyle = `rgba(0, 255, 255, ${drop.opacity})`;
        ctx.fillText(drop.char, drop.x, drop.y);
      }
    }

    // Create initial 3D characters
    function initCharacters() {
      characters = [];
      
      for (let i = 0; i < MAX_CHARS; i++) {
        const char = String.fromCharCode(Math.floor(Math.random() * 93) + 33);
        
        // Create position with signed random values for even distribution
        // Using a sphere distribution for better 3D cloud effect
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const radius = Math.random() * SEPARATION;
        
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        
        characters.push({
          char,
          originalX: x,
          originalY: y,
          originalZ: z,
          x,
          y,
          z,
          targetX: 0,
          targetY: 0,
          targetZ: 0,
          gridRow: 0,
          gridCol: 0,
          velocity: { x: 0, y: 0, z: 0 }
        });
      }
      
      // Assign grid positions for slide 2
      assignGridPositions();
    }

    // Assign grid positions for slide 2 transition
    function assignGridPositions() {
      for (let i = 0; i < characters.length; i++) {
        const rowIndex = i % GRID_ROWS;
        const colIndex = Math.floor(i / GRID_ROWS) % GRID_COLS;
        
        // Calculate grid positions
        const xSpacing = (SEPARATION * 2) / GRID_COLS;
        const ySpacing = (SEPARATION * 2) / GRID_ROWS;
        
        // Position starts from top-left corner of the grid
        const gridX = -SEPARATION + xSpacing * colIndex + xSpacing / 2;
        const gridY = -SEPARATION + ySpacing * rowIndex + ySpacing / 2;
        
        characters[i].gridRow = rowIndex;
        characters[i].gridCol = colIndex;
        characters[i].targetX = gridX;
        characters[i].targetY = gridY;
        characters[i].targetZ = 0.5;
      }
    }

    // Project 3D point to 2D screen position
    function project(x: number, y: number, z: number): [number, number, number] {
      const zp = z + camera.z;
      const div = zp / height;
      const xp = (x + camera.x) / div;
      const yp = (y + camera.y) / div;
      return [xp + width / 2, yp + height / 2, zp];
    }

    // Rotate a point around an axis
    function rotate(point: { x: number, y: number, z: number }, axis: string, angle: number) {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      
      const { x, y, z } = point;
      
      if (axis === 'x') {
        point.y = y * cos - z * sin;
        point.z = y * sin + z * cos;
      } else if (axis === 'y') {
        point.x = x * cos - z * sin;
        point.z = x * sin + z * cos;
      } else if (axis === 'z') {
        point.x = x * cos - y * sin;
        point.y = x * sin + y * cos;
      }
    }
    
    // Function to smoothly transition characters between states
    function transitionCharacters() {
      for (const char of characters) {
        // Calculate distance to target
        const dx = char.targetX - char.x;
        const dy = char.targetY - char.y;
        const dz = char.targetZ - char.z;
        
        // Apply velocity for smooth movement
        char.velocity.x = char.velocity.x * 0.9 + dx * 0.1;
        char.velocity.y = char.velocity.y * 0.9 + dy * 0.1;
        char.velocity.z = char.velocity.z * 0.9 + dz * 0.1;
        
        // Update position
        char.x += char.velocity.x * 0.1;
        char.y += char.velocity.y * 0.1;
        char.z += char.velocity.z * 0.1;
      }
    }

    // Render frame
    function render() {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, width, height);
      
      // Title text
      ctx.font = "24px sans-serif";
      ctx.fillStyle = "rgba(255, 255, 255, 1)";
      ctx.textAlign = "center";
      ctx.fillText("STARKNET", width / 2, 40);
      
      // Handle slide transitions
      if (currentSlide !== lastSlide) {
        // Initialize transition
        if (currentSlide === 1 && lastSlide === 0) {
          // Transition from rain to 3D rotation
          transitionProgress = 0;
          
          // Initialize 3D characters if coming from rain
          if (characters.length === 0) {
            initCharacters();
          }
          
          // Reset rotation for a clean start
          for (const char of characters) {
            char.x = char.originalX;
            char.y = char.originalY;
            char.z = char.originalZ;
            char.velocity = { x: 0, y: 0, z: 0 };
          }
        } else if (currentSlide === 2 && lastSlide === 1) {
          // Transition from 3D rotation to grid
          transitionProgress = 0;
          assignGridPositions();
        } else if (currentSlide === 0) {
          // Transition to rain
          transitionProgress = 0;
          initRain();
        }
        
        lastSlide = currentSlide;
      }
      
      // Update transition progress
      if (transitionProgress < 1) {
        transitionProgress = Math.min(transitionProgress + TRANSITION_SPEED, 1);
      }
      
      // Render based on current slide
      if (currentSlide === 0) {
        // Slide 0: Rain effect
        updateRain();
        renderRain();
      } else if (currentSlide === 1) {
        // Slide 1: 3D rotating cloud
        for (let i = 0; i < characters.length; i++) {
          const char = characters[i];
          
          // If we just transitioned to 3D, ensure positions are reset
          if (lastSlide === 0 && transitionProgress < 1) {
            // During transition from rain, move to 3D positions
            char.targetX = char.originalX;
            char.targetY = char.originalY;
            char.targetZ = char.originalZ;
            transitionCharacters();
          } else {
            // When fully in 3D mode or continuing rotation
            // We need to save original positions before rotation
            const originalX = char.x;
            const originalY = char.y;
            const originalZ = char.z;
            
            // Apply rotation for 3D effect
            rotate(char, 'x', 0.003);
            rotate(char, 'y', 0.002);
            
            // If coming from rain, keep the rotation minimal to build up
            if (transitionProgress < 1) {
              // Blend between original and rotated position
              char.x = originalX * (1 - transitionProgress) + char.x * transitionProgress;
              char.y = originalY * (1 - transitionProgress) + char.y * transitionProgress;
              char.z = originalZ * (1 - transitionProgress) + char.z * transitionProgress;
            }
          }
          
          // Randomly change characters
          if (Math.random() < 0.01) {
            char.char = String.fromCharCode(Math.floor(Math.random() * 93) + 33);
          }
        }
        
        // Sort characters by Z depth for correct rendering
        characters.sort((a, b) => (b.z + camera.z) - (a.z + camera.z));
        
        // Render each character in 3D space
        for (let i = 0; i < characters.length; i++) {
          const char = characters[i];
          const [screenX, screenY, screenZ] = project(char.x, char.y, char.z);
          
          // Skip if character is behind camera
          if (screenZ <= 0) continue;
          
          // Calculate size based on distance
          const maxSize = 50;
          const size = Math.floor(maxSize / screenZ);
          if (size <= 0) continue;
          
          // Calculate brightness based on distance
          let brightness = size / maxSize;
          brightness = Math.max(0.1, Math.min(brightness, 1));
          
          // Blue-tinted ASCII colors
          const blueValue = Math.min(255, Math.max(100, Math.floor(150 + 100 * brightness)));
          const color = `rgba(200, 200, ${blueValue}, ${brightness})`;
          
          // Draw character
          ctx.font = `${size}px monospace`;
          ctx.fillStyle = color;
          ctx.fillText(char.char, screenX, screenY);
        }
      } else if (currentSlide === 2) {
        // Slide 2: 2D Grid layout
        for (let i = 0; i < characters.length; i++) {
          const char = characters[i];
          
          // Set target positions for grid layout
          char.targetX = char.targetX;
          char.targetY = char.targetY;
          char.targetZ = char.targetZ;
          
          // Apply smooth transition to target positions
          transitionCharacters();
          
          // Update character to binary for grid view
          if (Math.random() < 0.02) {
            char.char = Math.random() > 0.5 ? "0" : "1";
          }
        }
        
        // Render each character in grid
        for (let i = 0; i < characters.length; i++) {
          const char = characters[i];
          const [screenX, screenY, screenZ] = project(char.x, char.y, char.z);
          
          // Skip if character is behind camera
          if (screenZ <= 0) continue;
          
          // Fixed size for grid view
          const size = 16;
          
          // Blue-green color for grid characters
          const color = "rgba(0, 255, 200, 0.8)";
          
          // Draw character
          ctx.font = `${size}px monospace`;
          ctx.fillStyle = color;
          ctx.fillText(char.char, screenX, screenY);
        }
      }
      
      // Update time and request next frame
      time++;
      animationFrame = requestAnimationFrame(render);
    }

    // Set canvas dimensions
    function setDimensions() {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    // Initialize and start animation
    function init() {
      setDimensions();
      
      // Always initialize characters so they're ready for transition
      initCharacters();
      
      // Initialize based on starting slide
      if (currentSlide === 0) {
        initRain();
      }
      
      animationFrame = requestAnimationFrame(render);
    }

    // Handle window resize
    const handleResize = () => {
      setDimensions();
    };
    
    window.addEventListener("resize", handleResize);
    init();
    
    // Cleanup on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrame);
    };
  }, [currentSlide]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block bg-black absolute top-0 left-0 right-0 bottom-0"
    />
  );
}