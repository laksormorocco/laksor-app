"use client";
import { useState, useEffect } from "react";
import GuideStats from "@/components/GuideStats";
import ProfileEditor from "@/components/ProfileEditor";
import {
  House, CalendarCheck, Target, ChartBar, User,
  Bell, ArrowRight, Check, X, Clock, Users
} from "@phosphor-icons/react";

const TABS = [
  { id:"home",         Icon: House,         label:"Accueil"      },
  { id:"reservations", Icon: CalendarCheck,  label:"Réservations" },
  { id:"demandes",     Icon: Target,         label:"Demandes"     },
  { id:"stats",        Icon: ChartBar,       label:"Stats"        },
  { id:"profil",       Icon: User,           label:"Profil"       },
];

function statusBadge(status: string) {
  const map: Record<string, string> = {
    CONFIRMED: "bg-sage-50 text-sage-300 border-sage-300",
    PENDING:   "bg-bronze-50 text-bronze-500 border-bronze-500",
    CANCELLED: "bg-red-50 text-red-400 border-red-300",
    QUOTED:    "bg-sand-200 text-charcoal-600 border-sand-300",
    ACCEPTED:  "bg-sage-50 text-sage-300 border-sage-300",
    REFUSED:   "bg-red-50 text-red-400 border-red-300",
  };
  return `inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${map[status] || "bg-sand-200 text-charcoal-400 border-sand-300"}`;
}

