import Link from "next/link";
import { CheckCircle, CalendarCheck, Compass, TeaBag, Copy } from "@phosphor-icons/react/dist/ssr";

export default function ConfirmationPage({ searchParams }: {
  searchParams: {
    guide?: string; price?: string; persons?: string;
    payment?: string; ref?: string; dates?: string; transport?: string
  }
}) {
  const isPaid = searchParams.payment === "deposit" || searchParams.payment === "full";
  const deposit = searchParams.price ? Math.round(Number(searchParams.price) * 0.3) : 0;
  const reste = Number(searchParams.price || 0) - deposit;
  const ref = searchParams.ref || "LAK-2026-XXXX";
  const paymentLabel = searchParams.payment === "deposit" ? "Acompte 30%" : searchParams.payment === "full" ? "100% en ligne" : "Cash le jour J";

  return (
    <div className="min-h-screen bg-sand-200 flex flex-col">

      <nav className="bg-white border-b border-sand-300 h-14 flex items-center justify-center px-4">
        <span className="font-display text-lg font-bold text-bronze-500 tracking-widest">LAKSOR</span>
      </nav>

      <div className="flex-1 flex items-start justify-center px-4 py-8">
        <div className="bg-white rounded-3xl border border-sand-300 w-full max-w-sm overflow-hidden shadow-sm">

          {/* TOP */}
          <div className="bg-sage-300 px-6 pt-8 pb-6 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={36} weight="fill" className="text-white" />
            </div>
            <h1 className="font-display text-2xl text-white mb-1">Réservation confirmée !</h1>
            <p className="text-white/70 text-sm">
              <strong className="text-white">{searchParams.guide || "Votre guide"}</strong> a bien reçu votre demande
            </p>
          </div>

          <div className="p-5 flex flex-col gap-4">

            {/* NUMERO DE RESERVATION */}
            <div className="bg-charcoal-800 rounded-2xl p-4 text-center">
              <div className="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest mb-1">Numéro de réservation</div>
              <div className="font-display text-2xl font-bold text-bronze-500 tracking-widest">{ref}</div>
              <div className="text-[10px] text-charcoal-400 mt-1">Conservez ce numéro pour tout suivi</div>
            </div>

            {/* DETAILS */}
            <div className="bg-sand-200 rounded-2xl p-4 border border-sand-300">
              <div className="text-[10px] font-bold text-charcoal-800 uppercase tracking-widest mb-3">Détails de la réservation</div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <span className="text-charcoal-400">Guide</span>
                  <span className="font-semibold text-charcoal-800">{searchParams.guide}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-charcoal-400">Jours réservés</span>
                  <span className="font-semibold text-charcoal-800">{searchParams.dates || 1} jour{Number(searchParams.dates) > 1 ? "s" : ""}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-charcoal-400">Participants</span>
                  <span className="font-semibold text-charcoal-800">{searchParams.persons} pers.</span>
                </div>
                {searchParams.transport === "true" && (
                  <div className="flex justify-between text-sm">
                    <span className="text-charcoal-400">Transport</span>
                    <span className="font-semibold text-charcoal-800">+300 MAD</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-charcoal-400">Paiement</span>
                  <span className="font-semibold text-charcoal-800">{paymentLabel}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-sand-300">
                  <span className="font-bold text-charcoal-800">Total</span>
                  <span className="font-display text-xl font-bold text-charcoal-800">{searchParams.price} <span className="text-xs font-normal text-charcoal-400">MAD</span></span>
                </div>
                {isPaid && (
                  <div className="text-[11px] text-bronze-500 font-semibold text-right">
                    Acompte : {deposit} MAD · Reste le jour J : {reste} MAD
                  </div>
                )}
              </div>
            </div>

            {/* THE BIENVENU */}
            {isPaid && (
              <div className="bg-amber-50 border border-bronze-500/30 rounded-2xl p-3 flex items-center gap-3">
                <TeaBag size={20} className="text-bronze-500 flex-shrink-0" weight="duotone" />
                <div>
                  <div className="text-xs font-bold text-bronze-500">Thé de bienvenu offert !</div>
                  <div className="text-[10px] text-charcoal-400 mt-0.5">Votre guide vous offrira un thé chez un café partenaire Laksor</div>
                </div>
              </div>
            )}

            {/* ETAPES */}
            <div className="bg-sand-200 rounded-2xl p-4 border border-sand-300">
              {[
                { Icon: CheckCircle, label: "Réservation confirmée", done: true },
                { Icon: CalendarCheck, label: "Le guide vous contacte 72h avant", done: false },
                { Icon: Compass, label: "Vivez l'expérience !", done: false },
              ].map((s, i) => (
                <div key={i} className={`flex items-center gap-3 ${i < 2 ? "mb-3" : ""}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${s.done ? "bg-sage-300" : "bg-sand-300"}`}>
                    <s.Icon size={16} weight="fill" className={s.done ? "text-white" : "text-charcoal-400"} />
                  </div>
                  <span className={`text-sm ${s.done ? "font-bold text-charcoal-800" : "text-charcoal-400"}`}>{s.label}</span>
                </div>
              ))}
            </div>

            {/* REMERCIEMENTS */}
            <div className="bg-charcoal-800 rounded-2xl p-5 text-center">
              <p className="font-display text-base text-bronze-500 mb-2">Merci de voyager avec Laksor</p>
              <p className="text-charcoal-400 text-xs leading-relaxed mb-3">
                Chaque guide et chauffeur Laksor est certifié par le <strong className="text-white">Ministère du Tourisme marocain</strong> et personnellement validé par notre équipe.
              </p>
              <p className="text-charcoal-400 text-xs leading-relaxed mb-4">
                Disponibles <strong className="text-white">7j/7</strong> via <strong className="text-white">laksor.ma</strong> ou WhatsApp au <strong className="text-white">+212 6 57 43 63 42</strong>
              </p>
              <a href="https://wa.me/212657436342" className="inline-flex items-center gap-2 bg-sage-300 hover:bg-sage-400 text-white text-xs font-bold px-5 py-2.5 rounded-full no-underline transition-colors">
                Contacter Laksor sur WhatsApp
              </a>
              <p className="text-charcoal-500 text-[10px] mt-3 italic">Bienvenue au Maroc authentique.</p>
            </div>

            <Link href="/" className="block bg-bronze-500 hover:bg-bronze-600 text-white font-bold py-4 rounded-full text-sm text-center no-underline transition-colors">
              Retour à l&apos;accueil
            </Link>
            <Link href="/search" className="block bg-sand-200 hover:bg-sand-300 text-charcoal-800 font-bold py-3.5 rounded-full text-sm text-center no-underline transition-colors border border-sand-300">
              Explorer d&apos;autres guides
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
