"use client";

import { useEffect, useRef, useState } from "react";

interface AsciiArtProps {
  type: "kasar" | "stack" | "quaza" | "snak" | "person";
  small?: boolean;
}

export default function AsciiArt({ type, small = false }: AsciiArtProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    // Fade in effect
    setOpacity(0);
    const fadeIn = setTimeout(() => setOpacity(1), 100);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set text properties
    ctx.font = small ? "8px monospace" : "12px monospace";
    ctx.fillStyle = "white";

    // Generate ASCII art based on type
    let asciiArt = "";

    switch (type) {
      case "kasar":
        asciiArt = generateKasarAscii();
        break;
      case "stack":
        asciiArt = generateStackAscii();
        break;
      case "quaza":
        asciiArt = generateQuazaAscii();
        break;
      case "snak":
        asciiArt = generateSnakAscii();
        break;
      case "person":
        asciiArt = generatePersonAscii();
        break;
      default:
        asciiArt = generateKasarAscii();
    }

    // Draw ASCII art
    const lines = asciiArt.split("\n");
    const lineHeight = small ? 8 : 12;

    lines.forEach((line, i) => {
      ctx.fillText(line, 10, (i + 1) * lineHeight);
    });

    // Animation frame for future implementation
    let frame = 0;
    const animate = () => {
      frame++;

      // Simple animation: subtle pulsing effect
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Subtle scale effect
      const scale = 1 + Math.sin(frame * 0.02) * 0.03;
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.scale(scale, scale);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);

      // Redraw with animation
      lines.forEach((line, i) => {
        ctx.fillStyle = "white";
        ctx.fillText(line, 10, (i + 1) * lineHeight);
      });

      ctx.restore();
      requestAnimationFrame(animate);
    };

    // Start animation
    const animationId = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      clearTimeout(fadeIn);
      cancelAnimationFrame(animationId);
    };
  }, [type, small]);

  return (
    <canvas
      ref={canvasRef}
      width={small ? 100 : 300}
      height={small ? 100 : 300}
      className="w-full h-full transition-opacity duration-800"
      style={{ opacity }}
    />
  );
}

// ASCII art generators remain the same
function generateKasarAscii() {
  return `
  ██╗  ██╗ █████╗ ███████╗ █████╗ ██████╗
  ██║ ██╔╝██╔══██╗██╔════╝██╔══██╗██╔══██╗
  █████╔╝ ███████║███████╗███████║██████╔╝
  ██╔═██╗ ██╔══██║╚════██║██╔══██║██╔══██╗
  ██║  ██╗██║  ██║███████║██║  ██║██║  ██║
  ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝
  `;
}

function generateStackAscii() {
  return `
  ███████╗████████╗ █████╗  ██████╗██╗  ██╗
  ██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
  ███████╗   ██║   ███████║██║     █████╔╝
  ╚════██║   ██║   ██╔══██║██║     ██╔═██╗
  ███████║   ██║   ██║  ██║╚██████╗██║  ██╗
  ╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝
  `;
}

function generateQuazaAscii() {
  return `
   ██████╗ ██╗   ██╗ █████╗ ███████╗ █████╗
  ██╔═══██╗██║   ██║██╔══██╗╚══███╔╝██╔══██╗
  ██║   ██║██║   ██║███████║  ███╔╝ ███████║
  ██║▄▄ ██║██║   ██║██╔══██║ ███╔╝  ██╔══██║
  ╚██████╔╝╚██████╔╝██║  ██║███████╗██║  ██║
   ╚══▀▀═╝  ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝
  `;
}

function generateSnakAscii() {
  return `
  ███████╗███╗   ██╗ █████╗ ██╗  ██╗
  ██╔════╝████╗  ██║██╔══██╗██║ ██╔╝
  ███████╗██╔██╗ ██║███████║█████╔╝
  ╚════██║██║╚██╗██║██╔══██║██╔═██╗
  ███████║██║ ╚████║██║  ██║██║  ██╗
  ╚══════╝╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝  ╚═╝
  `;
}

function generatePersonAscii() {
  return `
    .--.
   |o_o |
   |:_/ |
  //   \\ \\
 (|     | )
 /'\\_   _/\`\\
 \\___)=(___/
  `;
}
