"use client";

import React, { useState, useEffect, useRef } from "react";

const NetworkAsciiArt = ({
  isActive,
  transitionTo,
  transitionFrom,
  transitionDirection,
}) => {
  const [frame, setFrame] = useState(0);
  const [grid, setGrid] = useState([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionProgress, setTransitionProgress] = useState(0);
  const transitionRef = useRef(null);
  const transitionTimerRef = useRef(null);

  // Configuration
  const width = 100;
  const height = 35;
  const nodeCount = 35; // Reduced number of nodes for more spacing
  const connectionDensity = 0.2; // Reduced density for fewer connections

  // Characters for different intensities
  const nodeChars = ["*", "★", "✧", "✦", "◉", "●", "◎", "◆"];
  const connectionChars = ["·", "∙", "⋅", "╱", "╲", "╳", "+"];
  const brightChars = ["✦", "✧", "◆", "◉", "*"];

  // Crazy ASCII characters for transition to 3D
  const crazyChars = [
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

  // Initialize the network nodes
  useEffect(() => {
    // Create an empty grid
    const newGrid = Array(height)
      .fill()
      .map(() => Array(width).fill(" "));

    // Create nodes
    const nodes = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.floor(5 + Math.random() * (width - 10)),
        y: Math.floor(5 + Math.random() * (height - 10)),
        char: nodeChars[Math.floor(Math.random() * nodeChars.length)],
        brightness: Math.random(),
        connections: [],
        pulseOffset: Math.random() * 2 * Math.PI,
        pulseSpeed: 0.05 + Math.random() * 0.1,
      });
    }

    // Create a "central node" representing Earth
    const centerX = Math.floor(width / 2);
    const centerY = Math.floor(height / 2);
    nodes.push({
      x: centerX,
      y: centerY,
      char: "◉",
      brightness: 1,
      connections: [],
      pulseOffset: 0,
      pulseSpeed: 0.02,
      isCenter: true,
    });

    // Surround the center with some characters to simulate Earth
    for (let i = 0; i < 10; i++) {
      const angle = (i / 10) * Math.PI * 2;
      const x = Math.floor(centerX + Math.cos(angle) * 3);
      const y = Math.floor(centerY + Math.sin(angle) * 2);
      if (x >= 0 && x < width && y >= 0 && y < height) {
        newGrid[y][x] = "○";
      }
    }

    // Create connections between nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        // Increase connection probability for the central node
        const centerFactor = nodes[i].isCenter || nodes[j].isCenter ? 3 : 1;
        if (Math.random() < connectionDensity * centerFactor) {
          nodes[i].connections.push(j);
          nodes[j].connections.push(i);
        }
      }
    }

    // Place nodes on the grid
    nodes.forEach((node, idx) => {
      newGrid[node.y][node.x] = node.isCenter ? "◉" : node.char;

      // Draw connections
      node.connections.forEach((connIdx) => {
        if (connIdx > idx) {
          // Avoid duplicates
          const target = nodes[connIdx];
          drawConnection(
            newGrid,
            node.x,
            node.y,
            target.x,
            target.y,
            connectionChars,
          );
        }
      });
    });

    setGrid(newGrid);
  }, []);

  // Function to draw a connection between two points
  const drawConnection = (grid, x1, y1, x2, y2, chars) => {
    // Bresenham's algorithm to trace a line
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const sx = x1 < x2 ? 1 : -1;
    const sy = y1 < y2 ? 1 : -1;
    let err = dx - dy;

    let x = x1;
    let y = y1;

    // To space connection characters
    let skipCounter = 0;
    const skipRate = 2; // Draw a character every X pixels

    while (!(x === x2 && y === y2)) {
      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x += sx;
      }
      if (e2 < dx) {
        err += dx;
        y += sy;
      }

      // Don't draw on nodes
      if ((x !== x1 || y !== y1) && (x !== x2 || y !== y2)) {
        skipCounter++;

        // Only draw a character every skipRate pixels
        if (skipCounter >= skipRate) {
          skipCounter = 0;
          const charIdx = Math.floor(Math.random() * chars.length);
          // Only replace if the cell is empty or already a connection
          if (grid[y][x] === " " || chars.includes(grid[y][x])) {
            grid[y][x] = chars[charIdx];
          }
        }
      }
    }
  };

  // Handle transition between ASCII types
  useEffect(() => {
    if (transitionTo === "3d" && isActive) {
      setIsTransitioning(true);

      // Start transition animation
      let progress = 0;
      const transitionSpeed = 0.02;
      const transitionDuration = 1200; // ms
      const startTime = Date.now();

      // Clear any existing transition timer
      if (transitionTimerRef.current) {
        clearInterval(transitionTimerRef.current);
      }

      const animate = () => {
        const elapsed = Date.now() - startTime;
        progress = Math.min(elapsed / transitionDuration, 1);
        setTransitionProgress(progress);

        // Create transitional grid that gradually replaces network chars with 3D ASCII chars
        const transitionalGrid = JSON.parse(JSON.stringify(grid));

        // As progress increases, replace more characters
        const replaceThreshold = progress * 0.5;

        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            if (
              transitionalGrid[y][x] !== " " &&
              Math.random() < replaceThreshold
            ) {
              // Replace with crazy char
              transitionalGrid[y][x] =
                crazyChars[Math.floor(Math.random() * crazyChars.length)];
            }
          }
        }

        setGrid(transitionalGrid);

        if (progress < 1) {
          transitionRef.current = requestAnimationFrame(animate);
        } else {
          setIsTransitioning(false);
          // Transition complete
          setTransitionProgress(1);
        }
      };

      transitionRef.current = requestAnimationFrame(animate);

      return () => {
        if (transitionRef.current) {
          cancelAnimationFrame(transitionRef.current);
        }
        if (transitionTimerRef.current) {
          clearInterval(transitionTimerRef.current);
        }
      };
    } else if (transitionFrom === "3d" && isActive) {
      // Coming from 3D to network
      setIsTransitioning(true);

      // Start with 3D-like characters
      const startGrid = JSON.parse(JSON.stringify(grid));
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          if (startGrid[y][x] !== " " && Math.random() < 0.5) {
            startGrid[y][x] =
              crazyChars[Math.floor(Math.random() * crazyChars.length)];
          }
        }
      }
      setGrid(startGrid);

      // Gradually transition back to network chars
      let progress = 0;
      const transitionSpeed = 0.02;
      const transitionDuration = 1200; // ms
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        progress = Math.min(elapsed / transitionDuration, 1);
        setTransitionProgress(progress);

        // Create transitional grid
        const transitionalGrid = JSON.parse(JSON.stringify(grid));

        // Replace 3D chars with network chars gradually
        const replaceThreshold = progress * 0.5;

        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            if (
              transitionalGrid[y][x] !== " " &&
              crazyChars.includes(transitionalGrid[y][x]) &&
              Math.random() < replaceThreshold
            ) {
              // Replace with network char
              const possibleChars = [...nodeChars, ...connectionChars];
              transitionalGrid[y][x] =
                possibleChars[Math.floor(Math.random() * possibleChars.length)];
            }
          }
        }

        setGrid(transitionalGrid);

        if (progress < 1) {
          transitionRef.current = requestAnimationFrame(animate);
        } else {
          setIsTransitioning(false);
          // Transition complete
          setTransitionProgress(1);
        }
      };

      transitionRef.current = requestAnimationFrame(animate);

      return () => {
        if (transitionRef.current) {
          cancelAnimationFrame(transitionRef.current);
        }
      };
    }
  }, [transitionTo, transitionFrom, isActive]);

  // Animation for character pulsing
  useEffect(() => {
    const timer = setInterval(() => {
      setFrame((prev) => prev + 1);
    }, 150);
    return () => clearInterval(timer);
  }, []);

  // "Pulse" effect on some characters to simulate brightness
  useEffect(() => {
    if (grid.length === 0 || isTransitioning) return;

    const newGrid = JSON.parse(JSON.stringify(grid));

    // Make some characters pulse randomly
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (grid[y][x] !== " " && Math.random() < 0.1) {
          // Chance to replace with a "bright" character
          if (Math.random() < 0.2) {
            newGrid[y][x] =
              brightChars[Math.floor(Math.random() * brightChars.length)];
          }
          // Or revert to normal connection character
          else if (
            Math.random() < 0.3 &&
            connectionChars.includes(grid[y][x])
          ) {
            newGrid[y][x] =
              connectionChars[
                Math.floor(Math.random() * connectionChars.length)
              ];
          }
        }
      }
    }

    setGrid(newGrid);
  }, [frame, isTransitioning]);

  // Apply CSS classes for colors
  const getCharClass = (char) => {
    if (isTransitioning) {
      // During transition, use special colors
      if (crazyChars.includes(char)) {
        if (transitionTo === "3d") {
          // Transitioning to 3D: use purples and whites
          return "text-purple-300";
        } else {
          // Transitioning from 3D: use greens and cyans
          return "text-green-300";
        }
      }
    }

    // Normal character coloring
    if (char === "◉") return "text-cyan-300";
    if (char === "○") return "text-blue-400";
    if (brightChars.includes(char)) return "text-purple-300";
    if (nodeChars.includes(char)) return "text-purple-400";
    if (connectionChars.includes(char)) return "text-indigo-300";
    if (crazyChars.includes(char)) return "text-green-300"; // Give transition chars a distinct color
    return "";
  };

  // Determine opacity and transition classes
  const getContainerClasses = () => {
    let classes =
      "flex justify-center items-center min-h-screen bg-black p-4 transition-opacity duration-1000 ";

    // Base opacity
    if (!isActive && !isTransitioning) {
      classes += "opacity-0 ";
    } else {
      classes += "opacity-100 ";
    }

    // Transition specific classes
    if (isTransitioning) {
      if (transitionTo === "3d") {
        classes += "transition-3d-to-network ";
      } else if (transitionFrom === "3d") {
        classes += "transition-network-to-3d ";
      }
    }

    if (transitionDirection === "out") {
      classes += "ascii-animation-fade-out ";
    } else if (transitionDirection === "in") {
      classes += "ascii-animation-fade-in ";
    }

    return classes;
  };

  return (
    <div className={getContainerClasses()}>
      <div className="text-center">
        <div className="text-3xl font-bold mb-4 text-white">STARKNET</div>
        <pre className="inline-block text-center bg-black text-blue-200 font-mono">
          {grid.map((row, y) => (
            <div key={y} className="char-transition">
              {row.map((char, x) => (
                <span
                  key={`${x}-${y}`}
                  className={`${getCharClass(char)} char-transition`}
                  style={{
                    transition: isTransitioning
                      ? "color 300ms ease-out"
                      : "none",
                  }}
                >
                  {char}
                </span>
              ))}
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
};

export default NetworkAsciiArt;
