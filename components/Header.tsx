"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  // Fonction pour basculer le menu mobile
  const toggleMobileMenu = () => {
    setMobileMenuOpen((prevState) => !prevState);
    // Log pour le débogage
    console.log("Menu mobile toggled:", !mobileMenuOpen);
  };

  // Handle clicking outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }

      // Fermer le menu mobile si on clique en dehors des liens ET du bouton
      if (
        mobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Effet pour gérer le scroll lorsque le menu mobile est ouvert
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      console.log("Menu is open, overflow hidden");
    } else {
      document.body.style.overflow = "auto";
      console.log("Menu is closed, overflow auto");
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

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

    // Fermer le menu mobile lors d'un changement de page
    setMobileMenuOpen(false);
  }, [pathname]);

  // Effet pour gérer la navigation avec hash lors du chargement de la page
  useEffect(() => {
    // Vérifier si nous sommes sur la page d'accueil et s'il y a un hash dans l'URL
    if (pathname === "/" && window.location.hash) {
      // Attendre que la page soit complètement chargée
      setTimeout(() => {
        const targetId = window.location.hash.substring(1); // Enlève le # du début
        const targetElement =
          document.getElementById(targetId) ||
          document.querySelector(`[class*="${targetId}"]`) ||
          document.querySelector(`[data-slide-id="1"]`) ||
          document.querySelector(`[data-ascii-state="1"]`);

        if (targetElement) {
          const headerHeight = 80;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.scrollY - headerHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      }, 500); // Délai pour s'assurer que tous les éléments sont chargés
    }
  }, [pathname]);

  // Fonction pour faire défiler vers la section des projets
  const scrollToProjects = (e: React.MouseEvent) => {
    e.preventDefault();

    // Vérifier si nous sommes sur la page d'accueil
    if (pathname !== "/") {
      // Si nous ne sommes pas sur la page d'accueil, rediriger vers la page d'accueil avec un indicateur pour le scroll
      window.location.href = "/#projects-slider";
      return;
    }

    // Le reste de la fonction reste identique pour la page d'accueil
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

  // Log pour le rendu
  console.log("Rendering header, mobileMenuOpen:", mobileMenuOpen);

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
                src="/images/KasarLogoNoBg.png"
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
            ref={toggleButtonRef}
            className="md:hidden w-12 h-12 bg-transparent border border-white border-2 rounded-2xl transition-all hover:bg-gray-200"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          ></button>
        </div>

        {/* Mobile Menu - Full Screen */}
        <div
          className={`fixed inset-0 top-20 left-0 right-0 bottom-0 w-full h-[calc(100vh-80px)] z-[9999] transition-all duration-300 md:hidden ${
            mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
          style={{ backgroundColor: "rgba(0, 0, 0, 0.95)" }}
        >
          <div className="h-full flex flex-col items-end justify-between py-16 px-8">
            <a
              href="#projects-slider"
              onClick={scrollToProjects}
              className="text-white font-calibre-medium text-[56px] font-bold mr-4 px-4 py-2 hover:bg-black hover:bg-opacity-50 rounded"
            >
              Projects
            </a>
            <Link
              href="/about"
              className="text-white font-calibre-medium text-[56px] font-bold mr-4 px-4 py-2 hover:bg-black hover:bg-opacity-50 rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/blog"
              className="text-white font-calibre-medium text-[56px] font-bold mr-4 px-4 py-2 hover:bg-black hover:bg-opacity-50 rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <a
              href="https://github.com/kasarlabs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white font-calibre-medium text-[56px] font-bold mr-4 px-4 py-2 hover:bg-black hover:bg-opacity-50 rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              GitHub
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
