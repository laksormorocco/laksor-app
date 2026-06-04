"use client";
import { useState, useEffect } from "react";
import {
  ChartBar, Compass, CalendarCheck, EnvelopeSimple, MapTrifold, UsersThree, UserCircle,
  Check, X, Trash, WhatsappLogo, PaperPlaneTilt, Plus, PencilSimple,
  ToggleLeft, ToggleRight, SignOut
} from "@phosphor-icons/react";

const PASSWORD = "laksor2024";

const TABS = [
  { id:"overview", Icon: ChartBar,       label:"Overview"  },
  { id:"guides",   Icon: Compass,        label:"Guides"    },
  { id:"bookings", Icon: CalendarCheck,  label:"Réserv."   },
  { id:"tours",    Icon: MapTrifold,     label:"Tours"     },
  { id:"email",    Icon: EnvelopeSimple, label:"Email"     },
  { id:"crm",     Icon: UsersThree,    label:"CRM"       },
  { id:"tourists", Icon: UserCircle,    label:"Clients"   },
];

const TOUR_TYPES = [
  { type:"MEDINA_SECRETS",     emoji:"🕌", title:"Médina & Secrets",       desc:"Ruelles cachées, artisans, histoire" },
  { type:"GASTRONOMIE",        emoji:"🍽️", title:"Gastronomie & Cuisine",   desc:"Épices, tajine, cuisine locale"      },
  { type:"HISTOIRE_MONUMENTS", emoji:"🏛️", title:"Histoire & Monuments",    desc:"Sites UNESCO, palais, médersas"      },
  { type:"DESERT_NATURE",      emoji:"🏜️", title:"Désert & Nature",         desc:"Sahara, bivouac, chameaux"           },
  { type:"SHOPPING_ARTISANAT", emoji:"🛍️", title:"Shopping & Artisanat",    desc:"Souks, cuir, poterie, tapis"         },
  { type:"COUCHER_SOLEIL",     emoji:"🌅", title:"Coucher de soleil",       desc:"Rooftops, dunes, panoramas"          },
  { type:"PHOTO_INSTAGRAM",    emoji:"📸", title:"Tour Photo / Instagram",  desc:"Lieux instagrammables, shooting"     },
];

const inputCls = "w-full border border-sand-300 rounded-xl px-4 py-3 text-sm text-charcoal-800 bg-sand-100 outline-none focus:border-bronze-500 transition-colors";

function statusBadge(status: string) {
  const map: Record<string,string> = {
    APPROVED: "bg-sage-50 text-sage-300 border-sage-300",
    PENDING:  "bg-bronze-50 text-bronze-500 border-bronze-500",
    REJECTED: "bg-red-50 text-red-400 border-red-200",
    SUSPENDED:"bg-sand-200 text-charcoal-400 border-sand-300",
  };
  const labels: Record<string,string> = { APPROVED:"Approuvé", PENDING:"En attente", REJECTED:"Refusé", SUSPENDED:"Suspendu" };
  return { cls: `inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${map[status]||"bg-sand-200 text-charcoal-400 border-sand-300"}`, label: labels[status]||status };
}

