const projects = [
  {
    id: 1,
    title: "Sn Stack exploration",
    description:
      "L'exploration de solutions client et blockchain pour la Starknet Stack.",
    asciiArt: "stack",
  },
  {
    id: 2,
    title: "Quaza",
    description: "Une L3 Starknet pour agents et développeurs.",
    asciiArt: "quaza",
  },
  {
    id: 3,
    title: "Snak",
    description: "Le Starknet agent kit framework pour build des agents.",
    asciiArt: "snak",
  },
];

export default function Projects() {
  return (
    <div className="w-full  flex items-center overflow-auto">
      <div className="w-full px-4 py-8">
        <h1 className="text-3xl font-semibold mb-8 text-center">Nos Projets</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <h1 className="text-6xl font-semibold text-center">🔬</h1>
        </div>
      </div>
    </div>
  );
}
