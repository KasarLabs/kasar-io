"use client";

import { useEffect, useRef } from "react";

export default function UnifiedAsciiAnimation({ currentSlide = 0 }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let ww: number, wh: number, camera: Vector;
    const CHARS: Char[] = [];
    // Parameters for slide 0
    const MAX_CHARS = 200;
    const SEPARATION = 1;
    let time = 0;
    let transitionProgress = 0;
    const TRANSITION_SPEED = 0.05;
    let lastSlide = currentSlide;

    // 2D grid parameters
    const GRID_ROWS = 25;
    const GRID_COLS = 50;

    // Character sets
    const NODE_CHARS = ["ﾊ", "ﾐ", "ﾋ", "ｹ", "ﾒ", "ｳ", "ｼ", "ﾅ"];
    const CONNECTION_CHARS = ["│", "─", "┌", "┐", "└", "┘", "┼", "╬"];
    const BRIGHT_CHARS = ["ﾘ", "ｱ", "ｶ", "ｻ", "ﾀ"];
    const NUMBER_CHARS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    const MAIN_CHARS = [...NODE_CHARS, ...CONNECTION_CHARS];
    const CRAZY_CHARS = [
      "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "+",
      "=", "{", "}", "[", "]", "|", "\\", ":", ";", "\"", "'", "<",
      ">", "?", "/", "~", "`", "±", "§", "Δ", "Σ", "Ω", "£", "¢",
      "¥", "Γ", "Λ", "Θ", "Ξ", "Π", "Φ", "Ψ"
    ];

    // Color types
    enum ColorType {
      CENTER = "center",
      NODE = "node",
      BRIGHT = "bright",
      CONNECTION = "connection",
      TRANSITION = "transition",
      NUMBER = "number",
    }

    // Color mapping
    const COLOR_MAP: Record<ColorType, string> = {
      [ColorType.CENTER]: "rgba(136, 239, 255, $opacity)", // cyan-300
      [ColorType.NODE]: "rgba(192, 132, 252, $opacity)", // purple-400
      [ColorType.BRIGHT]: "rgba(216, 180, 254, $opacity)", // purple-300
      [ColorType.CONNECTION]: "rgba(165, 180, 252, $opacity)", // indigo-300
      [ColorType.TRANSITION]: "rgba(134, 239, 172, $opacity)", // green-300
      [ColorType.NUMBER]: "rgba(253, 224, 71, $opacity)", // yellow-300
    };

    class Vector {
      x: number;
      y: number;
      z: number;
      originalX: number;
      originalY: number;
      originalZ: number;
      targetX: number;
      targetY: number;
      targetZ: number;

      constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.originalX = x;
        this.originalY = y;
        this.originalZ = z;
        this.targetX = 0;
        this.targetY = 0;
        this.targetZ = 0;
      }

      reset(): void {
        this.x = this.originalX;
        this.y = this.originalY;
        this.z = this.originalZ;
      }

      setTarget(x: number, y: number, z: number): void {
        this.targetX = x;
        this.targetY = y;
        this.targetZ = z;
      }

      updateForTransition(progress: number): void {
        if (progress > 0) {
          // Slide 0-1 transition
          this.x = this.originalX * (1 - progress) + this.targetX * progress;
          this.y = this.originalY * (1 - progress) + this.targetY * progress;
          this.z = this.originalZ * (1 - progress) + this.targetZ * progress;
        } else {
          // Reset to original 3D position
          this.reset();
        }
      }

      rotate(dir: "x" | "y" | "z", ang: number): void {
        const X = this.x;
        const Y = this.y;
        const Z = this.z;
        const SIN = Math.sin(ang);
        const COS = Math.cos(ang);
        if (dir === "x") {
          this.y = Y * COS - Z * SIN;
          this.z = Y * SIN + Z * COS;
        } else if (dir === "y") {
          this.x = X * COS - Z * SIN;
          this.z = X * SIN + Z * COS;
        } else if (dir === "z") {
          this.x = X * COS - Y * SIN;
          this.y = X * SIN + Y * COS;
        }
      }

      project(): [number, number, number] {
        const ZP = this.z + camera.z;
        const DIV = ZP / wh;
        const XP = (this.x + camera.x) / DIV;
        const YP = (this.y + camera.y) / DIV;
        const CENTER = getCenter();
        return [XP + CENTER[0], YP + CENTER[1], ZP];
      }
    }

    class Char {
      letter: string;
      pos: Vector;
      colorType: ColorType;
      isCenter: boolean;
      pulseOffset: number;
      rowIndex: number;
      colIndex: number;
      originalLetter: string;
      useSlide0Style: boolean;

      constructor(letter: string, pos: Vector, useSlide0Style = false) {
        this.letter = letter;
        this.originalLetter = letter;
        this.pos = pos;
        this.useSlide0Style = useSlide0Style;
        this.colorType = this.getColorType(letter);
        this.isCenter =
          Math.abs(pos.x) < 0.2 &&
          Math.abs(pos.y) < 0.2 &&
          Math.abs(pos.z) < 0.2;
        this.pulseOffset = Math.random() * 2 * Math.PI;

        // Assign row and column indices for 2D grid transition
        this.rowIndex = 0;
        this.colIndex = 0;

        // Special treatment for characters near center in non-slide-0 mode
        if (this.isCenter && !useSlide0Style) {
          this.colorType = ColorType.CENTER;
          if (Math.random() < 0.5) {
            this.letter = "◉";
            this.originalLetter = "◉";
          }
        }
      }

      getColorType(char: string): ColorType {
        if (char === "◉" || char === "○") return ColorType.CENTER;
        if (BRIGHT_CHARS.includes(char)) return ColorType.BRIGHT;
        if (NODE_CHARS.includes(char)) return ColorType.NODE;
        if (CONNECTION_CHARS.includes(char)) return ColorType.CONNECTION;
        if (NUMBER_CHARS.includes(char)) return ColorType.NUMBER;
        if (CRAZY_CHARS.includes(char)) return ColorType.TRANSITION;
        return ColorType.NODE; // default
      }

      assignGridPosition(rowIndex: number, colIndex: number): void {
        this.rowIndex = rowIndex;
        this.colIndex = colIndex;

        // Calculate grid positions
        const xSpacing = (SEPARATION * 2) / GRID_COLS;
        const ySpacing = (SEPARATION * 2) / GRID_ROWS;

        // Position starts from top-left corner of the grid
        const gridX = -SEPARATION + xSpacing * colIndex + xSpacing / 2;
        const gridY = -SEPARATION + ySpacing * rowIndex + ySpacing / 2;

        // Set the target position for 2D grid
        this.pos.setTarget(gridX, gridY, 0.5);
      }

      rotate(dir: "x" | "y" | "z", ang: number): void {
        this.pos.rotate(dir, ang);
      }

      update(progress: number): void {
        // Character appearance logic based on slide and transition
        if (currentSlide === 0 && progress < 0.5) {
          // Special case for slide 0 - periodically change characters randomly
          if (Math.random() < 0.002) {
            if (this.useSlide0Style) {
              // Random ASCII character (33-126) for slide 0 style
              this.letter = String.fromCharCode((Math.random() * 93 + 33) | 0);
            } else {
              this.letter = CRAZY_CHARS[Math.floor(Math.random() * CRAZY_CHARS.length)];
            }
          }
          
          // In slide 0 to slide 1 transition, start morphing characters
          if (progress > 0.2 && progress < 0.5) {
            const transitionFactor = (progress - 0.2) / 0.3;
            if (Math.random() < 0.01 * transitionFactor) {
              if (Math.random() < 0.7) {
                this.letter = NUMBER_CHARS[Math.floor(Math.random() * NUMBER_CHARS.length)];
                this.colorType = ColorType.NUMBER;
              } else {
                this.letter = MAIN_CHARS[Math.floor(Math.random() * MAIN_CHARS.length)];
                this.colorType = this.getColorType(this.letter);
              }
            }
          }
        } 
        // For transitions and other slides
        else if (progress > 0.5) {
          if (Math.random() < 0.02) {
            const rnd = Math.random();
            if (rnd < 0.6) {
              this.letter = NUMBER_CHARS[Math.floor(Math.random() * NUMBER_CHARS.length)];
              this.colorType = ColorType.NUMBER;
            } else if (rnd < 0.8) {
              this.letter = CRAZY_CHARS[Math.floor(Math.random() * CRAZY_CHARS.length)];
              this.colorType = ColorType.TRANSITION;
            } else {
              this.letter = MAIN_CHARS[Math.floor(Math.random() * MAIN_CHARS.length)];
              this.colorType = this.getColorType(this.letter);
            }
          }
        } else {
          if (Math.random() < 0.002) {
            const rnd = Math.random();
            if (rnd < 0.3) {
              this.letter = BRIGHT_CHARS[Math.floor(Math.random() * BRIGHT_CHARS.length)];
              this.colorType = ColorType.BRIGHT;
            } else {
              this.letter = MAIN_CHARS[Math.floor(Math.random() * MAIN_CHARS.length)];
              this.colorType = this.getColorType(this.letter);
            }
          }
          if (this.isCenter) {
            this.letter = this.originalLetter;
            this.colorType = ColorType.CENTER;
          }
        }
      }

      render(): void {
        const PIXEL = this.pos.project();
        const XP = PIXEL[0];
        const YP = PIXEL[1];
        const ZP = PIXEL[2];

        // Determine if this character should use slide 0 style rendering
        const useSlide0Rendering = this.useSlide0Style && currentSlide === 0 && transitionProgress < 0.5;
        
        // Size calculation based on slide
        const MAX_SIZE = useSlide0Rendering ? 50 : 70;
        let SIZE = ((1 / ZP) * MAX_SIZE) | 0;

        // Size adjustments for transitions
        if (transitionProgress > 0.8) {
          const blendFactor = (transitionProgress - 0.8) * 5;
          const uniformSize = Math.min(ww / GRID_COLS, wh / GRID_ROWS) * 0.4;
          SIZE = SIZE * (1 - blendFactor) + uniformSize * blendFactor;
        }

        // Brightness calculation
        let BRIGHTNESS = SIZE / MAX_SIZE;

        // Special brightness handling for slide 0
        if (useSlide0Rendering) {
          // Exaggerate depth perception with stronger brightness variations
          // Closer characters are brighter, further characters are dimmer
          const depthFactor = 1.5 - (ZP / (SEPARATION * 3));
          BRIGHTNESS = Math.max(0.1, Math.min(1.0, BRIGHTNESS * depthFactor));
          
          // Enhanced slide0 color with depth-based blue variation
          const blueValue = Math.min(255, Math.max(100, (200 * BRIGHTNESS) | 0));
          const slide0Color = `rgba(255, 255, ${blueValue}, ${BRIGHTNESS})`;
          
          ctx.beginPath();
          ctx.fillStyle = slide0Color;
          ctx.font = SIZE + "px monospace";
          ctx.fillText(this.letter, XP, YP);
          ctx.fill();
          ctx.closePath();
          return;
        }

        // Standard brightness adjustments for other slides
        if (currentSlide === 0 && transitionProgress < 0.3) {
          const depthFactor = 1 + (this.pos.z / SEPARATION) * 0.3;
          BRIGHTNESS *= depthFactor;
          if (this.pos.z > 0) {
            BRIGHTNESS *= 1.2;
          }
        }

        // Pulse effect for bright and center characters
        if (this.colorType === ColorType.BRIGHT || this.isCenter) {
          BRIGHTNESS *= 0.8 + 0.2 * Math.sin(time * 0.05 + this.pulseOffset);
        }

        // Wave effect for grid transition
        if (transitionProgress > 0.8) {
          const distFromCenter = Math.sqrt(
            Math.pow(this.colIndex - GRID_COLS / 2, 2) +
            Math.pow(this.rowIndex - GRID_ROWS / 2, 2)
          );
          const waveEffect = Math.sin(time * 0.05 - distFromCenter * 0.3);
          BRIGHTNESS *= 0.7 + 0.3 * (0.5 + waveEffect * 0.5);
        }

        BRIGHTNESS = Math.max(BRIGHTNESS, 0.1);

        // Standard color rendering for non-slide-0 or during transition
        const colorStr = COLOR_MAP[this.colorType].replace("$opacity", BRIGHTNESS.toFixed(2));

        ctx.beginPath();
        ctx.fillStyle = colorStr;
        ctx.font = SIZE + "px monospace";
        ctx.fillText(this.letter, XP, YP);
        ctx.fill();
        ctx.closePath();
      }
    }

    function getCenter(): [number, number] {
      return [ww / 2, wh / 2];
    }

    function signedRandom(): number {
      return Math.random() - Math.random();
    }

    function renderAll(): void {
      // For slide 0, emphasize depth by sorting and adding visual cues
      const isSlide0 = currentSlide === 0 && transitionProgress < 0.5;
      
      // Sort characters by z-position for proper depth rendering
      if (isSlide0) {
        // For slide 0, sort from near-to-far (painter's algorithm)
        CHARS.sort((a, b) => {
          const aPos = a.pos.project();
          const bPos = b.pos.project();
          return aPos[2] - bPos[2]; // Painter's algorithm: render near-to-far
        });
      } else {
        // For other slides, sort from far-to-near
        CHARS.sort((a, b) => {
          const aPos = a.pos.project();
          const bPos = b.pos.project();
          return bPos[2] - aPos[2]; // render far-to-near
        });
      }

      for (let i = 0; i < CHARS.length; i++) {
        CHARS[i].render();
      }
    }

    function update(): void {
      ctx.clearRect(0, 0, ww, wh);
      // For a solid black background
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, ww, wh);

      // Title text
      ctx.font = "24px sans-serif";
      ctx.fillStyle = "rgba(255, 255, 255, 1)";
      ctx.textAlign = "center";
      ctx.fillText("STARKNET", ww / 2, 40);

      // Handle transition based on slide
      if (currentSlide === 1 && transitionProgress < 1) {
        transitionProgress = Math.min(transitionProgress + TRANSITION_SPEED, 1);
      } else if (currentSlide === 0 && transitionProgress > 0) {
        transitionProgress = Math.max(transitionProgress - TRANSITION_SPEED, 0);
      }

      if (lastSlide !== currentSlide) {
        if (currentSlide === 1) {
          assignGridPositions();
        }
        lastSlide = currentSlide;
      }

      // For slide 0, apply dramatically enhanced rotation to showcase 3D disposition
      if (currentSlide === 0 && transitionProgress < 0.5) {
        // Use much larger rotation angles for dramatic effect
        const angleX = Math.sin(time * 0.0005) * 0.03;
        const angleY = Math.cos(time * 0.0007) * 0.03;
        
        // Apply rotation to each character
        for (let i = 0; i < CHARS.length; i++) {
          CHARS[i].rotate("x", angleX);
          CHARS[i].rotate("y", angleY);
          
          // Add more z-axis rotation
          if (i % 2 === 0) {
            CHARS[i].rotate("z", 0.005 * Math.sin(time * 0.0003));
          }
        }
      } else {
        // For other slides, apply global rotation
        const globalRotationX = Math.sin(time * 0.0003) * 0.002;
        const globalRotationY = Math.cos(time * 0.0002) * 0.003;
        const globalRotationZ = Math.sin(time * 0.0001) * 0.001;

        for (let i = 0; i < CHARS.length; i++) {
          if (transitionProgress < 0.7) {
            CHARS[i].rotate("x", globalRotationX);
            CHARS[i].rotate("y", globalRotationY);
            CHARS[i].rotate("z", globalRotationZ);
          }
        }
      }

      // Update positions and characters
      for (let i = 0; i < CHARS.length; i++) {
        CHARS[i].pos.updateForTransition(transitionProgress);
        CHARS[i].update(transitionProgress);
      }

      time++;
    }

    function assignGridPositions(): void {
      for (let i = 0; i < CHARS.length; i++) {
        const rowIndex = i % GRID_ROWS;
        const colIndex = Math.floor(i / GRID_ROWS) % GRID_COLS;
        CHARS[i].assignGridPosition(rowIndex, colIndex);
      }
    }

    function loop(): void {
      window.requestAnimationFrame(loop);
      update();
      renderAll();
    }

    function createChars(): void {
      // Create a dramatically structured 3D arrangement for better visualization
      // We'll create characters in a sphere AND a cube lattice to emphasize depth
      
      // First, create some characters in cube lattice points
      const latticeSize = 3; // 3x3x3 cube
      const latticeSpacing = SEPARATION / (latticeSize - 1);
      
      let charCount = 0;
      
      // Create cube lattice structure (corners and edges)
      for (let x = 0; x < latticeSize; x++) {
        for (let y = 0; y < latticeSize; y++) {
          for (let z = 0; z < latticeSize; z++) {
            // Only use points on the edges of the cube for clearer structure
            if (x === 0 || x === latticeSize-1 || 
                y === 0 || y === latticeSize-1 || 
                z === 0 || z === latticeSize-1) {
              
              const X = (x * latticeSpacing) - SEPARATION/2;
              const Y = (y * latticeSpacing) - SEPARATION/2;
              const Z = (z * latticeSpacing) - SEPARATION/2;
              
              // Create character
              const CHARACTER = String.fromCharCode((Math.random() * 93 + 33) | 0);
              const POS = new Vector(X, Y, Z);
              const CHAR = new Char(CHARACTER, POS, true);
              CHARS.push(CHAR);
              charCount++;
            }
          }
        }
      }
      
      // Fill the rest with spherical distribution
      for (let i = charCount; i < MAX_CHARS; i++) {
        const CHARACTER = String.fromCharCode((Math.random() * 93 + 33) | 0);
        
        // Spherical distribution with higher concentration toward the center
        let theta = Math.random() * Math.PI * 2;
        let phi = Math.acos(2 * Math.random() - 1);
        let radius = Math.pow(Math.random(), 1/2) * SEPARATION * 0.8; // Square root for more central concentration
        
        const X = radius * Math.sin(phi) * Math.cos(theta);
        const Y = radius * Math.sin(phi) * Math.sin(theta);
        const Z = radius * Math.cos(phi);
        
        const POS = new Vector(X, Y, Z);
        const CHAR = new Char(CHARACTER, POS, true);
        CHARS.push(CHAR);
      }

      assignGridPositions();
    }

    function setDim(): void {
      ww = canvas.clientWidth;
      wh = canvas.clientHeight;
      canvas.width = ww * window.devicePixelRatio;
      canvas.height = wh * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    function initCamera(): void {
      // Using a closer camera position for slide 0 to accentuate perspective
      camera = new Vector(0, 0, SEPARATION * 1.2);
    }

    setDim();
    initCamera();
    createChars();
    loop();

    const handleResize = () => {
      setDim();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [currentSlide]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block bg-black absolute top-0 left-0 right-0 bottom-0"
    />
  );
}