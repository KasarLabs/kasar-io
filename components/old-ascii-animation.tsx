"use client";

import { useEffect, useRef } from "react";

export default function AsciiAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let ww: number, wh: number, camera: Vector;
    const CHARS: Char[] = [];
    const MAX_CHARS = 300; // Increased number of characters
    const SEPARATION = 1.5; // Increased separation for a wider spread
    let time = 0;

    // More diverse and crazy ASCII characters
    const CRAZY_CHARS = [
      "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "+",
      "=", "{", "}", "[", "]", "|", "\\", ":", ";", "\"", "'", "<",
      ">", "?", "/", "~", "", "±", "§", "Δ", "Σ", "Ω", "£", "¢",
      "¥", "Γ", "Λ", "Θ", "Ξ", "Π", "Φ", "Ψ"
    ];

    class Vector {
      x: number;
      y: number;
      z: number;
      constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
      }
      rotate(dir: "x" | "y", ang: number) {
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
      constructor(letter: string, pos: Vector) {
        this.letter = letter;
        this.pos = pos;
      }
      rotate(dir: "x" | "y", ang: number) {
        this.pos.rotate(dir, ang);
      }
      render() {
        const PIXEL = this.pos.project();
        const XP = PIXEL[0];
        const YP = PIXEL[1];
        const MAX_SIZE = 70; // Increased max size for larger characters
        const SIZE = (1 / PIXEL[2] * MAX_SIZE) | 0;
        const BRIGHTNESS = SIZE / MAX_SIZE;
        
        // Using only black and white with opacity for depth
        const COL = rgba(255, 255, 255, ${BRIGHTNESS});
        
        ctx.beginPath();
        ctx.fillStyle = COL;
        ctx.font = SIZE + "px monospace";
        ctx.fillText(this.letter, XP, YP);
        ctx.fill();
        ctx.closePath();
      }
    }

    function getCenter() {
      return [ww / 2, wh / 2];
    }

    function signedRandom() {
      return Math.random() - Math.random();
    }

    function renderAll() {
      for (let i = 0; i < CHARS.length; i++) {
        CHARS[i].render();
      }
    }

    function update() {
      ctx.clearRect(0, 0, ww, wh);
      ctx.fillStyle = "black"; // Set background to black
      ctx.fillRect(0, 0, ww, wh);
      
      for (let i = 0; i < CHARS.length; i++) {
        const DX = 0.006 * Math.sin(time * 0.001); // Slightly increased rotation speed
        const DY = 0.006 * Math.cos(time * 0.001);
        CHARS[i].rotate("x", DX);
        CHARS[i].rotate("y", DY);
      }
      time++;
    }

    function loop() {
      window.requestAnimationFrame(loop);
      update();
      renderAll();
    }

    function createChars() {
      for (let i = 0; i < MAX_CHARS; i++) {
        // Use the crazy characters array
        const CHARACTER = CRAZY_CHARS[Math.floor(Math.random() * CRAZY_CHARS.length)];
        const X = signedRandom() * SEPARATION;
        const Y = signedRandom() * SEPARATION;
        const Z = signedRandom() * SEPARATION;
        const POS = new Vector(X, Y, Z);
        const CHAR = new Char(CHARACTER, POS);
        CHARS.push(CHAR);
      }
    }

    function setDim() {
      // Make the canvas fill its container completely
      ww = canvas.clientWidth;
      wh = canvas.clientHeight;
      canvas.width = ww * window.devicePixelRatio;
      canvas.height = wh * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    function initCamera() {
      camera = new Vector(0, 0, SEPARATION + 0.8); // Adjusted camera position to bring elements closer
    }

    setDim();
    initCamera();
    createChars();
    loop();

    window.addEventListener("resize", setDim);
    return () => {
      window.removeEventListener("resize", setDim);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "100%",
        display: "block", // Removes any default spacing
        background: "black", // Ensures black background
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    />
  );
}