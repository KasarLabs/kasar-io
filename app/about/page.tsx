"use client";

import React from "react";
import Image from "next/image";
import ScrollToTopButton from "@/components/ScrollToTopButton";

interface TeamMemberProps {
  name: string;
  role: string;
  image: string;
  github?: string;
}

const TeamMember: React.FC<TeamMemberProps> = ({
  name,
  role,
  image,
  github,
}) => {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32 rounded-full overflow-hidden mb-3">
        <Image src={image} alt={name} fill className="object-cover" />
      </div>
      <h3 className="text-base font-bold">{name}</h3>
      <p className="text-gray-600 text-sm">{role}</p>
      {github && (
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-500 mt-1"
        >
          GitHub
        </a>
      )}
    </div>
  );
};

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Antiyro",
      role: "CEO & Founder",
      image: "https://github.com/antiyro.png",
      github: "https://github.com/antiyro",
    },
    {
      name: "jbcaron",
      role: "DevOps",
      image: "https://github.com/jbcaron.png",
      github: "https://github.com/jbcaron",
    },
    {
      name: "cchudant",
      role: "Rust Engineer",
      image: "https://github.com/cchudant.png",
      github: "https://github.com/cchudant",
    },
    {
      name: "Trantorian1",
      role: "Rust Engineer",
      image: "https://github.com/trantorian1.png",
      github: "https://github.com/trantorian1",
    },
    {
      name: "0xhijo",
      role: "LLM Engineer",
      image: "https://github.com/0xhijo.png",
      github: "https://github.com/0xhijo",
    },
    {
      name: "minhanhld",
      role: "LLM Engineer",
      image: "https://github.com/minhanhld.png",
      github: "https://github.com/minhanhld",
    },
    {
      name: "ale-sain",
      role: "Smart Contract Dev",
      image: "https://github.com/ale-sain.png",
      github: "https://github.com/ale-sain",
    },
    {
      name: "Tbelleng",
      role: "Full Stack Engineer",
      image: "https://github.com/Tbelleng.png",
      github: "https://github.com/Tbelleng",
    },
    {
      name: "lucienfer",
      role: "Full Stack Engineer",
      image: "https://github.com/lucienfer.png",
      github: "https://github.com/lucienfer",
    },
    {
      name: "enitrat",
      role: "Cairo Advisor",
      image: "https://github.com/enitrat.png",
      github: "https://github.com/enitrat",
    },
  ];

  // Assurer que la page est bien positionnée après le rendu
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      // Réinitialiser la position de défilement
      window.scrollTo(0, 0);

      // Forcer un repositionnement de la page
      document.documentElement.style.scrollBehavior = "auto";

      // Corriger le positionnement du contenu
      const mainElement = document.querySelector("main");
      if (mainElement) {
        mainElement.style.position = "relative";
        mainElement.style.top = "0";
        mainElement.style.marginTop = "0";
      }
    }
  }, []);

  return (
    <main
      className="container mx-auto px-4 py-16 max-w-3xl flex-grow content-page"
      style={{ marginTop: 0, paddingTop: "2.5rem" }}
    >
      <ScrollToTopButton />
      <section className="mb-16 mt-16">
        <h1 className="text-4xl font-bold mb-6">Kasar Labs</h1>
        <p className="text-lg text-gray-600 mb-4">
          Founded in 2021, by a team of Starknet Core developers.
        </p>
        <p className="text-2xl font-medium mb-10">
          An Engineering & Research Laboratory
        </p>

        <div className="space-y-6 text-lg">
          <p className="font-light">
            At Kasar Labs, we specialize in low-level development for
            distributed systems, with a particular focus on blockchain
            technology. We've built a reputation for developing powerful,
            secure, and user-friendly infrastructure.
          </p>

          <p className="font-light">
            Our expertise spans Zero-Knowledge Proofs & Cryptography, Cairo
            language & provable execution environments, blockchain core
            development, and Rust-based systems engineering. This profound
            understanding of Rust enables us to develop high-quality
            infrastructure for our solutions.
          </p>

          <p className="font-light">
            As a young, globally distributed team, we approach complex
            challenges with fearlessness and cutting-edge knowledge. We believe
            in building elegant, minimalist solutions that prioritize security
            without compromising usability and developer experience.
          </p>

          <p className="font-light">
            We collaborate with industry leaders including Starkware, Nethermind
            or Informal Systems, bringing our low-level expertise to high-impact
            projects across the blockchain ecosystem.
          </p>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Our Team</h2>
        <p className="text-lg mb-10">
          We're continuously seeking talented developers and researchers who
          share our passion for low-level systems, ZK technology, and provable
          computation.
        </p>
        <p className="text-lg mb-10">
          Our team values technical excellence, innovation, and the courage to
          tackle the hardest problems in distributed systems.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <TeamMember
              key={index}
              name={member.name}
              role={member.role}
              image={member.image}
              github={member.github}
            />
          ))}
        </div>
      </section>

      <section className="mb-16 text-center">
        <h2 className="text-3xl font-bold mb-8">Join Our Team!</h2>
        <p className="text-lg mb-10">
          We are looking for exceptional talents in Rust engineering,
          Zero-Knowledge systems, and distributed systems architecture.
        </p>
        <div className="flex justify-center">
          <a
            href="https://t.me/kasarlabs"
            className="inline-flex items-center px-6 py-3 rounded-2xl bg-transparent border border-white text-white font-medium transition-all hover:bg-white hover:bg-opacity-5 hover:scale-105 text-sm"
          >
            Contact Us
          </a>
        </div>
      </section>

      {/* Footer commenté pour plus tard
      <footer className="text-center text-gray-500 mt-20">
        <p></p>
      </footer>
      */}
    </main>
  );
}
