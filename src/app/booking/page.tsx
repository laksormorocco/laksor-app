"use client";
import { useState } from "react";
import { ArrowLeft, MapPin, Check, ShieldCheck, Clock } from "@phosphor-icons/react";
import CalendarPicker from "@/components/CalendarPicker";

type Slot = { date: string; duration: "half_am" | "half_pm" | "full" };

const GUIDE = {
  id: 1,
  name: "Youssef A.",
  city: "Marrakech",
  halfDayPrice: 350,
  fullDayPrice: 650,
  img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
};

function durationLabel(d: Slot["duration"]) {
  if (d === "half_am") return "Matin · 4h";
  if (d === "half_pm") return "Après-midi · 4h";
  return "Journée · 8h";
}

export default function BookingPage() {
  const [step,    setStep]    = useState<1|2|3>(1);
  const [slots,   setSlots]   = useState<Slot[]>([]);
  const [total,   setTotal]   = useState(0);
  const [persons, setPersons] = useState(2);

  function handleSlots(newSlots: Slot[], newTotal: number) {
    setSlots(newSlots);
    setTotal(newTotal);
  }

  const extraPercent  = 10;
  const extraPersons  = Math.max(0, persons - 2);
  const extraAmount   = total * (extraPercent / 100) * extraPersons;
  const grandTotal    = total + extraAmount;

  return (
    <div className="bg-sand-200 min-h-screen pb-10">

      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-30 bg-white border-b border-sand-300 h-14 flex items-center px-4 gap-3">
        <a href={`/guide/${GUIDE.id}`} className="w-9 h-9 rounded-full border border-sand-300 flex items-center justify-center text-charcoal-700 hover:border-bronze-500 transition-colors">
          <ArrowLeft size={16} weight="bold" />
        </a>
        <span className="font-display text-base font-semibold text-charcoal-800 flex-1 text-center">
          Réserver avec {GUIDE.name}
        </span>
        <div className="w-9" />
      </nav>

      {/* ── PROGRESS ── */}
      <div className="bg-white border-b border-sand-200 px-4 py-3">
        <div className="flex items-center max-w-sm mx-auto">
          {[["1","Détails"],["2","Paiement"],["3","Confirmation"]].map(([n, label], i) => (
            <div key={n} className="flex items-center flex-1">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all
                  ${parseInt(n) < step
                    ? "bg-sage-300 text-white"
                    : parseInt(n) === step
                      ? "bg-bronze-500 text-white"
                      : "bg-sand-300 text-charcoal-400"}`}>
                  {parseInt(n) < step ? <Check size={12} weight="bold" /> : n}
                </div>
                <span className={`text-xs font-semibold hidden sm:block
                  ${parseInt(n) <= step ? "text-charcoal-800" : "text-charcoal-400"}`}>
                  {label}
                </span>
              </div>
              {i < 2 && (
                <div className={`flex-1 h-0.5 mx-2 transition-all
                  ${parseInt(n) < step ? "bg-sage-300" : "bg-sand-300"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-5">

        {/* ════ STEP 1 ════ */}
        {step === 1 && (
          <div className="flex flex-col gap-4">

            {/* Guide card */}
            <div className="bg-white rounded-2xl p-4 border border-sand-300 flex items-center gap-3">
              <img src={GUIDE.img} alt={GUIDE.name}
                className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-display text-base font-semibold text-charcoal-800">{GUIDE.name}</div>
                <div className="flex items-center gap-1 text-charcoal-400 text-xs mt-0.5">
                  <MapPin size={11} weight="fill" />
                  <span>{GUIDE.city}</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <ShieldCheck size={11} className="text-sage-300" weight="fill" />
                  <span className="text-[11px] font-bold text-sage-300">Guide certifié</span>
                </div>
              </div>
            </div>

            {/* Calendrier */}
            <div>
              <div className="text-sm font-bold text-charcoal-800 mb-2 px-1">
                Sélectionnez vos créneaux
              </div>
              <CalendarPicker
                priceHalfDay={GUIDE.halfDayPrice}
                priceFullDay={GUIDE.fullDayPrice}
                onSelectionChange={handleSlots}
              />
            </div>

            {/* Nombre de personnes */}
            <div className="bg-white rounded-2xl p-4 border border-sand-300">
              <div className="text-sm font-bold text-charcoal-800 mb-3">Nombre de personnes</div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-charcoal-700">Voyageurs</div>
                  {persons > 2 && (
                    <div className="text-xs text-charcoal-400 mt-0.5">
                      +{extraPercent}% par pers. supplémentaire
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setPersons(Math.max(1, persons - 1))}
                    className="w-9 h-9 rounded-full border-2 border-sand-300 flex items-center justify-center text-charcoal-600 font-bold text-lg hover:border-bronze-500 hover:text-bronze-500 transition-colors"
                  >−</button>
                  <span className="font-display text-xl font-bold text-charcoal-800 w-6 text-center">{persons}</span>
                  <button
                    onClick={() => setPersons(persons + 1)}
                    className="w-9 h-9 rounded-full bg-bronze-500 flex items-center justify-center text-white font-bold text-lg hover:bg-bronze-600 transition-colors"
                  >+</button>
                </div>
              </div>
            </div>

            {/* Récap total */}
            {slots.length > 0 && (
              <div className="bg-white rounded-2xl p-4 border border-sand-300">
                <div className="text-sm font-bold text-charcoal-800 mb-3">Récapitulatif</div>
                {slots.map(s => (
                  <div key={s.date} className="flex justify-between text-sm py-1.5 border-b border-sand-200 last:border-0">
                    <span className="text-charcoal-600">
                      {new Date(s.date + "T00:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                      <span className="text-charcoal-400 ml-1 text-xs">· {durationLabel(s.duration)}</span>
                    </span>
                    <span className="font-semibold text-charcoal-800">
                      {s.duration === "full" ? GUIDE.fullDayPrice : GUIDE.halfDayPrice} MAD
                    </span>
                  </div>
                ))}
                {extraPersons > 0 && (
                  <div className="flex justify-between text-sm py-1.5 border-b border-sand-200">
                    <span className="text-charcoal-600">Supplément {extraPersons} pers.</span>
                    <span className="font-semibold text-charcoal-800">+{extraAmount} MAD</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-3 mt-1">
                  <span className="text-sm font-bold text-charcoal-800">Total</span>
                  <span className="font-display text-xl font-bold text-bronze-500">{grandTotal} MAD</span>
                </div>
              </div>
            )}

            <button
              onClick={() => setStep(2)}
              disabled={slots.length === 0}
              className={`w-full py-4 rounded-2xl text-base font-bold transition-all
                ${slots.length > 0
                  ? "bg-bronze-500 text-white hover:bg-bronze-600 shadow-md"
                  : "bg-sand-300 text-charcoal-400 cursor-not-allowed"}`}
            >
              Continuer vers le paiement →
            </button>
          </div>
        )}

        {/* ════ STEP 2 ════ */}
        {step === 2 && (
          <div className="flex flex-col gap-4">

            {/* Récap */}
            <div className="bg-white rounded-2xl p-4 border border-sand-300">
              <div className="text-sm font-bold text-charcoal-800 mb-3">Récapitulatif de la réservation</div>
              <div className="flex items-center gap-3 bg-sand-200 rounded-xl p-3 mb-3">
                <img src={GUIDE.img} alt={GUIDE.name} className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <div className="text-sm font-bold text-charcoal-800">{GUIDE.name}</div>
                  <div className="text-xs text-charcoal-400 flex items-center gap-1 mt-0.5">
                    <Clock size={10} />{slots.length} créneau{slots.length > 1 ? "x" : ""} · {persons} pers.
                  </div>
                </div>
              </div>
              {slots.map(s => (
                <div key={s.date} className="flex justify-between text-xs py-1.5 border-b border-sand-200 last:border-0 text-charcoal-600">
                  <span>
                    {new Date(s.date + "T00:00:00").toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" })}
                    · {durationLabel(s.duration)}
                  </span>
                  <span className="font-semibold">
                    {s.duration === "full" ? GUIDE.fullDayPrice : GUIDE.halfDayPrice} MAD
                  </span>
                </div>
              ))}
              <div className="flex justify-between items-center pt-3 mt-1">
                <span className="text-sm font-bold text-charcoal-800">Total</span>
                <span className="font-display text-xl font-bold text-bronze-500">{grandTotal} MAD</span>
              </div>
            </div>

            {/* Info paiement cash */}
            <div className="bg-sage-50 border border-sage-300 rounded-2xl p-4 flex items-start gap-3">
              <ShieldCheck size={20} className="text-sage-300 flex-shrink-0 mt-0.5" weight="fill" />
              <div>
                <div className="text-sm font-bold text-charcoal-800 mb-1">Paiement le jour J</div>
                <p className="text-xs text-charcoal-500 leading-relaxed">
                  Aucun paiement maintenant. Vous réglez directement en cash auprès du guide le jour de chaque visite. Annulation gratuite jusqu'à 72h avant.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-4 rounded-2xl border-2 border-sand-300 text-charcoal-600 text-sm font-bold hover:border-bronze-500 transition-colors"
              >
                ← Retour
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-2 flex-grow-[2] py-4 rounded-2xl bg-bronze-500 text-white text-sm font-bold hover:bg-bronze-600 transition-colors shadow-md"
              >
                Confirmer la réservation →
              </button>
            </div>
          </div>
        )}

        {/* ════ STEP 3 ════ */}
        {step === 3 && (
          <div className="text-center pt-6">
            <div className="w-20 h-20 rounded-full bg-sage-300 flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Check size={36} weight="bold" color="#fff" />
            </div>
            <h2 className="font-display text-2xl font-semibold text-charcoal-800 mb-2">
              Réservation confirmée !
            </h2>
            <p className="text-sm text-charcoal-400 mb-8 leading-relaxed">
              Votre guide vous contactera sur WhatsApp dans les 2h pour confirmer chaque créneau.
            </p>

            <div className="bg-white rounded-2xl border border-sand-300 text-left mb-4">
              {[
                ["Guide",       GUIDE.name],
                ["Ville",       GUIDE.city],
                ["Créneaux",    `${slots.length} sélectionné${slots.length > 1 ? "s" : ""}`],
                ["Voyageurs",   `${persons} personne${persons > 1 ? "s" : ""}`],
                ["Total",       `${grandTotal} MAD`],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between items-center px-4 py-3 border-b border-sand-200 last:border-0">
                  <span className="text-xs text-charcoal-400 font-medium">{label}</span>
                  <span className={`text-sm font-bold ${label === "Total" ? "text-bronze-500" : "text-charcoal-800"}`}>
                    {val}
                  </span>
                </div>
              ))}
            </div>

            <a
              href="/"
              className="block w-full py-4 rounded-2xl bg-bronze-500 text-white text-base font-bold hover:bg-bronze-600 transition-colors text-center no-underline"
            >
              Retour à l'accueil
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
