import React from "react";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "À propos de nous",
  description: "Notre mission et notre équipe",
};

interface TeamMemberProps {
  name: string;
  role: string;
  image: string;
}

const TeamMember: React.FC<TeamMemberProps> = ({ name, role, image }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-40 rounded-full overflow-hidden mb-4">
        <Image src={image} alt={name} fill className="object-cover" />
      </div>
      <h3 className="text-xl font-bold">{name}</h3>
      <p className="text-gray-600">{role}</p>
    </div>
  );
};

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Jean Dupont",
      role: "CEO & Fondateur",
      image: "/team/member1.jpg",
    },
    {
      name: "Marie Martin",
      role: "Directrice Technique",
      image: "/team/member2.jpg",
    },
    {
      name: "Pierre Lefebvre",
      role: "Responsable Marketing",
      image: "/team/member3.jpg",
    },
    {
      name: "Sophie Dubois",
      role: "Designer UX/UI",
      image: "/team/member4.jpg",
    },
    {
      name: "Thomas Moreau",
      role: "Ingénieur IA",
      image: "/team/member5.jpg",
    },
    {
      name: "Camille Bernard",
      role: "Développeuse Full-Stack",
      image: "/team/member6.jpg",
    },
    {
      name: "Alexandre Petit",
      role: "Responsable Produit",
      image: "/team/member7.jpg",
    },
  ];

  return (
    <main className="container mx-auto px-4 py-16 max-w-3xl">
      <section className="mb-16">
        <h1 className="text-4xl font-bold mb-6">About us</h1>
        <p className="text-lg text-gray-600 mb-4">
          Mise à jour : Nous avons levé 10M€ auprès de BPI France, Kima Ventures
          et Eurazeo.{" "}
          <a href="/news" className="underline">
            En savoir plus
          </a>
          .
        </p>
        <p className="text-2xl font-medium mb-10">
          L&apos;innovation numérique est à portée de main.
        </p>

        <div className="space-y-6 text-lg">
          <p className="font-light">
            Créer des solutions numériques innovantes est le défi technique le
            plus important de notre époque.
          </p>

          <p className="font-light">
            Nous avons fondé le premier laboratoire dédié exclusivement à
            l&apos;innovation numérique, avec un seul objectif et un seul
            produit : des expériences utilisateur exceptionnelles.
          </p>

          <p className="font-light">
            C&apos;est notre mission, notre nom et notre feuille de route
            complète, car c&apos;est notre unique objectif. Notre équipe, nos
            investisseurs et notre modèle économique sont tous alignés pour y
            parvenir.
          </p>

          <p className="font-light">
            Nous abordons la qualité et les fonctionnalités ensemble, comme des
            problèmes techniques à résoudre par des percées scientifiques et
            d&apos;ingénierie révolutionnaires. Nous prévoyons d&apos;avancer
            aussi rapidement que possible tout en nous assurant que la qualité
            reste toujours notre priorité.
          </p>

          <p className="font-light">Ainsi, nous pouvons évoluer sereinement.</p>

          <p className="font-light">
            Notre concentration unique signifie aucune distraction par la
            gestion ou les cycles de produits, et notre modèle d&apos;affaires
            garantit que la qualité, la sécurité et le progrès sont tous
            protégés des pressions commerciales à court terme.
          </p>

          <p className="font-light">
            Nous sommes une entreprise française avec des bureaux à Paris et
            Lyon, où nous avons des racines profondes et la capacité de recruter
            les meilleurs talents techniques.
          </p>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Notre équipe</h2>
        <p className="text-lg mb-10">
          Nous réunissons une équipe agile et talentueuse des meilleurs
          ingénieurs et chercheurs dédiés à se concentrer sur l&apos;innovation
          numérique et rien d&apos;autre.
        </p>
        <p className="text-lg mb-10">
          Si c&apos;est vous, nous offrons l&apos;opportunité de réaliser
          l&apos;œuvre de votre vie et d&apos;aider à résoudre le défi technique
          le plus important de notre époque.
        </p>
        <p className="text-lg mb-12">C&apos;est maintenant. Rejoignez-nous.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <TeamMember
              key={index}
              name={member.name}
              role={member.role}
              image={member.image}
            />
          ))}
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