export default function GuideDashboard() {
  const [active, setActive] = useState("home");
  const [guide, setGuide] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [customRequests, setCustomRequests] = useState<any[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [guideId, setGuideId] = useState("");

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id") || "";
    setGuideId(id);
    if (id) fetchData(id);
    else setLoading(false);
  }, []);

  async function fetchData(id: string) {
    setLoading(true);
    try {
      const [dashRes, reqRes] = await Promise.all([
        fetch("/api/guide/dashboard?guideId=" + id),
        fetch("/api/custom-request?guideId=" + id)
      ]);
      const dashData = await dashRes.json();
      const reqData  = await reqRes.json();
      if (dashData.guide) {
        setGuide(dashData.guide);
        setBookings(dashData.guide.bookings || []);
        setTotalRevenue(dashData.totalRevenue || 0);
      }
      setCustomRequests(reqData.requests || []);
    } catch(e) { console.error(e); }
    setLoading(false);
  }

  async function updateBooking(bookingId: string, status: string) {
    await fetch("/api/guide/booking", {
      method: "PATCH",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ bookingId, status })
    });
    if (guideId) fetchData(guideId);
  }

  async function updateRequest(requestId: string, status: string, proposedPrice?: number) {
    await fetch("/api/custom-request", {
      method: "PATCH",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ requestId, status, proposedPrice })
    });
    if (guideId) fetchData(guideId);
  }

  const pending         = bookings.filter(b => b.status === "PENDING");
  const confirmed       = bookings.filter(b => b.status === "CONFIRMED");
  const pendingRequests = customRequests.filter(r => r.status === "PENDING");
  const notifications   = pending.length + pendingRequests.length;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-sand-200">
      <div className="text-center">
        <div className="text-4xl mb-3 animate-pulse">⏳</div>
        <div className="text-sm text-charcoal-400">Chargement...</div>
      </div>
    </div>
  );

  if (!guideId) return (
    <div className="min-h-screen flex items-center justify-center bg-sand-200 px-4">
      <div className="bg-white rounded-3xl p-8 text-center max-w-sm w-full border border-sand-300">
        <div className="text-4xl mb-4">🔐</div>
        <h2 className="font-display text-lg font-semibold text-charcoal-800 mb-2">Accès Dashboard</h2>
        <p className="text-sm text-charcoal-400 mb-6">Connectez-vous pour accéder à votre espace guide</p>
        <a href="/auth/login" className="block bg-bronze-500 text-white rounded-full py-3.5 text-sm font-bold no-underline text-center hover:bg-bronze-600 transition-colors">
          Se connecter
        </a>
      </div>
    </div>
  );

  return (
    <div className="bg-sand-200 min-h-screen pb-24">

      {/* ── HEADER ── */}
      <div className="sticky top-0 z-30 bg-white border-b border-sand-300 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-sand-300 border-2 border-sand-300">
              {guide?.avatar && <img src={guide.avatar} className="w-full h-full object-cover" />}
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-sage-300 rounded-full border-2 border-white" />
          </div>
          <div>
            <div className="text-[11px] text-charcoal-400">Bonjour,</div>
            <div className="text-sm font-bold text-charcoal-800">{guide?.displayName || "Guide"} 👋</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="relative w-10 h-10 bg-sand-200 rounded-xl border border-sand-300 flex items-center justify-center">
            <Bell size={18} className="text-charcoal-600" />
            {notifications > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-bronze-500 rounded-full border border-white" />
            )}
          </button>
          <a href="/" className="w-10 h-10 bg-sand-200 rounded-xl border border-sand-300 flex items-center justify-center no-underline">
            <House size={18} className="text-charcoal-600" />
          </a>
        </div>
      </div>

      <div className="px-4 pt-4 max-w-lg mx-auto">

        {/* ══ HOME ══ */}
        {active === "home" && (
          <div className="flex flex-col gap-3">
            <div className="bg-charcoal-800 rounded-3xl p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-8 translate-x-8" />
              <div className="text-xs text-charcoal-400 mb-1">Revenus total</div>
              <div className="font-display text-3xl font-bold text-white mb-3">
                {totalRevenue} <span className="text-base font-normal text-charcoal-400">MAD</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: "En attente", val: pending.length,                          color: "text-bronze-500" },
                  { label: "Confirmées", val: confirmed.length,                        color: "text-sage-300"   },
                  { label: "Note",       val: Number(guide?.avgRating||0).toFixed(1),  color: "text-white"      },
                  { label: "Vues",       val: guide?.views || 0,                       color: "text-white"      },
                ].map(s => (
                  <div key={s.label} className="bg-white/5 rounded-xl p-2 text-center">
                    <div className={`text-base font-bold ${s.color}`}>{s.val}</div>
                    <div className="text-[9px] text-charcoal-400 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {pending.length > 0 && (
              <div className="bg-white rounded-2xl border border-sand-300 p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-charcoal-800">Réservations en attente</span>
                  <span className="bg-bronze-50 text-bronze-500 border border-bronze-500 text-[10px] font-bold px-2.5 py-0.5 rounded-full">{pending.length} nouvelles</span>
                </div>
                {pending.map((b: any) => (
                  <div key={b.id} className="border border-sand-200 rounded-xl p-3 mb-3 last:mb-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-full bg-bronze-50 border border-bronze-500 flex items-center justify-center font-bold text-bronze-500 flex-shrink-0">
                        {b.tourist?.name?.[0] || "T"}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-charcoal-800">{b.tourist?.name || "Touriste"}</div>
                        <div className="text-xs text-charcoal-400">{b.tourist?.email || "—"}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-display text-base font-bold text-sage-300">{b.totalPrice} MAD</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {[
                        ["Date",  new Date(b.date).toLocaleDateString("fr-FR")],
                        ["Durée", b.duration === "HALF_DAY" ? "4h" : "8h"],
                        ["Pers.", String(b.persons)],
                      ].map(([k, v]) => (
                        <div key={k} className="bg-sand-200 rounded-lg p-2 text-center">
                          <div className="text-[9px] text-charcoal-400 uppercase tracking-wide">{k}</div>
                          <div className="text-xs font-bold text-charcoal-800 mt-0.5">{v}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => updateBooking(b.id, "CONFIRMED")}
                        className="flex-1 bg-sage-300 text-white rounded-full py-2.5 text-xs font-bold flex items-center justify-center gap-1 hover:bg-sage-400 transition-colors">
                        <Check size={13} weight="bold" /> Accepter
                      </button>
                      <button onClick={() => updateBooking(b.id, "CANCELLED")}
                        className="w-10 h-10 bg-red-50 text-red-400 rounded-full flex items-center justify-center hover:bg-red-100 transition-colors flex-shrink-0">
                        <X size={14} weight="bold" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {confirmed.length > 0 && (
              <div className="bg-white rounded-2xl border border-sand-300 p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-charcoal-800">Prochains tours</span>
                  <button onClick={() => setActive("reservations")} className="text-bronze-500 text-xs font-bold flex items-center gap-1">
                    Voir tout <ArrowRight size={11} weight="bold" />
                  </button>
                </div>
                {confirmed.slice(0, 3).map((b: any, i: number) => (
                  <div key={b.id} className={`flex items-center gap-3 py-3 ${i < Math.min(confirmed.length,3)-1 ? "border-b border-sand-200" : ""}`}>
                    <div className="w-10 h-10 rounded-xl bg-sage-50 flex items-center justify-center flex-shrink-0">
                      <Users size={18} className="text-sage-300" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-charcoal-800">{b.tourist?.name || "Touriste"}</div>
                      <div className="text-xs text-charcoal-400 mt-0.5 flex items-center gap-1">
                        <Clock size={10} />
                        {new Date(b.date).toLocaleDateString("fr-FR")} · {b.duration === "HALF_DAY" ? "4h" : "8h"} · {b.persons} pers.
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-sage-300">{b.totalPrice} MAD</div>
                      <span className="text-[9px] bg-sage-50 text-sage-300 border border-sage-300 px-2 py-0.5 rounded-full font-bold">✓ Confirmé</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {pending.length === 0 && confirmed.length === 0 && (
              <div className="bg-white rounded-2xl border border-sand-300 p-10 text-center">
                <div className="text-4xl mb-3">📋</div>
                <div className="text-sm font-bold text-charcoal-800 mb-1">Aucune réservation</div>
                <div className="text-xs text-charcoal-400">Les nouvelles réservations apparaîtront ici</div>
              </div>
            )}
          </div>
        )}

        {/* ══ RÉSERVATIONS ══ */}
        {active === "reservations" && (
          <div className="bg-white rounded-2xl border border-sand-300 p-4">
            <div className="text-sm font-bold text-charcoal-800 mb-3">Toutes les réservations</div>
            {bookings.length === 0
              ? <div className="text-center py-10 text-charcoal-400 text-sm">Aucune réservation</div>
              : bookings.map((b: any, i: number) => (
                <div key={b.id} className={`flex items-center gap-3 py-3 ${i < bookings.length-1 ? "border-b border-sand-200" : ""}`}>
                  <div className="w-10 h-10 rounded-xl bg-sand-200 flex items-center justify-center font-bold text-charcoal-500 flex-shrink-0 text-sm">
                    {b.tourist?.name?.[0] || "T"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-charcoal-800">{b.tourist?.name || "Touriste"}</div>
                    <div className="text-xs text-charcoal-400 mt-0.5">
                      {new Date(b.date).toLocaleDateString("fr-FR")} · {b.duration === "HALF_DAY" ? "4h" : "8h"} · {b.persons} pers.
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-bold text-sage-300">{b.totalPrice} MAD</div>
                    <span className={statusBadge(b.status)}>
                      {b.status === "CONFIRMED" ? "Confirmé" : b.status === "PENDING" ? "En attente" : "Annulé"}
                    </span>
                    {b.status === "PENDING" && (
                      <div className="flex gap-1 mt-1 justify-end">
                        <button onClick={() => updateBooking(b.id, "CONFIRMED")}
                          className="bg-sage-300 text-white rounded-full px-2.5 py-1 text-[10px] font-bold">✓</button>
                        <button onClick={() => updateBooking(b.id, "CANCELLED")}
                          className="bg-red-50 text-red-400 rounded-full px-2.5 py-1 text-[10px] font-bold">✕</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* ══ DEMANDES ══ */}
        {active === "demandes" && (
          <div className="flex flex-col gap-3">
            <div className="text-sm font-bold text-charcoal-800">Demandes sur mesure ({customRequests.length})</div>
            {customRequests.length === 0 ? (
              <div className="bg-white rounded-2xl border border-sand-300 p-10 text-center">
                <div className="text-4xl mb-3">🎯</div>
                <div className="text-sm text-charcoal-400">Aucune demande sur mesure</div>
              </div>
            ) : customRequests.map((r: any) => (
              <div key={r.id} className="bg-white rounded-2xl border border-sand-300 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-sm font-bold text-charcoal-800">{r.tourist?.name || "Touriste"}</div>
                    <div className="text-xs text-charcoal-400">{r.tourist?.email}</div>
                  </div>
                  <span className={statusBadge(r.status)}>
                    {r.status === "PENDING" ? "En attente" : r.status === "QUOTED" ? "Devis envoyé" : r.status === "ACCEPTED" ? "Accepté" : "Refusé"}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[
                    ["Date",  new Date(r.startDate).toLocaleDateString("fr-FR")],
                    ["Jours", String(r.days)],
                    ["Pers.", String(r.persons)],
                  ].map(([k, v]) => (
                    <div key={k} className="bg-sand-200 rounded-lg p-2 text-center">
                      <div className="text-[9px] text-charcoal-400 uppercase tracking-wide">{k}</div>
                      <div className="text-xs font-bold text-charcoal-800 mt-0.5">{v}</div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-charcoal-500 leading-relaxed mb-3">{r.description}</p>
                {r.status === "PENDING" && (
                  <div className="flex gap-2 flex-wrap">
                    <input type="number" placeholder="Prix (MAD)" id={"price-"+r.id}
                      className="border border-sand-300 rounded-xl px-3 py-2 text-sm text-charcoal-800 outline-none focus:border-bronze-500 w-36" />
                    <button onClick={async () => {
                      const inp = document.getElementById("price-"+r.id) as HTMLInputElement;
                      await updateRequest(r.id, "QUOTED", parseFloat(inp.value));
                    }} className="bg-bronze-500 text-white rounded-full px-4 py-2 text-xs font-bold hover:bg-bronze-600 transition-colors">
                      Proposer prix
                    </button>
                    <button onClick={() => updateRequest(r.id, "REFUSED")}
                      className="bg-red-50 text-red-400 rounded-full px-4 py-2 text-xs font-bold hover:bg-red-100 transition-colors">
                      Refuser
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {active === "stats" && guideId && <GuideStats guideId={guideId} />}
        {active === "profil" && guide && <ProfileEditor guide={guide} guideId={guideId} onSaved={() => fetchData(guideId)} />}
      </div>

      {/* ── BOTTOM NAV ── */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/97 backdrop-blur-lg border-t border-sand-300 z-50 flex">
        {TABS.map(({ id, Icon, label }) => (
          <button key={id} onClick={() => setActive(id)}
            className={`flex flex-col items-center gap-1 flex-1 py-3 transition-colors border-t-2 relative
              ${active === id ? "border-bronze-500 text-bronze-500" : "border-transparent text-charcoal-400"}`}>
            <Icon size={20} weight={active === id ? "fill" : "regular"} />
            <span className={`text-[10px] font-bold`}>{label}</span>
            {id === "demandes" && pendingRequests.length > 0 && (
              <span className="absolute top-1 right-4 w-1.5 h-1.5 bg-bronze-500 rounded-full" />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}
