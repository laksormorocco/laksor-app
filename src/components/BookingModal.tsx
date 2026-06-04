"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import CalendarPicker from "@/components/CalendarPicker";
import {
  X, CaretLeft, User, Sun, SunHorizon, Users, Baby,
  Minus, Plus, Car, CreditCard, Money, Lock, CalendarBlank
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

export default function BookingModal({ guideName, halfDayPrice, fullDayPrice, guideId }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const [duration, setDuration] = useState<"half"|"full">("half");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [selectedHour, setSelectedHour] = useState("10h00");
  const [transport, setTransport] = useState(false);
  const [payment, setPayment] = useState("deposit");
  const [loading, setLoading] = useState(false);
  const [bookedDates, setBookedDates] = useState<{date:string;duration:string}[]>([]);

  useEffect(() => {
    fetch("/api/guide/availability?guideId=" + guideId)
      .then(r => r.json())
      .then(d => setBookedDates(d.bookedDates || []));
  }, [guideId]);

  const pricePerDay = duration === "full" ? fullDayPrice : halfDayPrice;
  const persons = adults + children;
  const extraPersonCost = persons > 2 ? Math.round(total * (persons - 2) * 0.1) : 0;
  const transportCost = transport ? 150 : 0;
  const serviceFee = 25;
  const adjustedTotal = total + extraPersonCost + transportCost + (selectedDates.length > 0 ? serviceFee : 0);
  const deposit = Math.round(adjustedTotal * 0.3);

  async function handleOpen() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.href } });
    } else { setOpen(true); }
  }

  async function handleConfirm() {
    if (selectedDates.length === 0) return alert("Choisissez au moins une date !");
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { alert("Connectez-vous"); setLoading(false); return; }
      await fetch("/api/auth/sync", {
        method: "POST", headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ supabaseId: session.user.id, email: session.user.email, name: session.user.user_metadata?.full_name || session.user.email, avatar: session.user.user_metadata?.avatar_url || null })
      });
      const res = await fetch("/api/bookings", {
        method: "POST", headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
          guideId,
          supabaseId: session.user.id,
          date: selectedDates[0],
          duration: duration==="full"?"FULL_DAY":"HALF_DAY",
          persons,
          totalPrice: adjustedTotal,
          notes: `Heure: ${selectedHour}${selectedDates.length > 1 ? " | Dates: " + selectedDates.join(", ") : ""}${transport ? " | Transport inclus" : ""}`
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

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />

      {/* Bottom Sheet */}
      <div className="relative bg-sand-200 rounded-t-3xl w-full max-w-lg mx-auto min-h-[60vh] max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">

        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 bg-sand-300 rounded-full" />
        </div>

        {/* HEADER SAGE */}
        <div className="bg-sage-300 px-5 pt-2 pb-4 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => setOpen(false)} className="flex items-center gap-1.5 bg-white/15 text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20">
              <CaretLeft size={12} weight="bold" /> Fermer
            </button>
            <span className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Réservation</span>
            <button onClick={() => setOpen(false)} className="w-7 h-7 bg-white/15 rounded-full flex items-center justify-center border border-white/20">
              <X size={13} weight="bold" className="text-white" />
            </button>
          </div>

          {/* Guide info */}
          <div className="flex items-center gap-3 pb-3 border-b border-white/15">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <User size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="text-[10px] text-white/50">Réservation avec</div>
              <div className="font-display text-white font-bold text-sm">{guideName}</div>
            </div>
            {selectedDates.length > 0 && (
              <div className="text-right">
                <div className="font-display text-white font-bold text-lg">{adjustedTotal} <span className="text-sm font-normal text-white/60">MAD</span></div>
                {payment === "deposit" && <div className="text-white/50 text-[10px]">Acompte : {deposit} MAD</div>}
              </div>
            )}
          </div>

          {/* Selected service */}
          <div className="mt-3 bg-white/10 border border-white/15 rounded-2xl px-3 py-2.5 flex items-center gap-3">
            {duration === "half" ? <SunHorizon size={18} className="text-white/70 flex-shrink-0" /> : <Sun size={18} className="text-white/70 flex-shrink-0" />}
            <div>
              <div className="text-white text-sm font-bold">{duration === "half" ? "Demi-journée (4h)" : "Journée complète (8h)"}</div>
              <div className="text-white/50 text-[10px]">{duration === "half" ? halfDayPrice : fullDayPrice} MAD · {adults} adulte{adults>1?"s":""}{children>0?` · ${children} enfant${children>1?"s":""}`:""}</div>
            </div>
          </div>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="overflow-y-auto flex-1 px-4 py-3 flex flex-col gap-3">

          {/* DURÉE */}
          <div className="bg-white rounded-2xl border border-sand-300 p-4">
            <div className="text-[10px] font-bold text-charcoal-800 uppercase tracking-widest mb-3">Durée</div>
            <div className="grid grid-cols-2 gap-2">
              {([
                { id:"half", Icon: SunHorizon, label:"Demi-journée", sub:"4 heures", price: halfDayPrice },
                { id:"full", Icon: Sun,        label:"Journée complète", sub:"8 heures", price: fullDayPrice },
              ] as const).map(d => (
                <button key={d.id} onClick={() => setDuration(d.id as "half"|"full")}
                  className={`rounded-xl p-3 border-2 text-left transition-all
                    ${duration===d.id ? "border-bronze-500 bg-amber-50" : "border-sand-300 bg-sand-200"}`}>
                  <d.Icon size={18} className={duration===d.id ? "text-bronze-500" : "text-charcoal-400"} />
                  <div className={`text-sm font-bold mt-1 ${duration===d.id ? "text-bronze-500" : "text-charcoal-800"}`}>{d.label}</div>
                  <div className="text-[10px] text-charcoal-400">{d.sub}</div>
                  <div className={`font-display text-base font-bold mt-1 ${duration===d.id ? "text-bronze-500" : "text-charcoal-800"}`}>{d.price} <span className="text-xs font-normal text-charcoal-400">MAD</span></div>
                </button>
              ))}
            </div>
          </div>

          {/* CALENDRIER */}
          <div className="bg-white rounded-2xl border border-sand-300 p-4">
            <div className="flex items-center gap-2 mb-3">
              <CalendarBlank size={14} className="text-bronze-500" />
              <div className="text-[10px] font-bold text-charcoal-800 uppercase tracking-widest">Date</div>
            </div>
            <CalendarPicker
              blockedDates={bookedDates.map(b => b.date)}
              priceHalfDay={halfDayPrice}
              priceFullDay={fullDayPrice}
              onSelectionChange={(slots, tot) => {
                setSelectedDates(slots.map(s => s.date));
                setTotal(tot);
              }}
            />
          </div>

          {/* PARTICIPANTS */}
          <div className="bg-white rounded-2xl border border-sand-300 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Users size={14} className="text-bronze-500" />
              <div className="text-[10px] font-bold text-charcoal-800 uppercase tracking-widest">Participants</div>
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
                    className="w-8 h-8 rounded-full border border-sand-300 flex items-center justify-center text-charcoal-800 hover:border-bronze-500 transition-colors">
                    <Minus size={12} weight="bold" />
                  </button>
                  <span className="font-display text-base font-bold text-charcoal-800 w-4 text-center">{p.val}</span>
                  <button onClick={() => p.set(Math.min(20, p.val+1))}
                    className="w-8 h-8 rounded-full bg-charcoal-800 flex items-center justify-center text-white hover:bg-charcoal-600 transition-colors">
                    <Plus size={12} weight="bold" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* TRANSPORT */}
          <div className="bg-white rounded-2xl border border-sand-300 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Car size={16} className="text-bronze-500" />
                <div>
                  <div className="text-sm font-semibold text-charcoal-800">Prise en charge hôtel/riad</div>
                  <div className="text-[10px] text-charcoal-400">+150 MAD aller-retour</div>
                </div>
              </div>
              <button onClick={() => setTransport(!transport)}
                className={`w-12 h-6 rounded-full relative transition-colors flex-shrink-0 ${transport ? "bg-sage-300" : "bg-sand-300"}`}>
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${transport ? "left-6" : "left-0.5"}`} />
              </button>
            </div>
          </div>

          {/* PAIEMENT */}
          <div className="bg-white rounded-2xl border border-sand-300 p-4">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard size={14} className="text-bronze-500" />
              <div className="text-[10px] font-bold text-charcoal-800 uppercase tracking-widest">Paiement</div>
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

          {/* RÉCAP */}
          {selectedDates.length > 0 && (
            <div className="bg-sage-300 rounded-2xl p-4">
              <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3">Récapitulatif</div>
              <div className="flex flex-col gap-2 pb-3 border-b border-white/10">
                <div className="flex justify-between text-xs">
                  <span className="text-white/60">{duration==="half"?"Demi-journée":"Journée"} · {selectedDates.length} jour{selectedDates.length>1?"s":""} · {persons} pers.</span>
                  <span className="text-white font-semibold">{total} MAD</span>
                </div>
                {extraPersonCost > 0 && (
                  <div className="flex justify-between text-xs">
                    <span className="text-white/60">+10% pers. supplémentaires</span>
                    <span className="text-white font-semibold">+{extraPersonCost} MAD</span>
                  </div>
                )}
                {transport && (
                  <div className="flex justify-between text-xs">
                    <span className="text-white/60">Transport</span>
                    <span className="text-white font-semibold">+150 MAD</span>
                  </div>
                )}
                <div className="flex justify-between text-xs">
                  <span className="text-white/60">Frais de service</span>
                  <span className="text-white font-semibold">+{serviceFee} MAD</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/30">Commission Laksor (25%)</span>
                  <span className="text-white/30">inclus</span>
                </div>
              </div>
              <div className="flex justify-between items-baseline mt-3">
                <span className="text-white/40 text-xs">Total</span>
                <div className="text-right">
                  <div className="font-display text-2xl font-bold text-white">{adjustedTotal} <span className="text-sm font-normal text-white/50">MAD</span></div>
                  {payment==="deposit" && <div className="text-white/40 text-[10px]">Acompte dû : {deposit} MAD</div>}
                </div>
              </div>
            </div>
          )}

          {/* BOUTON CONFIRMER */}
          <button
            onClick={handleConfirm}
            disabled={loading || selectedDates.length === 0}
            className={`w-full py-4 rounded-full text-sm font-bold transition-all
              ${selectedDates.length > 0 ? "bg-bronze-500 hover:bg-bronze-600 text-white shadow-lg" : "bg-sand-300 text-charcoal-400 cursor-not-allowed"}`}>
            {loading ? "Envoi en cours..." : selectedDates.length > 0 ? "Confirmer la réservation ✦" : "Sélectionnez une date"}
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[10px] text-charcoal-400 pb-4">
            <Lock size={10} /> Paiement sécurisé · CMI · Visa · Mastercard
          </div>

        </div>
      </div>
    </div>
  );
}
