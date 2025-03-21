import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Kasar Labs",
  description: "An engineering and research laboratory of Starknet core devs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="h-full">
      <body
        className={`${inter.className} bg-black text-white flex flex-col min-h-screen`}
      >
        {/* Script pour réinitialiser les effets de la page home quand on navigue vers d'autres pages */}
        <Script id="navigation-reset">
          {`
            // Vérifier si nous sommes sur une page autre que la home
            if (window.location.pathname !== "/" && window.location.pathname !== "") {
              // Réinitialiser les styles et le scroll
              document.documentElement.style.scrollBehavior = 'auto';
              window.scrollTo(0, 0);
              
              // Supprimer tout spacer qui pourrait avoir été ajouté par la home
              setTimeout(() => {
                const spacer = document.getElementById('scroll-spacer');
                if (spacer) spacer.remove();
                
                // Forcer le repositionnement des éléments principaux
                document.body.style.overflow = 'auto';
                const mainElem = document.querySelector('main');
                if (mainElem) {
                  mainElem.style.marginTop = '0';
                  mainElem.style.paddingTop = '0';
                  mainElem.style.position = 'relative';
                  mainElem.style.transform = 'none';
                }
              }, 0);
            }
          `}
        </Script>
        <Header />
        <main className="flex-grow w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
