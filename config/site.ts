// config/site.ts
// ✏️  Configuration globale de l'application

export const siteConfig = {
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",

  // ─── NAVIGATION ─────────────────────────────────────────────
  nav: [
    { label: "Trouver un guide", href: "/search" },
    { label: "Comment ça marche", href: "/#how-it-works" },
    { label: "Devenir guide", href: "/auth/register?role=guide" },
  ],

  // ─── COMMISSION PLATEFORME ──────────────────────────────────
  commissionRate: 0.20, // 20%

  // ─── STRIPE ─────────────────────────────────────────────────
  currency: "mad",
  currencySymbol: "MAD",

  // ─── VILLES MAROC ───────────────────────────────────────────
  moroccanCities: [
    "Marrakech",
    "Fès",
    "Casablanca",
    "Rabat",
    "Tanger",
    "Agadir",
    "Essaouira",
    "Chefchaouen",
    "Meknès",
    "Ouarzazate",
    "Merzouga",
    "Taroudant",
    "Tétouan",
    "Safi",
    "El Jadida",
  ],

  // ─── LANGUES DISPONIBLES ────────────────────────────────────
  languages: [
    "Arabe",
    "Français",
    "Anglais",
    "Espagnol",
    "Allemand",
    "Italien",
    "Portugais",
    "Néerlandais",
    "Russe",
    "Chinois",
    "Japonais",
    "Darija",
    "Tamazight",
  ],

  // ─── DURÉES ─────────────────────────────────────────────────
  durations: {
    HALF_DAY: { label: "Demi-journée (4h)", hours: 4 },
    FULL_DAY:  { label: "Journée complète (8h)", hours: 8 },
  },
};
