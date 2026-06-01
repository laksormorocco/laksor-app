export const COLORS = {
  sand:"#F6F1E8", sandDark:"#EADCC8",
  bronze:"#B88A44", bronzeDark:"#A17635",
  sage:"#7D8F69", sageDark:"#6A7A58",
  charcoal:"#111111", white:"#FFFFFF",
  grey:"#888888", greyLight:"#E5E5E5",
} as const;

export const GRADIENTS = {
  bronze:"linear-gradient(135deg,#B88A44,#A17635)",
  hero:"linear-gradient(180deg,rgba(0,0,0,0.35) 0%,rgba(0,0,0,0.65) 100%)",
  sand:"linear-gradient(180deg,#F6F1E8 0%,#EADCC8 100%)",
} as const;

export const FONTS = {
  title:"var(--font-playfair),Georgia,serif",
  body:"var(--font-inter),sans-serif",
} as const;

export const RADIUS = {
  card:"24px", btn:"999px", modal:"32px",
  input:"999px", badge:"999px", sm:"12px",
} as const;

export const SHADOWS = {
  card:"0 10px 40px rgba(0,0,0,0.06)",
  bronze:"0 4px 16px rgba(184,138,68,0.30)",
  hover:"0 20px 60px rgba(0,0,0,0.12)",
} as const;

export const TRANSITIONS = {
  fast:"all 0.15s ease", base:"all 0.2s ease", slow:"all 0.4s ease",
} as const;

export type ColorKey = keyof typeof COLORS;
