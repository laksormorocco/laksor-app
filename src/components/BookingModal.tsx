"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import CalendarPicker from "@/components/CalendarPicker";
import {
  X, CaretLeft, CaretRight, User, Users, Baby,
  Minus, Plus, Car, CreditCard, Money, Lock,
  CalendarBlank, CheckCircle, TeaBag, ArrowRight
} from "@phosphor-icons/react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

type Props = { guideName: string; halfDayPrice: number; fullDayPrice: number; guideId: string };

const PAYMENT_OPTIONS = [
  { id: "deposit", Icon: CreditCard, label: "Acompte 30%",    desc: "70% le jour J · Annulation gratuite 72h" },
  { id: "full",    Icon: CreditCard, label: "100% en ligne",  desc: "Annulation gratuite 72h" },
  { id: "cash",    Icon: Money,      label: "Cash le jour J", desc: "Aucun prépaiement requis" },
];

type Step = "dates" | "info" | "recap";

export default function BookingModal({ guideName, halfDayPrice, fullDayPrice, guideId }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("dates");
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [transport, setTransport] = useState(false);
  const [payment, setPayment] = useState("deposit");
  const [loading, setLoading] = useState(false);
  const [bookedDates, setBookedDates] = useState<{date:string;duration:string}[]>([]);
  // Guest info
  const [guestName, setGuestName] = useState("");
  const [guestContact, setGuestContact] = useState("");

  useEffect(() => {
    fetch("/api/guide/availability?guideId=" + guideId)
      .then(r => r.json())
      .then(d => setBookedDates(d.bookedDates || []));
  }, [guideId]);

  const persons = adults + children;
  const extraCost = persons > 2 ? Math.round(total * (persons - 2) * 0.1) : 0;
  const transportCost = transport ? 300 : 0;
  const serviceFee = selectedDates.length > 0 ? 25 : 0;
  const adjustedTotal = total + extraCost + transportCost + serviceFee;
  const deposit = Math.round(adjustedTotal * 0.3);
  const isPaid = payment === "deposit" || payment === "full";

  function handleOpen() { setOpen(true); setStep("dates"); }

  async function handleConfirm() {
    if (selectedDates.length === 0) return alert("Choisissez au moins une date !");
    if (!guestName.trim() || !guestContact.trim()) return alert("Renseignez vos coordonnées !");
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const supabaseId = session?.user?.id;
      if (session) {
        await fetch("/api/auth/sync", {
          method: "POST", headers: {"Content-Type":"application/json"},
          body: JSON.stringify({ supabaseId, email: session.user.email, name: session.user.user_metadata?.full_name || guestName, avatar: session.user.user_metadata?.avatar_url || null })
        });
      }
      const res = await fetch("/api/bookings", {
        method: "POST", headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
          guideId,
          supabaseId: supabaseId || null,
          guestName,
          guestContact,
          date: selectedDates[0],
          duration: "HALF_DAY",
          persons,
          totalPrice: adjustedTotal,
          paymentMethod: payment,
          transport,
          notes: selectedDates.length > 1 ? "Dates: " + selectedDates.join(", ") : ""
        })
      });
      const data = await res.json();
      if (!res.ok) { alert(data.error || "Erreur"); setLoading(false); return; }
      if (data.whatsappUrl) window.open(data.whatsappUrl, "_blank");
      router.push("/booking/confirmation?guide=" + encodeURIComponent(guideName) + "&price=" + adjustedTotal + "&persons=" + persons);
    } catch(e) { alert("Erreur reseau"); }
    setLoading(false);
  }

  if (!open) return (
    <button onClick={handleOpen} className="w-full bg-sage-300 hover:bg-sage-400 text-white font-bold py-4 rounded-full text-sm transition-colors flex items-center justify-center gap-2">
      <CalendarBlank size={18} weight="bold" />
      Vérifier les disponibilités
    </button>
  );

  const STEPS = ["dates", "info", "recap"];
  const stepIndex = STEPS.indexOf(step);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />

      <div className="relative bg-sand-200 rounded-t-3xl w-full max-w-lg mx-auto max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">

        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 bg-sand-300 rounded-full" />
        </div>

        {/* HEADER */}
        <div className="bg-sage-300 px-5 pt-2 pb-4 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => step === "dates" ? setOpen(false) : setStep(STEPS[stepIndex-1] as Step)}
              className="flex items-center gap-1.5 bg-white/15 text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20">
              <CaretLeft size={12} weight="bold" /> {step === "dates" ? "Fermer" : "Retour"}
            </button>

            {/* Steps indicator */}
            <div className="flex items-center gap-1.5">
              {["Dates","Infos","Récap"].map((s, i) => (
                <div key={s} className="flex items-center gap-1">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold
                    ${i <= stepIndex ? "bg-white text-sage-300" : "bg-white/20 text-white/50"}`}>
                    {i < stepIndex ? "✓" : i+1}
                  </div>
                  {i < 2 && <div className={`w-4 h-px ${i < stepIndex ? "bg-white" : "bg-white/20"}`} />}
                </div>
              ))}
            </div>

            <button onClick={() => setOpen(false)} className="w-7 h-7 bg-white/15 rounded-full flex items-center justify-center border border-white/20">
              <X size={13} weight="bold" className="text-white" />
            </button>
          </div>

          {/* Guide + prix */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <User size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="text-[10px] text-white/50">Réservation avec</div>
              <div className="font-display text-white font-bold text-sm">{guideName}</div>
            </div>
            {adjustedTotal > 0 && (
              <div className="text-right">
                <div className="font-display text-white font-bold text-lg">{adjustedTotal} <span className="text-sm font-normal text-white/60">MAD</span></div>
                {payment === "deposit" && <div className="text-white/50 text-[10px]">Acompte : {deposit} MAD</div>}
              </div>
            )}
          </div>
        </div>

        {/* CONTENT */}
        <div className="overflow-y-auto flex-1 px-4 py-3 flex flex-col gap-3">

          {/* ══ STEP 1 : DATES ══ */}
          {step === "dates" && (
            <>
              {/* Calendrier */}
              <div className="bg-white rounded-2xl border border-sand-300 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CalendarBlank size={14} className="text-bronze-500" />
                  <span className="text-[10px] font-bold text-charcoal-800 uppercase tracking-widest">Choisissez vos dates</span>
                </div>
                <CalendarPicker
                  blockedDates={bookedDates.map((b: any) => b.date)}
                  priceHalfDay={halfDayPrice}
                  priceFullDay={fullDayPrice}
                  onSelectionChange={(slots: any[], t: number) => {
                    setSelectedDates(slots.map((s: any) => s.date));
                    setTotal(t);
                  }}
                />
              </div>

              {/* Participants */}
              <div className="bg-white rounded-2xl border border-sand-300 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Users size={14} className="text-bronze-500" />
                  <span className="text-[10px] font-bold text-charcoal-800 uppercase tracking-widest">Participants</span>
                </div>
                {[
                  { label:"Adultes", desc:"12 ans +", Icon: Users, val: adults, set: setAdults, min: 1 },
                  { label:"Enfants", desc:"Moins de 12 ans", Icon: Baby, val: children, set: setChildren, min: 0 },
                ].map(p => (
                  <div key={p.label} className="flex items-center justify-between py-2.5 border-b border-sand-200 last:border-0">
                    <div className="flex items-center gap-2">
                      <p.Icon size={16} className="text-charcoal-400" />
                      <div>
                        <div className="text-sm font-semibold text-charcoal-800">{p.label}</div>
                        <div className="text-[10px] text-charcoal-400">{p.desc}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => p.set(Math.max(p.min, p.val-1))}
                        className="w-8 h-8 rounded-full border border-sand-300 flex items-center justify-center hover:border-bronze-500 transition-colors">
                        <Minus size={12} weight="bold" className="text-charcoal-800" />
                      </button>
                      <span className="font-display text-base font-bold text-charcoal-800 w-4 text-center">{p.val}</span>
                      <button onClick={() => p.set(Math.min(20, p.val+1))}
                        className="w-8 h-8 rounded-full bg-charcoal-800 flex items-center justify-center hover:bg-charcoal-600 transition-colors">
                        <Plus size={12} weight="bold" className="text-white" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Transport */}
              <div className="bg-white rounded-2xl border border-sand-300 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Car size={16} className="text-bronze-500" />
                    <div>
                      <div className="text-sm font-semibold text-charcoal-800">Prise en charge hôtel/riad</div>
                      <div className="text-[10px] text-charcoal-400">+300 MAD aller-retour</div>
                    </div>
                  </div>
                  <button onClick={() => setTransport(!transport)}
                    className={`w-12 h-6 rounded-full relative transition-colors flex-shrink-0 ${transport ? "bg-sage-300" : "bg-sand-300"}`}>
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${transport ? "left-6" : "left-0.5"}`} />
                  </button>
                </div>
              </div>

              <button
                onClick={() => selectedDates.length > 0 && setStep("info")}
                className={`w-full py-4 rounded-full text-sm font-bold transition-all flex items-center justify-center gap-2
                  ${selectedDates.length > 0 ? "bg-bronze-500 hover:bg-bronze-600 text-white shadow-lg" : "bg-sand-300 text-charcoal-400 cursor-not-allowed"}`}>
                {selectedDates.length > 0 ? <><CheckCircle size={16} weight="fill" /> Continuer → Vos coordonnées</> : "Sélectionnez une date"}
              </button>
            </>
          )}

          {/* ══ STEP 2 : INFOS ══ */}
          {step === "info" && (
            <>
              <div className="bg-white rounded-2xl border border-sand-300 p-4">
                <div className="text-[10px] font-bold text-charcoal-800 uppercase tracking-widest mb-1">Vos coordonnées</div>
                <div className="text-xs text-charcoal-400 mb-4">Pour vous envoyer les détails de votre réservation</div>
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-charcoal-600 uppercase tracking-wide mb-1 block">Nom complet *</label>
                    <input value={guestName} onChange={e => setGuestName(e.target.value)}
                      placeholder="Mohammed El Fassi"
                      className="w-full border border-sand-300 rounded-xl px-4 py-3 text-sm text-charcoal-800 outline-none focus:border-bronze-500 transition-colors bg-sand-100" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-charcoal-600 uppercase tracking-wide mb-1 block">Email ou WhatsApp *</label>
                    <input value={guestContact} onChange={e => setGuestContact(e.target.value)}
                      placeholder="email@exemple.com ou +212 6XX XXX XXX"
                      className="w-full border border-sand-300 rounded-xl px-4 py-3 text-sm text-charcoal-800 outline-none focus:border-bronze-500 transition-colors bg-sand-100" />
                    <div className="text-[10px] text-charcoal-400 mt-1">📱 Le guide vous contactera 72h avant la visite</div>
                  </div>
                </div>
              </div>

              {/* Paiement */}
              <div className="bg-white rounded-2xl border border-sand-300 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard size={14} className="text-bronze-500" />
                  <span className="text-[10px] font-bold text-charcoal-800 uppercase tracking-widest">Mode de paiement</span>
                </div>
                <div className="flex flex-col gap-2">
                  {PAYMENT_OPTIONS.map(opt => (
                    <button key={opt.id} onClick={() => setPayment(opt.id)}
                      className={`flex items-center justify-between p-3 rounded-xl border-2 text-left transition-all
                        ${payment===opt.id ? "border-bronze-500 bg-amber-50" : "border-sand-300 bg-sand-200"}`}>
                      <div>
                        <div className={`text-sm font-bold ${payment===opt.id ? "text-bronze-500" : "text-charcoal-800"}`}>{opt.label}</div>
                        <div className="text-[10px] text-charcoal-400 mt-0.5">{opt.desc}</div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0
                        ${payment===opt.id ? "border-bronze-500 bg-bronze-500" : "border-sand-300 bg-white"}`}>
                        {payment===opt.id && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* The bienvenu */}
              {isPaid && (
                <div className="bg-amber-50 border border-bronze-500/30 rounded-2xl p-3 flex items-center gap-3">
                  <TeaBag size={20} className="text-bronze-500 flex-shrink-0" weight="duotone" />
                  <div>
                    <div className="text-xs font-bold text-bronze-500">🍵 Thé de bienvenu offert !</div>
                    <div className="text-[10px] text-charcoal-400 mt-0.5">Offert chez un café partenaire Laksor avec ce mode de paiement</div>
                  </div>
                </div>
              )}

              <button
                onClick={() => guestName.trim() && guestContact.trim() && setStep("recap")}
                className={`w-full py-4 rounded-full text-sm font-bold transition-all flex items-center justify-center gap-2
                  ${guestName.trim() && guestContact.trim() ? "bg-bronze-500 hover:bg-bronze-600 text-white shadow-lg" : "bg-sand-300 text-charcoal-400 cursor-not-allowed"}`}>
                <ArrowRight size={16} weight="bold" /> Voir le récapitulatif
              </button>
            </>
          )}

          {/* ══ STEP 3 : RECAP ══ */}
          {step === "recap" && (
            <>
              {/* Résumé */}
              <div className="bg-white rounded-2xl border border-sand-300 p-4">
                <div className="text-[10px] font-bold text-charcoal-800 uppercase tracking-widest mb-3">Récapitulatif</div>
                <div className="flex flex-col gap-2.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-charcoal-400">Dates</span>
                    <span className="font-semibold text-charcoal-800">{selectedDates.length} jour{selectedDates.length>1?"s":""}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-charcoal-400">Participants</span>
                    <span className="font-semibold text-charcoal-800">{persons} pers.</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-charcoal-400">Transport</span>
                    <span className="font-semibold text-charcoal-800">{transport ? "+300 MAD" : "Non"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-charcoal-400">Paiement</span>
                    <span className="font-semibold text-charcoal-800">{payment === "deposit" ? "Acompte 30%" : payment === "full" ? "100% en ligne" : "Cash"}</span>
                  </div>
                  {extraCost > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-charcoal-400">Supplément pers.</span>
                      <span className="font-semibold text-charcoal-800">+{extraCost} MAD</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-charcoal-400">Frais de service</span>
                    <span className="font-semibold text-charcoal-800">+{serviceFee} MAD</span>
                  </div>
                  <div className="border-t border-sand-200 pt-2.5 flex justify-between">
                    <span className="font-bold text-charcoal-800">Total</span>
                    <span className="font-display text-xl font-bold text-charcoal-800">{adjustedTotal} MAD</span>
                  </div>
                  {payment === "deposit" && (
                    <div className="text-[11px] text-bronze-500 font-semibold text-right">Acompte dû maintenant : {deposit} MAD</div>
                  )}
                </div>
              </div>

              {/* Coordonnées */}
              <div className="bg-white rounded-2xl border border-sand-300 p-4">
                <div className="text-[10px] font-bold text-charcoal-800 uppercase tracking-widest mb-2">Vos informations</div>
                <div className="text-sm text-charcoal-800 font-semibold">{guestName}</div>
                <div className="text-xs text-charcoal-400">{guestContact}</div>
              </div>

              {/* The bienvenu recap */}
              {isPaid && (
                <div className="bg-amber-50 border border-bronze-500/30 rounded-2xl p-3 flex items-center gap-3">
                  <TeaBag size={20} className="text-bronze-500 flex-shrink-0" weight="duotone" />
                  <div className="text-xs font-bold text-bronze-500">🍵 Thé de bienvenu offert chez un café partenaire Laksor</div>
                </div>
              )}

              <button
                onClick={handleConfirm}
                disabled={loading}
                className={`w-full py-4 rounded-full text-sm font-bold transition-all
                  ${!loading ? "bg-bronze-500 hover:bg-bronze-600 text-white shadow-lg" : "bg-sand-300 text-charcoal-400 cursor-not-allowed"}`}>
                {loading ? "Envoi en cours..." : "Confirmer la réservation ✦"}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-charcoal-400 pb-4">
                <Lock size={10} /> Paiement sécurisé · CMI · Visa · Mastercard
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  , document.body);
}
