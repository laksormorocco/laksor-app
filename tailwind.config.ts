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
        // ── Laksor Brand ──
        bronze: {
          DEFAULT: "#B88A44",
          dark:    "#A17635",
          light:   "#D4A85A",
          50:      "#FBF5E9",
          100:     "#F5E8C8",
          200:     "#EDD197",
          300:     "#E4BA66",
          400:     "#D4A85A",
          500:     "#B88A44",
          600:     "#A17635",
          700:     "#7A5828",
          800:     "#523B1A",
          900:     "#2A1E0D",
        },
        sage: {
          DEFAULT: "#7D8F69",
          50:      "#EEF2EB",
          100:     "#D5DFD0",
          200:     "#AABFA1",
          300:     "#7D8F69",  
          400:     "#6A7A58",
          500:     "#566547",
          600:     "#435036",
          700:     "#303B26",
          800:     "#1E2618",
          900:     "#0B110A",
        },
        sand: {
          DEFAULT: "#F6F1E8",
          50:      "#FFFFFF",
          100:     "#FDFBF7",
          200:     "#F6F1E8",
          300:     "#EADCC8",
          400:     "#DEC8A8",
          500:     "#D2B488",
          600:     "#C6A068",
          700:     "#A07E48",
          800:     "#785E35",
          900:     "#503F23",
        },
        charcoal: {
          DEFAULT: "#111111",
          50:      "#F5F5F5",
          100:     "#E8E8E8",
          200:     "#CCCCCC",
          300:     "#999999",
          400:     "#666666",
          500:     "#444444",
          600:     "#333333",
          700:     "#222222",
          800:     "#111111",
          900:     "#000000",
        },
        // ── Shadcn/ui ──
        border:     "hsl(var(--border))",
        input:      "hsl(var(--input))",
        ring:       "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT:    "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT:    "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT:    "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT:    "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT:    "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        card: {
          DEFAULT:    "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        sans:    ["var(--font-inter)", "system-ui", "sans-serif"],
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
          to:   { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to:   { height: "0" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(32px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.9)" },
          to:   { opacity: "1", transform: "scale(1)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-6px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
        "fade-up":        "fade-up 0.5s ease-out forwards",
        shimmer:          "shimmer 2s linear infinite",
        "fade-in":       "fade-in 0.6s ease-out forwards",
        "slide-up":      "slide-up 0.7s ease-out forwards",
        "slide-up-slow": "slide-up 1s ease-out forwards",
        "scale-in":      "scale-in 0.5s ease-out forwards",
        "float":         "float 3s ease-in-out infinite",
      },
    },
  },
  safelist: [
      { pattern: /^(bg|text|border|ring)-(bronze|sage|sand|charcoal)-(50|100|200|300|400|500|600|700|800|900)$/ },
      ],
  plugins: [require("tailwindcss-animate")],
};

export default config;
