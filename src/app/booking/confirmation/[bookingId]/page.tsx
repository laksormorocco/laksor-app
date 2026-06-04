"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  CheckCircle, CalendarCheck, Compass, TeaBag,
  MapPin, Star, WhatsappLogo
} from "@phosphor-icons/react";

export default function ConfirmationPage() {
  const params = useParams();
  const bookingId = params.bookingId as string;
  const [booking, setBooking] = useState<any>(null);
  const [bookingRef, setBookingRef] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookingId) return;
    fetch("/api/bookings/" + bookingId)
      .then(r => r.json())
      .then(data => {
        setBooking(data.booking);
        setBookingRef(data.bookingRef || "");
        setLoading(false);
      });
  }, [bookingId]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-sand-200">
      <div className="text-4xl animate-pulse">...</div>
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
  const duration = booking.duration === "FULL_DAY" ? "Journee complete (8h)" : "Demi-journee (4h)";
  const paymentLabel = booking.paymentMethod === "deposit" ? "Acompte 30%" : booking.paymentMethod === "full" ? "100% en ligne" : "Cash le jour J";

  return (
    <div className="min-h-screen bg-sand-200 flex flex-col">
      <nav className="bg-white border-b border-sand-300 h-14 flex items-center justify-center sticky top-0 z-10">
        <span className="font-display text-lg font-bold text-bronze-500 tracking-widest">LAKSOR</span>
      </nav>

      <div className="flex-1 flex items-start justify-center px-4 py-8">
        <div className="w-full max-w-sm flex flex-col gap-4">

          <div className="bg-sage-300 rounded-3xl px-6 pt-8 pb-6 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={36} weight="fill" className="text-white" />
            </div>
            <h1 className="font-display text-2xl text-white mb-1">Reservation confirmee !</h1>
            {tourist?.name && <p className="text-white/80 text-sm mb-1">Bonjour <strong className="text-white">{tourist.name}</strong></p>}
            <p className="text-white/70 text-sm"><strong className="text-white">{guide?.displayName}</strong> vous attend avec impatience</p>
          </div>

          <div className="bg-charcoal-800 rounded-2xl p-4 text-center">
            <div className="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest mb-1">Numero de reservation</div>
            <div className="font-display text-2xl font-bold text-bronze-500 tracking-widest">{bookingRef}</div>
            <div className="text-[10px] text-charcoal-400 mt-1">Conservez ce numero pour tout suivi</div>
          </div>

          <div className="bg-white rounded-2xl border border-sand-300 p-4">
            <div className="text-[10px] font-bold text-charcoal-800 uppercase tracking-widest mb-3">Votre guide</div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-sand-300 flex-shrink-0">
                {guide?.avatar
                  ? <img src={guide.avatar} className="w-full h-full object-cover" alt={guide.displayName} />
                  : <div className="w-full h-full flex items-center justify-center font-display text-xl font-bold text-charcoal-500">{guide?.displayName?.[0]}</div>
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
              </div>
            </div>
            {guide?.phone && (
              <a href={"https://wa.me/" + guide.phone.replace(/[^0-9]/g, "")}
                className="w-full flex items-center justify-center gap-2 bg-sage-300 hover:bg-sage-400 text-white font-bold py-2.5 rounded-full text-sm no-underline transition-colors">
                <WhatsappLogo size={16} weight="fill" />
                Contacter le guide sur WhatsApp
              </a>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-sand-300 p-4">
            <div className="text-[10px] font-bold text-charcoal-800 uppercase tracking-widest mb-3">Details de la visite</div>
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2">
                <CalendarCheck size={16} className="text-sage-300 flex-shrink-0" />
                <span className="text-sm font-semibold text-charcoal-800 capitalize">{dateStr}</span>
              </div>
              <div className="flex items-center gap-2">
                <Compass size={16} className="text-bronze-500 flex-shrink-0" />
                <span className="text-sm text-charcoal-800">{duration}</span>
              </div>
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

          <div className="bg-white rounded-2xl border border-sand-300 p-4">
            <div className="text-[10px] font-bold text-charcoal-800 uppercase tracking-widest mb-3">Paiement</div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-charcoal-400">Mode</span>
              <span className={`font-bold px-2.5 py-0.5 rounded-full text-xs ${isPaid ? "bg-sage-300/15 text-sage-300" : "bg-sand-200 text-charcoal-600"}`}>{paymentLabel}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-sand-200">
              <span className="font-bold text-charcoal-800">Total</span>
              <span className="font-display text-2xl font-bold text-bronze-500">{total} <span className="text-sm font-normal text-charcoal-400">MAD</span></span>
            </div>
            {isPaid && (
              <div className="text-right text-[11px] text-sage-300 font-semibold mt-1">
                Acompte : {deposit} MAD - Reste le jour J : {total - deposit} MAD
              </div>
            )}
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
