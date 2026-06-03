import LoginButton from "@/components/LoginButton";
import Link from "next/link";
import { ArrowLeft, Lock, MapPin, ChatCircle, ShieldCheck } from "@phosphor-icons/react/dist/ssr";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-sand-200 flex flex-col max-w-lg mx-auto">

      {/* ── COVER ── */}
      <div className="relative h-64 overflow-hidden flex-shrink-0">
        <div className="absolute inset-0"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&q=80)", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 100%)" }} />
        <Link href="/" className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white no-underline z-10">
          <ArrowLeft size={16} weight="bold" />
        </Link>
        <div className="relative z-10 flex flex-col items-center justify-end h-full pb-8 px-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-bronze-500 flex items-center justify-center mb-4 text-3xl" style={{ boxShadow: "0 8px 24px rgba(184,138,68,0.4)" }}>🧭</div>
          <h1 className="font-display text-2xl font-semibold text-white mb-1 leading-tight">
            Découvrez le Maroc<br/>avec ceux qui y vivent
          </h1>
          <p className="text-sm text-white/70">Guides locaux certifiés · Expériences authentiques</p>
        </div>
      </div>

      {/* ── CARD ── */}
      <div className="flex-1 px-4 -mt-5 pb-10">
        <div className="bg-white rounded-3xl p-6 border border-sand-300" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-3 bg-sand-200 rounded-2xl px-4 py-3 mb-5">
            <div className="flex">
              {["M","J","S"].map((l,i) => (
                <div key={i} className="w-7 h-7 rounded-full bg-sand-300 border-2 border-white flex items-center justify-center text-xs font-bold text-charcoal-500 -mr-2">{l}</div>
              ))}
            </div>
            <span className="text-xs font-semibold text-charcoal-500 ml-3"><strong className="text-charcoal-800">1.2k+</strong> voyageurs nous font confiance</span>
          </div>

          {/* Google button */}
          <LoginButton />

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-sand-300" />
            <div className="flex items-center gap-1 text-[10px] text-charcoal-300">
              <Lock size={10} weight="fill" />
              <span>Connexion sécurisée par Google OAuth</span>
            </div>
            <div className="flex-1 h-px bg-sand-300" />
          </div>

          {/* Mini cards */}
          <div className="grid grid-cols-3 gap-2 mb-5">
            <div className="bg-sand-200 border border-sand-300 rounded-2xl p-3 text-center">
              <MapPin size={20} weight="duotone" className="text-bronze-500 mx-auto mb-1" />
              <div className="text-[11px] font-bold text-charcoal-800 leading-tight">Guides vérifiés</div>
              <div className="text-[9px] text-charcoal-400 mt-0.5">Certifiés Ministère</div>
            </div>
            <div className="bg-sand-200 border border-sand-300 rounded-2xl p-3 text-center">
              <ChatCircle size={20} weight="duotone" className="text-bronze-500 mx-auto mb-1" />
              <div className="text-[11px] font-bold text-charcoal-800 leading-tight">Chat direct</div>
              <div className="text-[9px] text-charcoal-400 mt-0.5">WhatsApp inclus</div>
            </div>
            <div className="bg-sand-200 border border-sand-300 rounded-2xl p-3 text-center">
              <ShieldCheck size={20} weight="duotone" className="text-bronze-500 mx-auto mb-1" />
              <div className="text-[11px] font-bold text-charcoal-800 leading-tight">Résa protégée</div>
              <div className="text-[9px] text-charcoal-400 mt-0.5">Annulation 72h</div>
            </div>
          </div>

          {/* Devenir guide CTA */}
          <div className="bg-charcoal-800 rounded-2xl p-4 mb-4 text-center">
            <div className="text-xs text-charcoal-300 mb-2">Vous êtes guide ou chauffeur ?</div>
            <Link href="/auth/register"
              className="inline-flex items-center gap-2 bg-bronze-500 text-white text-sm font-bold px-5 py-2.5 rounded-full no-underline hover:bg-bronze-600 transition-colors">
              Devenir guide →
            </Link>
          </div>

          <p className="text-center text-[10px] text-charcoal-300">
            En vous connectant, vous acceptez nos <span className="underline cursor-pointer">CGU</span>
          </p>
        </div>
      </div>
    </div>
  );
}
