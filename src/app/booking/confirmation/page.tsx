import Link from "next/link";
import { CheckCircle, CalendarCheck, Compass, TeaBag } from "@phosphor-icons/react/dist/ssr";

export default function ConfirmationPage({ searchParams }: {
  searchParams: {
    guideId?: string; guide?: string; city?: string;
    price?: string; base?: string; extra?: string;
    persons?: string; payment?: string; ref?: string;
    dates?: string; transport?: string; serviceFee?: string;
    name?: string;
  }
}) {
  const isPaid = searchParams.payment === "deposit" || searchParams.payment === "full";
  const total = Number(searchParams.price || 0);
  const deposit = Math.round(total * 0.3);
  const reste = total - deposit;
  const ref = searchParams.ref || "—";
  const paymentLabel = searchParams.payment === "deposit" ? "Acompte 30%" : searchParams.payment === "full" ? "100% en ligne" : "Cash le jour J";
  const hasTransport = searchParams.transport === "true";
  const rawDates = searchParams.dates ? decodeURIComponent(searchParams.dates).split(",").filter(Boolean) : [];
  const formattedDates = rawDates.map(d =>
    new Date(d + "T00:00:00").toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
  );

  return (
    <div className="min-h-screen bg-sand-200 flex flex-col">
      <nav className="bg-white border-b border-sand-300 h-14 flex items-center justify-center sticky top-0 z-10">
        <span className="font-display text-lg font-bold text-bronze-500 tracking-widest">LAKSOR</span>
      </nav>
      <div className="flex-1 flex items-start justify-center px-4 py-8">
        <div className="bg-white rounded-3xl border border-sand-300 w-full max-w-sm overflow-hidden shadow-sm">

          <div className="bg-sage-300 px-6 pt-8 pb-6 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={36} weight="fill" className="text-white" />
            </div>
            <h1 className="font-display text-2xl text-white mb-1">Reservation confirmee !</h1>
            {searchParams.name && <p className="text-white/80 text-sm mb-1">Bonjour <strong className="text-white">{searchParams.name}</strong></p>}
            <p className="text-white/70 text-sm"><strong className="text-white">{searchParams.guide}</strong> vous attend avec impatience</p>
          </div>

          <div className="p-5 flex flex-col gap-4">

            <div className="bg-charcoal-800 rounded-2xl p-4 text-center">
              <div className="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest mb-1">Numero de reservation</div>
              <div className="font-display text-2xl font-bold text-bronze-500 tracking-widest">{ref}</div>
              <div className="text-[10px] text-charcoal-400 mt-1">Conservez ce numero pour tout suivi</div>
            </div>

            <div className="bg-sand-200 rounded-2xl p-4 border border-sand-300">
              <div className="text-[10px] font-bold text-charcoal-800 uppercase tracking-widest mb-3">Votre guide</div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sage-300/20 border border-sage-300/30 flex items-center justify-center font-display text-lg font-bold text-sage-300">
                  {searchParams.guide?.[0]}
                </div>
                <div>
                  <div className="font-display text-sm font-bold text-charcoal-800">{searchParams.guide}</div>
                  <div className="text-xs text-charcoal-400">{searchParams.city} · Guide certifie</div>
                </div>
              </div>
            </div>

            {formattedDates.length > 0 && (
              <div className="bg-sand-200 rounded-2xl p-4 border border-sand-300">
                <div className="text-[10px] font-bold text-charcoal-800 uppercase tracking-widest mb-3">
                  Date{formattedDates.length > 1 ? "s" : ""} de visite
                </div>
                {formattedDates.map((d, i) => (
                  <div key={i} className="flex items-center gap-2 mb-1 last:mb-0">
                    <CalendarCheck size={14} className="text-sage-300 flex-shrink-0" />
                    <span className="text-sm font-semibold text-charcoal-800 capitalize">{d}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-sand-200 rounded-2xl p-4 border border-sand-300">
              <div className="text-[10px] font-bold text-charcoal-800 uppercase tracking-widest mb-3">Detail du prix</div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <span className="text-charcoal-400">Prestation de base (2 pers.)</span>
                  <span className="font-semibold text-charcoal-800">{searchParams.base} MAD</span>
                </div>
                {Number(searchParams.extra) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-charcoal-400">+15% pers. supplementaires</span>
                    <span className="font-semibold text-charcoal-800">+{searchParams.extra} MAD</span>
                  </div>
                )}
                {hasTransport && (
                  <div className="flex justify-between text-sm">
                    <span className="text-charcoal-400">Transport hotel/riad A/R</span>
                    <span className="font-semibold text-charcoal-800">+300 MAD</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-charcoal-400">Frais de service</span>
                  <span className="font-semibold text-charcoal-800">+{searchParams.serviceFee || 25} MAD</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-sand-300">
                  <span className="font-bold text-charcoal-800">Total</span>
                  <span className="font-display text-2xl font-bold text-bronze-500">{total} <span className="text-sm font-normal text-charcoal-400">MAD</span></span>
                </div>
                {isPaid && (
                  <div className="text-right text-[11px] text-sage-300 font-semibold">
                    Acompte : {deposit} MAD · Reste le jour J : {reste} MAD
                  </div>
                )}
              </div>
            </div>

            <div className={`rounded-2xl p-3 border flex items-start gap-3 ${isPaid ? "bg-amber-50 border-bronze-500/30" : "bg-sand-200 border-sand-300"}`}>
              <span className="text-lg">{isPaid ? "💳" : "💵"}</span>
              <div>
                <div className={`text-xs font-bold ${isPaid ? "text-bronze-500" : "text-charcoal-600"}`}>{paymentLabel}</div>
                <div className="text-[10px] text-charcoal-400 mt-0.5">
                  {isPaid ? "Merci pour votre paiement !" : "Paiement directement au guide le jour de la visite"}
                </div>
              </div>
            </div>

            {isPaid && (
              <div className="bg-amber-50 border border-bronze-500/30 rounded-2xl p-3 flex items-center gap-3">
                <TeaBag size={20} className="text-bronze-500 flex-shrink-0" weight="duotone" />
                <div>
                  <div className="text-xs font-bold text-bronze-500">The de bienvenu offert !</div>
                  <div className="text-[10px] text-charcoal-400 mt-0.5">Votre guide vous offrira un the chez un cafe partenaire Laksor</div>
                </div>
              </div>
            )}

            <div className="bg-sand-200 rounded-2xl p-4 border border-sand-300">
              {[
                { Icon: CheckCircle, label: "Reservation confirmee", done: true },
                { Icon: CalendarCheck, label: "Le guide vous contacte 72h avant", done: false },
                { Icon: Compass, label: "Vivez l experience !", done: false },
              ].map((s, i) => (
                <div key={i} className={`flex items-center gap-3 ${i < 2 ? "mb-3" : ""}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${s.done ? "bg-sage-300" : "bg-sand-300"}`}>
                    <s.Icon size={16} weight="fill" className={s.done ? "text-white" : "text-charcoal-400"} />
                  </div>
                  <span className={`text-sm ${s.done ? "font-bold text-charcoal-800" : "text-charcoal-400"}`}>{s.label}</span>
                </div>
              ))}
            </div>

            <div className="bg-charcoal-800 rounded-2xl p-5 text-center">
              <p className="font-display text-base text-bronze-500 mb-2">Merci de voyager avec Laksor</p>
              <p className="text-charcoal-400 text-xs leading-relaxed mb-3">
                Chaque guide et chauffeur Laksor est certifie par le <strong className="text-white">Ministere du Tourisme marocain</strong> et personnellement valide par notre equipe.
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
              Retour a l accueil
            </Link>
            <Link href="/search" className="block bg-sand-200 hover:bg-sand-300 text-charcoal-800 font-bold py-3.5 rounded-full text-sm text-center no-underline transition-colors border border-sand-300 mb-4">
              Explorer d autres guides
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
}
