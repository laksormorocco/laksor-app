// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{ts,tsx}",
    "./content/**/*.{ts,tsx}",
    "./config/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Laksor Brand ──────────────────────────────
        majorelle: {
          DEFAULT: "#123EAB",
          50:  "#EEF2FB",
          100: "#D4DDF5",
          200: "#A9BBEB",
          300: "#7E99E1",
          400: "#5377D7",
          500: "#123EAB",
          600: "#0F3490",
          700: "#0B2975",
          800: "#081F5A",
          900: "#05143F",
        },
        safran: {
          DEFAULT: "#F4C542",
          50:  "#FEFAEC",
          100: "#FCF2C9",
          200: "#FAE593",
          300: "#F7D85D",
          400: "#F4C542",
          500: "#EFB01A",
          600: "#CC9213",
          700: "#A3730E",
          800: "#7A560A",
          900: "#523906",
        },
        terracotta: {
          DEFAULT: "#C96B4B",
          50:  "#FCF3EF",
          100: "#F8E3DA",
          200: "#F0C5B3",
          300: "#E8A78C",
          400: "#D98865",
          500: "#C96B4B",
          600: "#A8533A",
          700: "#853E2B",
          800: "#622B1E",
          900: "#3F1812",
        },
        sand: {
          DEFAULT: "#F8F5F0",
          50:  "#FFFFFF",
          100: "#F8F5F0",
          200: "#EDE6D8",
          300: "#E2D7C0",
          400: "#D7C8A8",
          500: "#CCB990",
        },
        // ── Shadcn/ui ──────────────────────────────────
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-playfair)", "Georgia", "serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.5s ease-out forwards",
        shimmer: "shimmer 2s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
