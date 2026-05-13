// content/branding.ts
// ✏️  Modifier ce fichier pour changer l'identité visuelle sans toucher au code

export const branding = {
  // ─── LOGO & NOM ────────────────────────────────────────────
  name: "Laksor",
  tagline: "Découvrez le Maroc authentique avec un guide local",
  description:
    "La marketplace qui connecte voyageurs et guides certifiés à travers tout le Maroc.",

  // ─── COULEURS ───────────────────────────────────────────────
  colors: {
    primary: "#123EAB",    // Bleu Majorelle
    secondary: "#F4C542",  // Jaune Safran
    accent: "#C96B4B",     // Terracotta
    background: "#F8F5F0", // Blanc Sable
  },

  // ─── HERO SECTION ───────────────────────────────────────────
  hero: {
    title: "Vivez le Maroc\ncomme un local",
    subtitle:
      "Des guides passionnés pour vous emmener au cœur de la médina, des souks, du désert et de la culture marocaine.",
    cta: "Trouver mon guide",
    ctaSecondary: "Devenir guide",
    // Remplacer par l'URL de votre image hero
    image: "https://images.unsplash.com/photo-1597211833712-5e41faa202ea?w=1600&q=80",
  },

  // ─── CATÉGORIES HOMEPAGE ────────────────────────────────────
  categories: [
    { id: "HISTOIRE",         label: "Culture & Histoire",   emoji: "🏛️", color: "#123EAB" },
    { id: "CULINAIRE",        label: "Food Tour",            emoji: "🍵", color: "#C96B4B" },
    { id: "SHOPPING",         label: "Shopping Souks",       emoji: "🛍️", color: "#F4C542" },
    { id: "DESERT",           label: "Désert & Aventure",    emoji: "🐪", color: "#C96B4B" },
    { id: "ARTISANAT",        label: "Artisanat",            emoji: "🏺", color: "#123EAB" },
    { id: "EXPERIENCE_LOCALE",label: "Expériences Locales",  emoji: "✨", color: "#F4C542" },
    { id: "PHOTOGRAPHIE",     label: "Photographie",         emoji: "📸", color: "#123EAB" },
    { id: "NIGHTLIFE",        label: "Nightlife",            emoji: "🌙", color: "#C96B4B" },
  ],

  // ─── CHIFFRES CLÉS ──────────────────────────────────────────
  stats: [
    { value: "200+", label: "Guides certifiés" },
    { value: "15",   label: "Villes couvertes" },
    { value: "4.9",  label: "Note moyenne" },
    { value: "5k+",  label: "Voyageurs satisfaits" },
  ],

  // ─── VILLES POPULAIRES ──────────────────────────────────────
  cities: [
    { name: "Marrakech", image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=600&q=80" },
    { name: "Fès",       image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80" },
    { name: "Essaouira", image: "https://images.unsplash.com/photo-1577538927984-cb5dcb3b20a0?w=600&q=80" },
    { name: "Chefchaouen",image: "https://images.unsplash.com/photo-1553522991-fd5deb8e3b50?w=600&q=80" },
    { name: "Agadir",    image: "https://images.unsplash.com/photo-1612714090001-3e1b7c8bdc87?w=600&q=80" },
    { name: "Tanger",    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80" },
  ],

  // ─── SEO ────────────────────────────────────────────────────
  seo: {
    title: "Laksor — Tour Guide Morocco",
    description: "Trouvez un guide local certifié au Maroc. Culture, food tour, désert, artisanat.",
    keywords: "guide touristique maroc, tour guide morocco, guide local marrakech, visite medina",
    ogImage: "/og-image.jpg",
  },
};
