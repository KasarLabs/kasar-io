import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Combine les classes avec tailwind-merge
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Formate une date au format français
export function formatDate(dateString: string): string {
  const date = new Date(dateString);

  // Options pour le format français
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  return date.toLocaleDateString("fr-FR", options);
}

// Tronque un texte s'il dépasse une longueur maximale
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

// Génère des couleurs aléatoires cohérentes basées sur une chaîne
export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).slice(-2);
  }

  return color;
}
