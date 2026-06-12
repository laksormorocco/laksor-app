import type { Metadata } from "next";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "600", "700", "800"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://laksor.vercel.app"),
  title: "Laksor — Discover Morocco with Certified Local Guides",
  description: "Discover Morocco with certified local guides. Private tours & authentic experiences in Marrakech, Fès, Essaouira, Chefchaouen and Agadir.",
  keywords: ["guide marrakech", "guide local maroc", "tour guide morocco", "morocco travel", "marrakech tour", "authentic morocco", "private guide morocco"],
  openGraph: {
    title: "Laksor — Certified Local Guides in Morocco",
    description: "Book private tours & authentic experiences with certified guides in Morocco.",
    url: "https://laksor.vercel.app",
    siteName: "Laksor",
    locale: "en_US",
    type: "website",
    images: [{ url: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=1200&h=630&fit=crop&q=80", width: 1200, height: 630, alt: "Laksor — Certified Local Guides in Morocco" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Laksor — Certified Local Guides in Morocco",
    description: "Book private tours & authentic experiences with certified guides in Morocco.",
    images: ["https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=1200&h=630&fit=crop&q=80"],
  },
  other: { "theme-color": "#B88A44" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body>{children}<WhatsAppButton /></body>
    </html>
  );
}
