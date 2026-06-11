"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  CheckCircle, CalendarCheck, Compass, TeaBag,
  MapPin, Star, WhatsappLogo, Car, Users, Clock,
  SealCheck, ArrowRight, DownloadSimple, House, Confetti
} from "@phosphor-icons/react";
import { useExchangeRate } from "@/hooks/useExchangeRate";

export default function ConfirmationPage() {
  const params = useParams();
  const bookingId = params.bookingId as string;
  const [booking, setBooking] = useState<any>(null);
  const [bookingRef, setBookingRef] = useState("");
  const [loading, setLoading] = useState(true);
  const [whatsapp, setWhatsapp] = useState("");
  const [waSaved, setWaSaved] = useState(false);
  const [invoiceUrl, setInvoiceUrl] = useState("");
  const [experience, setExperience] = useState<any>(null);
  const [showCheck, setShowCheck] = useState(false);

  useEffect(() => {
    if (bookingId) {
      fetch("/api/invoice/token?bookingId=" + bookingId)
        .then(r => r.json())
        .then(d => { if (d.token) setInvoiceUrl("/api/invoice/pdf?bookingId=" + bookingId + "&token=" + d.token); });
    }
  }, [bookingId]);

  useEffect(() => {
    if (!bookingId) return;
    fetch("/api/bookings/" + bookingId)
      .then(r => r.json())
      .then(data => {
        setBooking(data.booking);
        setBookingRef(data.bookingRef || "");
        if (data.experience) setExperience(data.experience);
        setLoading(false);
        setTimeout(() => setShowCheck(true), 300);
      });
  }, [bookingId]);

  const { convert } = useExchangeRate();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{background:"#F6F1E8"}}>
      <div className="w-10 h-10 border-4 border-bronze-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!booking) return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{background:"#F6F1E8"}}>
      <div className="text-center">
        <div className="text-sm text-charcoal-400">Réservation introuvable</div>
        <Link href="/" className="mt-4 block text-bronze-500 font-bold">Retour accueil</Link>
      </div>
    </div>
  );

  const guide = booking.guide;
  const tourist = booking.tourist;
  const isPaid = booking.paymentMethod === "deposit" || booking.paymentMethod === "full";
  const total = Number(booking.totalPrice);
  const deposit = Math.round(total * 0.3);
  const dateStr = new Date(booking.date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const duration = experience?.duration || (booking.duration === "FULL_DAY" ? "Journée complète (8h)" : "Demi-journée (4h)");
  const paymentLabel = booking.paymentMethod === "deposit" ? "Acompte 30%" : booking.paymentMethod === "full" ? "100% en ligne" : "Cash le jour J";
  const hasTransport = booking.notes?.includes("Transport") || false;

  return (
    <div className="min-h-screen pb-10" style={{background:"#F6F1E8"}}>

      {/* NAVBAR */}
      <nav className="h-14 flex items-center justify-center sticky top-0 z-10"
        style={{background:"rgba(246,241,232,0.92)", backdropFilter:"blur(16px)", borderBottom:"1px solid rgba(184,138,68,0.12)"}}>
        <span className="font-display text-lg font-bold tracking-widest" style={{color:"#B88A44"}}>LAKSOR</span>
      </nav>

      <div className="px-4 pt-6 max-w-sm mx-auto flex flex-col gap-4">

        {/* HERO — gradient sage→bronze animé */}
        <div className="rounded-3xl px-6 pt-8 pb-7 text-center relative overflow-hidden"
          style={{background:"linear-gradient(135deg, #7D8F69 0%, #B88A44 100%)"}}>
          <div className="absolute inset-0 opacity-10"
            style={{backgroundImage:"radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 80%, white 1px, transparent 1px)", backgroundSize:"30px 30px"}} />

          {/* Cercle check animé */}
          <div className="relative z-10">
            <div className={"w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center transition-all duration-700 " + (showCheck ? "scale-100 opacity-100" : "scale-50 opacity-0")}
              style={{background:"rgba(255,255,255,0.2)", backdropFilter:"blur(8px)", border:"2px solid rgba(255,255,255,0.3)"}}>
              <CheckCircle size={44} weight="fill" className="text-white" />
            </div>
            <h1 className={"font-display text-2xl text-white font-bold mb-1 transition-all duration-700 delay-200 " + (showCheck ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0")}>
              Réservation confirmée !
            </h1>
            {tourist?.name && (
              <p className={"text-white/80 text-sm mb-1 transition-all duration-700 delay-300 " + (showCheck ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0")}>
                Bonjour <strong className="text-white italic font-display">{tourist.name}</strong>
              </p>
            )}
            <p className={"text-white/70 text-xs transition-all duration-700 delay-400 " + (showCheck ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0")}>
              {experience ? "Laksor" : <strong className="text-white">{guide?.displayName}</strong>} vous attend avec impatience
            </p>
          </div>
        </div>

        {/* NUMÉRO DE RÉSERVATION — card premium sans noir */}
        <div className="rounded-2xl p-5 text-center"
          style={{background:"linear-gradient(135deg, #1a1a1a, #2d2a25)", border:"1px solid rgba(184,138,68,0.3)"}}>
          <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{color:"rgba(184,138,68,0.7)"}}>Numéro de réservation</div>
          <div className="font-display text-3xl font-bold tracking-widest mb-1" style={{color:"#B88A44", textShadow:"0 0 20px rgba(184,138,68,0.3)"}}>{bookingRef}</div>
          <div className="text-[10px]" style={{color:"rgba(255,255,255,0.4)"}}>Conservez ce numéro pour tout suivi</div>
        </div>

        {/* EXPÉRIENCE LAKSOR */}
        {experience && (
          <div className="bg-white rounded-2xl p-4" style={{boxShadow:"0 2px 16px rgba(0,0,0,0.06)"}}>
            <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{color:"#B88A44"}}>Expérience Laksor</div>
            <div className="font-display text-base font-bold text-charcoal-800 mb-3">{experience.title}</div>
            <div className="flex flex-col gap-2">
              {experience.duration && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock size={14} className="text-charcoal-400 flex-shrink-0" weight="duotone" />
                  <span className="text-charcoal-600">{experience.duration}</span>
                </div>
              )}
              {experience.meetingPoint && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin size={14} className="text-charcoal-400 flex-shrink-0" weight="duotone" />
                  <span className="text-charcoal-600">{experience.meetingPoint}</span>
                </div>
              )}
              {experience.providerContact && (
                <div className="flex items-center gap-2 text-sm">
                  <WhatsappLogo size={14} weight="fill" style={{color:"#25D366"}} className="flex-shrink-0" />
                  <a href={"https://wa.me/" + experience.providerContact.replace(/[^0-9]/g, "")}
                    className="font-semibold no-underline" style={{color:"#7D8F69"}}>
                    Contacter le prestataire
                  </a>
                </div>
              )}
              {experience.included?.length > 0 && (
                <div className="mt-2 pt-2 border-t border-sand-100">
                  <div className="text-[10px] font-bold mb-1.5" style={{color:"#7D8F69"}}>✓ Inclus</div>
                  <div className="flex flex-wrap gap-1">
                    {experience.included.map((item:string) => (
                      <span key={item} className="text-[10px] px-2 py-0.5 rounded-full" style={{background:"rgba(125,143,105,0.1)", color:"#7D8F69"}}>{item}</span>
                    ))}
                  </div>
                </div>
              )}
              {experience.notIncluded?.length > 0 && (
                <div className="mt-1">
                  <div className="text-[10px] font-bold text-red-400 mb-1.5">✗ À prévoir</div>
                  <div className="flex flex-wrap gap-1">
                    {experience.notIncluded.map((item:string) => (
                      <span key={item} className="text-[10px] px-2 py-0.5 rounded-full" style={{background:"rgba(239,68,68,0.08)", color:"#ef4444"}}>{item}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* GUIDE — masqué pour expériences */}
        {!experience && (
          <div className="bg-white rounded-2xl p-4" style={{boxShadow:"0 2px 16px rgba(0,0,0,0.06)"}}>
            <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{color:"#B88A44"}}>Votre guide</div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0" style={{border:"2px solid #EADCC8"}}>
                {guide?.avatar
                  ? <img src={guide.avatar} className="w-full h-full object-cover" alt={guide?.displayName} />
                  : <div className="w-full h-full flex items-center justify-center font-display text-2xl font-bold" style={{background:"rgba(184,138,68,0.1)", color:"#B88A44"}}>{guide?.displayName?.[0]}</div>
                }
              </div>
              <div className="flex-1">
                <div className="font-display text-sm font-bold text-charcoal-800">{guide?.displayName}</div>
                <div className="flex items-center gap-1 mt-1">
                  <SealCheck size={13} weight="fill" className="text-sage-300" />
                  <span className="text-[11px] text-sage-300 font-semibold">Guide certifié</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <MapPin size={11} className="text-charcoal-400" />
                  <span className="text-xs text-charcoal-400">{guide?.city}</span>
                </div>
                {guide?.avgRating > 0 && (
                  <div className="flex items-center gap-1 mt-1">
                    <Star size={11} weight="fill" className="text-amber-400" />
                    <span className="text-xs font-bold text-charcoal-800">{guide.avgRating}</span>
                    <span className="text-xs text-charcoal-400">({guide.totalReviews} avis)</span>
                  </div>
                )}
                {guide?.languages?.length > 0 && (
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {guide.languages.map((lang: string) => (
                      <span key={lang} className="text-sm">
                        {lang === "Francais" || lang === "Français" ? "🇫🇷" :
                         lang === "Anglais" || lang === "English" ? "🇬🇧" :
                         lang === "Arabe" || lang === "Arabic" ? "🇲🇦" :
                         lang === "Espagnol" || lang === "Spanish" ? "🇪🇸" :
                         lang === "Allemand" || lang === "German" ? "🇩🇪" :
                         lang === "Hebreu" || lang === "Hebrew" ? "🇮🇱" :
                         lang === "Russe" || lang === "Russian" ? "🇷🇺" : "🌍"}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* DÉTAILS VISITE */}
        <div className="bg-white rounded-2xl p-4" style={{boxShadow:"0 2px 16px rgba(0,0,0,0.06)"}}>
          <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{color:"#B88A44"}}>Détails de la visite</div>
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:"rgba(125,143,105,0.1)"}}>
                <CalendarCheck size={15} weight="duotone" className="text-sage-300" />
              </div>
              <span className="text-sm font-semibold text-charcoal-800 capitalize">{dateStr}</span>
            </div>
            {booking.slots?.length > 0 ? (
              booking.slots.map((s: any, i: number) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:"rgba(184,138,68,0.1)"}}>
                    <Compass size={15} weight="duotone" className="text-bronze-500" />
                  </div>
                  <span className="text-sm text-charcoal-800">
                    {new Date(s.date).toLocaleDateString("fr-FR", {weekday:"short", day:"numeric", month:"short"})} · {experience?.duration || (s.duration === "full" ? "Journée complète (8h)" : "Demi-journée (4h)")}
                  </span>
                </div>
              ))
            ) : (
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:"rgba(184,138,68,0.1)"}}>
                  <Compass size={15} weight="duotone" className="text-bronze-500" />
                </div>
                <span className="text-sm text-charcoal-800">{duration}</span>
              </div>
            )}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:"rgba(184,138,68,0.1)"}}>
                <MapPin size={15} weight="duotone" className="text-bronze-500" />
              </div>
              <span className="text-sm text-charcoal-500">{guide?.city || "Marrakech"} · <span className="font-semibold" style={{color:"#B88A44"}}>Point de RDV communiqué 72h avant</span></span>
            </div>
            <div className="flex justify-between text-sm pt-2 mt-1 border-t border-sand-100">
              <span className="text-charcoal-400">Participants</span>
              <span className="font-semibold text-charcoal-800">{booking.persons} pers.</span>
            </div>
          </div>
        </div>

        {/* PAIEMENT */}
        <div className="bg-white rounded-2xl p-4" style={{boxShadow:"0 2px 16px rgba(0,0,0,0.06)"}}>
          <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{color:"#B88A44"}}>Paiement</div>
          <div className="flex justify-between text-sm mb-2.5">
            <span className="text-charcoal-400">Mode</span>
            <span className={"font-bold px-2.5 py-0.5 rounded-full text-xs " + (isPaid ? "bg-sage-300/15 text-sage-300" : "bg-sand-200 text-charcoal-600")}>{paymentLabel}</span>
          </div>
          <div className="flex justify-between pt-2.5 border-t border-sand-100">
            <span className="font-bold text-charcoal-800">Total</span>
            <div className="text-right">
              <div className="font-display text-2xl font-bold" style={{color:"#B88A44"}}>{convert(total)}</div>
              <div className="text-[10px] text-charcoal-400">{total} MAD</div>
            </div>
          </div>
          {isPaid && (
            <div className="text-right text-[11px] font-semibold mt-1" style={{color:"#7D8F69"}}>
              Acompte : {convert(deposit)} · Reste le jour J : {convert(total - deposit)}
            </div>
          )}
        </div>

        {/* THÉ BIENVENU */}
        {isPaid && (
          <div className="rounded-2xl p-4 flex items-center gap-3" style={{background:"rgba(184,138,68,0.08)", border:"1px solid rgba(184,138,68,0.2)"}}>
            <TeaBag size={22} className="text-bronze-500 flex-shrink-0" weight="duotone" />
            <div>
              <div className="text-xs font-bold text-bronze-500">🍵 Thé de bienvenu offert !</div>
              <div className="text-[10px] text-charcoal-400 mt-0.5">Votre guide vous offrira un thé chez un café partenaire Laksor</div>
            </div>
          </div>
        )}

        {/* UPSELL TRANSPORT — masqué pour expériences */}
        {!hasTransport && !experience && (
          <div className="bg-white rounded-2xl p-4" style={{boxShadow:"0 2px 16px rgba(0,0,0,0.06)", border:"1px solid rgba(184,138,68,0.2)"}}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:"rgba(184,138,68,0.1)"}}>
                <Car size={20} weight="duotone" className="text-bronze-500" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-charcoal-800">Ajouter le transport ?</div>
                <div className="text-[10px] text-charcoal-400 mt-0.5">Prise en charge hôtel/riad aller-retour · +300 MAD</div>
              </div>
            </div>
            <a href={"https://wa.me/212657436342?text=Bonjour, je souhaite ajouter le transport a ma reservation " + bookingRef}
              className="w-full flex items-center justify-center gap-2 text-white font-bold py-3 rounded-full text-sm no-underline transition-all active:scale-[0.98]"
              style={{background:"linear-gradient(135deg, #B88A44, #9A7238)", boxShadow:"0 4px 14px rgba(184,138,68,0.3)"}}>
              <WhatsappLogo size={14} weight="fill" /> Ajouter via WhatsApp
            </a>
          </div>
        )}

        {/* WHATSAPP */}
        {!waSaved && (
          <div className="bg-white rounded-2xl p-4" style={{boxShadow:"0 2px 16px rgba(0,0,0,0.06)"}}>
            <div className="font-display text-sm font-semibold text-charcoal-800 mb-1">Améliorez votre expérience</div>
            <div className="text-xs text-charcoal-400 mb-3">Partagez votre WhatsApp pour une meilleure communication. Ref : <span className="font-bold text-bronze-500">{bookingRef}</span></div>
            <div className="flex gap-2">
              <input value={whatsapp} onChange={e => setWhatsapp(e.target.value)}
                placeholder="+212 6XX XXX XXX"
                className="flex-1 border-2 border-sand-300 rounded-xl px-3 py-2.5 text-sm outline-none bg-sand-100 transition-colors" />
              <button onClick={async () => {
                  if (!whatsapp.trim()) return;
                  const res = await fetch("/api/bookings/whatsapp", {
                    method: "POST",
                    headers: {"Content-Type":"application/json"},
                    body: JSON.stringify({ bookingId, whatsapp, bookingRef, touristName: tourist?.name || "Client" })
                  });
                  const data = await res.json();
                  if (data.notifyUrl) window.open(data.notifyUrl, "_blank");
                  setWaSaved(true);
                }}
                className="text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-all active:scale-95"
                style={{background:"#25D366"}}>
                <WhatsappLogo size={16} weight="fill" />
              </button>
            </div>
          </div>
        )}

        {/* TIMELINE */}
        <div className="bg-white rounded-2xl p-4" style={{boxShadow:"0 2px 16px rgba(0,0,0,0.06)"}}>
          <div className="font-display text-sm font-semibold text-charcoal-800 mb-4">Prochaines étapes</div>
          {[
            { label: "Réservation confirmée", done: true, icon: "✓" },
            { label: "Guide attribué", done: true, icon: "✓" },
            { label: "Contact 72h avant la visite", done: false, icon: "3" },
            { label: "Jour de l'expérience", done: false, icon: "4" },
            { label: "Votre avis après la visite", done: false, icon: "5" },
          ].map((s, i, arr) => (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className={"w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold transition-all " + (s.done ? "text-white" : "bg-sand-200 text-charcoal-400")}
                  style={s.done ? {background:"linear-gradient(135deg, #7D8F69, #566547)"} : {}}>
                  {s.done ? <CheckCircle size={16} weight="fill" className="text-white" /> : s.icon}
                </div>
                {i < arr.length - 1 && <div className={"w-0.5 h-7 mt-1 " + (s.done ? "bg-sage-300" : "bg-sand-200")} />}
              </div>
              <div className={"pt-1.5 pb-4 text-sm " + (s.done ? "font-semibold text-charcoal-800" : "text-charcoal-400")}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* SUPPORT — fond sable, pas noir */}
        <div className="rounded-2xl p-5 text-center" style={{background:"linear-gradient(135deg, #1a1a1a, #2d2a25)", border:"1px solid rgba(184,138,68,0.2)"}}>
          <p className="font-display text-base font-bold mb-2" style={{color:"#B88A44"}}>Merci de voyager avec Laksor</p>
          <p className="text-xs leading-relaxed mb-1" style={{color:"rgba(255,255,255,0.5)"}}>
            Chaque guide est certifié par le <strong className="text-white">Ministère du Tourisme marocain</strong>.
          </p>
          <p className="text-xs mb-4" style={{color:"rgba(255,255,255,0.4)"}}>
            Disponibles <strong className="text-white">7j/7</strong> via <strong className="text-white">laksor.ma</strong>
          </p>
          <a href="https://wa.me/212657436342"
            className="inline-flex items-center gap-2 text-white text-xs font-bold px-5 py-2.5 rounded-full no-underline transition-all active:scale-95"
            style={{background:"#25D366", boxShadow:"0 4px 12px rgba(37,211,102,0.3)"}}>
            <WhatsappLogo size={14} weight="fill" />
            Contacter le support Laksor
          </a>
          <p className="text-[10px] mt-3 italic" style={{color:"rgba(255,255,255,0.3)"}}>Bienvenue au Maroc authentique.</p>
        </div>

        {/* ACTIONS — hiérarchie claire */}
        <div className="flex flex-col gap-3 pb-6">
          <Link href="/"
            className="flex items-center justify-center gap-2 w-full py-4 text-white rounded-full text-sm font-bold no-underline transition-all active:scale-[0.98]"
            style={{background:"linear-gradient(135deg, #B88A44, #9A7238)", boxShadow:"0 6px 20px rgba(184,138,68,0.4)"}}>
            <House size={16} weight="duotone" /> Retour à l'accueil
          </Link>
          {invoiceUrl && (
            <a href={invoiceUrl} target="_blank"
              className="flex items-center justify-center gap-2 w-full py-3.5 text-bronze-500 rounded-full text-sm font-bold no-underline transition-all active:scale-[0.98]"
              style={{border:"2px solid #B88A44", background:"transparent"}}>
              <DownloadSimple size={16} weight="bold" /> Télécharger la facture
            </a>
          )}
          <Link href="/search"
            className="flex items-center justify-center gap-2 w-full py-3.5 text-charcoal-600 rounded-full text-sm font-semibold no-underline transition-all"
            style={{background:"rgba(184,138,68,0.08)", border:"1px solid #EADCC8"}}>
            Explorer d'autres guides <ArrowRight size={14} />
          </Link>
        </div>

      </div>
    </div>
  );
}
