import AsciiArt from "@/components/AsciiArt";

export default function About() {
  return (
    <div className="w-full  flex items-center overflow-auto">
      <div className="w-full px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-semibold mb-8 text-center">
            À Propos de Kasar Labs
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Notre Laboratoire</h2>
              <p className="mb-4">
                Kasar Labs est un laboratoire d'ingénierie et de recherche
                composé de développeurs core Starknet dédiés à résoudre vos
                problèmes de haut et bas niveau.
              </p>
              <p>
                Notre mission est de construire l'infrastructure de la prochaine
                génération de projets Starknet, en fournissant des solutions
                innovantes et robustes pour l'écosystème blockchain.
              </p>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-64 h-64">
                <AsciiArt type="kasar" />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 text-center">
              Notre Équipe
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
              {/* Placeholder pour les membres de l'équipe */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="text-center">
                  <div className="w-32 h-32 mx-auto mb-4 bg-neutral-900 rounded-full flex items-center justify-center">
                    <AsciiArt type="person" small />
                  </div>
                  <h3 className="text-lg font-semibold">Développeur {i}</h3>
                  <p className="text-neutral-400">Core Starknet Developer</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
