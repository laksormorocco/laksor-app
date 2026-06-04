"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import {
  CalendarCheck, MapPin, Clock, Users, Star,
  WhatsappLogo, X, Compass, SignOut, House
} from "@phosphor-icons/react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function TouristDashboard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("upcoming");

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { window.location.href = "/auth/login"; return; }
      setUser(session.user);
      await fetch("/api/auth/sync", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ supabaseId: session.user.id, email: session.user.email, name: session.user.user_metadata?.full_name || session.user.email, avatar: session.user.user_metadata?.avatar_url || null })
      });
      const res = await fetch("/api/tourist/bookings?supabaseId=" + session.user.id);
      const data = await res.json();
      setBookings(data.bookings || []);
      setLoading(false);
    });
  }, []);

  async function cancelBooking(id: string) {
    if (!confirm("Annuler cette reservation ?")) return;
    await fetch("/api/tourist/bookings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ bookingId: id, status: "CANCELLED" }) });
    setBookings(bookings.map(b => b.id === id ? { ...b, status: "CANCELLED" } : b));
  }

  const upcoming = bookings.filter(b => b.status === "PENDING" || b.status === "CONFIRMED");
  const past = bookings.filter(b => b.status === "COMPLETED" || b.status === "CANCELLED");
  const can72h = (date: string) => new Date(date).getTime() - Date.now() > 72 * 60 * 60 * 1000;

  function StatusBadge({ status }: { status: string }) {
    const map: Record<string, string> = {
      CONFIRMED: "bg-sage-300/15 text-sage-300 border-sage-300/30",
      PENDING: "bg-amber-50 text-amber-600 border-amber-300/30",
      CANCELLED: "bg-red-50 text-red-400 border-red-300/30",
      COMPLETED: "bg-sand-200 text-charcoal-400 border-sand-300",
    };
    const labels: Record<string, string> = { CONFIRMED: "Confirme", PENDING: "En attente", CANCELLED: "Annule", COMPLETED: "Termine" };
    return <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${map[status] || map.PENDING}`}>{labels[status] || status}</span>;
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-sand-200">
      <div className="w-10 h-10 border-4 border-bronze-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="bg-sand-200 min-h-screen pb-8">

      {/* HEADER */}
      <div className="sticky top-0 z-30 bg-white border-b border-sand-300 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-sand-300 border-2 border-sand-300">
              {user?.user_metadata?.avatar_url
                ? <img src={user.user_metadata.avatar_url} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-sm font-bold text-charcoal-500">{user?.user_metadata?.full_name?.[0]}</div>
              }
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-sage-300 rounded-full border-2 border-white" />
          </div>
          <div>
            <div className="text-[10px] text-charcoal-400">Bonjour,</div>
            <div className="text-sm font-bold text-charcoal-800">{user?.user_metadata?.full_name || "Voyageur"}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/" className="w-9 h-9 bg-sand-200 rounded-xl border border-sand-300 flex items-center justify-center no-underline">
            <House size={16} className="text-charcoal-600" />
          </Link>
          <Link href="/logout" className="w-9 h-9 bg-sand-200 rounded-xl border border-sand-300 flex items-center justify-center no-underline">
            <SignOut size={16} className="text-charcoal-600" />
          </Link>
        </div>
      </div>

      {/* TABS */}
      <div className="bg-white border-b border-sand-300 flex">
        {[["upcoming", "Reservations actives"], ["past", "Historique"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex-1 py-3 text-xs font-bold border-b-2 transition-colors
              ${tab === id ? "border-bronze-500 text-bronze-500" : "border-transparent text-charcoal-400"}`}>
            {label} {id === "upcoming" && upcoming.length > 0 && <span className="ml-1 bg-bronze-500 text-white text-[9px] px-1.5 py-0.5 rounded-full">{upcoming.length}</span>}
          </button>
        ))}
      </div>

      <div className="px-4 pt-4 max-w-lg mx-auto flex flex-col gap-3">

        {/* STATS */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Actives", value: upcoming.length, color: "text-bronze-500" },
            { label: "Confirmees", value: bookings.filter(b=>b.status==="CONFIRMED").length, color: "text-sage-300" },
            { label: "Total", value: bookings.length, color: "text-charcoal-800" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-sand-300 p-3 text-center">
              <div className={`font-display text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-[10px] text-charcoal-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* PROCHAINE VISITE */}
        {(() => {
          const next = upcoming.find(b => b.status === "CONFIRMED");
          if (!next) return null;
          const days = Math.ceil((new Date(next.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          return (
            <div className="bg-gradient-to-br from-sage-300 to-sage-400 rounded-2xl p-4 text-white">
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-1">Prochaine aventure</div>
              <div className="font-display text-xl font-bold mb-1">Dans {days} jour{days > 1 ? "s" : ""} !</div>
              <div className="text-sm text-white/80">Avec <strong className="text-white">{next.guide?.displayName}</strong> à {next.guide?.city}</div>
              <div className="text-xs text-white/60 mt-1">{new Date(next.date).toLocaleDateString("fr-FR", {weekday:"long", day:"numeric", month:"long"})}</div>
            </div>
          );
        })()}

        {/* PROCHAINE VISITE */}
        {(() => {
          const next = upcoming.find(b => b.status === "CONFIRMED");
          if (!next) return null;
          const days = Math.ceil((new Date(next.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          return (
            <div className="bg-gradient-to-br from-sage-300 to-sage-400 rounded-2xl p-4 text-white">
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-1">Prochaine aventure</div>
              <div className="font-display text-xl font-bold mb-1">Dans {days} jour{days > 1 ? "s" : ""} !</div>
              <div className="text-sm text-white/80">Avec <strong className="text-white">{next.guide?.displayName}</strong> à {next.guide?.city}</div>
              <div className="text-xs text-white/60 mt-1">{new Date(next.date).toLocaleDateString("fr-FR", {weekday:"long", day:"numeric", month:"long"})}</div>
            </div>
          );
        })()}

        {/* UPCOMING */}
        {tab === "upcoming" && (
          <>
            {upcoming.length === 0 ? (
              <div className="bg-white rounded-2xl border border-sand-300 p-10 text-center">
                <Compass size={40} className="text-sand-300 mx-auto mb-3" />
                <div className="text-sm font-bold text-charcoal-800 mb-1">Aucune reservation active</div>
                <div className="text-xs text-charcoal-400 mb-4">Trouvez votre guide ideal au Maroc</div>
                <Link href="/search" className="inline-block bg-bronze-500 text-white font-bold px-6 py-3 rounded-full text-sm no-underline">
                  Explorer les guides
                </Link>
              </div>
            ) : upcoming.map(b => {
              const bookingRef = b.notes?.match(/REF:([A-Z0-9-]+)/)?.[1] || "";
              return (
                <div key={b.id} className="bg-white rounded-2xl border border-sand-300 p-4">
                  {/* Guide info */}
                  <div className="flex items-center gap-3 mb-3">
                    <Link href={"/guide/" + b.guide?.id} className="w-12 h-12 rounded-xl overflow-hidden bg-sand-300 flex-shrink-0 no-underline">
                      {b.guide?.avatar
                        ? <img src={b.guide.avatar} className="w-full h-full object-cover" alt={b.guide.displayName} />
                        : <div className="w-full h-full flex items-center justify-center font-bold text-charcoal-500 text-lg bg-sage-300/20">{b.guide?.displayName?.[0]}</div>
                      }
                    </Link>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-charcoal-800">{b.guide?.displayName}</div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <MapPin size={11} className="text-charcoal-400" />
                        <span className="text-xs text-charcoal-400">{b.guide?.city}</span>
                      </div>
                    </div>
                    <StatusBadge status={b.status} />
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {[
                      { Icon: CalendarCheck, label: "Date", value: new Date(b.date).toLocaleDateString("fr-FR", {day:"numeric",month:"short"}) },
                      { Icon: Clock, label: "Duree", value: b.duration === "FULL_DAY" ? "8h" : "4h" },
                      { Icon: Users, label: "Pers.", value: String(b.persons) },
                    ].map(d => (
                      <div key={d.label} className="bg-sand-200 rounded-xl p-2.5 text-center border border-sand-300">
                        <d.Icon size={14} className="text-bronze-500 mx-auto mb-1" />
                        <div className="text-[9px] text-charcoal-400 uppercase tracking-wide">{d.label}</div>
                        <div className="text-xs font-bold text-charcoal-800 mt-0.5">{d.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Prix + ref */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-display text-xl font-bold text-charcoal-800">{Number(b.totalPrice)} <span className="text-xs font-normal text-charcoal-400">MAD</span></div>
                    {bookingRef && <span className="text-[10px] text-charcoal-400 bg-sand-200 px-2 py-1 rounded-lg font-mono">{bookingRef}</span>}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {b.status === "CONFIRMED" && b.guide?.phone ? (
                      <a href={"https://wa.me/" + b.guide.phone.replace(/[^0-9]/g, "")}
                        className="flex-1 flex items-center justify-center gap-2 bg-sage-300 hover:bg-sage-400 text-white font-bold py-2.5 rounded-full text-xs no-underline transition-colors">
                        <WhatsappLogo size={14} weight="fill" />
                        Contacter le guide
                      </a>
                    ) : (
                      <div className="flex-1 flex items-center justify-center gap-2 bg-sand-200 text-charcoal-400 font-bold py-2.5 rounded-full text-xs">
                        <WhatsappLogo size={14} />
                        Disponible si confirme
                      </div>
                    )}
                    {b.status === "PENDING" && can72h(b.date) && (
                      <button onClick={() => cancelBooking(b.id)}
                        className="flex items-center gap-1 bg-red-50 text-red-400 border border-red-200 rounded-full px-3 py-2 text-xs font-bold">
                        <X size={12} weight="bold" />
                        Annuler
                      </button>
                    )}
                  </div>

                  {/* Lien confirmation */}
                  <Link href={"/booking/confirmation/" + b.id}
                    className="mt-2 block text-center text-[11px] text-bronze-500 font-semibold no-underline">
                    Voir la confirmation →
                  </Link>
                  {b.status === "PENDING" && (
                    <div className="mt-2 text-[10px] text-charcoal-400 text-center">
                      Annulation gratuite jusqu\u0027a 72h avant la visite
                    </div>
                  )}
                  {b.status === "PENDING" && (
                    <div className="mt-2 text-[10px] text-charcoal-400 text-center">
                      Annulation gratuite jusqu\u0027a 72h avant la visite
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}

        {/* PAST */}
        {tab === "past" && (
          <>
            {past.length === 0 ? (
              <div className="bg-white rounded-2xl border border-sand-300 p-10 text-center">
                <div className="text-sm text-charcoal-400">Aucun historique</div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-sand-300 overflow-hidden">
                {past.map((b, i) => (
                  <div key={b.id} className={`flex items-center gap-3 p-4 ${i < past.length-1 ? "border-b border-sand-200" : ""}`}>
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-sand-300 flex-shrink-0">
                      {b.guide?.avatar
                        ? <img src={b.guide.avatar} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center font-bold text-charcoal-500">{b.guide?.displayName?.[0]}</div>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-charcoal-800 truncate">{b.guide?.displayName}</div>
                      <div className="text-xs text-charcoal-400">{new Date(b.date).toLocaleDateString("fr-FR")} · {b.duration === "FULL_DAY" ? "8h" : "4h"}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-bold text-charcoal-800">{Number(b.totalPrice)} MAD</div>
                      <StatusBadge status={b.status} />
                      {b.status === "COMPLETED" && (
                        <Link href={"/guide/" + b.guide?.id + "#avis"}
                          className="mt-1 block text-[10px] text-bronze-500 font-bold no-underline">
                          Laisser un avis →
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* CTA */}
        <div className="bg-charcoal-800 rounded-2xl p-5 text-center mt-2">
          <Compass size={28} className="text-bronze-500 mx-auto mb-2" />
          <div className="font-display text-base text-white mb-1">Pret pour une nouvelle aventure ?</div>
          <div className="text-xs text-charcoal-400 mb-3">Explorez nos guides certifies au Maroc</div>
          <Link href="/search" className="inline-block bg-bronze-500 hover:bg-bronze-600 text-white font-bold px-6 py-3 rounded-full text-sm no-underline transition-colors">
            Explorer les guides
          </Link>
        </div>

      </div>
    </div>
  );
}
