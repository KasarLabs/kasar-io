"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

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

  // Comportement amélioré pour la navigation
  useEffect(() => {
    // Réinitialiser le scroll et effacer les styles qui pourraient persister
    const resetPageState = () => {
      window.scrollTo(0, 0);

      // Si nous quittons la page d'accueil, supprimons tout style inline potentiellement ajouté
      if (pathname !== "/") {
        // Assurer que les éléments des pages de contenu sont correctement affichés
        document.body.style.overflow = "auto";

        // Supprimer tous les spacers qui auraient pu être ajoutés par la page d'accueil
        const spacer = document.getElementById("scroll-spacer");
        if (spacer) spacer.remove();

        // Forcer une réinitialisation du DOM après la navigation
        setTimeout(() => {
          const contentPage = document.querySelector(".content-page");
          if (contentPage) {
            contentPage.classList.add("force-reset");
            setTimeout(() => contentPage.classList.remove("force-reset"), 50);
          }
        }, 0);
      }
    };

    resetPageState();
  }, [pathname]);

  // Fonction pour faire défiler vers la section des projets
  const scrollToProjects = (e: React.MouseEvent) => {
    e.preventDefault();

    // Ajoutons un ID au composant ProjectsSlider
    const projectsSlider =
      document.querySelector('[class*="ProjectsSlider"]') ||
      document.getElementById("projects-slider");

    if (projectsSlider) {
      // Défilement avec un petit décalage pour tenir compte de la hauteur du header
      const headerHeight = 80; // Hauteur approximative du header en pixels
      const elementPosition = projectsSlider.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    } else {
      // Si nous ne trouvons pas le slider directement, essayons de trouver le premier slide
      const firstSlide =
        document.querySelector('[data-slide-id="1"]') ||
        document.querySelector('[data-ascii-state="1"]');

      if (firstSlide) {
        const offsetPosition =
          firstSlide.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      } else {
        // Fallback: essayons de trouver le conteneur du slider par son contenu
        const allElements = document.querySelectorAll("div, section");
        for (let i = 0; i < allElements.length; i++) {
          const element = allElements[i];
          if (
            element.textContent?.includes("SN Stack") &&
            element.textContent?.includes("Madara")
          ) {
            const offsetPosition =
              element.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth",
            });
            break;
          }
        }
      }
    }

    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

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
              className={`w-36 h-12 bg-transparent border border-white border-2 rounded-2xl transition-all ${
                dropdownOpen ? "bg-white" : "hover:bg-gray-200"
              }`}
              aria-label="Menu"
            ></button>

            {dropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-80 backdrop-blur-sm rounded-md py-4 z-50"
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <a
                  href="#projects-slider"
                  onClick={scrollToProjects}
                  className="block px-6 py-3 text-gray-300 hover:text-white font-calibre-medium text-[40px] text-right transition-all font-bold"
                >
                  Projects
                </a>
                <Link
                  href="/about"
                  className="block px-6 py-3 text-gray-300 hover:text-white font-calibre-medium text-[40px] text-right transition-all font-bold"
                >
                  About
                </Link>
                <Link
                  href="/blog"
                  className="block px-6 py-3 text-gray-300 hover:text-white font-calibre-medium text-[40px] text-right transition-all font-bold"
                >
                  Blog
                </Link>
                <a
                  href="https://github.com/kasarlabs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-6 py-3 text-gray-300 hover:text-white font-calibre-medium text-[40px] text-right transition-all font-bold"
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
          <div className="md:hidden absolute top-20 left-0 right-0 backdrop-blur-sm py-4 px-6 space-y-4">
            <a
              href="#projects-slider"
              onClick={scrollToProjects}
              className="block text-gray-300 hover:text-white font-calibre-medium text-lg hover:bg-black py-2 px-4 rounded-lg transition-all font-bold"
            >
              Projects
            </a>
            <Link
              href="/about"
              className="block text-gray-300 hover:text-white font-calibre-medium text-lg hover:bg-black py-2 px-4 rounded-lg transition-all font-bold"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/blog"
              className="block text-gray-300 hover:text-white font-calibre-medium text-lg hover:bg-black py-2 px-4 rounded-lg transition-all font-bold"
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <a
              href="https://github.com/kasarlabs"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-gray-300 hover:text-white font-calibre-medium text-lg hover:bg-black py-2 px-4 rounded-lg transition-all font-bold"
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
