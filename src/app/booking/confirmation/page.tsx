import Link from "next/link";
import { CheckCircle, CalendarCheck, Compass, TeaBag } from "@phosphor-icons/react/dist/ssr";

export default function ConfirmationPage({ searchParams }: { searchParams: { guide?: string; price?: string; persons?: string; payment?: string } }) {
  const isPaid = searchParams.payment === "deposit" || searchParams.payment === "full";
  const deposit = searchParams.price ? Math.round(Number(searchParams.price) * 0.3) : 0;

  return (
    <div className="min-h-screen bg-sand-200 flex flex-col">

      {/* NAVBAR */}
      <nav className="bg-white border-b border-sand-300 h-14 flex items-center justify-center px-4">
        <span className="font-display text-lg font-bold text-bronze-500 tracking-widest">LAKSOR</span>
      </nav>

      <div className="flex-1 flex items-start justify-center px-4 py-8">
        <div className="bg-white rounded-3xl border border-sand-300 w-full max-w-sm overflow-hidden shadow-sm">

          {/* TOP BANNER */}
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

            {/* PRIX */}
            {searchParams.price && (
              <div className="bg-sand-200 rounded-2xl p-4 border border-sand-300">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-charcoal-400">Personnes</span>
                  <span className="text-sm font-bold text-charcoal-800">{searchParams.persons} pers.</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-sand-300">
                  <span className="text-sm font-bold text-charcoal-800">Total</span>
                  <span className="font-display text-2xl font-bold text-charcoal-800">{searchParams.price} <span className="text-sm font-normal text-charcoal-400">MAD</span></span>
                </div>
                {isPaid && (
                  <div className="mt-2 text-[11px] text-bronze-500 font-semibold text-right">
                    Acompte payé : {deposit} MAD · Reste : {Number(searchParams.price) - deposit} MAD le jour J
                  </div>
                )}
              </div>
            )}

            {/* PAIEMENT */}
            <div className={`rounded-2xl p-3 border flex items-start gap-3 ${isPaid ? "bg-amber-50 border-bronze-500/30" : "bg-sand-200 border-sand-300"}`}>
              <span className="text-lg">{isPaid ? "💳" : "💵"}</span>
              <div>
                <div className={`text-xs font-bold ${isPaid ? "text-bronze-500" : "text-charcoal-600"}`}>
                  {isPaid ? searchParams.payment === "deposit" ? "Acompte 30% — Merci !" : "100% payé en ligne — Merci !" : "Paiement cash le jour J"}
                </div>
                <div className="text-[10px] text-charcoal-400 mt-0.5">
                  {isPaid ? "Le reste sera réglé directement au guide le jour de la visite" : "Le paiement s'effectue directement au guide"}
                </div>
              </div>
            </div>

            {/* THE BIENVENU */}
            {isPaid && (
              <div className="bg-amber-50 border border-bronze-500/30 rounded-2xl p-3 flex items-center gap-3">
                <TeaBag size={20} className="text-bronze-500 flex-shrink-0" weight="duotone" />
                <div>
                  <div className="text-xs font-bold text-bronze-500">🍵 Thé de bienvenu offert !</div>
                  <div className="text-[10px] text-charcoal-400 mt-0.5">Votre guide vous offrira un thé chez un café partenaire Laksor</div>
                </div>
              </div>
            )}

            {/* ÉTAPES */}
            <div className="bg-sand-200 rounded-2xl p-4 border border-sand-300">
              {[
                { Icon: CheckCircle, label: "Réservation confirmée", done: true },
                { Icon: CalendarCheck, label: "Le guide vous contacte 72h avant", done: false },
                { Icon: Compass, label: "Vivez l'expérience !", done: false },
              ].map((s, i) => (
                <div key={i} className={`flex items-center gap-3 ${i < 2 ? "mb-3" : ""}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                    ${s.done ? "bg-sage-300" : "bg-sand-300"}`}>
                    <s.Icon size={16} weight="fill" className={s.done ? "text-white" : "text-charcoal-400"} />
                  </div>
                  <span className={`text-sm ${s.done ? "font-bold text-charcoal-800" : "text-charcoal-400"}`}>{s.label}</span>
                </div>
              ))}
            </div>

            {/* MESSAGE REMERCIEMENTS */}
            <div className="bg-charcoal-800 rounded-2xl p-5 text-center">
              <div className="font-display text-lg text-white mb-2">Merci de voyager avec Laksor 🧭</div>
              <div className="text-charcoal-400 text-xs leading-relaxed mb-4">
                Votre expérience au Maroc commence ici. Chaque guide et chauffeur Laksor est certifié par le <strong className="text-white">Ministère du Tourisme marocain</strong> et personnellement validé par notre équipe — pour que vous voyagiez l&apos;esprit tranquille.
              </div>
              <div className="text-charcoal-400 text-xs leading-relaxed mb-4">
                Une question ? Un imprévu ? Notre équipe est disponible <strong className="text-white">7j/7</strong> via notre plateforme <strong className="text-white">laksor.ma</strong> ou sur WhatsApp au numéro d&apos;urgence.
              </div>
              <a href="https://wa.me/212657436342" className="inline-flex items-center gap-2 bg-sage-300 hover:bg-sage-400 text-white text-xs font-bold px-5 py-2.5 rounded-full no-underline transition-colors">
                💬 Contacter Laksor sur WhatsApp
              </a>
              <div className="mt-3 text-[10px] text-charcoal-500 italic">Bienvenue au Maroc authentique.</div>
            </div>

            {/* CTA */}
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
