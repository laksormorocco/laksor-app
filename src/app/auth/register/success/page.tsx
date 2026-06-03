import Link from "next/link";
import { CheckCircle, MagnifyingGlass, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";

export default function RegisterSuccessPage() {
  return (
    <div className="min-h-screen bg-sand-200 flex flex-col">

      {/* Cover */}
      <div className="relative h-48 overflow-hidden flex-shrink-0">
        <div className="absolute inset-0"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&q=80)", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.7))" }} />
        <div className="relative z-10 flex flex-col items-center justify-end h-full pb-6 px-6 text-center">
          <div className="w-16 h-16 bg-sage-300 rounded-full flex items-center justify-center mb-3 text-3xl shadow-lg">🎉</div>
          <h1 className="font-display text-2xl font-semibold text-white">Candidature envoyée !</h1>
        </div>
      </div>

      {/* Card */}
      <div className="flex-1 px-4 -mt-5 pb-10">
        <div className="bg-white rounded-3xl p-6 border border-sand-300 max-w-sm mx-auto" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>

          <p className="text-sm text-charcoal-500 text-center leading-relaxed mb-6">
            Nous avons bien reçu votre demande. Notre équipe va examiner votre profil et vous contacter sur <strong className="text-charcoal-800">WhatsApp</strong> sous 24h.
          </p>

          {/* Steps */}
          <div className="flex flex-col gap-0 mb-6">
            {[
              { Icon: CheckCircle,    color: "text-sage-300",   bg: "bg-sage-50",   title: "Candidature soumise",   sub: "Votre profil a été envoyé",           done: true  },
              { Icon: MagnifyingGlass, color: "text-charcoal-400", bg: "bg-sand-200", title: "Vérification en cours", sub: "Notre équipe examine votre dossier",   done: false },
              { Icon: WhatsappLogo,   color: "text-charcoal-400", bg: "bg-sand-200", title: "Contact WhatsApp",      sub: "Réponse sous 24h",                    done: false },
            ].map((s, i) => (
              <div key={s.title} className="flex items-center gap-4 py-3 border-b border-sand-200 last:border-0">
                <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
                  <s.Icon size={20} className={s.color} weight={s.done ? "fill" : "regular"} />
                </div>
                <div>
                  <div className={`text-sm font-bold ${s.done ? "text-sage-300" : "text-charcoal-800"}`}>{s.title}</div>
                  <div className="text-xs text-charcoal-400">{s.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <Link href="/"
            className="block w-full py-4 bg-bronze-500 text-white rounded-2xl text-sm font-bold text-center no-underline hover:bg-bronze-600 transition-colors mb-3">
            Retour à l&apos;accueil
          </Link>
          <Link href="/auth/login"
            className="block w-full py-3.5 border border-sand-300 text-charcoal-600 rounded-2xl text-sm font-bold text-center no-underline hover:border-bronze-500 hover:text-bronze-500 transition-colors">
            Accéder à mon espace guide
          </Link>
        </div>
      </div>
    </div>
  );
}
