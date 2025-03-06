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
    // For slide 0, replicate the standalone effect (300 chars, wider spread)
    const MAX_CHARS = currentSlide === 0 ? 300 : 250;
    const SEPARATION = currentSlide === 0 ? 1.5 : 1.2;
    let time = 0;
    let transitionProgress = 0;
    let transition3Progress = 0;
    const TRANSITION_SPEED = 0.05;
    const TRANSITION3_SPEED = 0.03;
    let lastSlide = currentSlide;

    // 2D grid parameters
    const GRID_ROWS = 25;
    const GRID_COLS = 50;

    // Imported from NetworkAsciiArt
    const NODE_CHARS = ["ﾊ", "ﾐ", "ﾋ", "ｹ", "ﾒ", "ｳ", "ｼ", "ﾅ"];
    const CONNECTION_CHARS = ["│", "─", "┌", "┐", "└", "┘", "┼", "╬"];
    const BRIGHT_CHARS = ["ﾘ", "ｱ", "ｶ", "ｻ", "ﾀ"];
    const NUMBER_CHARS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

    // Combined character set for 3D animation
    const MAIN_CHARS = [...NODE_CHARS, ...CONNECTION_CHARS];

    // Crazy ASCII characters for transition effects
    const CRAZY_CHARS = [
      "!",
      "@",
      "#",
      "$",
      "%",
      "^",
      "&",
      "*",
      "(",
      ")",
      "_",
      "+",
      "=",
      "{",
      "}",
      "[",
      "]",
      "|",
      "\\",
      ":",
      ";",
      '"',
      "'",
      "<",
      ">",
      "?",
      "/",
      "~",
      "`",
      "±",
      "§",
      "Δ",
      "Σ",
      "Ω",
      "£",
      "¢",
      "¥",
      "Γ",
      "Λ",
      "Θ",
      "Ξ",
      "Π",
      "Φ",
      "Ψ",
    ];

    // Spiral characters for slide 3
    const SPIRAL_CHARS = [
      "◎",
      "◉",
      "●",
      "◐",
      "◑",
      "◒",
      "◓",
      "◔",
      "◕",
      "◖",
      "◗",
      "◌",
      "◍",
      "◎",
      "◉",
      "○",
      "◌",
      "◍",
      "◎",
      "◉",
      "○",
      "◌",
      "◍",
    ];

    // Color types based on NetworkAsciiArt
    enum ColorType {
      CENTER = "center",
      NODE = "node",
      BRIGHT = "bright",
      CONNECTION = "connection",
      TRANSITION = "transition",
      NUMBER = "number",
      SPIRAL = "spiral",
    }

    // Color mapping based on NetworkAsciiArt's Tailwind classes
    const COLOR_MAP: Record<ColorType, string> = {
      [ColorType.CENTER]: "rgba(136, 239, 255, $opacity)", // cyan-300
      [ColorType.NODE]: "rgba(192, 132, 252, $opacity)", // purple-400
      [ColorType.BRIGHT]: "rgba(216, 180, 254, $opacity)", // purple-300
      [ColorType.CONNECTION]: "rgba(165, 180, 252, $opacity)", // indigo-300
      [ColorType.TRANSITION]: "rgba(134, 239, 172, $opacity)", // green-300
      [ColorType.NUMBER]: "rgba(253, 224, 71, $opacity)", // yellow-300
      [ColorType.SPIRAL]: "rgba(249, 115, 22, $opacity)", // orange-500
    };

    // Enhanced Vector class with rotational capabilities
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
      spiral3DX: number;
      spiral3DY: number;
      spiral3DZ: number;

      constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.originalX = x;
        this.originalY = y;
        this.originalZ = z;
        // Target positions for 2D grid transition - will be set later
        this.targetX = 0;
        this.targetY = 0;
        this.targetZ = 0;
        // Spiral 3D positions for slide 3 - will be set later
        this.spiral3DX = 0;
        this.spiral3DY = 0;
        this.spiral3DZ = 0;
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

      setSpiral3D(x: number, y: number, z: number): void {
        this.spiral3DX = x;
        this.spiral3DY = y;
        this.spiral3DZ = z;
      }

      updateForTransition(progress: number, progress3: number): void {
        if (progress > 0 && progress3 === 0) {
          // Slide 1-2 transition: Interpolate between 3D position and 2D grid position
          this.x = this.originalX * (1 - progress) + this.targetX * progress;
          this.y = this.originalY * (1 - progress) + this.targetY * progress;
          this.z = this.originalZ * (1 - progress) + this.targetZ * progress;
        } else if (progress3 > 0) {
          // Slide 3 transition: Interpolate between current position and spiral 3D position
          const baseX = progress > 0 ? this.targetX : this.originalX;
          const baseY = progress > 0 ? this.targetY : this.originalY;
          const baseZ = progress > 0 ? this.targetZ : this.originalZ;

          this.x = baseX * (1 - progress3) + this.spiral3DX * progress3;
          this.y = baseY * (1 - progress3) + this.spiral3DY * progress3;
          this.z = baseZ * (1 - progress3) + this.spiral3DZ * progress3;
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
      rotationSpeed: number;
      spiralRadius: number;
      spiralAngle: number;
      spiralHeight: number;
      // Add individual rotation axes speeds
      rotationSpeedX: number;
      rotationSpeedY: number;
      rotationSpeedZ: number;
      // Add rotation direction
      rotationDirectionX: number;
      rotationDirectionY: number;
      rotationDirectionZ: number;
      // Add orbit parameters
      orbitRadius: number;
      orbitSpeed: number;
      orbitPhase: number;
      orbitAxis: "x" | "y" | "z";

      constructor(letter: string, pos: Vector) {
        this.letter = letter;
        this.originalLetter = letter;
        this.pos = pos;
        this.colorType = this.getColorType(letter);
        this.isCenter =
          Math.abs(pos.x) < 0.2 &&
          Math.abs(pos.y) < 0.2 &&
          Math.abs(pos.z) < 0.2;
        this.pulseOffset = Math.random() * 2 * Math.PI;

        // Assign row and column indices for 2D grid transition
        this.rowIndex = 0;
        this.colIndex = 0;

        // Enhanced rotation parameters for slide 0 (will be overridden if slide 0)
        this.rotationSpeed = Math.random() * 0.01 + 0.005;
        this.rotationSpeedX = Math.random() * 0.01 + 0.004;
        this.rotationSpeedY = Math.random() * 0.01 + 0.005;
        this.rotationSpeedZ = Math.random() * 0.01 + 0.006;

        // Random rotation directions (1 or -1)
        this.rotationDirectionX = Math.random() > 0.5 ? 1 : -1;
        this.rotationDirectionY = Math.random() > 0.5 ? 1 : -1;
        this.rotationDirectionZ = Math.random() > 0.5 ? 1 : -1;

        // Orbit parameters
        this.orbitRadius = Math.random() * 0.2;
        this.orbitSpeed = Math.random() * 0.002 + 0.001;
        this.orbitPhase = Math.random() * Math.PI * 2;
        this.orbitAxis = ["x", "y", "z"][Math.floor(Math.random() * 3)] as
          | "x"
          | "y"
          | "z";

        // Spiral parameters for slide 3
        this.spiralRadius = Math.random() * 0.5 + 0.5;
        this.spiralAngle = Math.random() * Math.PI * 2;
        this.spiralHeight = (Math.random() * 2 - 1) * SEPARATION;

        // Special treatment for characters near center
        if (this.isCenter) {
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
        if (SPIRAL_CHARS.includes(char)) return ColorType.SPIRAL;
        return ColorType.NODE; // default
      }

      assignGridPosition(rowIndex: number, colIndex: number): void {
        this.rowIndex = rowIndex;
        this.colIndex = colIndex;

        // Calculate grid positions in the same scale as 3D space
        const xSpacing = (SEPARATION * 2) / GRID_COLS;
        const ySpacing = (SEPARATION * 2) / GRID_ROWS;

        // Position starts from top-left corner of the grid
        const gridX = -SEPARATION + xSpacing * colIndex + xSpacing / 2;
        const gridY = -SEPARATION + ySpacing * rowIndex + ySpacing / 2;

        // Set the target position for 2D grid
        this.pos.setTarget(gridX, gridY, 0.5);
      }

      assignSpiralPosition(): void {
        // Calculate spiral positions for slide 3
        const t = this.spiralAngle + time * 0.001;
        const radius = this.spiralRadius;
        const height = this.spiralHeight;

        // Spiral coordinates
        const spiralX = Math.cos(t) * radius;
        const spiralY = Math.sin(t) * radius;
        const spiralZ = height + Math.sin(t * 2) * 0.3;

        this.pos.setSpiral3D(spiralX, spiralY, spiralZ);
      }

      rotate(dir: "x" | "y" | "z", ang: number): void {
        this.pos.rotate(dir, ang);
      }

      // Updated selfRotate to replicate slide 0 effect exactly
      selfRotate(): void {
        if (
          currentSlide === 0 &&
          transitionProgress < 0.1 &&
          transition3Progress < 0.1
        ) {
          // Use fixed rotation as in the standalone effect
          const DX = 0.006 * Math.sin(time * 0.001);
          const DY = 0.006 * Math.cos(time * 0.001);
          this.rotate("x", DX);
          this.rotate("y", DY);
        } else if (currentSlide !== 0) {
          // Original selfRotate for non-slide0 (or during transitions)
          const timeScale = time * 0.002;
          this.rotate(
            "x",
            this.rotationSpeedX *
              this.rotationDirectionX *
              Math.sin(timeScale + this.pulseOffset),
          );
          this.rotate(
            "y",
            this.rotationSpeedY *
              this.rotationDirectionY *
              Math.cos(timeScale + this.pulseOffset * 0.7),
          );
          this.rotate(
            "z",
            this.rotationSpeedZ *
              this.rotationDirectionZ *
              Math.sin(timeScale * 0.5 + this.pulseOffset * 0.3),
          );

          // Apply orbital movement if character is not at center
          if (!this.isCenter) {
            const orbitT = timeScale + this.orbitPhase;
            const originalPos = new Vector(
              this.pos.originalX,
              this.pos.originalY,
              this.pos.originalZ,
            );

            if (this.orbitAxis === "x") {
              this.pos.y = originalPos.y + Math.sin(orbitT) * this.orbitRadius;
              this.pos.z = originalPos.z + Math.cos(orbitT) * this.orbitRadius;
            } else if (this.orbitAxis === "y") {
              this.pos.x = originalPos.x + Math.sin(orbitT) * this.orbitRadius;
              this.pos.z = originalPos.z + Math.cos(orbitT) * this.orbitRadius;
            } else {
              this.pos.x = originalPos.x + Math.sin(orbitT) * this.orbitRadius;
              this.pos.y = originalPos.y + Math.cos(orbitT) * this.orbitRadius;
            }
          }
        }
      }

      update(progress: number, progress3: number): void {
        // For slide 0, rely on selfRotate (using fixed rotation)
        if (currentSlide === 0) {
          this.selfRotate();
        }
        // For other slides, the selfRotate (if any) is applied in the above branch

        // Update spiral position for slide 3
        this.assignSpiralPosition();

        // Update character appearance based on slide/transition
        if (progress3 > 0) {
          // Slide 3 transition - gradually change to spiral chars
          if (Math.random() < 0.03) {
            if (Math.random() < 0.7) {
              this.letter =
                SPIRAL_CHARS[Math.floor(Math.random() * SPIRAL_CHARS.length)];
              this.colorType = ColorType.SPIRAL;
            } else if (Math.random() < 0.5) {
              this.letter =
                BRIGHT_CHARS[Math.floor(Math.random() * BRIGHT_CHARS.length)];
              this.colorType = ColorType.BRIGHT;
            } else {
              this.letter =
                CRAZY_CHARS[Math.floor(Math.random() * CRAZY_CHARS.length)];
              this.colorType = ColorType.TRANSITION;
            }
          }
        } else if (progress > 0 && progress < 1) {
          if (Math.random() < 0.02) {
            const rnd = Math.random();
            if (rnd < 0.6) {
              this.letter =
                NUMBER_CHARS[Math.floor(Math.random() * NUMBER_CHARS.length)];
              this.colorType = ColorType.NUMBER;
            } else if (rnd < 0.8) {
              this.letter =
                CRAZY_CHARS[Math.floor(Math.random() * CRAZY_CHARS.length)];
              this.colorType = ColorType.TRANSITION;
            } else {
              this.letter =
                MAIN_CHARS[Math.floor(Math.random() * MAIN_CHARS.length)];
              this.colorType = this.getColorType(this.letter);
            }
          }
        } else if (progress >= 1) {
          if (Math.random() < 0.05) {
            if (Math.random() < 0.8) {
              this.letter =
                NUMBER_CHARS[Math.floor(Math.random() * NUMBER_CHARS.length)];
              this.colorType = ColorType.NUMBER;
            } else {
              this.letter =
                CRAZY_CHARS[Math.floor(Math.random() * CRAZY_CHARS.length)];
              this.colorType = ColorType.TRANSITION;
            }
          }
        } else {
          if (Math.random() < 0.002) {
            const rnd = Math.random();
            if (rnd < 0.3) {
              this.letter =
                BRIGHT_CHARS[Math.floor(Math.random() * BRIGHT_CHARS.length)];
              this.colorType = ColorType.BRIGHT;
            } else {
              this.letter =
                MAIN_CHARS[Math.floor(Math.random() * MAIN_CHARS.length)];
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

        let MAX_SIZE = 60;
        let SIZE = ((1 / PIXEL[2]) * MAX_SIZE) | 0;

        if (transitionProgress > 0.8 && transition3Progress < 0.2) {
          const blendFactor = (transitionProgress - 0.8) * 5;
          const uniformSize = Math.min(ww / GRID_COLS, wh / GRID_ROWS) * 0.4;
          SIZE = SIZE * (1 - blendFactor) + uniformSize * blendFactor;
        }

        if (transition3Progress > 0.5) {
          const distFactor = Math.sqrt(
            Math.pow(this.pos.x, 2) +
              Math.pow(this.pos.y, 2) +
              Math.pow(this.pos.z, 2),
          );
          SIZE = SIZE * (1 - 0.3 * distFactor);
        }

        let BRIGHTNESS = SIZE / MAX_SIZE;

        if (this.colorType === ColorType.BRIGHT || this.isCenter) {
          BRIGHTNESS *= 0.8 + 0.2 * Math.sin(time * 0.05 + this.pulseOffset);
        }

        if (
          currentSlide === 0 &&
          transitionProgress === 0 &&
          transition3Progress === 0
        ) {
          const depthFactor = 1 + (this.pos.z / SEPARATION) * 0.3;
          BRIGHTNESS *= depthFactor;
          if (this.pos.z > 0) {
            BRIGHTNESS *= 1.2;
          }
        }

        if (transitionProgress > 0.8 && transition3Progress < 0.2) {
          const distFromCenter = Math.sqrt(
            Math.pow(this.colIndex - GRID_COLS / 2, 2) +
              Math.pow(this.rowIndex - GRID_ROWS / 2, 2),
          );
          const waveEffect = Math.sin(time * 0.05 - distFromCenter * 0.3);
          BRIGHTNESS *= 0.7 + 0.3 * (0.5 + waveEffect * 0.5);
        }

        if (transition3Progress > 0.2) {
          const spiralPulse = Math.sin(time * 0.03 + this.spiralAngle * 3);
          BRIGHTNESS *= 0.7 + 0.3 * (0.5 + spiralPulse * 0.5);
        }

        BRIGHTNESS = Math.max(BRIGHTNESS, 0.1);

        let colorStr = COLOR_MAP[this.colorType];
        colorStr = colorStr.replace("$opacity", BRIGHTNESS.toFixed(2));

        ctx.beginPath();
        ctx.fillStyle = colorStr;
        ctx.font = SIZE + "px monospace";
        ctx.fillText(this.letter, XP, YP);
        ctx.fill();
        ctx.closePath();
      }
    }

    // Updated getCenter so that slide 0 uses the canvas center (as in the standalone effect)
    function getCenter(): [number, number] {
      if (currentSlide === 0) {
        return [ww / 2, wh / 2];
      } else if (transitionProgress >= 0.5 || currentSlide > 0) {
        return [ww / 2, wh / 2];
      } else {
        const rightPos = ww * 0.7;
        const centerPos = ww / 2;
        const interpolatedX =
          rightPos * (1 - transitionProgress) + centerPos * transitionProgress;
        return [interpolatedX, wh / 2];
      }
    }

    function signedRandom(): number {
      return Math.random() - Math.random();
    }

    function renderAll(): void {
      // Sort characters by z-position for proper depth rendering
      CHARS.sort((a, b) => {
        const aPos = a.pos.project();
        const bPos = b.pos.project();
        return bPos[2] - aPos[2]; // render far-to-near
      });

      for (let i = 0; i < CHARS.length; i++) {
        CHARS[i].render();
      }
    }

    function update(): void {
      ctx.clearRect(0, 0, ww, wh);
      // For a solid black background
      ctx.fillStyle = currentSlide === 0 ? "black" : "rgba(0, 0, 0, 0.98)";
      ctx.fillRect(0, 0, ww, wh);

      // Title text remains unchanged
      ctx.font = "24px sans-serif";
      ctx.fillStyle = "rgba(255, 255, 255, 1)";
      ctx.textAlign = "center";
      ctx.fillText("STARKNET", ww / 2, 40);

      // Handle transition based on slide
      if (currentSlide === 1 && transitionProgress < 1) {
        transitionProgress = Math.min(transitionProgress + TRANSITION_SPEED, 1);
        transition3Progress = 0;
      } else if (currentSlide === 0 && transitionProgress > 0) {
        transitionProgress = Math.max(transitionProgress - TRANSITION_SPEED, 0);
        transition3Progress = 0;
      } else if (currentSlide === 2 && transition3Progress < 1) {
        transition3Progress = Math.min(
          transition3Progress + TRANSITION3_SPEED,
          1,
        );
      } else if (currentSlide !== 2 && transition3Progress > 0) {
        transition3Progress = Math.max(
          transition3Progress - TRANSITION3_SPEED,
          0,
        );
      }

      if (lastSlide !== currentSlide) {
        if (currentSlide === 1) {
          assignGridPositions();
        }
        lastSlide = currentSlide;
      }

      // For non-slide0, apply global rotation
      const globalRotationX = Math.sin(time * 0.0003) * 0.002;
      const globalRotationY = Math.cos(time * 0.0002) * 0.003;
      const globalRotationZ = Math.sin(time * 0.0001) * 0.001;

      for (let i = 0; i < CHARS.length; i++) {
        CHARS[i].pos.updateForTransition(
          transitionProgress,
          transition3Progress,
        );

        // For slide 0, we now rely on selfRotate (with fixed rotation) so we skip global rotation
        if (
          currentSlide !== 0 &&
          transitionProgress < 0.7 &&
          transition3Progress < 0.7
        ) {
          CHARS[i].rotate("x", globalRotationX);
          CHARS[i].rotate("y", globalRotationY);
          CHARS[i].rotate("z", globalRotationZ);
        }

        CHARS[i].update(transitionProgress, transition3Progress);
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
      // Create a denser center cluster for the "earth" effect
      for (let i = 0; i < 20; i++) {
        const angle = (i / 20) * Math.PI * 2;
        const X = Math.cos(angle) * 0.2;
        const Y = Math.sin(angle) * 0.2;
        const Z = Math.random() * 0.1;
        const character = Math.random() < 0.5 ? "◉" : "○";
        const POS = new Vector(X, Y, Z);
        const CHAR = new Char(character, POS);
        CHARS.push(CHAR);
      }

      // Create regular characters
      for (let i = 0; i < MAX_CHARS - 20; i++) {
        const CHARACTER =
          MAIN_CHARS[Math.floor(Math.random() * MAIN_CHARS.length)];
        const X = signedRandom() * SEPARATION;
        const Y = signedRandom() * SEPARATION;
        const Z = signedRandom() * SEPARATION;
        const POS = new Vector(X, Y, Z);
        const CHAR = new Char(CHARACTER, POS);
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
      camera = new Vector(0, 0, SEPARATION + 0.8);
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
