// Ce fichier est utilisé pour précharger les icônes React et éviter les problèmes de chargement asynchrone
import { BsTelegram, BsTwitter, BsGithub } from "react-icons/bs";

// Force l'importation de toutes les icônes utilisées dans l'application
export const IconsRegistry = {
  BsTelegram,
  BsTwitter,
  BsGithub,
};

// Fonction utilitaire pour utiliser les icônes
export const useIcon = (name: keyof typeof IconsRegistry) => {
  return IconsRegistry[name];
};