export default function AdminDashboard() {
  const [auth,     setAuth]     = useState(false);
  const [pwd,      setPwd]      = useState("");
  const [active,   setActive]   = useState("overview");
  const [stats,    setStats]    = useState<any>(null);
  const [guides,   setGuides]   = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [guideTab, setGuideTab] = useState("pending");
  const [search,   setSearch]   = useState("");
  const [emailForm,setEmailForm]= useState({to:"",subject:"",message:""});
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent,    setEmailSent]    = useState(false);
  const [templates,    setTemplates]    = useState<any[]>([]);
  const [tourForm,     setTourForm]     = useState<any>(null);
  const [tourSaving,   setTourSaving]   = useState(false);
  const [crmBookings,  setCrmBookings]  = useState<any[]>([]);
  const [crmSearch,    setCrmSearch]    = useState("");
  const [crmStatus,    setCrmStatus]    = useState("");
  const [crmSelected,  setCrmSelected]  = useState<any>(null);
  const [crmLoading,   setCrmLoading]   = useState(false);
  const [crmPeriod,    setCrmPeriod]    = useState("");
  const [crmGuide,     setCrmGuide]     = useState("");
  const [tourists,     setTourists]     = useState<any[]>([]);
  const [touristSearch,setTouristSearch]= useState("");
  const [touristSel,   setTouristSel]   = useState<any>(null);

  useEffect(() => { if (auth) { fetchAll(); fetchTemplates(); } }, [auth]);
  useEffect(() => { if (auth && active === "guides") fetchGuides(); }, [guideTab, active, auth]);
  useEffect(() => { if (auth && active === "crm") fetchCrm(); }, [active, auth, crmSearch, crmStatus, crmPeriod, crmGuide]);
  useEffect(() => { if (auth && active === "tourists") fetchTourists(); }, [active, auth, touristSearch]);

  async function fetchAll() {
    const [sRes, bRes] = await Promise.all([fetch("/api/admin/stats"), fetch("/api/admin/bookings")]);
    setStats(await sRes.json());
    setBookings((await bRes.json()).bookings || []);
    fetchGuides();
  }

  async function fetchGuides() {
    const res = await fetch("/api/admin/guides?status=" + guideTab.toUpperCase());
    setGuides((await res.json()).guides || []);
  }

  async function fetchTourists() {
    const params = new URLSearchParams();
    if (touristSearch) params.set("search", touristSearch);
    const res = await fetch("/api/admin/tourists?" + params.toString());
    if (res.ok) setTourists((await res.json()).tourists || []);
  }

  async function fetchCrm() {
    setCrmLoading(true);
    const params = new URLSearchParams();
    if (crmSearch) params.set("search", crmSearch);
    if (crmStatus) params.set("status", crmStatus);
    if (crmPeriod) params.set("period", crmPeriod);
    if (crmGuide) params.set("guideId", crmGuide);
    const res = await fetch("/api/admin/bookings?" + params.toString());
    if (res.ok) setCrmBookings((await res.json()).bookings || []);
    setCrmLoading(false);
  }

  async function fetchTemplates() {
    const res = await fetch("/api/admin/tours");
    if (res.ok) setTemplates((await res.json()).templates || []);
  }

  async function updateGuide(id: string, status: string) {
    await fetch("/api/admin/guides", { method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify({id,status}) });
    fetchGuides(); fetchAll();
  }

  async function deleteGuide(id: string) {
    if (!confirm("Supprimer ce guide ?")) return;
    await fetch("/api/admin/guides/"+id, { method:"DELETE" });
    fetchGuides();
  }

  async function sendEmail() {
    if (!emailForm.to || !emailForm.subject || !emailForm.message) return alert("Remplissez tout");
    setEmailSending(true);
    const res = await fetch("/api/email", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ to:emailForm.to, subject:emailForm.subject, html:"<div style=\'font-family:sans-serif;padding:24px\'><h2>LAKSOR MOROCCO</h2><hr/>"+emailForm.message.split("\n").join("<br/>")+"</div>" }) });
    if (res.ok) { setEmailSent(true); setEmailForm({to:"",subject:"",message:""}); setTimeout(()=>setEmailSent(false),3000); }
    else alert("Erreur");
    setEmailSending(false);
  }

  async function saveTour() {
    if (!tourForm) return;
    setTourSaving(true);
    const method = tourForm.id ? "PATCH" : "POST";
    const res = await fetch("/api/admin/tours", { method, headers:{"Content-Type":"application/json"}, body:JSON.stringify(tourForm) });
    if (res.ok) { await fetchTemplates(); setTourForm(null); }
    else alert("Erreur sauvegarde");
    setTourSaving(false);
  }

  async function toggleTemplate(id: string, isActive: boolean) {
    await fetch("/api/admin/tours", { method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify({id, isActive:!isActive}) });
    fetchTemplates();
  }

  const filtered = guides.filter(g => !search || g.displayName?.toLowerCase().includes(search.toLowerCase()) || g.city?.toLowerCase().includes(search.toLowerCase()));
  const BARS = stats?.monthlyRevenue || [];
  const maxBar = Math.max(...BARS.map((b:any) => b.revenue), 1);

  if (!auth) return (
    <div className="min-h-screen flex items-center justify-center bg-sand-200 px-4">
      <div className="bg-white rounded-3xl p-8 text-center max-w-sm w-full border border-sand-300">
        <div className="text-4xl mb-4">🔐</div>
        <h2 className="font-display text-lg font-semibold text-charcoal-800 mb-2">Accès Admin</h2>
        <p className="text-sm text-charcoal-400 mb-6">Laksor Back-office</p>
        <input type="password" value={pwd} onChange={e=>setPwd(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&setPwd(p=>{if(p===PASSWORD){setAuth(true);return p;}alert("Mot de passe incorrect");return p;})}
          placeholder="Mot de passe" className={inputCls + " mb-4"} />
        <button onClick={() => { if (pwd === PASSWORD) setAuth(true); else alert("Mot de passe incorrect"); }}
          className="w-full bg-bronze-500 text-white rounded-full py-3.5 text-sm font-bold hover:bg-bronze-600 transition-colors">
          Accéder
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-sand-200 min-h-screen pb-24">

      {/* ── HEADER ── */}
      <div className="sticky top-0 z-30 bg-white border-b border-sand-300 px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-bronze-500 rounded-xl flex items-center justify-center text-white text-sm font-bold">L</div>
          <span className="font-display text-base font-semibold text-charcoal-800">Admin</span>
        </div>
        <button onClick={() => setAuth(false)} className="flex items-center gap-1.5 text-xs font-bold text-red-400 bg-red-50 px-3 py-1.5 rounded-full border border-red-200">
          <SignOut size={13} /> Déconnexion
        </button>
      </div>

      <div className="px-4 pt-4 max-w-lg mx-auto">

        {/* ══ OVERVIEW ══ */}
        {active === "overview" && (
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon:"🧭", label:"Guides approuvés", val:stats?.approvedGuides||0,  color:"text-bronze-500"  },
                { icon:"⏳", label:"En attente",        val:stats?.pendingGuides||0,   color:"text-charcoal-600"},
                { icon:"📋", label:"Réservations",      val:stats?.totalBookings||0,   color:"text-sage-300"    },
                { icon:"💰", label:"Commission",        val:Math.round((stats?.totalRevenue||0)*0.25)+" MAD", color:"text-charcoal-800" },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-2xl border border-sand-300 p-4">
                  <div className="text-2xl mb-2">{s.icon}</div>
                  <div className={`font-display text-xl font-bold ${s.color}`}>{s.val}</div>
                  <div className="text-[10px] text-charcoal-400 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            {BARS.length > 0 && (
              <div className="bg-white rounded-2xl border border-sand-300 p-4">
                <div className="text-sm font-bold text-charcoal-800 mb-3">Revenus par mois</div>
                <div className="flex items-end gap-1 h-20">
                  {BARS.map((b:any, i:number) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className="text-[8px] text-charcoal-400">{b.revenue>0?b.revenue:""}</div>
                      <div className="w-full rounded-t-sm"
                        style={{ height: Math.max((b.revenue/maxBar)*60,2)+"px", background: i===BARS.length-1?"#B88A44":"rgba(184,138,68,0.3)" }} />
                      <div className="text-[8px] text-charcoal-400">{b.month}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}


          {/* TAUX DE CONVERSION */}
          <div className="bg-white rounded-2xl border border-sand-300 p-4">
            <div className="text-sm font-bold text-charcoal-800 mb-3">Taux de conversion</div>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-sand-200 rounded-full h-3 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-bronze-500 to-amber-400 rounded-full"
                  style={{width: (stats?.conversionRate || 0) + "%"}} />
              </div>
              <span className="font-display text-lg font-bold text-bronze-500">{stats?.conversionRate || 0}%</span>
            </div>
            <div className="flex justify-between mt-2 text-xs text-charcoal-400">
              <span>{stats?.confirmedBookings || 0} confirmees</span>
              <span>{stats?.cancelledBookings || 0} annulees</span>
              <span>{stats?.totalBookings || 0} total</span>
            </div>
          </div>

          {stats?.topGuides?.length > 0 && (
            <div className="bg-white rounded-2xl border border-sand-300 p-4">
              <div className="text-sm font-bold text-charcoal-800 mb-3">Top Guides par revenus</div>
              {stats.topGuides.map((g: any, i: number) => (
                <div key={g.guideId} className={`flex items-center gap-3 py-2.5 ${i < stats.topGuides.length-1 ? "border-b border-sand-200" : ""}`}>
                  <div className="w-6 h-6 rounded-full bg-bronze-500/10 flex items-center justify-center text-xs font-bold text-bronze-500 flex-shrink-0">{i+1}</div>
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-sand-300 flex-shrink-0">
                    {g.avatar ? <img src={g.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs font-bold text-charcoal-500">{g.displayName?.[0]}</div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-charcoal-800 truncate">{g.displayName}</div>
                    <div className="text-xs text-charcoal-400">{g.city} · {g.bookings} resa</div>
                  </div>
                  <div className="text-sm font-bold text-bronze-500">{g.revenue} MAD</div>
                </div>
              ))}
            </div>
          )}

            {stats?.recentBookings?.length > 0 && (
              <div className="bg-white rounded-2xl border border-sand-300 p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-charcoal-800">Dernières réservations</span>
                  <button onClick={() => setActive("bookings")} className="text-bronze-500 text-xs font-bold">Voir tout →</button>
                </div>
                {stats.recentBookings.slice(0,3).map((b:any,i:number) => (
                  <div key={i} className={`flex items-center gap-3 py-2.5 ${i<2?"border-b border-sand-200":""}`}>
                    <div className="w-9 h-9 rounded-xl overflow-hidden bg-sand-300 flex-shrink-0 flex items-center justify-center text-sm font-bold text-charcoal-500">
                      {b.guide?.avatar ? <img src={b.guide.avatar} className="w-full h-full object-cover" /> : b.guide?.displayName?.[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-charcoal-800 truncate">{b.guide?.displayName}</div>
                      <div className="text-xs text-charcoal-400">{b.tourist?.name} · {new Date(b.date).toLocaleDateString("fr-FR")}</div>
                    </div>
                    <div className="text-sm font-bold text-sage-300 flex-shrink-0">{b.totalPrice} MAD</div>
                  </div>
                ))}
              </div>
            )}

            {stats?.recentGuides?.length > 0 && (
              <div className="bg-white rounded-2xl border border-sand-300 p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-charcoal-800">Guides en attente</span>
                  <span className="bg-bronze-50 text-bronze-500 border border-bronze-500 text-[10px] font-bold px-2.5 py-0.5 rounded-full">{stats.pendingGuides}</span>
                </div>
                {stats.recentGuides.map((g:any) => (
                  <div key={g.id} className="border border-sand-200 rounded-xl p-3 mb-3 last:mb-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-sand-300 flex-shrink-0 flex items-center justify-center font-bold text-charcoal-500">
                        {g.avatar ? <img src={g.avatar} className="w-full h-full object-cover" /> : g.displayName?.[0]}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-charcoal-800">{g.displayName}</div>
                        <div className="text-xs text-charcoal-400">📍 {g.city}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => updateGuide(g.id,"APPROVED")}
                        className="flex-1 bg-sage-300 text-white rounded-full py-2 text-xs font-bold flex items-center justify-center gap-1 hover:bg-sage-400 transition-colors">
                        <Check size={12} weight="bold" /> Approuver
                      </button>
                      <button onClick={() => updateGuide(g.id,"REJECTED")}
                        className="w-9 h-9 bg-red-50 text-red-400 rounded-full flex items-center justify-center flex-shrink-0">
                        <X size={14} weight="bold" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══ GUIDES ══ */}
        {active === "guides" && (
          <div className="flex flex-col gap-3">
            <input value={search} onChange={e=>setSearch(e.target.value)}
              placeholder="Rechercher un guide..." className={inputCls} />
            <div className="flex gap-2">
              {["pending","approved","rejected"].map(t => (
                <button key={t} onClick={() => setGuideTab(t)}
                  className={`px-4 py-2 rounded-full text-xs font-bold border transition-all flex-shrink-0
                    ${guideTab===t ? "bg-bronze-500 text-white border-bronze-500" : "bg-white text-charcoal-500 border-sand-300"}`}>
                  {t==="pending"?"En attente":t==="approved"?"Approuvés":"Refusés"}
                </button>
              ))}
            </div>
            {filtered.map((g:any) => {
              const badge = statusBadge(g.status);
              return (
                <div key={g.id} className="bg-white rounded-2xl border border-sand-300 p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-11 h-11 rounded-full overflow-hidden bg-sand-300 flex-shrink-0 flex items-center justify-center font-bold text-charcoal-500">
                      {g.avatar ? <img src={g.avatar} className="w-full h-full object-cover" /> : g.displayName?.[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-charcoal-800">{g.displayName}</div>
                      <div className="text-xs text-charcoal-400">📍 {g.city} · {g.halfDayPrice}/{g.fullDayPrice} MAD</div>
                      {g.user?.email && <div className="text-xs text-bronze-500 truncate">{g.user.email}</div>}
                    </div>
                    <span className={badge.cls}>{badge.label}</span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {g.phone && (
                      <a href={"https://wa.me/"+g.phone.replace(/[^0-9]/g,"")} target="_blank"
                        className="bg-sage-300 text-white rounded-full px-3 py-1.5 text-xs font-bold no-underline flex items-center gap-1">
                        <WhatsappLogo size={12} weight="fill" /> WA
                      </a>
                    )}
                    {g.user?.email && (
                      <button onClick={() => { setEmailForm({to:g.user.email,subject:"Message Laksor",message:""}); setActive("email"); }}
                        className="bg-sand-200 text-charcoal-600 rounded-full px-3 py-1.5 text-xs font-bold border border-sand-300">
                        📧 Email
                      </button>
                    )}
                    {guideTab === "pending" && (
                      <>
                        <button onClick={() => updateGuide(g.id,"APPROVED")}
                          className="bg-sage-300 text-white rounded-full px-3 py-1.5 text-xs font-bold flex items-center gap-1">
                          <Check size={11} weight="bold" /> Approuver
                        </button>
                        <button onClick={() => updateGuide(g.id,"REJECTED")}
                          className="bg-red-50 text-red-400 rounded-full px-3 py-1.5 text-xs font-bold border border-red-200">
                          <X size={11} weight="bold" /> Refuser
                        </button>
                      </>
                    )}
                    {guideTab === "approved" && (
                      <button onClick={() => updateGuide(g.id,"SUSPENDED")}
                        className="bg-bronze-50 text-bronze-500 rounded-full px-3 py-1.5 text-xs font-bold border border-bronze-500">
                        Suspendre
                      </button>
                    )}
                    <button onClick={() => deleteGuide(g.id)}
                      className="bg-red-50 text-red-400 rounded-full px-3 py-1.5 text-xs font-bold border border-red-200 ml-auto">
                      <Trash size={12} weight="bold" />
                    </button>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="bg-white rounded-2xl border border-sand-300 p-10 text-center">
                <div className="text-4xl mb-3">🔍</div>
                <div className="text-sm text-charcoal-400">Aucun guide trouvé</div>
              </div>
            )}
          </div>
        )}

        {/* ══ RÉSERVATIONS ══ */}
        {active === "bookings" && (
          <div className="flex flex-col gap-3">
            <div className="text-sm font-bold text-charcoal-800">Réservations ({bookings.length})</div>
            {bookings.length === 0 ? (
              <div className="bg-white rounded-2xl border border-sand-300 p-10 text-center">
                <div className="text-sm text-charcoal-400">Aucune réservation</div>
              </div>
            ) : bookings.map((b:any,i:number) => {
              const badge = statusBadge(b.status);
              return (
                <div key={i} className="bg-white rounded-2xl border border-sand-300 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-bold text-charcoal-800">{b.guide?.displayName}</div>
                    <span className={badge.cls}>{badge.label}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {[["Date",new Date(b.date).toLocaleDateString("fr-FR")],["Durée",b.duration==="HALF_DAY"?"4h":"8h"],["Pers.",String(b.persons||1)]].map(([k,v]) => (
                      <div key={k} className="bg-sand-200 rounded-lg p-2 text-center">
                        <div className="text-[9px] text-charcoal-400 uppercase">{k}</div>
                        <div className="text-xs font-bold text-charcoal-800 mt-0.5">{v}</div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-sand-200 rounded-xl p-3 mb-3">
                    <div className="text-[10px] text-charcoal-400 mb-1">Touriste</div>
                    <div className="text-sm font-bold text-charcoal-800">{b.tourist?.name||"—"}</div>
                    <div className="text-xs text-charcoal-400">{b.tourist?.email||"—"}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-sage-300 text-base">{b.totalPrice} MAD</span>
                      <span className="text-xs text-charcoal-400 ml-2">+{b.commission} comm.</span>
                    </div>
                    <div className="flex gap-2">
                      {b.tourist?.email && (
                        <button onClick={() => { setEmailForm({to:b.tourist.email,subject:"Votre réservation",message:""}); setActive("email"); }}
                          className="bg-sand-200 text-charcoal-600 rounded-full px-3 py-1.5 text-xs font-bold border border-sand-300">
                          📧
                        </button>
                      )}
                      {b.guide?.phone && (
                        <a href={"https://wa.me/"+b.guide.phone.replace(/[^0-9]/g,"")} target="_blank"
                          className="bg-sage-300 text-white rounded-full px-3 py-1.5 text-xs font-bold no-underline">
                          💬
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ══ TOURS ══ */}
        {active === "tours" && (
          <div className="flex flex-col gap-3">
            <div className="text-sm font-bold text-charcoal-800">Templates de tours ({templates.length}/7)</div>

            {/* Liste des 7 types */}
            {TOUR_TYPES.map(tt => {
              const existing = templates.find((t:any) => t.tourType === tt.type);
              return (
                <div key={tt.type} className="bg-white rounded-2xl border border-sand-300 p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-2xl">{tt.emoji}</div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-charcoal-800">{tt.title}</div>
                      <div className="text-xs text-charcoal-400">{tt.desc}</div>
                    </div>
                    {existing ? (
                      <button onClick={() => toggleTemplate(existing.id, existing.isActive)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border transition-all
                          ${existing.isActive ? "bg-sage-50 text-sage-300 border-sage-300" : "bg-sand-200 text-charcoal-400 border-sand-300"}`}>
                        {existing.isActive ? <ToggleRight size={14} weight="fill" /> : <ToggleLeft size={14} />}
                        {existing.isActive ? "Actif" : "Inactif"}
                      </button>
                    ) : (
                      <span className="text-[10px] text-charcoal-300 font-bold px-2.5 py-1 bg-sand-200 rounded-full">Non créé</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setTourForm(existing ? {
                        id: existing.id, tourType: tt.type, title: existing.title,
                        description: existing.description, duration: existing.duration,
                        groupSize: existing.groupSize, difficulty: existing.difficulty,
                        bestMoment: existing.bestMoment, coverImage: existing.coverImage || "",
                        tags: (existing.tags||[]).join(", "),
                        included: (existing.included||[]).join(", "),
                        notIncluded: (existing.notIncluded||[]).join(", "),
                      } : {
                        tourType: tt.type, title: tt.title, description: "", duration: "4h",
                        groupSize: "1-6 pers.", difficulty: "Facile", bestMoment: "Matin",
                        coverImage: "", tags: "", included: "", notIncluded: "",
                      })}
                      className="flex items-center gap-1.5 bg-bronze-50 text-bronze-500 border border-bronze-500 rounded-full px-3 py-1.5 text-xs font-bold">
                      <PencilSimple size={12} weight="bold" />
                      {existing ? "Modifier" : "Créer"}
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Formulaire création/édition tour */}
            {tourForm && (
              <div className="bg-white rounded-2xl border border-bronze-500 p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-bold text-charcoal-800">
                    {tourForm.id ? "Modifier le tour" : "Créer le tour"} — {TOUR_TYPES.find(t=>t.type===tourForm.tourType)?.title}
                  </div>
                  <button onClick={() => setTourForm(null)} className="w-7 h-7 rounded-full bg-sand-200 flex items-center justify-center">
                    <X size={12} weight="bold" className="text-charcoal-500" />
                  </button>
                </div>

                {[
                  { key:"title",       label:"Titre",           type:"input",    ph:"Médina & Secrets" },
                  { key:"description", label:"Description",     type:"textarea", ph:"Description du tour..." },
                  { key:"coverImage",  label:"Image de couverture (URL)", type:"input", ph:"https://..." },
                  { key:"duration",    label:"Durée",           type:"input",    ph:"4h" },
                  { key:"groupSize",   label:"Taille du groupe",type:"input",    ph:"1-6 pers." },
                  { key:"difficulty",  label:"Difficulté",      type:"input",    ph:"Facile" },
                  { key:"bestMoment",  label:"Meilleur moment", type:"input",    ph:"Matin" },
                  { key:"tags",        label:"Tags (virgule)",  type:"input",    ph:"Authentique, Culture" },
                  { key:"included",    label:"Inclus (virgule)",type:"input",    ph:"Guide officiel, Thé" },
                  { key:"notIncluded", label:"Non inclus (virgule)", type:"input", ph:"Transport, Repas" },
                ].map(f => (
                  <div key={f.key} className="mb-3">
                    <label className="text-[10px] font-bold text-charcoal-400 uppercase tracking-wider block mb-1">{f.label}</label>
                    {f.type === "textarea"
                      ? <textarea value={tourForm[f.key]||""} onChange={e=>setTourForm({...tourForm,[f.key]:e.target.value})}
                          placeholder={f.ph} rows={3} className={inputCls + " resize-none"} />
                      : <input value={tourForm[f.key]||""} onChange={e=>setTourForm({...tourForm,[f.key]:e.target.value})}
                          placeholder={f.ph} className={inputCls} />
                    }
                  </div>
                ))}

                <button onClick={saveTour} disabled={tourSaving}
                  className={`w-full py-3.5 rounded-2xl text-sm font-bold text-white transition-all
                    ${tourSaving ? "bg-sand-300 cursor-not-allowed" : "bg-bronze-500 hover:bg-bronze-600"}`}>
                  {tourSaving ? "Sauvegarde..." : tourForm.id ? "Mettre à jour" : "Créer le template →"}
                </button>
              </div>
            )}
          </div>
        )}


        {/* ══ CRM ══ */}
        {active === "crm" && (
          <div className="flex flex-col gap-3">

            {/* Search + Filtres */}
            <div className="bg-white rounded-2xl border border-sand-300 p-4 flex flex-col gap-3">
              <input value={crmSearch} onChange={e => setCrmSearch(e.target.value)}
                placeholder="Rechercher LAK-XXXX, nom, email, guide..."
                className={inputCls} />
              <div className="flex gap-2 flex-wrap">
                {["","CONFIRMED","PENDING","CANCELLED","COMPLETED"].map(s => (
                  <button key={s} onClick={() => setCrmStatus(s)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all
                      ${crmStatus===s ? "bg-bronze-500 text-white border-bronze-500" : "bg-sand-200 text-charcoal-400 border-sand-300"}`}>
                    {s===""?"Tous":s==="CONFIRMED"?"Confirme":s==="PENDING"?"En attente":s==="CANCELLED"?"Annule":"Complete"}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 flex-wrap">
                {[["","Toutes dates"],["week","Cette semaine"],["month","Ce mois"]].map(([v,l]) => (
                  <button key={v} onClick={() => setCrmPeriod(v)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all
                      ${crmPeriod===v ? "bg-sage-300 text-white border-sage-300" : "bg-sand-200 text-charcoal-400 border-sand-300"}`}>
                    {l}
                  </button>
                ))}
              </div>
              <button onClick={() => {
                const rows = [["Ref","Client","Email","WhatsApp","Guide","Ville","Date visite","Date reservation","Personnes","Prix","Paiement","Statut"]];
                crmBookings.forEach(b => rows.push([
                  b.bookingRef, b.tourist?.name||"Guest", b.tourist?.email||"",
                  b.whatsapp||"", b.guide?.displayName||"", b.guide?.city||"",
                  new Date(b.date).toLocaleDateString("fr-FR"),
                  new Date(b.createdAt).toLocaleDateString("fr-FR"),
                  b.persons, b.totalPrice, b.paymentMethod||"cash", b.status
                ]));
                const csv = rows.map(r => r.join(";")).join("\n");
                const a = document.createElement("a");
                a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
                a.download = "laksor-reservations.csv";
                a.click();
              }} className="w-full flex items-center justify-center gap-2 bg-charcoal-800 text-white rounded-xl py-2.5 text-xs font-bold">
                Exporter CSV
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label:"Total", value: crmBookings.length },
                { label:"Confirmes", value: crmBookings.filter(b=>b.status==="CONFIRMED").length },
                { label:"Revenue", value: crmBookings.filter(b=>b.status==="CONFIRMED").reduce((s,b)=>s+Number(b.totalPrice),0)+" MAD" },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-xl border border-sand-300 p-3 text-center">
                  <div className="font-display text-lg font-bold text-charcoal-800">{s.value}</div>
                  <div className="text-[10px] text-charcoal-400">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Liste */}
            {crmLoading ? (
              <div className="text-center py-8 text-charcoal-400 text-sm">Chargement...</div>
            ) : crmBookings.length === 0 ? (
              <div className="bg-white rounded-2xl border border-sand-300 p-8 text-center text-charcoal-400 text-sm">Aucune reservation</div>
            ) : crmBookings.map(b => (
              <div key={b.id} className="bg-white rounded-2xl border border-sand-300 p-4 cursor-pointer hover:border-bronze-500 transition-colors"
                onClick={() => setCrmSelected(crmSelected?.id===b.id ? null : b)}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-display text-sm font-bold text-bronze-500">{b.bookingRef}</span>
                  <span className={statusBadge(b.status).cls}>{statusBadge(b.status).label}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-charcoal-800">{b.tourist?.name||"Guest"}</div>
                    <div className="text-xs text-charcoal-400">{b.tourist?.email}</div>
                    {b.whatsapp && <div className="text-xs text-sage-300 font-semibold">WA: {b.whatsapp}</div>}
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-charcoal-800">{Number(b.totalPrice)} MAD</div>
                    <div className="text-xs text-charcoal-400">Visite: {new Date(b.date).toLocaleDateString("fr-FR")}</div>
                    <div className="text-xs text-charcoal-300">Reserve le: {new Date(b.createdAt).toLocaleDateString("fr-FR")}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-sand-200">
                  <div className="w-6 h-6 rounded-full overflow-hidden bg-sand-300 flex-shrink-0">
                    {b.guide?.avatar
                      ? <img src={b.guide.avatar} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-charcoal-500">{b.guide?.displayName?.[0]}</div>
                    }
                  </div>
                  <span className="text-xs text-charcoal-400">{b.guide?.displayName} · {b.guide?.city}</span>
                  <span className="text-xs text-charcoal-400 ml-auto">{b.persons} pers.</span>
                </div>

                {crmSelected?.id===b.id && (
                  <div className="mt-3 pt-3 border-t border-sand-200 flex flex-col gap-2">
                    <div className="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest mb-1">Fiche complete</div>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        ["Reference", b.bookingRef],
                        ["Date visite", new Date(b.date).toLocaleDateString("fr-FR")],
                        ["Date reservation", new Date(b.createdAt).toLocaleDateString("fr-FR")],
                        ["Duree", b.duration==="FULL_DAY"?"Journee (8h)":"Demi-journee (4h)"],
                        ["Personnes", b.persons],
                        ["Prix total", Number(b.totalPrice)+" MAD"],
                        ["Paiement", b.paymentMethod||"cash"],
                        ["Statut", b.status],
                        ["Guide", b.guide?.displayName],
                        ["Ville", b.guide?.city],
                        ["Client", b.tourist?.name||"Guest"],
                        ["Email", b.tourist?.email],
                        ["WhatsApp", b.whatsapp||"Non fourni"],
                      ].map(([k,v]) => (
                        <div key={k} className="bg-sand-200 rounded-lg p-2">
                          <div className="text-[9px] text-charcoal-400 uppercase tracking-wide">{k}</div>
                          <div className="text-xs font-semibold text-charcoal-800 mt-0.5 truncate">{v}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-1 flex-wrap">
                      {b.guide?.phone && (
                        <a href={"https://wa.me/"+b.guide.phone.replace(/[^0-9]/g,"")+"?text=Ref: "+b.bookingRef}
                          className="flex items-center gap-1 bg-sage-300 text-white font-bold px-3 py-1.5 rounded-full text-xs no-underline">
                          WA Guide
                        </a>
                      )}
                      {b.whatsapp && (
                        <a href={"https://wa.me/"+b.whatsapp.replace(/[^0-9]/g,"")+"?text=Bonjour, ref reservation: "+b.bookingRef}
                          className="flex items-center gap-1 bg-bronze-500 text-white font-bold px-3 py-1.5 rounded-full text-xs no-underline">
                          WA Client
                        </a>
                      )}
                      {b.tourist?.email && (
                        <a href={"mailto:"+b.tourist.email+"?subject=Reservation "+b.bookingRef}
                          className="flex items-center gap-1 bg-charcoal-800 text-white font-bold px-3 py-1.5 rounded-full text-xs no-underline">
                          Email
                        </a>
                      )}
                    </div>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <div className="text-[10px] font-bold text-charcoal-400 uppercase w-full">Changer statut :</div>
                      {["CONFIRMED","CANCELLED","COMPLETED"].map(s => (
                        <button key={s} onClick={async (e) => {
                          e.stopPropagation();
                          await fetch("/api/guide/booking", { method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify({bookingId:b.id, status:s}) });
                          fetchCrm();
                        }} className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all
                          ${b.status===s ? "bg-bronze-500 text-white border-bronze-500" : "bg-sand-200 text-charcoal-500 border-sand-300 hover:border-bronze-500"}`}>
                          {s==="CONFIRMED"?"Confirmer":s==="CANCELLED"?"Annuler":"Completer"}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}



        {/* ══ TOURISTES ══ */}
        {active === "tourists" && (
          <div className="flex flex-col gap-3">

            {/* Search */}
            <div className="bg-white rounded-2xl border border-sand-300 p-4">
              <input value={touristSearch} onChange={e => setTouristSearch(e.target.value)}
                placeholder="Rechercher par nom ou email..."
                className={inputCls} />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label:"Total clients", value: tourists.length },
                { label:"Avec reservations", value: tourists.filter(t=>t.totalBookings>0).length },
                { label:"Revenue total", value: tourists.reduce((s,t)=>s+t.totalSpent,0)+" MAD" },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-xl border border-sand-300 p-3 text-center">
                  <div className="font-display text-lg font-bold text-charcoal-800">{s.value}</div>
                  <div className="text-[9px] text-charcoal-400">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Liste touristes */}
            {tourists.length === 0 ? (
              <div className="bg-white rounded-2xl border border-sand-300 p-8 text-center text-charcoal-400 text-sm">Aucun client</div>
            ) : tourists.map(t => (
              <div key={t.id} className="bg-white rounded-2xl border border-sand-300 p-4 cursor-pointer hover:border-bronze-500 transition-colors"
                onClick={() => setTouristSel(touristSel?.id === t.id ? null : t)}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-sand-300 flex-shrink-0">
                    {t.avatar
                      ? <img src={t.avatar} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center font-bold text-charcoal-500">{t.name?.[0] || "?"}</div>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-charcoal-800">{t.name || "Guest"}</div>
                    <div className="text-xs text-charcoal-400 truncate">{t.email}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-bold text-bronze-500">{t.totalSpent} MAD</div>
                    <div className="text-xs text-charcoal-400">{t.totalBookings} resa</div>
                  </div>
                </div>

                {touristSel?.id === t.id && (
                  <div className="mt-3 pt-3 border-t border-sand-200 flex flex-col gap-2">
                    <div className="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest mb-1">Historique reservations</div>
                    {t.bookings.length === 0 ? (
                      <div className="text-xs text-charcoal-400 text-center py-2">Aucune reservation</div>
                    ) : t.bookings.map((b: any) => (
                      <div key={b.id} className="bg-sand-200 rounded-xl p-2.5 flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-charcoal-800">{b.guide?.displayName} · {b.guide?.city}</div>
                          <div className="text-[10px] text-charcoal-400">{new Date(b.date).toLocaleDateString("fr-FR")} · {b.persons} pers.</div>
                          <div className="text-[10px] text-charcoal-400">Reserve le: {new Date(b.createdAt).toLocaleDateString("fr-FR")}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-bold text-charcoal-800">{Number(b.totalPrice)} MAD</div>
                          <span className={statusBadge(b.status).cls}>{statusBadge(b.status).label}</span>
                        </div>
                      </div>
                    ))}
                    <div className="flex gap-2 mt-1">
                      {t.email && (
                        <a href={"mailto:"+t.email}
                          className="flex-1 flex items-center justify-center gap-1 bg-charcoal-800 text-white font-bold py-2 rounded-xl text-xs no-underline">
                          Email
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ══ EMAIL ══ */}
        {active === "email" && (
          <div className="bg-white rounded-2xl border border-sand-300 p-4">
            <div className="text-sm font-bold text-charcoal-800 mb-4">Envoyer un email</div>
            {[
              { key:"to",      label:"Destinataire", ph:"email@exemple.com", type:"input"    },
              { key:"subject", label:"Sujet",        ph:"Sujet",             type:"input"    },
              { key:"message", label:"Message",      ph:"Votre message...",  type:"textarea" },
            ].map(f => (
              <div key={f.key} className="mb-4">
                <label className="text-xs font-bold text-charcoal-600 uppercase tracking-wider block mb-1.5">{f.label}</label>
                {f.type === "textarea"
                  ? <textarea value={(emailForm as any)[f.key]} onChange={e=>setEmailForm({...emailForm,[f.key]:e.target.value})}
                      placeholder={f.ph} rows={6} className={inputCls + " resize-none"} />
                  : <input value={(emailForm as any)[f.key]} onChange={e=>setEmailForm({...emailForm,[f.key]:e.target.value})}
                      placeholder={f.ph} className={inputCls} />
                }
              </div>
            ))}
            <button onClick={sendEmail} disabled={emailSending}
              className={`w-full py-3.5 rounded-2xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all
                ${emailSending ? "bg-sand-300 cursor-not-allowed" : emailSent ? "bg-sage-300" : "bg-bronze-500 hover:bg-bronze-600"}`}>
              <PaperPlaneTilt size={15} weight="bold" />
              {emailSending ? "Envoi..." : emailSent ? "✓ Envoyé !" : "Envoyer"}
            </button>
          </div>
        )}
      </div>

      {/* ── BOTTOM NAV ── */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/97 backdrop-blur-lg border-t border-sand-300 z-50 flex">
        {TABS.map(({ id, Icon, label }) => (
          <button key={id} onClick={() => setActive(id)}
            className={`flex flex-col items-center gap-1 flex-1 py-3 transition-colors border-t-2
              ${active === id ? "border-bronze-500 text-bronze-500" : "border-transparent text-charcoal-400"}`}>
            <Icon size={18} weight={active === id ? "fill" : "regular"} />
            <span className="text-[9px] font-bold">{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
