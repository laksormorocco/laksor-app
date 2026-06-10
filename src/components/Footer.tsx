import Link from "next/link";
import { InstagramLogo, WhatsappLogo, EnvelopeSimple } from "@phosphor-icons/react/dist/ssr";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-sand-300 px-5 pt-10 pb-8">

      {/* LOGO + TAGLINE */}
      <div className="text-center mb-8">
        <img src="/logo7.png" alt="Laksor" style={{height:36, width:"auto", objectFit:"contain", maxWidth:120}} className="mx-auto mb-3" />
        <p className="text-xs text-charcoal-400 leading-relaxed max-w-xs mx-auto">
          Discover Morocco with certified local guides.<br/>
          Authentic experiences · Private tours
        </p>
      </div>

      {/* LINKS */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div>
          <div className="text-[10px] font-bold text-bronze-500 uppercase tracking-widest mb-3">Discover</div>
          {[
            ["Find a guide", "/search"],
            ["Experiences", "/experiences"],
            ["Marrakech", "/search?city=Marrakech"],
            ["Fès", "/search?city=Fes"],
            ["Essaouira", "/search?city=Essaouira"],
          ].map(([l, h]) => (
            <Link key={l} href={h} className="block text-sm text-charcoal-400 mb-2.5 no-underline hover:text-bronze-500 transition-colors">{l}</Link>
          ))}
        </div>
        <div>
          <div className="text-[10px] font-bold text-bronze-500 uppercase tracking-widest mb-3">Guides</div>
          {[
            ["Become a guide", "/auth/register"],
            ["Guide charter", "/legal/charte-guides"],
            ["About Laksor", "/about"],
          ].map(([l, h]) => (
            <Link key={l} href={h} className="block text-sm text-charcoal-400 mb-2.5 no-underline hover:text-bronze-500 transition-colors">{l}</Link>
          ))}
        </div>
      </div>

      {/* SOCIAL */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <a href="https://wa.me/212657436342" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs font-bold text-white px-4 py-2.5 rounded-full no-underline"
          style={{background:"#25D366"}}>
          <WhatsappLogo size={14} weight="fill" /> WhatsApp
        </a>
        <a href="https://www.instagram.com/laksor.morocco" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs font-bold text-white px-4 py-2.5 rounded-full no-underline"
          style={{background:"linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)"}}>
          <InstagramLogo size={14} weight="fill" /> Instagram
        </a>
        <a href="mailto:contact@laksor.ma"
          className="flex items-center gap-2 text-xs font-semibold text-charcoal-600 px-4 py-2.5 rounded-full no-underline border border-sand-300">
          <EnvelopeSimple size={14} weight="fill" /> Email
        </a>
      </div>

      {/* BOTTOM */}
      <div className="border-t border-sand-200 pt-5 text-center">
        <p className="text-[11px] text-charcoal-300 mb-3">© 2026 Laksor Morocco · All rights reserved</p>
        <div className="flex gap-4 justify-center flex-wrap">
          {[["Terms","/legal/cgv"],["Usage","/legal/cgu"],["Privacy","/legal/privacy"],["Guide Charter","/legal/charte-guides"]].map(([l,h]) => (
            <Link key={l} href={h} className="text-[11px] text-charcoal-300 no-underline hover:text-bronze-500 transition-colors">{l}</Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
