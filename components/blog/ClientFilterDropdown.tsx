"use client";

import { useState } from "react";
import Link from "next/link";

export default function ClientFilterDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const tags = ["All", "Snak", "Quaza", "Madara", "Sn Stack", "Stories"];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2 text-white bg-gray-800 rounded-lg"
      >
        <span>Filtrer par catégorie</span>
        <svg
          className={`w-5 h-5 transition-transform ${isOpen ? "transform rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-gray-800 rounded-lg shadow-lg py-1">
          {tags.map((tag) => (
            <Link
              key={tag}
              href={tag === "All" ? "/blog" : `/blog?tag=${tag}`}
              className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              {tag}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
