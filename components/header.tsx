// components/header.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="w-full z-50 sticky top-0">
      {" "}
      {/* Changed from fixed to sticky */}
      <nav className="h-20 px-4 backdrop-blur-sm md:px-6">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="relative w-15 h-15 rounded-full overflow-hidden"
            >
              <Image
                src="/images/kasarLogoNoBg.png"
                alt="Logo"
                width={60}
                height={60}
                className="object-cover"
              />
            </Link>
          </div>

          {/* Desktop Navigation
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/projects"
              className="text-gray-300 hover:text-white font-calibre-medium text-2xl hover:scale-105 transition-all"
            >
              Projects
            </Link>
            <Link
              href="/about"
              className="text-gray-300 hover:text-white font-calibre-medium text-2xl hover:scale-105 transition-all"
            >
              About
            </Link>
            <Link
              href="/blog"
              className="text-gray-300 hover:text-white font-calibre-medium text-2xl hover:scale-105 transition-all"
            >
              Blog
            </Link>
            <a
              href="https://github.com/kasarlabs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white font-calibre-medium text-2xl hover:scale-105 transition-all"
            >
              GitHub
            </a>
          </div> */}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-300 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 bg-black/100 backdrop-blur-sm py-4 px-6 space-y-4">
            <Link
              href="/projects"
              className="block text-gray-300 hover:text-white font-calibre-medium text-lg hover:bg-black py-2 px-4 rounded-lg transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              Projects
            </Link>
            <Link
              href="/about"
              className="block text-gray-300 hover:text-white font-calibre-medium text-lg hover:bg-black py-2 px-4 rounded-lg transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/blog"
              className="block text-gray-300 hover:text-white font-calibre-medium text-lg hover:bg-black py-2 px-4 rounded-lg transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <a
              href="https://github.com/kasarlabs"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-gray-300 hover:text-white font-calibre-medium text-lg hover:bg-black py-2 px-4 rounded-lg transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              GitHub
            </a>
          </div>
        )}
      </nav>
    </header>
  );
}
