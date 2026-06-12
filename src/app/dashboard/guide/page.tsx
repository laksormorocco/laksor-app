"use client";
import { useState, useEffect } from "react";
import GuideStats from "@/components/GuideStats";
import ProfileEditor from "@/components/ProfileEditor";
import {
  House, CalendarCheck, Target, ChartBar, User,
  Bell, ArrowRight, Check, X, Clock, Users, Star,
  Trophy, ChartLineUp, Eye, SignOut, MapTrifold, ToggleLeft, ToggleRight, Sparkle, ArrowLeft, IdentificationCard
} from "@phosphor-icons/react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

const TABS = [
  { id:"home",         Icon: House,        label:"Dashboard"    },
  { id:"reservations", Icon: CalendarCheck, label:"Réservations" },
  { id: "experiences", Icon: Sparkle, label: "Experiences" },
  { id:"stats",        Icon: ChartBar,      label:"Stats"        },
  { id:"profil",       Icon: User,          label:"Profil"       },
  { id:"services",  Icon: MapTrifold, label:"Services" },
  { id:"documents", Icon: IdentificationCard, label:"Documents" },
];

function statusBadge(status: string) {
  const map: Record<string,string> = {
    CONFIRMED: "bg-sage-50 text-sage-300 border-sage-300",
    PENDING:   "bg-amber-50 text-amber-600 border-amber-300",
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
  const [guideTours, setGuideTours] = useState<any[]>([]);
  const [toursLoading, setToursLoading] = useState(false);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [expLoading, setExpLoading] = useState(false);
  const [expForm, setExpForm] = useState<any>(null);
  const [editPrice, setEditPrice] = useState<Record<string,string>>({});

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id") || "";
    setGuideId(id);
    if (id) { fetchData(id); fetchTours(id); fetchExperiences(id); }
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

  async function fetchExperiences(id: string) {
    setExpLoading(true);
    const res = await fetch("/api/guide/experiences?guideId=" + id);
    if (res.ok) setExperiences((await res.json()).experiences || []);
    setExpLoading(false);
  }

  async function fetchTours(id: string) {
    setToursLoading(true);
    const res = await fetch("/api/guide/tours?guideId=" + id);
    const data = await res.json();
    setGuideTours(data.tours || []);
    setToursLoading(false);
  }

  async function toggleTour(templateId: string, isActive: boolean, price?: string) {
    await fetch("/api/guide/tours", {
      method: "PATCH",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ guideId, templateId, isActive, price: price || null })
    });
    fetchTours(guideId);
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
  const tours           = guide?.tours || [];
  const activeTours     = tours.filter((t: any) => t.isActive);
  const completionPct   = Math.min(100, 60
    + (guide?.avatar ? 10 : 0)
    + ((guide?.gallery?.length ?? 0) > 0 ? 10 : 0)
    + ((guide?.bio?.length ?? 0) > 100 ? 10 : 0)
    + (activeTours.length > 0 ? 10 : 0)
  );
  const superGuideProgress = Math.min(guide?.totalReviews || 0, 50);
  const needsForSuper      = Math.max(0, 50 - (guide?.totalReviews || 0));

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
        <a href="/auth/login" className="block bg-bronze-500 text-white rounded-full py-3.5 text-sm font-bold no-underline text-center">
          Se connecter
        </a>
      </div>
    </div>
  );


  return (
    <div className="bg-sand-200 min-h-screen pb-24">

      {/* HEADER */}
      <div className="sticky top-0 z-30 bg-white border-b border-sand-300 px-4 py-2 flex items-center justify-between">
        <div className="flex flex-col gap-1.5">
          <img src="/logo7.png" alt="Laksor" style={{ height: 36, width: "auto", objectFit: "contain", maxWidth: 130 }} />
          <div className="flex bg-sand-200 rounded-full p-0.5 border border-sand-300 gap-0.5">
            <a href={`/guide/${guideId}`} className="text-[10px] px-3 py-1 rounded-full text-charcoal-400 font-semibold no-underline flex items-center gap-1">
              <Eye size={11} /> Vue publique
            </a>
            <button className="text-[10px] px-3 py-1 rounded-full bg-charcoal-800 text-white font-bold">
              ✏ Mon dashboard
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="relative w-9 h-9 bg-sand-200 rounded-xl border border-sand-300 flex items-center justify-center">
            <Bell size={17} className="text-charcoal-600" />
            {notifications > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-bronze-500 rounded-full border border-white" />}
          </button>
          <a href="/logout" className="w-9 h-9 bg-sand-200 rounded-xl border border-sand-300 flex items-center justify-center no-underline">
            <SignOut size={17} className="text-charcoal-600" />
          </a>
        </div>
      </div>

      <div className="px-4 pt-4 max-w-lg mx-auto flex flex-col gap-3">

      {/* HOME */}
      {active === "home" && (
        <>
          {/* PROFIL BANNER */}
          <div className="bg-charcoal-800 rounded-2xl p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-8 translate-x-8" />
            <div className="flex gap-3 items-start mb-4">
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-bronze-500/40">
                  {guide?.avatar
                    ? <img src={guide.avatar} className="w-full h-full object-cover" alt="avatar" />
                    : <div className="w-full h-full bg-sand-300 flex items-center justify-center text-lg font-bold text-charcoal-600">{guide?.displayName?.[0]}</div>
                  }
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-sage-300 rounded-full border-2 border-charcoal-800" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-display text-white text-[15px]">{guide?.displayName}</span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full font-bold bg-sage-300/20 text-sage-300 border border-sage-300/30">✓ Guide vérifié</span>
                </div>
                <div className="text-[10px] text-charcoal-400 mt-1">Guide à {guide?.city} · {guide?.yearsExp} ans d&apos;expérience</div>
                <div className="flex gap-3 mt-1.5 flex-wrap">
                  <span className="text-[10px] text-amber-400 flex items-center gap-1"><Star size={10} weight="fill" /> {guide?.avgRating} ({guide?.totalReviews} avis)</span>
                  <span className="text-[10px] text-charcoal-400 flex items-center gap-1"><Users size={10} /> {bookings.length} visites</span>
                  <span className="text-[10px] text-charcoal-400 flex items-center gap-1"><Clock size={10} /> Répond &lt;10 min</span>
                </div>
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-3">
              <div className="flex justify-between mb-1.5">
                <span className="text-[10px] text-charcoal-400">Complétion du profil</span>
                <span className="text-[10px] font-bold text-bronze-500">{completionPct}%</span>
              </div>
              <div className="bg-white/10 rounded-full h-1.5">
                <div className="h-full bg-gradient-to-r from-bronze-500 to-amber-400 rounded-full" style={{width: completionPct+"%"}} />
              </div>
              {completionPct < 100 && <div className="text-[9px] text-charcoal-500 mt-1.5">📹 Ajoutez une vidéo pour atteindre 100%</div>}
            </div>
          </div>

          {/* STATS */}
          <div className="bg-white rounded-2xl border border-sand-300 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-charcoal-800">Résumé de votre activité</span>
              <span className="text-[10px] text-charcoal-400 bg-sand-200 border border-sand-300 rounded-full px-3 py-1">Ce mois</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label:"Revenus",       value: totalRevenue, unit:"MAD", color:"text-bronze-500" },
                { label:"Réservations",  value: bookings.length, unit:"", color:"text-sage-300" },
                { label:"Note moy.",     value: guide?.avgRating || "—", unit:"★", color:"text-amber-500" },
                { label:"Réponse",       value: "98", unit:"%", color:"text-sage-300" },
              ].map(s => (
                <div key={s.label} className="bg-sand-200 rounded-xl p-2 text-center border border-sand-300">
                  <div className={`font-display text-base font-bold ${s.color}`}>{s.value}<span className="text-[9px] text-charcoal-400 ml-0.5">{s.unit}</span></div>
                  <div className="text-[9px] text-charcoal-400 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* SUPER GUIDE */}
          <div className="bg-gradient-to-br from-amber-50 to-sand-200 rounded-2xl border border-bronze-500/20 p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Trophy size={15} className="text-bronze-500" />
                  <span className="text-sm font-bold text-charcoal-800">Objectif Super Guide</span>
                </div>
                <div className="text-[10px] text-charcoal-400 mt-1">
                  {needsForSuper > 0
                    ? <span>Encore <b className="text-bronze-500">{needsForSuper} avis 5★</b> pour passer au niveau supérieur</span>
                    : <span className="text-sage-300 font-bold">🎉 Objectif atteint !</span>
                  }
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-bronze-500 to-amber-400 flex items-center justify-center text-xl shadow-lg">🏆</div>
            </div>
            <div className="bg-sand-300 rounded-full h-1.5 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-bronze-500 to-amber-400 rounded-full" style={{width: Math.min(100,Math.round((superGuideProgress/50)*100))+"%"}} />
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-[9px] text-charcoal-400">{superGuideProgress} / 50 avis requis</span>
              <span className="text-[9px] font-bold text-bronze-500">{Math.min(100,Math.round((superGuideProgress/50)*100))}%</span>
            </div>
          </div>

          {/* APERCU RAPIDE */}
          <div className="bg-white rounded-2xl border border-sand-300 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-charcoal-800">Aperçu rapide</span>
              <button onClick={() => setActive("stats")} className="text-bronze-500 text-[11px] font-bold flex items-center gap-1">
                Voir les stats <ArrowRight size={11} weight="bold" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label:"Vues profil",  value: guide?.views || 0,       delta:"+18%" },
                { label:"Clics",        value: 342,                      delta:"+12%" },
                { label:"Réservations", value: bookings.length,          delta:"+27%" },
                { label:"Revenus",      value: totalRevenue+" MAD",      delta:"+21%" },
              ].map(({ label, value, delta }) => (
                <div key={label} className="bg-sand-200 rounded-xl p-3 border border-sand-300">
                  <div className="text-[9px] text-charcoal-400 uppercase tracking-wide font-semibold">{label}</div>
                  <div className="font-display text-sm font-bold text-charcoal-800 mt-1">{value}</div>
                  <div className="text-[9px] text-sage-300 font-bold mt-1">{delta}</div>
                </div>
              ))}
            </div>
          </div>

          {/* EN ATTENTE */}
          {pending.length > 0 && (
            <div className="bg-white rounded-2xl border border-sand-300 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-charcoal-800">En attente ({pending.length})</span>
                <button onClick={() => setActive("reservations")} className="text-bronze-500 text-[11px] font-bold flex items-center gap-1">
                  Voir tout <ArrowRight size={11} weight="bold" />
                </button>
              </div>
              {pending.map((b: any, i: number) => (
                <div key={b.id} className={`flex items-center gap-3 py-3 ${i < pending.length-1 ? "border-b border-sand-200" : ""}`}>
                  <div className="w-9 h-9 rounded-xl bg-amber-50 border border-sand-300 flex items-center justify-center font-bold text-bronze-500 text-sm flex-shrink-0">
                    {b.tourist?.name?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-charcoal-800">{b.tourist?.name}</div>
                    <div className="text-[10px] text-charcoal-400 mt-0.5 flex items-center gap-1">
                      <Clock size={10} /> {new Date(b.date).toLocaleDateString("fr-FR",{day:"numeric",month:"short"})} · {b.duration==="HALF_DAY"?"4h":"8h"} · {b.persons} pers.
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-bold text-bronze-500">{Math.round(((b.totalPrice || 0) - 25) / 1.25)} MAD</div>
                    <div className="flex gap-1 mt-1.5 justify-end">
                      <button onClick={() => updateBooking(b.id,"CONFIRMED")} className="bg-sage-300 text-white rounded-full px-2.5 py-1 text-[10px] font-bold flex items-center gap-1">
                        <Check size={10} weight="bold" /> Acc.
                      </button>
                      <button onClick={() => updateBooking(b.id,"CANCELLED")} className="bg-red-50 text-red-400 rounded-full px-2.5 py-1 text-[10px] font-bold">
                        <X size={10} weight="bold" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PROCHAINS TOURS */}
          {confirmed.length > 0 && (
            <div className="bg-white rounded-2xl border border-sand-300 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-charcoal-800">Prochains tours</span>
                <button onClick={() => setActive("reservations")} className="text-bronze-500 text-[11px] font-bold flex items-center gap-1">
                  Voir tout <ArrowRight size={11} weight="bold" />
                </button>
              </div>
              {confirmed.slice(0,3).map((b: any, i: number) => (
                <div key={b.id} className={`flex items-center gap-3 py-3 ${i < Math.min(confirmed.length,3)-1 ? "border-b border-sand-200" : ""}`}>
                  <div className="w-9 h-9 rounded-xl bg-sage-50 flex items-center justify-center flex-shrink-0">
                    <Users size={16} className="text-sage-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-charcoal-800">{b.tourist?.name}</div>
                    <div className="text-[10px] text-charcoal-400 mt-0.5 flex items-center gap-1">
                      <Clock size={10} /> {new Date(b.date).toLocaleDateString("fr-FR",{day:"numeric",month:"short"})} · {b.duration==="HALF_DAY"?"4h":"8h"} · {b.persons} pers.
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-sage-300">{Math.round(((b.totalPrice || 0) - 25) / 1.25)} MAD</div>
                    <span className="text-[9px] bg-sage-50 text-sage-300 border border-sage-300/30 px-2 py-0.5 rounded-full font-bold">✓ Confirmé</span>
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
        </>
      )}

      {/* RÉSERVATIONS */}
      {active === "reservations" && (
        <div className="bg-white rounded-2xl border border-sand-300 p-4">
          <div className="text-sm font-bold text-charcoal-800 mb-3">Toutes les réservations ({bookings.length})</div>
          {bookings.length === 0
            ? <div className="text-center py-10 text-charcoal-400 text-sm">Aucune réservation</div>
            : bookings.map((b: any, i: number) => (
              <div key={b.id} className={`flex items-center gap-3 py-3 ${i < bookings.length-1 ? "border-b border-sand-200" : ""}`}>
                <div className="w-9 h-9 rounded-xl bg-sand-200 border border-sand-300 flex items-center justify-center font-bold text-charcoal-500 flex-shrink-0 text-sm">
                  {b.tourist?.name?.[0] || "T"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-charcoal-800">{b.tourist?.name || "Touriste"}</div>
                  <div className="text-[10px] text-charcoal-400 mt-0.5 flex items-center gap-1">
                    <Clock size={10} /> {new Date(b.date).toLocaleDateString("fr-FR",{day:"numeric",month:"short"})} · {b.duration==="HALF_DAY"?"4h":"8h"} · {b.persons} pers.
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-bold text-sage-300">{Math.round(((b.totalPrice || 0) - 25) / 1.25)} MAD</div>
                  <span className={statusBadge(b.status)}>
                    {b.status==="CONFIRMED"?"Confirmé":b.status==="PENDING"?"En attente":"Annulé"}
                  </span>
                  {b.status === "PENDING" && (
                    <div className="flex gap-1 mt-1 justify-end">
                      <button onClick={() => updateBooking(b.id,"CONFIRMED")} className="bg-sage-300 text-white rounded-full px-2.5 py-1 text-[10px] font-bold">✓</button>
                      <button onClick={() => updateBooking(b.id,"CANCELLED")} className="bg-red-50 text-red-400 rounded-full px-2.5 py-1 text-[10px] font-bold">✕</button>
                    </div>
                  )}
                </div>
              </div>
            ))
          }
        </div>
      )}

      {/* DEMANDES */}
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
                  {r.status==="PENDING"?"En attente":r.status==="QUOTED"?"Devis envoyé":r.status==="ACCEPTED"?"Accepté":"Refusé"}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {[["Date",new Date(r.startDate).toLocaleDateString("fr-FR")],["Jours",String(r.days)],["Pers.",String(r.persons)]].map(([k,v]) => (
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
                    await updateRequest(r.id,"QUOTED",parseFloat(inp.value));
                  }} className="bg-bronze-500 text-white rounded-full px-4 py-2 text-xs font-bold">
                    Proposer prix
                  </button>
                  <button onClick={() => updateRequest(r.id,"REFUSED")} className="bg-red-50 text-red-400 rounded-full px-4 py-2 text-xs font-bold">
                    Refuser
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}


      {active === "services" && (
        <div className="flex flex-col gap-3">
          <div className="text-sm font-bold text-charcoal-800">Mes services ({guideTours.filter(t=>t.isActive).length} actifs)</div>
          <div className="text-xs text-charcoal-400 -mt-1">Activez les services que vous proposez et définissez vos tarifs</div>

          {toursLoading ? (
            <div className="text-center py-8 text-charcoal-400 text-sm">Chargement...</div>
          ) : guideTours.length === 0 ? (
            <div className="bg-white rounded-2xl border border-sand-300 p-8 text-center">
              <div className="text-sm text-charcoal-400">Aucun service disponible — contactez l admin</div>
            </div>
          ) : guideTours.map(t => (
            <div key={t.template.id} className={`bg-white rounded-2xl border p-4 transition-all ${t.isActive ? "border-sage-300/50" : "border-sand-300"}`}>
              <div className="flex items-start gap-3 mb-3">
                <div className="text-2xl flex-shrink-0">{t.template.tourType === "MEDINA_SECRETS" ? "🕌" : t.template.tourType === "GASTRONOMIE" ? "🍽️" : t.template.tourType === "HISTOIRE_MONUMENTS" ? "🏛️" : t.template.tourType === "DESERT_NATURE" ? "🏜️" : t.template.tourType === "SHOPPING_ARTISANAT" ? "🛍️" : t.template.tourType === "COUCHER_SOLEIL" ? "🌅" : "📸"}</div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-charcoal-800">{t.template.title}</div>
                  <div className="text-xs text-charcoal-400 mt-0.5">{t.template.description?.slice(0,80)}...</div>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    {t.template.tags?.slice(0,3).map((tag: string) => (
                      <span key={tag} className="text-[9px] bg-sand-200 text-charcoal-400 px-2 py-0.5 rounded-full">{tag}</span>
                    ))}
                  </div>
                </div>
                <button onClick={() => toggleTour(t.template.id, !t.isActive, editPrice[t.template.id])}
                  className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border transition-all
                    ${t.isActive ? "bg-sage-300/15 text-sage-300 border-sage-300/40" : "bg-sand-200 text-charcoal-400 border-sand-300"}`}>
                  {t.isActive ? <ToggleRight size={14} weight="fill" /> : <ToggleLeft size={14} />}
                  {t.isActive ? "Actif" : "Inactif"}
                </button>
              </div>

              {/* Prix */}
              <div className="flex items-center gap-2 pt-3 border-t border-sand-200">
                <div className="text-xs text-charcoal-400 flex-shrink-0">Mon tarif :</div>
                <input
                  type="number"
                  value={editPrice[t.template.id] ?? (t.price || "")}
                  onChange={e => setEditPrice({...editPrice, [t.template.id]: e.target.value})}
                  placeholder={t.price ? String(t.price) : "Prix MAD"}
                  className="flex-1 border border-sand-300 rounded-xl px-3 py-1.5 text-sm text-charcoal-800 outline-none focus:border-bronze-500"
                />
                <span className="text-xs text-charcoal-400">MAD</span>
                <button onClick={() => toggleTour(t.template.id, t.isActive, editPrice[t.template.id])}
                  className="bg-bronze-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs">
                  OK
                </button>
              </div>
              {t.price && (
                <div className="text-xs text-sage-300 font-semibold mt-1.5">Tarif actuel : {t.price} MAD</div>
              )}
            </div>
          ))}
        </div>
      )}

      
        {active === "experiences" && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-charcoal-800">Mes experiences ({experiences.length})</div>
                <div className="text-xs text-charcoal-400 mt-0.5">Creez et gerez vos experiences personnalisees</div>
              </div>
              <button onClick={() => setExpForm({ title:"", description:"", duration:"4h", groupSize:"1-6 pers.", difficulty:"Facile", price:"", city: guide?.city || "", meetingPoint:"", included:"", notIncluded:"", tags:"", photos:[], transportRequired:false })}
                className="flex items-center gap-1.5 bg-bronze-500 text-white text-xs font-bold px-4 py-2.5 rounded-full">
                + Nouvelle
              </button>
            </div>
            {expLoading ? (
              <div className="text-center py-8 text-charcoal-400 text-sm">Chargement...</div>
            ) : experiences.length === 0 ? (
              <div className="bg-white rounded-2xl border border-sand-300 p-8 text-center">
                <div className="text-3xl mb-3">🧭</div>
                <div className="text-sm font-bold text-charcoal-800 mb-1">Aucune experience</div>
                <div className="text-xs text-charcoal-400">Creez votre premiere experience pour la proposer aux voyageurs</div>
              </div>
            ) : experiences.map((exp: any) => (
              <div key={exp.id} className="bg-white rounded-2xl border border-sand-300 p-4">
                <div className="flex items-start gap-3">
                  {exp.photos?.[0] ? (
                    <img src={exp.photos[0]} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-sand-200 flex items-center justify-center flex-shrink-0 text-2xl">🧭</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-charcoal-800 truncate">{exp.title}</div>
                    <div className="text-xs text-charcoal-400 mt-0.5">{exp.duration} · {exp.groupSize}</div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={"text-[10px] font-bold px-2 py-0.5 rounded-full " + (exp.status === "APPROVED" ? "bg-sage-300/15 text-sage-300" : exp.status === "PENDING" ? "bg-bronze-500/15 text-bronze-500" : "bg-red-100 text-red-400")}>
                        {exp.status === "APPROVED" ? "Active" : exp.status === "PENDING" ? "En attente" : "Refuse"}
                      </span>
                      <span className="text-xs font-bold text-charcoal-800">{exp.price} MAD</span>
                    </div>
                  </div>
                  <button onClick={() => setExpForm({...exp, included: (exp.included||[]).join(", "), notIncluded: (exp.notIncluded||[]).join(", "), tags: (exp.tags||[]).join(", ")})}
                    className="text-xs text-bronze-500 font-bold flex-shrink-0">Modifier</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {active === "stats" && guideId && <GuideStats guideId={guideId} />}

        {active === "documents" && (
          <div className="flex flex-col gap-4">
            <div className="text-sm font-bold text-charcoal-800">Verification d identite</div>
            <div className="text-xs text-charcoal-400 -mt-2">Ces documents sont necessaires pour valider votre profil guide</div>

            {[
              { key: "guideCardUrl", label: "Carte guide officielle (recto)", icon: "🪪" },
              { key: "guideCardBack", label: "Carte guide officielle (verso)", icon: "🪪" },
              { key: "nationalIdUrl", label: "Carte nationale (recto)", icon: "🪪" },
              { key: "nationalIdBack", label: "Carte nationale (verso)", icon: "🪪" },
            ].map(doc => (
              <div key={doc.key} className="bg-white rounded-2xl border border-sand-300 p-4">
                <div className="text-xs font-bold text-charcoal-800 mb-3">{doc.icon} {doc.label}</div>
                {guide?.[doc.key] ? (
                  <div className="relative">
                    <img src={guide[doc.key]} className="w-full h-40 object-cover rounded-xl" alt={doc.label} />
                    <label className="absolute bottom-2 right-2 bg-white/90 text-xs font-bold px-3 py-1.5 rounded-full cursor-pointer border border-sand-300">
                      Changer
                      <input type="file" accept="image/*" className="hidden" onChange={async e => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const fd = new FormData();
                        fd.append("file", file as Blob);
                        fd.append("folder", "documents");
                        const res = await fetch("/api/upload", { method: "POST", body: fd });
                        const { url } = await res.json();
                        if (url) {
                          await fetch("/api/guide/profile", { method: "PATCH", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ guideId, [doc.key]: url }) });
                          fetchData(guideId);
                        }
                      }} />
                    </label>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-36 border-2 border-dashed border-sand-300 rounded-xl cursor-pointer hover:border-bronze-500 transition-colors">
                    <span className="text-3xl mb-2">📷</span>
                    <span className="text-xs text-charcoal-400">Cliquez pour uploader</span>
                    <input type="file" accept="image/*" className="hidden" onChange={async e => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const fd = new FormData();
                      fd.append("file", file as Blob);
                      fd.append("folder", "documents");
                      const res = await fetch("/api/upload", { method: "POST", body: fd });
                      const { url } = await res.json();
                      if (url) {
                        await fetch("/api/guide/profile", { method: "PATCH", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ guideId, [doc.key]: url }) });
                        fetchData(guideId);
                      }
                    }} />
                  </label>
                )}
              </div>
            ))}

            <div className={`rounded-2xl px-4 py-3 text-xs font-semibold text-center ${guide?.docsStatus === "APPROVED" ? "bg-sage-300/15 text-sage-300" : guide?.docsStatus === "REFUSED" ? "bg-red-50 text-red-400" : "bg-bronze-500/10 text-bronze-500"}`}>
              {guide?.docsStatus === "APPROVED" ? "✅ Documents verifies" : guide?.docsStatus === "REFUSED" ? "❌ Documents refuses — contactez le support" : "⏳ Documents en attente de verification"}
            </div>
          </div>
        )}

      {active === "profil" && guide && <ProfileEditor guide={guide} guideId={guideId} onSaved={() => fetchData(guideId)} />}

      </div>

      {/* BOTTOM NAV */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-sand-300 z-50 flex">
        {TABS.map(({ id, Icon, label }) => (
          <button key={id} onClick={() => setActive(id)}
            className={`flex flex-col items-center gap-1 flex-1 py-3 transition-colors border-t-2 relative
              ${active===id ? "border-bronze-500 text-bronze-500" : "border-transparent text-charcoal-400"}`}>
            <Icon size={20} weight={active===id ? "fill" : "regular"} />
            <span className="text-[10px] font-bold">{label}</span>
            {id === "demandes" && pendingRequests.length > 0 && (
              <span className="absolute top-1 right-4 w-1.5 h-1.5 bg-bronze-500 rounded-full" />
            )}
          </button>
        ))}
      </nav>

      {expForm && (
        <div className="fixed inset-x-0 top-0 bottom-16 z-50 bg-white flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-sand-200">
            <button onClick={() => setExpForm(null)} className="w-9 h-9 rounded-full border border-sand-200 flex items-center justify-center">
              <ArrowLeft size={16} weight="bold" className="text-charcoal-600" />
            </button>
            <span className="font-display text-sm font-bold text-charcoal-800">{expForm.id ? "Modifier" : "Nouvelle experience"}</span>
            <div className="w-9" />
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-4">
            <div>
              <div className="text-xs font-bold text-charcoal-800 mb-2">Photos</div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {(expForm.photos || []).map((url: string, i: number) => (
                  <div key={i} className="relative flex-shrink-0">
                    <img src={url} className="w-20 h-20 rounded-xl object-cover" />
                    <button onClick={() => setExpForm({...expForm, photos: expForm.photos.filter((_: any, j: number) => j !== i)})}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">x</button>
                  </div>
                ))}
                <label className="w-20 h-20 rounded-xl border-2 border-dashed border-sand-300 flex flex-col items-center justify-center cursor-pointer flex-shrink-0 text-charcoal-400">
                  <span className="text-2xl">+</span>
                  <span className="text-[10px]">Photo</span>
                  <input type="file" accept="image/*" className="hidden" onChange={async e => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const fd = new FormData();
                    fd.append("file", file as Blob);
                    fd.append("folder", "experiences");
                    const res = await fetch("/api/upload", { method: "POST", body: fd });
                    const { url } = await res.json();
                    if (url) setExpForm({...expForm, photos: [...(expForm.photos||[]), url]});
                  }} />
                </label>
              </div>
            </div>
            {([
              { key:"title", label:"Titre *", ph:"Journee a Agafay..." },
              { key:"description", label:"Description", ph:"Decrivez votre experience...", area:true },
              { key:"price", label:"Prix (MAD)", ph:"500" },
              { key:"city", label:"Ville", ph:"Marrakech" },
              { key:"meetingPoint", label:"Point de RDV", ph:"Place Jemaa el-Fna..." },
              { key:"duration", label:"Duree", ph:"4h" },
              { key:"groupSize", label:"Groupe", ph:"1-6 pers." },
              { key:"difficulty", label:"Niveau", ph:"Facile" },
              { key:"tags", label:"Tags (virgule)", ph:"Desert, Aventure" },
              { key:"included", label:"Inclus (virgule)", ph:"Guide, Transport" },
              { key:"notIncluded", label:"Non inclus (virgule)", ph:"Repas, Entrees" },
            ] as any[]).map((f: any) => (
              <div key={f.key}>
                <div className="text-xs font-bold text-charcoal-400 mb-1">{f.label}</div>
                {f.area ? (
                  <textarea value={expForm[f.key] || ""} onChange={e => setExpForm({...expForm, [f.key]: e.target.value})}
                    placeholder={f.ph} rows={3} className="w-full border border-sand-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-bronze-500 resize-none" />
                ) : (
                  <input value={expForm[f.key] || ""} onChange={e => setExpForm({...expForm, [f.key]: e.target.value})}
                    placeholder={f.ph} className="w-full border border-sand-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-bronze-500" />
                )}
              </div>
            ))}
            <div className="flex items-center justify-between bg-sand-100 rounded-xl px-4 py-3">
              <div>
                <div className="text-xs font-bold text-charcoal-800">Transport necessaire</div>
                <div className="text-[10px] text-charcoal-400">Prevenir le client qu il aura besoin de transport</div>
              </div>
              <button onClick={() => setExpForm({...expForm, transportRequired: !expForm.transportRequired})}
                className={"w-12 h-6 rounded-full relative transition-colors " + (expForm.transportRequired ? "bg-sage-300" : "bg-sand-300")}>
                <div className={"w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm " + (expForm.transportRequired ? "left-6" : "left-0.5")} />
              </button>
            </div>
            {!expForm.pricePerPerson && (
              <div>
                <div className="text-xs font-bold text-charcoal-400 mb-1">Nombre de personnes inclus dans le prix</div>
                <input type="number" value={expForm.maxPersons || 6}
                  onChange={e => setExpForm({...expForm, maxPersons: Number(e.target.value)})}
                  min={1} max={20}
                  className="w-full border border-sand-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-bronze-500" />
              </div>
            )}

            <button onClick={async () => {
              const data = {
                ...expForm,
                guideId,
                included: expForm.included ? expForm.included.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
                notIncluded: expForm.notIncluded ? expForm.notIncluded.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
                tags: expForm.tags ? expForm.tags.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
                price: Number(expForm.price) || 0,
              };
              const method = expForm.id ? "PATCH" : "POST";
              const res = await fetch("/api/guide/experiences", { method, headers: {"Content-Type":"application/json"}, body: JSON.stringify(data) });
              if (res.ok) { fetchExperiences(guideId); setExpForm(null); }
            }}
              className="w-full text-white font-bold py-4 rounded-full text-sm"
              style={{background:"linear-gradient(135deg, #B88A44, #9A7238)", boxShadow:"0 4px 14px rgba(184,138,68,0.3)"}}>
              {expForm.id ? "Mettre a jour" : "Publier l experience"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
