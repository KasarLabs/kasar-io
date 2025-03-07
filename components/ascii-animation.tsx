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
    const TRANSITION_SPEED = 0.05;
    let lastSlide = currentSlide;
    
    // Grid parameters for slide 1
    const GRID_ROWS = 25;
    const GRID_COLS = 50;

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
    }[] = [];

    // Camera position
    const camera = {
      x: 0,
      y: 0,
      z: SEPARATION + 1
    };

    // Create initial characters
    function initCharacters() {
      characters = [];
      
      for (let i = 0; i < MAX_CHARS; i++) {
        const char = String.fromCharCode(Math.floor(Math.random() * 93) + 33);
        
        // Create position with signed random values for even distribution
        const x = (Math.random() - 0.5) * 2 * SEPARATION;
        const y = (Math.random() - 0.5) * 2 * SEPARATION;
        const z = (Math.random() - 0.5) * 2 * SEPARATION;
        
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
          gridCol: 0
        });
      }
      
      // Assign grid positions for slide 1
      assignGridPositions();
    }

    // Assign grid positions for slide 1 transition
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
      
      // Handle transition between slides
      if (currentSlide === 1 && transitionProgress < 1) {
        transitionProgress = Math.min(transitionProgress + TRANSITION_SPEED, 1);
      } else if (currentSlide === 0 && transitionProgress > 0) {
        transitionProgress = Math.max(transitionProgress - TRANSITION_SPEED, 0);
      }
      
      // Check for slide change
      if (lastSlide !== currentSlide) {
        lastSlide = currentSlide;
      }
      
      // Update character positions based on current rotation and transition state
      for (let i = 0; i < characters.length; i++) {
        const char = characters[i];
        
        // For slide 0, apply continuous rotation
        if (currentSlide === 0 || transitionProgress < 1) {
          // First reset to original position if we're in slide 0 with no transition
          if (currentSlide === 0 && transitionProgress === 0) {
            char.x = char.originalX;
            char.y = char.originalY;
            char.z = char.originalZ;
          }
          
          // Apply rotation - this is the key for the animation
          const rotationFactor = currentSlide === 0 ? 1 : 1 - transitionProgress;
          
          // Apply different rotation speeds - REDUCED SPEED HERE
          rotate(char, 'x', 0.003 * rotationFactor); // Reduced from 0.01
          rotate(char, 'y', 0.002 * rotationFactor); // Reduced from 0.0075
        }
        
        // Apply transition to grid position for slide 1
        if (transitionProgress > 0) {
          char.x = char.x * (1 - transitionProgress) + char.targetX * transitionProgress;
          char.y = char.y * (1 - transitionProgress) + char.targetY * transitionProgress;
          char.z = char.z * (1 - transitionProgress) + char.targetZ * transitionProgress;
          
          // Update character to binary for slide 1
          if (Math.random() < 0.02 * transitionProgress) {
            char.char = Math.random() > 0.5 ? "0" : "1";
          }
        } else if (currentSlide === 0 && Math.random() < 0.002) {
          // Randomly change characters for slide 0
          char.char = String.fromCharCode(Math.floor(Math.random() * 93) + 33);
        }
      }
      
      // Sort characters by Z depth for correct rendering
      characters.sort((a, b) => (b.z + camera.z) - (a.z + camera.z));
      
      // Render each character
      for (let i = 0; i < characters.length; i++) {
        const char = characters[i];
        const [screenX, screenY, screenZ] = project(char.x, char.y, char.z);
        
        // Skip if character is behind camera
        if (screenZ <= 0) continue;
        
        // Calculate size based on distance
        const maxSize = 50;
        const size = Math.floor(maxSize / screenZ);
        if (size <= 0) continue;
        
        // Calculate brightness based on size/distance
        let brightness = size / maxSize;
        brightness = Math.max(0.1, Math.min(brightness, 1));
        
        // Always use blue-tinted ASCII colors from slide 0
        const blueValue = Math.min(255, Math.max(100, Math.floor(150 + 100 * brightness)));
        const color = `rgba(255, 255, ${blueValue}, ${brightness})`;
        
        // Draw character
        ctx.font = `${size}px monospace`;
        ctx.fillStyle = color;
        ctx.fillText(char.char, screenX, screenY);
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
      initCharacters();
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