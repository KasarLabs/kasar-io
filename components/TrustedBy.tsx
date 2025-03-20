"use client";

import Link from "next/link";

export default function TrustedBy() {
  // Array of trusted partners with their names and URLs
  const trustedPartners = [
    { name: "Starkware", url: "https://starkware.co/" },
    { name: "Starknet Foundation", url: "https://starknet.io/" },
    { name: "Nethermind", url: "https://nethermind.io/" },
    { name: "Informal Systems", url: "https://informal.systems/" },
    { name: "Equilibrium Labs", url: "https://equilibrium.co/" },
    { name: "Taproot Wizards", url: "https://taprootwizards.com/" },
    { name: "Topology", url: "https://topology.gg" },
    // Add more partners as needed
  ];

  return (
    <div className="w-full bg-black px-6 md:px-12 lg:px-16 py-24 min-h-screen flex items-center justify-center">
      <div className="max-w-7xl mx-auto">
        <h2
          className="text-white font-bold leading-tight text-left"
          style={{ fontSize: "4.8rem" }}
        >
          Our team is trusted by{" "}
          {trustedPartners.map((partner, index) => (
            <span key={partner.name}>
              <Link
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="border-b-4 border-white hover:opacity-80 transition-opacity"
              >
                {partner.name}
              </Link>
              {index < trustedPartners.length - 2 ? ", " : ", "}
            </span>
          ))}{" "}
          etc
        </h2>
      </div>
    </div>
  );
}
