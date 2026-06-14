"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useExchangeRate } from "@/hooks/useExchangeRate";
import { priceWithCommission, priceWithFees, expTotalPrice } from "@/lib/pricing";
import PriceDisplay from "@/components/PriceDisplay";
import CalendarPicker from "@/components/CalendarPicker";
import MiniCal from "@/components/MiniCal";
import {
  ArrowLeft, Users, Baby, Minus, Plus, Car,
  CreditCard, Money, Lock, CalendarBlank, Clock,
  CheckCircle, TeaBag, ArrowRight, MapPin, Star,
  ShieldCheck, SealCheck
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
  const searchParamsHook = useSearchParams();
  const expId = searchParamsHook?.get("expId") || null;
  const tourPriceParam = searchParamsHook?.get("tourPrice") ? Number(searchParamsHook.get("tourPrice")) : null;
  const isExperience = !!expId;
  const bookingType = searchParamsHook?.get("bookingType") || "group";
  const tourTypeParam = searchParamsHook?.get("tourType") || null;

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
  const [startHour, setStartHour] = useState("09:00");
  const [experience, setExperience] = useState<any>(null);
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [hotelLocation, setHotelLocation] = useState<"inside"|"outside">("inside");

  useEffect(() => {
    if (!expId) return;
    fetch("/api/admin/experiences?id=" + expId)
      .then(r => r.json())
      .then(d => { if (d.experience) setExperience(d.experience); });
  }, [expId]);

  useEffect(() => {
    if (!guideId) return;
    const requests: Promise<any>[] = [
      fetch("/api/guide/public?guideId=" + guideId).then(r => r.json()),
      fetch("/api/guide/availability?guideId=" + guideId).then(r => r.json()),
    ];
    Promise.all(requests).then(([guideData, availData]) => {
      setGuide(guideData.guide);
      setBookedDates(availData.bookedDates || []);
      setLoading(false);
    });
  }, [guideId]);

  const persons = adults + children;
  const expPricePerPerson = searchParamsHook?.get("pricePerPerson") === "true";
  const expMaxPersons = Number(searchParamsHook?.get("maxPersons") || 1);
  const t1 = experience ? (experience.groupThreshold1 || null) : (searchParamsHook?.get("t1") ? Number(searchParamsHook.get("t1")) : null);
  const d1 = experience ? (experience.groupDiscount1 || null) : (searchParamsHook?.get("d1") ? Number(searchParamsHook.get("d1")) : null);
  const t2 = experience ? (experience.groupThreshold2 || null) : (searchParamsHook?.get("t2") ? Number(searchParamsHook.get("t2")) : null);
  const d2 = experience ? (experience.groupDiscount2 || null) : (searchParamsHook?.get("d2") ? Number(searchParamsHook.get("d2")) : null);
  const expBasePrice = isExperience && tourPriceParam ? expTotalPrice(tourPriceParam, persons, t1, d1, t2, d2) : 0;
  const expFullPrice = isExperience && tourPriceParam ? (tourPriceParam * persons) : 0;
  const expDiscount = expFullPrice - expBasePrice;
  const extraPersonPrice = guide?.extraPersonPrice || 200;
  const extraCost = isExperience ? 0 : (persons > 4 ? (persons - 4) * extraPersonPrice : 0);
  const transportExtraFee = persons * 110;
  const transportCost = bookingType === "private" ? 0 : (transport && hotelLocation === "outside" ? transportExtraFee : 0);
  const serviceFee = 25;
  const adjustedTotal = isExperience ? expBasePrice + transportCost + serviceFee : total + extraCost + transportCost + serviceFee;
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
          guideId, supabaseId: session?.user?.id || null,
          guestName, guestContact,
          date: selectedDates[0], duration: "HALF_DAY", persons,
          totalPrice: adjustedTotal, paymentMethod: payment, transport,
          notes: selectedDates.length > 1 ? "Dates: " + selectedDates.join(", ") : "",
          expId: expId || null, startTime: selectedSlot || startHour, tourType: tourTypeParam || null
        })
      });
      const data = await res.json();
      if (!res.ok) { alert(data.error || "Erreur"); setSubmitting(false); return; }
      if (data.whatsappUrl) window.open(data.whatsappUrl, "_blank");
      router.push("/booking/confirmation/" + data.booking.id);
    } catch(e) { alert("Erreur reseau"); }
    setSubmitting(false);
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{background:"#F6F1E8"}}>
      <div className="w-12 h-12 border-4 border-bronze-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const STEPS = ["dates", "info", "recap"];
  const stepIndex = STEPS.indexOf(step);

  return (
    <div className="min-h-screen" style={{background:"#F6F1E8"}}>

      {/* HEADER */}
      <div className="sticky top-0 z-30 px-5 pt-4 pb-3"
        style={{background:"rgba(246,241,232,0.92)", backdropFilter:"blur(16px)", borderBottom:"1px solid rgba(184,138,68,0.12)"}}>
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => step === "dates" ? router.back() : setStep(STEPS[stepIndex-1] as Step)}
            className="w-9 h-9 rounded-full bg-white flex items-center justify-center active:scale-95 transition-transform"
            style={{border:"1.5px solid #EADCC8", boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
            <ArrowLeft size={15} weight="bold" className="text-charcoal-800" />
          </button>
          <div className="text-center">
            <div className="text-[10px] text-charcoal-400 uppercase tracking-widest">Réservation</div>
            <div className="font-display text-sm font-bold text-charcoal-800">
              {isExperience && experience ? experience.title : guide?.displayName || "Laksor"}
            </div>
          </div>
          <div className="w-9" />
        </div>
        <div className="flex items-center justify-center gap-1">
          {["Dates","Infos","Récap"].map((s, i) => (
            <div key={s} className="flex items-center gap-1">
              <div className={"w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all " + (i < stepIndex ? "bg-sage-300 text-white" : i === stepIndex ? "text-white" : "bg-sand-200 text-charcoal-400")}
                style={i === stepIndex ? {background:"linear-gradient(135deg, #B88A44, #9A7238)", boxShadow:"0 0 0 3px rgba(184,138,68,0.2)"} : {}}>
                {i < stepIndex ? "✓" : i+1}
              </div>
              {i < 2 && <div className={"w-8 h-0.5 rounded-full transition-all " + (i < stepIndex ? "bg-sage-300" : "bg-sand-200")} />}
            </div>
          ))}
        </div>
      </div>

      {/* RECAP CARD */}
      <div className="mx-4 mt-3 rounded-2xl bg-white flex items-center gap-3 p-3.5"
        style={{boxShadow:"0 2px 16px rgba(0,0,0,0.08)", border:"1px solid #F0EDE7"}}>
        <div className="w-12 h-12 rounded-2xl overflow-hidden flex-shrink-0"
          style={{background:"rgba(184,138,68,0.1)", border:"2px solid #EADCC8"}}>
          {guide?.avatar
            ? <img src={guide.avatar} className="w-full h-full object-cover" alt={guide?.displayName} />
            : <div className="w-full h-full flex items-center justify-center font-display text-xl font-bold" style={{color:"#B88A44"}}>{guide?.displayName?.[0] || "L"}</div>
          }
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-display text-sm font-bold text-charcoal-800 truncate">
            {isExperience && experience ? experience.title : guide?.displayName}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <MapPin size={10} className="text-charcoal-400 flex-shrink-0" />
            <span className="text-[11px] text-charcoal-400">{guide?.city || "Marrakech"}</span>
            <span className="text-[10px] font-semibold" style={{color:"#7D8F69"}}>✦ Certifié</span>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="font-display text-lg font-bold leading-tight" style={{color:"#B88A44"}}>
            {(adjustedTotal > 0 || isExperience) ? convert(adjustedTotal) : <PriceDisplay mad={priceWithCommission(Number(guide?.halfDayPrice || 0))} size="lg" />}
          </div>
          <div className="text-[10px] text-charcoal-400">
            {(adjustedTotal > 0 || isExperience) ? adjustedTotal + " MAD" : "pour 2 pers."}
          </div>
          {payment === "deposit" && adjustedTotal > 0 && (
            <div className="text-[10px] font-semibold" style={{color:"#B88A44"}}>Acompte {convert(deposit)}</div>
          )}
        </div>
      </div>

      <div className="px-4 pt-4 pb-36 max-w-lg mx-auto flex flex-col gap-3">

        {/* STEP 1 */}
        {step === "dates" && (
          <>
            <div className="bg-white rounded-2xl p-4" style={{boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:"rgba(184,138,68,0.12)"}}>
                  <CalendarBlank size={15} weight="duotone" className="text-bronze-500" />
                </div>
                <div>
                  <div className="font-display text-sm font-semibold text-charcoal-800">Choisissez votre date</div>
                  {tourPriceParam && <div className="text-[11px] text-charcoal-400">{convert(tourPriceParam)} par personne · {bookingType === "private" ? "🔒 Privé" : "👥 Groupe"}</div>}
                </div>
              </div>
              {isExperience ? (
                <div className="flex flex-col gap-4">
                  <MiniCal value={selectedDates[0] || ""} onChange={v => setSelectedDates([v])} />
                  {bookingType === "group" && experience?.departureSlots?.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <Clock size={12} className="text-charcoal-400" />
                        <span className="text-[11px] font-semibold text-charcoal-400 uppercase tracking-wide">Créneau de départ</span>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {experience.departureSlots.map((slot:string) => (
                          <button key={slot} onClick={() => setSelectedSlot(slot)}
                            className={"flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold border-2 transition-all " + (selectedSlot === slot ? "text-white border-transparent" : "bg-white text-charcoal-600 border-sand-300")}
                            style={selectedSlot === slot ? {background:"linear-gradient(135deg, #B88A44, #9A7238)", boxShadow:"0 4px 12px rgba(184,138,68,0.3)"} : {}}>
                            <Clock size={12} weight={selectedSlot === slot ? "fill" : "regular"} /> {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {bookingType === "private" && (
                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <Clock size={12} className="text-charcoal-400" />
                        <span className="text-[11px] font-semibold text-charcoal-400 uppercase tracking-wide">Votre heure de départ</span>
                      </div>
                      <input type="time" value={selectedSlot} onChange={e => setSelectedSlot(e.target.value)}
                        className="w-full border-2 border-sand-300 rounded-xl px-4 py-3 text-sm font-semibold outline-none bg-white" />
                      <div className="text-[10px] text-charcoal-400 mt-1.5 ml-1">Choisissez l'heure qui vous convient</div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <MiniCal value={selectedDates[0] || ""} onChange={v => {
                    setSelectedDates([v]);
                    setTotal(tourPriceParam || priceWithCommission(guide?.halfDayPrice || 350));
                  }} />
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Clock size={12} className="text-charcoal-400" />
                      <span className="text-[11px] font-semibold text-charcoal-400 uppercase tracking-wide">Heure de début</span>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1" style={{scrollbarWidth:"none"}}>
                      {["07:00","08:00","09:00","10:00","11:00","12:00","14:00","15:00","16:00"].map(h => (
                        <button key={h} onClick={() => setStartHour(h)}
                          className={"flex-shrink-0 px-3 py-2 rounded-xl text-xs font-semibold border-2 transition-all " + (startHour === h ? "text-white border-transparent" : "bg-white text-charcoal-500 border-sand-300")}
                          style={startHour === h ? {background:"linear-gradient(135deg, #B88A44, #9A7238)"} : {}}>
                          {h}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl p-4" style={{boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:"rgba(184,138,68,0.12)"}}>
                  <Users size={15} weight="duotone" className="text-bronze-500" />
                </div>
                <div>
                  <div className="font-display text-sm font-semibold text-charcoal-800">Participants</div>
                  <div className="text-[11px] text-charcoal-400">{persons} personne{persons > 1 ? "s" : ""} sélectionnée{persons > 1 ? "s" : ""}</div>
                </div>
              </div>
              {adults < 2 && (
                <div className="mb-3 px-3 py-2 rounded-xl text-[11px] font-semibold" style={{background:"rgba(239,68,68,0.06)", color:"#ef4444"}}>
                  ⚠️ Minimum 2 participants requis pour cette réservation
                </div>
              )}
              {[
                { label:"Adultes", desc:"12 ans +", Icon: Users, val: adults, set: setAdults, min: 2 },
                { label:"Enfants", desc:"Moins de 12 ans · -50%", Icon: Baby, val: children, set: setChildren, min: 0 },
              ].map(p => (
                <div key={p.label} className="flex items-center justify-between py-3 border-b border-sand-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{background:"#F6F1E8"}}>
                      <p.Icon size={16} className="text-charcoal-500" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-charcoal-800">{p.label}</div>
                      <div className="text-[10px] text-charcoal-400">{p.desc}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => p.set(Math.max(p.min, p.val-1))} disabled={p.val <= p.min}
                      className="w-9 h-9 rounded-full border-2 border-sand-300 flex items-center justify-center transition-all hover:border-bronze-500 active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed">
                      <Minus size={13} weight="bold" className="text-charcoal-700" />
                    </button>
                    <span className="font-display text-lg font-bold text-charcoal-800 w-6 text-center">{p.val}</span>
                    <button onClick={() => p.set(Math.min(20, p.val+1))}
                      className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90"
                      style={{background:"linear-gradient(135deg, #B88A44, #9A7238)", boxShadow:"0 3px 10px rgba(184,138,68,0.35)"}}>
                      <Plus size={13} weight="bold" className="text-white" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {bookingType === "private" ? (
              <div className="rounded-2xl p-4 flex items-center gap-3" style={{background:"rgba(125,143,105,0.08)", border:"1.5px solid rgba(125,143,105,0.2)"}}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:"rgba(125,143,105,0.15)"}}>
                  <Car size={18} weight="duotone" className="text-sage-300" />
                </div>
                <div>
                  <div className="text-sm font-bold text-charcoal-800">Ramassage inclus 🎉</div>
                  <div className="text-[11px] text-charcoal-500 mt-0.5">Nous venons vous chercher où vous êtes</div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-4" style={{boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:"rgba(184,138,68,0.12)"}}>
                    <MapPin size={15} weight="duotone" className="text-bronze-500" />
                  </div>
                  <div className="font-display text-sm font-semibold text-charcoal-800">Votre lieu de résidence</div>
                </div>
                <div className="flex p-1 rounded-2xl mb-3" style={{background:"#F6F1E8"}}>
                  <button onClick={() => { setHotelLocation("inside"); setTransport(false); }}
                    className={"flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all " + (hotelLocation === "inside" ? "text-white" : "text-charcoal-500")}
                    style={hotelLocation === "inside" ? {background:"#7D8F69", boxShadow:"0 3px 10px rgba(125,143,105,0.35)"} : {}}>
                    ✅ Dans Marrakech
                  </button>
                  <button onClick={() => { setHotelLocation("outside"); setTransport(true); }}
                    className={"flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all " + (hotelLocation === "outside" ? "text-white" : "text-charcoal-500")}
                    style={hotelLocation === "outside" ? {background:"#7D8F69", boxShadow:"0 3px 10px rgba(125,143,105,0.35)"} : {}}>
                    ⚠️ Hors Marrakech
                  </button>
                </div>
                {hotelLocation === "outside" && (
                  <div className="rounded-xl p-3 text-xs font-semibold" style={{background:"rgba(125,143,105,0.1)", color:"#7D8F69", border:"1px solid rgba(125,143,105,0.2)"}}>
                    🚐 Frais de ramassage : {convert(transportExtraFee)} · {persons} pers. × 110 MAD
                  </div>
                )}
                {hotelLocation === "inside" && (
                  <div className="text-[11px] text-charcoal-400 ml-1">Ramassage gratuit dans un rayon de 10km du centre</div>
                )}
              </div>
            )}

            {!isExperience && persons > 4 && (
              <div className="rounded-2xl px-4 py-3 flex items-center gap-2" style={{background:"rgba(184,138,68,0.08)", border:"1px solid rgba(184,138,68,0.2)"}}>
                <span>⚠️</span>
                <span className="text-xs font-semibold" style={{color:"#B88A44"}}>+200 MAD / pers. au-delà de 4 · Supplément : +{convert(extraCost)}</span>
              </div>
            )}

            {selectedDates.length > 0 && (
              <div className="bg-white rounded-2xl p-4" style={{boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
                <div className="font-display text-sm font-semibold text-charcoal-800 mb-3">Détail du prix</div>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-charcoal-500">{isExperience ? "Expérience" : `Créneaux (${selectedDates.length} jour${selectedDates.length>1?"s":""})`}</span>
                    <span className="font-semibold text-charcoal-800">{convert(isExperience ? expFullPrice : total)}</span>
                  </div>
                  {!isExperience && persons > 4 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-xs font-semibold" style={{color:"#B88A44"}}>+200 MAD × {persons-4} pers. suppl.</span>
                      <span className="font-semibold" style={{color:"#B88A44"}}>+{convert(extraCost)}</span>
                    </div>
                  )}
                  {transport && hotelLocation === "outside" && (
                    <div className="flex justify-between text-sm">
                      <span className="text-charcoal-500">Ramassage hors zone</span>
                      <span className="font-semibold text-charcoal-800">+{convert(transportExtraFee)}</span>
                    </div>
                  )}
                  {isExperience && expDiscount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold" style={{color:"#7D8F69"}}>Réduction groupe ({persons} pers.)</span>
                      <span className="font-semibold" style={{color:"#7D8F69"}}>-{convert(expDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-charcoal-400">Frais de service <span className="text-[10px] opacity-50">(plateforme)</span></span>
                    <span className="font-semibold text-charcoal-800">+{convert(serviceFee)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-sand-200">
                    <span className="font-bold text-charcoal-800">Total</span>
                    <span className="font-display text-xl font-bold" style={{color:"#B88A44"}}>{convert(adjustedTotal)}</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* STEP 2 */}
        {step === "info" && (
          <>
            <div className="bg-white rounded-2xl p-4" style={{boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
              <div className="font-display text-sm font-semibold text-charcoal-800 mb-1">Vos coordonnées</div>
              <div className="text-[11px] text-charcoal-400 mb-4">Pour vous envoyer les détails de votre réservation</div>
              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-[10px] font-bold text-charcoal-500 uppercase tracking-widest mb-1.5 block">Nom complet *</label>
                  <input value={guestName} onChange={e => setGuestName(e.target.value)}
                    placeholder="Mohammed El Fassi"
                    className="w-full border-2 border-sand-300 rounded-xl px-4 py-3 text-sm text-charcoal-800 outline-none bg-sand-100 transition-colors" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-charcoal-500 uppercase tracking-widest mb-1.5 block">Email ou WhatsApp *</label>
                  <input value={guestContact} onChange={e => setGuestContact(e.target.value)}
                    placeholder="email@exemple.com ou +212 6XX XXX XXX"
                    className="w-full border-2 border-sand-300 rounded-xl px-4 py-3 text-sm text-charcoal-800 outline-none bg-sand-100 transition-colors" />
                  <div className="text-[10px] text-charcoal-400 mt-1.5 ml-1">📱 Le guide vous contactera 72h avant la visite</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4" style={{boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{background:"rgba(184,138,68,0.12)"}}>
                  <CreditCard size={15} weight="duotone" className="text-bronze-500" />
                </div>
                <div className="font-display text-sm font-semibold text-charcoal-800">Mode de paiement</div>
              </div>
              <div className="flex flex-col gap-2">
                {PAYMENT_OPTIONS.map(opt => (
                  <button key={opt.id} onClick={() => setPayment(opt.id)}
                    className={"flex items-center justify-between p-3.5 rounded-2xl border-2 text-left transition-all " + (payment===opt.id ? "border-bronze-500" : "border-sand-200 bg-sand-100")}
                    style={payment===opt.id ? {background:"rgba(184,138,68,0.06)"} : {}}>
                    <div>
                      <div className={"text-sm font-bold " + (payment===opt.id ? "text-bronze-500" : "text-charcoal-800")}>{opt.label}</div>
                      <div className="text-[10px] text-charcoal-400 mt-0.5">{opt.desc}</div>
                    </div>
                    <div className={"w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 " + (payment===opt.id ? "border-bronze-500 bg-bronze-500" : "border-sand-300 bg-white")}>
                      {payment===opt.id && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {isPaid && (
              <div className="rounded-2xl p-4 flex items-center gap-3" style={{background:"rgba(184,138,68,0.08)", border:"1px solid rgba(184,138,68,0.2)"}}>
                <TeaBag size={22} className="text-bronze-500 flex-shrink-0" weight="duotone" />
                <div>
                  <div className="text-xs font-bold text-bronze-500">🍵 Thé de bienvenu offert !</div>
                  <div className="text-[10px] text-charcoal-400 mt-0.5">Offert chez un café partenaire Laksor</div>
                </div>
              </div>
            )}

            <button onClick={() => guestName.trim() && guestContact.trim() && setStep("recap")}
              className="w-full py-4 rounded-full text-sm font-bold transition-all flex items-center justify-center gap-2 text-white active:scale-[0.98]"
              style={{
                background: guestName.trim() && guestContact.trim() ? "linear-gradient(135deg, #B88A44, #9A7238)" : "#D4C9B8",
                boxShadow: guestName.trim() && guestContact.trim() ? "0 6px 20px rgba(184,138,68,0.4)" : "none"
              }}>
              <ArrowRight size={16} weight="bold" /> Voir le récapitulatif
            </button>
          </>
        )}

        {/* STEP 3 */}
        {step === "recap" && (
          <>
            <div className="bg-white rounded-2xl p-4" style={{boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
              {isExperience && experience && (
                <div className="mb-4 pb-3 border-b border-sand-200">
                  <div className="text-[10px] font-bold text-bronze-500 uppercase tracking-widest mb-1">Experience Laksor</div>
                  <div className="font-display text-base font-bold text-charcoal-800">{experience.title}</div>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{background:"rgba(184,138,68,0.1)", color:"#B88A44"}}>{bookingType === "private" ? "🔒 Privé" : "👥 Groupe"}</span>
                    {experience.duration && <span className="text-[10px] text-charcoal-400">⏱ {experience.duration}</span>}
                    {experience.meetingPoint && <span className="text-[10px] text-charcoal-400">📍 {experience.meetingPoint}</span>}
                  </div>
                </div>
              )}
              <div className="font-display text-sm font-semibold text-charcoal-800 mb-3">Récapitulatif</div>
              <div className="flex flex-col gap-2.5">
                {tourTypeParam && (
                  <div className="flex justify-between text-sm">
                    <span className="text-charcoal-400">Type de visite</span>
                    <span className="font-semibold text-charcoal-800">{({MEDINA_SECRETS:"Médina",GASTRONOMIE:"Gastronomie",HISTOIRE_MONUMENTS:"Histoire",DESERT_NATURE:"Désert",SHOPPING_ARTISANAT:"Shopping",COUCHER_SOLEIL:"Coucher soleil",PHOTO_INSTAGRAM:"Photo Instagram"} as any)[tourTypeParam] || tourTypeParam}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-charcoal-400">Date</span>
                  <span className="font-semibold text-charcoal-800 capitalize">{selectedDates[0] ? new Date(selectedDates[0] + "T00:00:00").toLocaleDateString("fr-FR", {weekday:"long", day:"numeric", month:"long"}) : "-"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-charcoal-400">Heure de départ</span>
                  <span className="font-semibold text-charcoal-800">{selectedSlot || startHour || "-"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-charcoal-400">Participants</span>
                  <span className="font-semibold text-charcoal-800">{persons} pers. ({adults} adultes{children > 0 ? ", " + children + " enfants" : ""})</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-charcoal-400">Transport</span>
                  <span className="font-semibold text-charcoal-800">{bookingType === "private" ? "Inclus 🎉" : hotelLocation === "outside" ? "Hors zone (+" + convert(transportExtraFee) + ")" : "Gratuit ✓"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-charcoal-400">Paiement</span>
                  <span className="font-semibold text-charcoal-800">{payment === "deposit" ? "Acompte 30%" : payment === "full" ? "100% en ligne" : "Cash"}</span>
                </div>
                {isExperience && experience?.providerContact && (
                  <div className="flex items-center gap-2 text-sm mt-1 pt-2 border-t border-sand-100">
                    <span className="text-charcoal-400">📞 Contact</span>
                    <a href={"https://wa.me/" + experience.providerContact.replace(/[^0-9]/g, "")}
                      className="font-semibold no-underline" style={{color:"#7D8F69"}}>{experience.providerContact}</a>
                  </div>
                )}
                {isExperience && experience?.included?.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-sand-100">
                    <div className="text-[10px] font-bold mb-1.5" style={{color:"#7D8F69"}}>✓ Inclus</div>
                    <div className="flex flex-wrap gap-1">
                      {experience.included.map((item:string) => (
                        <span key={item} className="text-[10px] px-2 py-0.5 rounded-full" style={{background:"rgba(125,143,105,0.1)", color:"#7D8F69"}}>{item}</span>
                      ))}
                    </div>
                  </div>
                )}
                {isExperience && experience?.notIncluded?.length > 0 && (
                  <div className="mt-1">
                    <div className="text-[10px] font-bold text-red-400 mb-1.5">✗ À prévoir</div>
                    <div className="flex flex-wrap gap-1">
                      {experience.notIncluded.map((item:string) => (
                        <span key={item} className="text-[10px] px-2 py-0.5 rounded-full bg-red-50 text-red-400">{item}</span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="border-t border-sand-200 pt-2.5 flex flex-col gap-1.5 mt-1">
                  {isExperience && (
                    <div className="flex justify-between text-xs text-charcoal-400">
                      <span>{persons} pers. × {convert(tourPriceParam || 0)}</span>
                      <span>{convert((tourPriceParam || 0) * persons)}</span>
                    </div>
                  )}
                  {isExperience && expDiscount > 0 && (
                    <div className="flex justify-between text-xs font-semibold" style={{color:"#7D8F69"}}>
                      <span>Réduction groupe ({persons} pers.)</span>
                      <span>-{convert(expDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs text-charcoal-400">
                    <span>Frais de service</span>
                    <span>+{convert(serviceFee)}</span>
                  </div>
                  <div className="flex justify-between pt-1.5 border-t border-sand-200">
                    <span className="font-bold text-charcoal-800">Total</span>
                    <span className="font-display text-xl font-bold" style={{color:"#B88A44"}}>{convert(adjustedTotal)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4" style={{boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
              <div className="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest mb-2">Vos informations</div>
              <div className="text-sm font-semibold text-charcoal-800">{guestName}</div>
              <div className="text-xs text-charcoal-400 mt-0.5">{guestContact}</div>
            </div>

            {isPaid && (
              <div className="rounded-2xl p-4 flex items-center gap-3" style={{background:"rgba(184,138,68,0.08)", border:"1px solid rgba(184,138,68,0.2)"}}>
                <TeaBag size={22} className="text-bronze-500 flex-shrink-0" weight="duotone" />
                <div className="text-xs font-bold text-bronze-500">🍵 Thé de bienvenu offert chez un café partenaire Laksor</div>
              </div>
            )}

            <button onClick={handleConfirm} disabled={submitting}
              className="w-full py-4 rounded-full text-sm font-bold transition-all flex items-center justify-center gap-2 text-white active:scale-[0.98]"
              style={{
                background: !submitting ? "linear-gradient(135deg, #B88A44, #9A7238)" : "#D4C9B8",
                boxShadow: !submitting ? "0 6px 20px rgba(184,138,68,0.4)" : "none"
              }}>
              {submitting ? "Envoi en cours..." : "Confirmer la réservation ✦"}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-charcoal-400 pb-4">
              <Lock size={10} /> Paiement sécurisé · CMI · Visa · Mastercard
            </div>
          </>
        )}
      </div>

      {/* CTA FIXE BAS — STEP 1 */}
      {step === "dates" && (
        <div className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-8 pt-3"
          style={{background:"linear-gradient(to top, #F6F1E8 75%, transparent)"}}>
          <button onClick={() => selectedDates.length > 0 && setStep("info")}
            className="w-full py-4 rounded-full text-sm font-bold transition-all flex items-center justify-center gap-2 text-white active:scale-[0.98]"
            style={{
              background: selectedDates.length > 0 ? "linear-gradient(135deg, #B88A44, #9A7238)" : "#D4C9B8",
              boxShadow: selectedDates.length > 0 ? "0 6px 20px rgba(184,138,68,0.4)" : "none",
              cursor: selectedDates.length > 0 ? "pointer" : "not-allowed"
            }}>
            {selectedDates.length === 0
              ? "Choisir une date"
              : (bookingType === "group" && experience?.departureSlots?.length > 0 && !selectedSlot)
              ? "⏰ Choisir un créneau"
              : <><CheckCircle size={16} weight="fill" /> Continuer → Vos coordonnées</>}
          </button>
          {selectedDates.length > 0 && (
            <div className="text-center text-[11px] text-charcoal-400 mt-2">
              <span style={{color:"#B88A44"}}>
                {new Date(selectedDates[0]+"T00:00:00").toLocaleDateString("fr-FR", {weekday:"long", day:"numeric", month:"long"})}
              </span>
              {selectedSlot && <span> · {selectedSlot}</span>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
