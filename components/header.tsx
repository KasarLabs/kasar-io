"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const _pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="w-full z-50 sticky top-0">
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

          {/* Desktop Dropdown Menu */}
          <div className="hidden md:block relative" ref={dropdownRef}>
            <button
              onMouseEnter={() => setDropdownOpen(true)}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-36 h-12 bg-transparent border border-white rounded-2xl hover:bg-gray-200 transition-all"
              aria-label="Menu"
            ></button>

            {dropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-80 bg-black/90 backdrop-blur-sm rounded-md shadow-lg py-4 z-50"
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <Link
                  href="/projects"
                  className="block px-6 py-3 text-gray-300 hover:text-white hover:bg-black/80 font-calibre-medium text-[40px] text-right transition-all"
                >
                  Projects
                </Link>
                <Link
                  href="/about"
                  className="block px-6 py-3 text-gray-300 hover:text-white hover:bg-black/80 font-calibre-medium text-[40px] text-right transition-all"
                >
                  About
                </Link>
                <Link
                  href="/blog"
                  className="block px-6 py-3 text-gray-300 hover:text-white hover:bg-black/80 font-calibre-medium text-[40px] text-right transition-all"
                >
                  Blog
                </Link>
                <a
                  href="https://github.com/kasarlabs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-6 py-3 text-gray-300 hover:text-white hover:bg-black/80 font-calibre-medium text-[40px] text-right transition-all"
                >
                  GitHub
                </a>
              </div>
            )}
          </div>

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
