import type { Metadata } from "next";
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
  title: "Laksor — Local Guides & Transport in Morocco",
  description: "Book certified local guides and private transport in Marrakech, Fès, Essaouira, Chefchaouen and Agadir.",
  keywords: ["guide marrakech", "guide local maroc", "transport marrakech", "tour guide morocco"],
  openGraph: {
    title: "Laksor — Local Guides & Transport in Morocco",
    description: "Authentic local experiences with certified guides and vetted transport providers.",
    url: "https://laksor.vercel.app",
    siteName: "Laksor",
    locale: "en_US",
    type: "website",
  },
  other: { "theme-color": "#F6F1E8" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
