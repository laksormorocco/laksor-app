// src/components/shared/Footer.tsx
import Link from "next/link";
import { branding } from "@/../../content/branding";

export function Footer() {
  return (
    <footer className="bg-majorelle text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-safran flex items-center justify-center">
                <span className="text-majorelle font-bold font-display">L</span>
              </div>
              <span className="font-display font-bold text-lg">{branding.name}</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              {branding.description}
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="font-semibold text-sm mb-4 text-safran">Explorer</p>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/search" className="hover:text-white">Trouver un guide</Link></li>
              <li><Link href="/#how-it-works" className="hover:text-white">Comment ça marche</Link></li>
              <li><Link href="/auth/register?role=guide" className="hover:text-white">Devenir guide</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-sm mb-4 text-safran">Villes</p>
            <ul className="space-y-2 text-sm text-white/70">
              {["Marrakech","Fès","Agadir","Chefchaouen","Essaouira"].map(c => (
                <li key={c}><Link href={`/search?city=${c}`} className="hover:text-white">{c}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-semibold text-sm mb-4 text-safran">Support</p>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
              <li><Link href="/privacy" className="hover:text-white">Confidentialité</Link></li>
              <li><Link href="/terms" className="hover:text-white">CGU</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/15 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-white/50">
          <p>© {new Date().getFullYear()} {branding.name}. Tous droits réservés.</p>
          <p>🇲🇦 Made with ❤️ in Morocco</p>
        </div>
      </div>
    </footer>
  );
}
