"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  CheckCircle, CalendarCheck, Compass, TeaBag,
  MapPin, Star, WhatsappLogo, Car, Users
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

  useEffect(() => {
    if (bookingId) {
      fetch("/api/invoice/token?bookingId=" + bookingId)
        .then(r => r.json())
        .then(d => { if (d.token) setInvoiceUrl("/api/invoice/pdf?bookingId=" + bookingId + "&token=" + d.token); });
    }
  }, [bookingId]);
  const { convert } = useExchangeRate();

  useEffect(() => {
    if (!bookingId) return;
    fetch("/api/bookings/" + bookingId)
      .then(r => r.json())
      .then(data => {
        setBooking(data.booking);
        setBookingRef(data.bookingRef || "");
        if (data.experience) setExperience(data.experience);
        setLoading(false);
      });
  }, [bookingId]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-sand-200">
      <div className="w-10 h-10 border-4 border-bronze-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!booking) return (
    <div className="min-h-screen flex items-center justify-center bg-sand-200 px-4">
      <div className="text-center">
        <div className="text-sm text-charcoal-400">Reservation introuvable</div>
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
  const duration = experience?.duration || (booking.duration === "FULL_DAY" ? "Journee complete (8h)" : "Demi-journee (4h)");
  const paymentLabel = booking.paymentMethod === "deposit" ? "Acompte 30%" : booking.paymentMethod === "full" ? "100% en ligne" : "Cash le jour J";
  const hasPhone = tourist?.email?.includes("@guest") === false && booking.notes?.includes("whatsapp");
  const hasTransport = booking.notes?.includes("Transport") || false;

  return (
    <div className="min-h-screen bg-sand-200 flex flex-col">
      <nav className="bg-white border-b border-sand-300 h-14 flex items-center justify-center sticky top-0 z-10">
        <span className="font-display text-lg font-bold text-bronze-500 tracking-widest">LAKSOR</span>
      </nav>

      <div className="flex-1 flex items-start justify-center px-4 py-8">
        <div className="w-full max-w-sm flex flex-col gap-4">

          {/* HERO */}
          <div className="bg-sage-300 rounded-3xl px-6 pt-8 pb-6 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={36} weight="fill" className="text-white" />
            </div>
            <h1 className="font-display text-2xl text-white mb-1">Reservation confirmee !</h1>
            {tourist?.name && <p className="text-white/80 text-sm mb-1">Bonjour <strong className="text-white">{tourist.name}</strong></p>}
            <p className="text-white/70 text-sm"><strong className="text-white">{guide?.displayName}</strong> vous attend avec impatience</p>
          </div>

          {/* NUMERO */}
          <div className="bg-charcoal-800 rounded-2xl p-4 text-center">
            <div className="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest mb-1">Numero de reservation</div>
            <div className="font-display text-2xl font-bold text-bronze-500 tracking-widest">{bookingRef}</div>
            <div className="text-[10px] text-charcoal-400 mt-1">Conservez ce numero pour tout suivi</div>
          </div>

          {/* EXPERIENCE */}
          {experience && (
            <div className="bg-white rounded-2xl border border-sand-300 p-4">
              <div className="text-[10px] font-bold text-bronze-500 uppercase tracking-widest mb-2">Experience Laksor</div>
              <div className="font-display text-base font-bold text-charcoal-800 mb-3">{experience.title}</div>
              <div className="flex flex-col gap-2">
                {experience.duration && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-charcoal-400">⏱ Durée</span>
                    <span className="font-semibold text-charcoal-800">{experience.duration}</span>
                  </div>
                )}
                {experience.meetingPoint && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin size={14} className="text-charcoal-400 flex-shrink-0" />
                    <span className="text-charcoal-600">{experience.meetingPoint}</span>
                  </div>
                )}
                {experience.providerContact && (
                  <div className="flex items-center gap-2 text-sm">
                    <WhatsappLogo size={14} className="text-sage-300 flex-shrink-0" />
                    <a href={"https://wa.me/" + experience.providerContact.replace(/[^0-9]/g, "")}
                      className="text-sage-300 font-semibold no-underline">{experience.providerContact}</a>
                  </div>
                )}
                {experience.included?.length > 0 && (
                  <div className="mt-2">
                    <div className="text-[10px] font-bold text-sage-300 mb-1.5">✓ Inclus</div>
                    <div className="flex flex-wrap gap-1">
                      {experience.included.map((item:string) => (
                        <span key={item} className="text-[10px] px-2 py-0.5 rounded-full" style={{background:"rgba(125,143,105,0.1)", color:"#7D8F69"}}>{item}</span>
                      ))}
                    </div>
                  </div>
                )}
                {experience.notIncluded?.length > 0 && (
                  <div className="mt-1">
                    <div className="text-[10px] font-bold text-red-400 mb-1.5">✗ A prévoir</div>
                    <div className="flex flex-wrap gap-1">
                      {experience.notIncluded.map((item:string) => (
                        <span key={item} className="text-[10px] px-2 py-0.5 rounded-full bg-red-50 text-red-400">{item}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* GUIDE — masqué pour expériences Laksor */}
          {!experience && (
          <div className="bg-white rounded-2xl border border-sand-300 p-4">
            <div className="text-[10px] font-bold text-charcoal-800 uppercase tracking-widest mb-3">Votre guide</div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-sand-300 flex-shrink-0">
                {guide?.avatar
                  ? <img src={guide.avatar} className="w-full h-full object-cover" alt={guide.displayName} />
                  : <div className="w-full h-full flex items-center justify-center font-display text-2xl font-bold text-charcoal-500">{guide?.displayName?.[0]}</div>
                }
              </div>
              <div className="flex-1">
                <div className="font-display text-sm font-bold text-charcoal-800">{guide?.displayName}</div>
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

          {/* DETAILS VISITE */}
          <div className="bg-white rounded-2xl border border-sand-300 p-4">
            <div className="text-[10px] font-bold text-charcoal-800 uppercase tracking-widest mb-3">Details de la visite</div>
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2">
                <CalendarCheck size={16} className="text-sage-300 flex-shrink-0" />
                <span className="text-sm font-semibold text-charcoal-800 capitalize">{dateStr}</span>
              </div>
              {booking.slots?.length > 0 ? (
                booking.slots.map((s: any, i: number) => (
                  <div key={i} className="flex items-center gap-2">
                    <Compass size={16} className="text-bronze-500 flex-shrink-0" />
                    <span className="text-sm text-charcoal-800">
                      {new Date(s.date).toLocaleDateString("fr-FR", {weekday:"short", day:"numeric", month:"short"})} - {experience?.duration || (s.duration === "full" ? "Journee complete (8h)" : "Demi-journee (4h)")}
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-2">
                  <Compass size={16} className="text-bronze-500 flex-shrink-0" />
                  <span className="text-sm text-charcoal-800">{duration}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-charcoal-400 flex-shrink-0" />
                <span className="text-sm text-charcoal-400">{guide?.city} - Point de RDV communique 72h avant</span>
              </div>
              <div className="flex justify-between text-sm pt-1 border-t border-sand-200">
                <span className="text-charcoal-400">Participants</span>
                <span className="font-semibold text-charcoal-800">{booking.persons} pers.</span>
              </div>
            </div>
          </div>

          {/* PAIEMENT */}
          <div className="bg-white rounded-2xl border border-sand-300 p-4">
            <div className="text-[10px] font-bold text-charcoal-800 uppercase tracking-widest mb-3">Paiement</div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-charcoal-400">Mode</span>
              <span className={`font-bold px-2.5 py-0.5 rounded-full text-xs ${isPaid ? "bg-sage-300/15 text-sage-300" : "bg-sand-200 text-charcoal-600"}`}>{paymentLabel}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-sand-200">
              <span className="font-bold text-charcoal-800">Total</span>
              <div className="text-right">
                <div className="font-display text-2xl font-bold text-bronze-500">{convert(total)}</div>
                <div className="text-[10px] text-charcoal-400">{total} MAD</div>
              </div>
            </div>
            {isPaid && (
              <div className="text-right text-[11px] text-sage-300 font-semibold mt-1">
                Acompte : {convert(deposit)} - Reste le jour J : {convert(total - deposit)}
              </div>
            )}
          </div>

          {/* THE BIENVENU */}
          {isPaid && (
            <div className="bg-amber-50 border border-bronze-500/30 rounded-2xl p-3 flex items-center gap-3">
              <TeaBag size={20} className="text-bronze-500 flex-shrink-0" weight="duotone" />
              <div>
                <div className="text-xs font-bold text-bronze-500">The de bienvenu offert !</div>
                <div className="text-[10px] text-charcoal-400 mt-0.5">Votre guide vous offrira un the chez un cafe partenaire Laksor</div>
              </div>
            </div>
          )}

          {/* UPSELL TRANSPORT — masqué pour expériences */}
          {!hasTransport && !experience && (
            <div className="bg-white rounded-2xl border border-bronze-500/30 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-bronze-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Car size={20} className="text-bronze-500" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-charcoal-800">Ajouter le transport ?</div>
                  <div className="text-[10px] text-charcoal-400 mt-0.5">Prise en charge hotel/riad aller-retour · +300 MAD</div>
                </div>
              </div>
              <a href={"https://wa.me/212657436342?text=Bonjour, je souhaite ajouter le transport a ma reservation " + bookingRef}
                className="mt-3 w-full flex items-center justify-center gap-2 bg-bronze-500 hover:bg-bronze-600 text-white font-bold py-2.5 rounded-full text-sm no-underline transition-colors">
                Ajouter via WhatsApp
              </a>
            </div>
          )}

          {/* WHATSAPP OPTIONNEL */}
          {!waSaved && (
            <div className="bg-white rounded-2xl border border-sand-300 p-4">
              <div className="text-[10px] font-bold text-charcoal-800 uppercase tracking-widest mb-1">Ameliorez votre experience</div>
              <div className="text-xs text-charcoal-400 mb-1">Partagez votre WhatsApp pour une meilleure communication concernant votre sejour.</div><div className="text-xs text-bronze-500 font-semibold mb-3">Merci de nous communiquer votre numero de reservation : {bookingRef}</div>
              <div className="flex gap-2">
                <input value={whatsapp} onChange={e => setWhatsapp(e.target.value)}
                  placeholder="+212 6XX XXX XXX"
                  className="flex-1 border border-sand-300 rounded-xl px-3 py-2 text-sm text-charcoal-800 outline-none focus:border-bronze-500" />
                <button onClick={async () => {
                    if (!whatsapp.trim()) return;
                    const res = await fetch("/api/bookings/whatsapp", {
                      method: "POST",
                      headers: {"Content-Type":"application/json"},
                      body: JSON.stringify({
                        bookingId,
                        whatsapp,
                        bookingRef,
                        touristName: tourist?.name || "Client"
                      })
                    });
                    const data = await res.json();
                    if (data.notifyUrl) window.open(data.notifyUrl, "_blank");
                    setWaSaved(true);
                  }}
                  className="bg-sage-300 text-white font-bold px-4 py-2 rounded-xl text-sm">
                  OK
                </button>
              </div>
            </div>
          )}

          {/* TIMELINE */}
          <div className="bg-white rounded-2xl border border-sand-300 p-4">
            <div className="text-[10px] font-bold text-charcoal-800 uppercase tracking-widest mb-4">Prochaines etapes</div>
            {[
              { label: "Reservation confirmee", done: true },
              { label: "Guide attribue", done: true },
              { label: "Contact 72h avant la visite", done: false },
              { label: "Jour de l experience", done: false },
              { label: "Votre avis apres la visite", done: false },
            ].map((s, i, arr) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${s.done ? "bg-sage-300" : "bg-sand-300"}`}>
                    {s.done
                      ? <CheckCircle size={14} weight="fill" className="text-white" />
                      : <div className="w-2 h-2 rounded-full bg-charcoal-300" />
                    }
                  </div>
                  {i < arr.length - 1 && <div className={`w-0.5 h-6 mt-1 ${s.done ? "bg-sage-300" : "bg-sand-300"}`} />}
                </div>
                <div className={`pt-1 pb-3 text-sm ${s.done ? "font-bold text-charcoal-800" : "text-charcoal-400"}`}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* SUPPORT */}
          <div className="bg-charcoal-800 rounded-2xl p-5 text-center">
            <p className="font-display text-base text-bronze-500 mb-2">Merci de voyager avec Laksor</p>
            <p className="text-charcoal-400 text-xs leading-relaxed mb-3">
              Chaque guide est certifie par le <strong className="text-white">Ministere du Tourisme marocain</strong>.
            </p>
            <p className="text-charcoal-400 text-xs mb-4">
              Disponibles <strong className="text-white">7j/7</strong> via <strong className="text-white">laksor.ma</strong> ou <strong className="text-white">+212 6 57 43 63 42</strong>
            </p>
            <a href="https://wa.me/212657436342"
              className="inline-flex items-center gap-2 bg-sage-300 hover:bg-sage-400 text-white text-xs font-bold px-5 py-2.5 rounded-full no-underline transition-colors">
              <WhatsappLogo size={14} weight="fill" />
              Contacter le support Laksor
            </a>
            <p className="text-charcoal-500 text-[10px] mt-3 italic">Bienvenue au Maroc authentique.</p>
          </div>

          {invoiceUrl && (
            <a href={invoiceUrl} target="_blank"
              className="block bg-charcoal-800 hover:bg-charcoal-600 text-white font-bold py-4 rounded-full text-sm text-center no-underline transition-colors">
              Telecharger la facture
            </a>
          )}

          <Link href="/" className="block bg-bronze-500 hover:bg-bronze-600 text-white font-bold py-4 rounded-full text-sm text-center no-underline transition-colors">
            Retour a l accueil
          </Link>
          <Link href="/search" className="block bg-sand-200 hover:bg-sand-300 text-charcoal-800 font-bold py-3.5 rounded-full text-sm text-center no-underline transition-colors border border-sand-300 mb-4">
            Explorer d autres guides
          </Link>

        </div>
      </div>
    </div>
  );
}
