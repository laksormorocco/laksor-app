"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter, useParams } from "next/navigation";
import { useExchangeRate } from "@/hooks/useExchangeRate";
import CalendarPicker from "@/components/CalendarPicker";
import {
  ArrowLeft, Users, Baby, Minus, Plus, Car,
  CreditCard, Money, Lock, CalendarBlank,
  CheckCircle, TeaBag, ArrowRight, MapPin, Star
} from "@phosphor-icons/react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

const PAYMENT_OPTIONS = [
  { id: "deposit", Icon: CreditCard, label: "Acompte 30%", badge: "Recommandé", desc: "70% le jour J · Annulation gratuite 72h" },
  { id: "full",    Icon: CreditCard, label: "100% en ligne", badge: null, desc: "Annulation gratuite 72h" },
  { id: "cash",    Icon: Money,      label: "Cash le jour J", badge: null, desc: "Aucun prépaiement requis" },
];

type Step = "dates" | "info" | "recap";

export default function BookingPage() {
  const router = useRouter();
  const params = useParams();
  const guideId = params.guideId as string;

  const [guide, setGuide] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<Step>("dates");
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [transport, setTransport] = useState(false);
  const [payment, setPayment] = useState("deposit");
  const [bookedDates, setBookedDates] = useState<{date:string;duration:string}[]>([]);
  const [guestName, setGuestName] = useState("");
  const [guestContact, setGuestContact] = useState("");

  useEffect(() => {
    if (!guideId) return;
    Promise.all([
      fetch("/api/guide/public?guideId=" + guideId).then(r => r.json()),
      fetch("/api/guide/availability?guideId=" + guideId).then(r => r.json()),
    ]).then(([guideData, availData]) => {
      setGuide(guideData.guide);
      setBookedDates(availData.bookedDates || []);
      setLoading(false);
    });
  }, [guideId]);

  const persons = adults + children;
  const extraCost = persons > 2 ? Math.round(total * (persons - 2) * 0.15) : 0;
  const transportCost = transport ? 300 : 0;
  const serviceFee = selectedDates.length > 0 ? 25 : 0;
  const adjustedTotal = total + extraCost + transportCost + serviceFee;
  const deposit = Math.round(adjustedTotal * 0.3);
  const isPaid = payment === "deposit" || payment === "full";
  const { convert } = useExchangeRate();

  async function handleConfirm() {
    if (!guestName.trim() || !guestContact.trim()) return alert("Renseignez vos coordonnées !");
    setSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await fetch("/api/auth/sync", {
          method: "POST", headers: {"Content-Type":"application/json"},
          body: JSON.stringify({ supabaseId: session.user.id, email: session.user.email, name: session.user.user_metadata?.full_name || guestName, avatar: session.user.user_metadata?.avatar_url || null })
        });
      }
      const res = await fetch("/api/bookings", {
        method: "POST", headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
          guideId,
          supabaseId: session?.user?.id || null,
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
      if (!res.ok) { alert(data.error || "Erreur"); setSubmitting(false); return; }
      if (data.whatsappUrl) window.open(data.whatsappUrl, "_blank");
      router.push("/booking/confirmation?guide=" + encodeURIComponent(guide?.displayName || "") + "&price=" + adjustedTotal + "&persons=" + persons + "&payment=" + payment + "&ref=" + (data.bookingRef || "") + "&dates=" + selectedDates.length + "&transport=" + transport);
    } catch(e) { alert("Erreur reseau"); }
    setSubmitting(false);
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-sand-200">
      <div className="text-4xl animate-pulse">⏳</div>
    </div>
  );

  const STEPS = ["dates", "info", "recap"];
  const stepIndex = STEPS.indexOf(step);

  return (
    <div className="min-h-screen bg-sand-200">

      {/* HEADER */}
      <div className="sticky top-0 z-30 bg-white border-b border-sand-300 px-4 h-14 flex items-center gap-3">
        <button onClick={() => step === "dates" ? router.back() : setStep(STEPS[stepIndex-1] as Step)}
          className="w-9 h-9 rounded-full border border-sand-300 flex items-center justify-center">
          <ArrowLeft size={16} weight="bold" className="text-charcoal-800" />
        </button>
        <div className="flex-1">
          <div className="text-xs text-charcoal-400">Réservation avec</div>
          <div className="font-display text-sm font-bold text-charcoal-800">{guide?.displayName}</div>
        </div>
        <div className="flex items-center gap-1.5">
          {["Dates","Infos","Récap"].map((s, i) => (
            <div key={s} className="flex items-center gap-1">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all
                ${i < stepIndex ? "bg-sage-300 text-white" : i === stepIndex ? "bg-bronze-500 text-white" : "bg-sand-300 text-charcoal-400"}`}>
                {i < stepIndex ? "✓" : i+1}
              </div>
              {i < 2 && <div className={`w-3 h-px ${i < stepIndex ? "bg-sage-300" : "bg-sand-300"}`} />}
            </div>
          ))}
        </div>
      </div>

      {/* GUIDE MINI CARD */}
      <div className="bg-white border-b border-sand-300 px-4 py-3 flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl overflow-hidden bg-sand-300 flex-shrink-0">
          {guide?.avatar
            ? <img src={guide.avatar} className="w-full h-full object-cover" alt={guide.displayName} />
            : <div className="w-full h-full flex items-center justify-center font-bold text-charcoal-500 text-lg">{guide?.displayName?.[0]}</div>
          }
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-display text-sm font-bold text-charcoal-800">{guide?.displayName}</span>
            {guide?.avgRating > 0 && (
              <span className="flex items-center gap-1 text-[11px] text-amber-500 font-bold">
                <Star size={11} weight="fill" /> {guide.avgRating}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-charcoal-400">
            <MapPin size={11} /> {guide?.city}
          </div>
        </div>
        <div className="text-right">
          {adjustedTotal > 0 ? (
            <>
              <div className="font-display text-lg font-bold text-charcoal-800">{adjustedTotal} <span className="text-xs font-normal text-charcoal-400">MAD</span></div>
              {payment === "deposit" && <div className="text-[10px] text-bronze-500">Acompte : {deposit} MAD</div>}
            </>
          ) : (
            <>
              <div className="font-display text-lg font-bold text-charcoal-800">{guide?.halfDayPrice} <span className="text-xs font-normal text-charcoal-400">MAD</span></div>
              <div className="text-[10px] text-charcoal-400">pour 2 pers.</div>
            </>
          )}
        </div>
      </div>

      <div className="px-4 pt-4 pb-8 max-w-lg mx-auto flex flex-col gap-3">

        {/* STEP 1 */}
        {step === "dates" && (
          <>
            <div className="bg-white rounded-2xl border border-sand-300 p-4">
              <div className="flex items-center gap-2 mb-3">
                <CalendarBlank size={14} className="text-bronze-500" />
                <span className="text-[10px] font-bold text-charcoal-800 uppercase tracking-widest">Choisissez vos dates</span>
              </div>
              <div className="text-[10px] text-charcoal-400 mb-2">💡 Tarifs affichés pour 2 personnes · +15% par personne supplémentaire
              </div>
              <CalendarPicker
                blockedDates={bookedDates.map((b: any) => b.date)}
                priceHalfDay={guide?.halfDayPrice || 350}
                priceFullDay={guide?.fullDayPrice || 650}
                onSelectionChange={(slots: any[], t: number) => {
                  setSelectedDates(slots.map((s: any) => s.date));
                  setTotal(t);
                }}
              />
            </div>

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

            {persons > 2 && (
              <div className="bg-amber-50 border border-bronze-500/20 rounded-xl px-3 py-2 flex items-center gap-2">
                <span className="text-bronze-500 text-lg">⚠️</span>
                <span className="text-xs text-bronze-500 font-semibold">+15% par personne au-delà de 2 · Supplément estimé : +{extraCost} MAD</span>
              </div>
            )}
            {selectedDates.length > 0 && (
              <div className="bg-white rounded-2xl border border-sand-300 p-4">
                <div className="text-[10px] font-bold text-charcoal-800 uppercase tracking-widest mb-3">Detail du prix</div>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-charcoal-400">Creneaux ({selectedDates.length} jour{selectedDates.length>1?"s":""})</span>
                    <span className="font-semibold text-charcoal-800">{total} MAD</span>
                  </div>
                  {persons > 2 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-amber-600 text-xs font-semibold">+15% x {persons-2} pers. suppl. (base 2 pers.)</span>
                      <span className="font-semibold text-amber-600">+{extraCost} MAD</span>
                    </div>
                  )}
                  {transport && (
                    <div className="flex justify-between text-sm">
                      <span className="text-charcoal-400">Transport</span>
                      <span className="font-semibold text-charcoal-800">+300 MAD</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-charcoal-400">Frais de service</span>
                    <span className="font-semibold text-charcoal-800">+{serviceFee} MAD</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-sand-300">
                    <span className="font-bold text-charcoal-800">Total</span>
                    <span className="font-display text-xl font-bold text-bronze-500">{adjustedTotal} MAD</span>
                  </div>
                </div>
              </div>
            )}
            <button onClick={() => selectedDates.length > 0 && setStep("info")}
              className={`w-full py-4 rounded-full text-sm font-bold transition-all flex items-center justify-center gap-2
                ${selectedDates.length > 0 ? "bg-bronze-500 hover:bg-bronze-600 text-white shadow-lg" : "bg-sand-300 text-charcoal-400 cursor-not-allowed"}`}>
              {selectedDates.length > 0 ? <><CheckCircle size={16} weight="fill" /> Continuer → Vos coordonnées</> : "Sélectionnez une date"}
            </button>
          </>
        )}

        {/* STEP 2 */}
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

            {isPaid && (
              <div className="bg-amber-50 border border-bronze-500/30 rounded-2xl p-3 flex items-center gap-3">
                <TeaBag size={20} className="text-bronze-500 flex-shrink-0" weight="duotone" />
                <div>
                  <div className="text-xs font-bold text-bronze-500">🍵 Thé de bienvenu offert !</div>
                  <div className="text-[10px] text-charcoal-400 mt-0.5">Offert chez un café partenaire Laksor avec ce mode de paiement</div>
                </div>
              </div>
            )}

            <button onClick={() => guestName.trim() && guestContact.trim() && setStep("recap")}
              className={`w-full py-4 rounded-full text-sm font-bold transition-all flex items-center justify-center gap-2
                ${guestName.trim() && guestContact.trim() ? "bg-bronze-500 hover:bg-bronze-600 text-white shadow-lg" : "bg-sand-300 text-charcoal-400 cursor-not-allowed"}`}>
              <ArrowRight size={16} weight="bold" /> Voir le récapitulatif
            </button>
          </>
        )}

        {/* STEP 3 */}
        {step === "recap" && (
          <>
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
                    <span className="text-charcoal-400">+15% / pers. suppl. (au-delà de 2)</span>
                    <span className="font-semibold text-charcoal-800">+{extraCost} MAD</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-charcoal-400">Frais de service</span>
                  <span className="font-semibold text-charcoal-800">+{serviceFee} MAD</span>
                </div>
                <div className="border-t border-sand-200 pt-2.5 flex justify-between">
                  <span className="font-bold text-charcoal-800">Total</span>
                  <span className="font-display text-xl font-bold text-charcoal-800">{convert(adjustedTotal)} <span className="text-xs font-normal text-charcoal-400">({adjustedTotal} MAD)</span></span>
                </div>
                {payment === "deposit" && (
                  <div className="text-[11px] text-bronze-500 font-semibold text-right">Acompte dû maintenant : {deposit} MAD</div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-sand-300 p-4">
              <div className="text-[10px] font-bold text-charcoal-800 uppercase tracking-widest mb-2">Vos informations</div>
              <div className="text-sm font-semibold text-charcoal-800">{guestName}</div>
              <div className="text-xs text-charcoal-400">{guestContact}</div>
            </div>

            {isPaid && (
              <div className="bg-amber-50 border border-bronze-500/30 rounded-2xl p-3 flex items-center gap-3">
                <TeaBag size={20} className="text-bronze-500 flex-shrink-0" weight="duotone" />
                <div className="text-xs font-bold text-bronze-500">🍵 Thé de bienvenu offert chez un café partenaire Laksor</div>
              </div>
            )}

            <button onClick={handleConfirm} disabled={submitting}
              className={`w-full py-4 rounded-full text-sm font-bold transition-all
                ${!submitting ? "bg-bronze-500 hover:bg-bronze-600 text-white shadow-lg" : "bg-sand-300 text-charcoal-400 cursor-not-allowed"}`}>
              {submitting ? "Envoi en cours..." : "Confirmer la réservation ✦"}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-charcoal-400 pb-4">
              <Lock size={10} /> Paiement sécurisé · CMI · Visa · Mastercard
            </div>
          </>
        )}
      </div>
    </div>
  );
}
