import LoginButton from "@/components/LoginButton";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-sand-200 flex flex-col">

      {/* ── COVER ── */}
      <div className="relative h-52 bg-charcoal-800 flex flex-col items-center justify-end pb-8 px-4">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&q=80)", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal-800/60 to-charcoal-800/90" />
        <Link href="/" className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white text-sm font-bold no-underline z-10">
          ←
        </Link>
        <div className="relative z-10 text-center">
          <div className="w-14 h-14 rounded-2xl bg-bronze-500 flex items-center justify-center mx-auto mb-3 text-2xl">🧭</div>
          <h1 className="font-display text-2xl font-semibold text-white mb-1">Bon retour !</h1>
          <p className="text-sm text-white/70">Connectez-vous pour accéder à votre espace</p>
        </div>
      </div>

      {/* ── CARD ── */}
      <div className="flex-1 px-4 -mt-6 pb-10">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-sand-300 max-w-sm mx-auto">

          {/* Google */}
          <div className="text-center text-xs font-bold text-charcoal-400 uppercase tracking-wider mb-4">
            Continuer avec
          </div>
          <LoginButton />

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-sand-300" />
            <span className="text-xs text-charcoal-300 font-medium">Connexion sécurisée</span>
            <div className="flex-1 h-px bg-sand-300" />
          </div>

          {/* Trust */}
          <div className="bg-sage-50 border border-sage-300 rounded-2xl p-4 mb-5">
            <div className="flex items-start gap-3">
              <span className="text-lg">🔒</span>
              <div>
                <div className="text-sm font-bold text-sage-300 mb-0.5">Connexion 100% sécurisée</div>
                <p className="text-xs text-charcoal-400 leading-relaxed">Google OAuth protège votre compte. Aucun mot de passe requis.</p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="flex flex-col gap-2 mb-5">
            {[
              { icon: "📍", text: "Réservez des guides locaux certifiés" },
              { icon: "💬", text: "Messagerie directe avec votre guide" },
              { icon: "🔄", text: "Annulation gratuite jusqu'à 72h avant" },
            ].map(f => (
              <div key={f.text} className="flex items-center gap-3 text-xs text-charcoal-500">
                <span>{f.icon}</span>{f.text}
              </div>
            ))}
          </div>

          {/* Register */}
          <div className="text-center pt-4 border-t border-sand-200">
            <span className="text-sm text-charcoal-400">Pas encore de compte ? </span>
            <Link href="/auth/register" className="text-bronze-500 font-bold text-sm no-underline">
              Devenir guide →
            </Link>
          </div>

          <p className="text-center text-[10px] text-charcoal-300 mt-3">
            En vous connectant, vous acceptez nos CGU
          </p>
        </div>
      </div>
    </div>
  );
}
