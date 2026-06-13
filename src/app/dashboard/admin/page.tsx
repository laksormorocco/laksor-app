"use client";
import { useState, useEffect } from "react";
import {
  ChartBar, Compass, CalendarCheck, UsersThree, UserCircle, PaperPlaneTilt,
  Check, X, Trash, WhatsappLogo, Plus, PencilSimple,
  ToggleLeft, ToggleRight, SignOut, Sparkle
} from "@phosphor-icons/react";

const PASSWORD = "laksor2024";

const TABS = [
  { id:"overview", Icon: ChartBar,       label:"Overview"  },
  { id:"guides",   Icon: Compass,        label:"Guides"    },
  { id:"bookings", Icon: CalendarCheck,  label:"Réserv."   },
  { id:"tourists", Icon: UserCircle,    label:"Clients"   },
  { id:"experiences", Icon: Sparkle, label:"Exp." },
  { id:"providers",   Icon: UsersThree, label:"Presta." },
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
  const [auth,     setAuth]     = useState(() => typeof window !== "undefined" && sessionStorage.getItem("laksor_admin") === "true");
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
  const [reminders,    setReminders]    = useState<any[]>([]);
  const [allExperiences, setAllExperiences] = useState<any[]>([]);
  const [openBookingId, setOpenBookingId] = useState<string|null>(null);
  const [newExpForm, setNewExpForm] = useState<any>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);
  const [editGuide,    setEditGuide]    = useState<any>(null);
  const [editGuideForm, setEditGuideForm] = useState<any>({});
  const [remLoading,   setRemLoading]   = useState(false);
  const [tourists,     setTourists]     = useState<any[]>([]);
  const [touristSearch,setTouristSearch]= useState("");
  const [touristSel,   setTouristSel]   = useState<any>(null);
  const [providers,    setProviders]    = useState<any[]>([]);

  useEffect(() => { if (auth) { fetchAll(); fetchTemplates(); } }, [auth]);
  useEffect(() => { if (auth && active === "guides") fetchGuides(); }, [guideTab, active, auth]);
  useEffect(() => { if (auth && active === "crm") fetchCrm(); }, [active, auth, crmSearch, crmStatus, crmPeriod, crmGuide]);
  useEffect(() => { if (auth && active === "experiences") fetchAllExperiences(); }, [active, auth]);
  useEffect(() => { if (auth && active === "tourists") fetchTourists(); }, [active, auth, touristSearch]);

  async function fetchAll() {
    const [sRes, bRes, pRes, eRes] = await Promise.all([fetch("/api/admin/stats"), fetch("/api/admin/bookings"), fetch("/api/admin/providers"), fetch("/api/admin/experiences")]);
    setStats(await sRes.json());
    setBookings((await bRes.json()).bookings || []);
    setProviders((await pRes.json()).providers || []);
    setAllExperiences((await eRes.json()).experiences || []);
    fetchGuides();
  }

  async function fetchGuides() {
    const res = await fetch("/api/admin/guides?status=" + guideTab.toUpperCase());
    setGuides((await res.json()).guides || []);
  }

  async function handleImport(file: File) {
    setImporting(true); setImportResult(null);
    try {
      const XLSX = await import("xlsx");
      const buffer = await file.arrayBuffer();
      const wb = XLSX.read(buffer, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows: any[] = XLSX.utils.sheet_to_json(ws, { header: 1 });
      if (rows.length < 2) { setImporting(false); return; }
      const headers = (rows[0] as string[]).map((h:string) => (h||"").toString().trim().toLowerCase());
      const guides = rows.slice(1).map((row: any[]) => {
        const obj:any = {};
        headers.forEach((h:string, i:number) => { obj[h] = (row[i]||"").toString().trim(); });
        return { nom:obj.nom||"", prenom:obj.prenom||obj["pr\u00e9nom"]||"", ville:obj.ville||"", langues:obj["langue de travail"]||obj.langues||"", email:obj.email||"" };
      }).filter((g:any) => g.nom||g.prenom);
      const res = await fetch("/api/admin/import",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({guides})});
      const data = await res.json();
      setImportResult(data);
    } catch(e:any) { setImportResult({created:0,errors:[{error:String(e)}]}); }
    setImporting(false); fetchGuides();
  }

  async function fetchAllExperiences() {
    const res = await fetch("/api/admin/experiences");
    if (res.ok) setAllExperiences((await res.json()).experiences || []);
  }

  async function fetchReminders() {
    setRemLoading(true);
    const res = await fetch("/api/cron/reminders?secret=laksor-cron-2026");
    if (res.ok) setReminders((await res.json()).results || []);
    setRemLoading(false);
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
    const formData = {...tourForm};
    if (formData.itinerary_raw) {
      formData.itinerary = formData.itinerary_raw.split("\n").filter((l:string)=>l.trim()).map((l:string)=>{
        const parts = l.split("|").map((p:string)=>p.trim());
        return { time: parts[0]||"", title: parts[1]||"", desc: parts[2]||"" };
      });
      delete formData.itinerary_raw;
    }
    const res = await fetch("/api/admin/tours", { method, headers:{"Content-Type":"application/json"}, body:JSON.stringify(formData) });
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
            <div className="flex justify-center mb-4">
              <img src="/logo7.png" alt="Laksor" style={{ height: 60, width: "auto", objectFit: "contain", maxWidth: 200 }} />
            </div>
        <h2 className="font-display text-lg font-semibold text-charcoal-800 mb-2">Accès Admin</h2>
            <p className="text-sm text-charcoal-400 mb-6">Back-office</p>
        <input type="password" value={pwd} onChange={e=>setPwd(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&setPwd(p=>{if(p===PASSWORD){setAuth(true);return p;}alert("Mot de passe incorrect");return p;})}
          placeholder="Mot de passe" className={inputCls + " mb-4"} />
        <button onClick={() => { if (pwd === PASSWORD) { setAuth(true); sessionStorage.setItem("laksor_admin", "true"); } else alert("Mot de passe incorrect"); }}
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
            <img src="/logo7.png" alt="Laksor" style={{ height: 36, width: "auto", objectFit: "contain", maxWidth: 130 }} />
        </div>
        <button onClick={() => setAuth(false)} className="flex items-center gap-1.5 text-xs font-bold text-red-400 bg-red-50 px-3 py-1.5 rounded-full border border-red-200">
          <SignOut size={13} /> Déconnexion
        </button>
      </div>

      <div className="px-4 pt-4 max-w-lg mx-auto">

        {/* ══ OVERVIEW ══ */}
        {active === "overview" && (
          <div className="flex flex-col gap-3">
            {/* STATS CARDS */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-2xl p-4" style={{boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{background:"rgba(184,138,68,0.1)"}}>
                  <Compass size={20} weight="duotone" className="text-bronze-500" />
                </div>
                <div className="font-display text-2xl font-bold" style={{color:"#B88A44"}}>{stats?.approvedGuides||0}</div>
                <div className="text-[11px] text-charcoal-400 mt-0.5">Guides approuvés</div>
              </div>
              <div className="bg-white rounded-2xl p-4" style={{boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{background:"rgba(125,143,105,0.1)"}}>
                  <CalendarCheck size={20} weight="duotone" className="text-sage-300" />
                </div>
                <div className="font-display text-2xl font-bold" style={{color:"#7D8F69"}}>{stats?.totalBookings||0}</div>
                <div className="text-[11px] text-charcoal-400 mt-0.5">Réservations</div>
              </div>
              <div className="bg-white rounded-2xl p-4" style={{boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{background:"rgba(184,138,68,0.1)"}}>
                  <ChartBar size={20} weight="duotone" className="text-bronze-500" />
                </div>
                <div className="font-display text-2xl font-bold text-charcoal-800">{Math.round((stats?.totalRevenue||0)*0.25)} MAD</div>
                <div className="text-[11px] text-charcoal-400 mt-0.5">Commission totale</div>
              </div>
              <div className="bg-white rounded-2xl p-4" style={{boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{background:"rgba(239,68,68,0.08)"}}>
                  <UsersThree size={20} weight="duotone" className="text-red-400" />
                </div>
                <div className="font-display text-2xl font-bold text-red-400">{stats?.pendingGuides||0}</div>
                <div className="text-[11px] text-charcoal-400 mt-0.5">En attente validation</div>
              </div>
            </div>

            {/* ACTIVITE RECENTE */}
            <div className="bg-white rounded-2xl p-4" style={{boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
              <div className="font-display text-sm font-semibold text-charcoal-800 mb-3">Activité récente</div>
              {bookings.slice(0,5).map((b:any) => (
                <div key={b.id} className="flex items-center gap-3 py-2.5 border-b border-sand-100 last:border-0">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{background:b.paymentMethod==="cash"?"rgba(125,143,105,0.1)":"rgba(184,138,68,0.1)"}}>
                    <CalendarCheck size={14} weight="duotone" className={b.paymentMethod==="cash"?"text-sage-300":"text-bronze-500"} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-charcoal-800 truncate">{b.tourist?.name || b.guestName || "Client"}</div>
                    <div className="text-[10px] text-charcoal-400">{b.ref || b.id?.slice(0,8)} · {b.notes?.match(/EXP:([a-z0-9]+)/i) ? "Expérience" : b.guide?.displayName || "Guide"} · {b.paymentMethod}</div>
                  </div>
                  <div className="font-display text-sm font-bold flex-shrink-0" style={{color:"#B88A44"}}>{b.totalPrice} MAD</div>
                </div>
              ))}
              {bookings.length === 0 && <div className="text-xs text-charcoal-400">Aucune réservation</div>}
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



          {/* RAPPELS 72H */}
          <div className="bg-white rounded-2xl border border-sand-300 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-bold text-charcoal-800">Rappels 72h</div>
              <button onClick={fetchReminders}
                className="bg-bronze-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                {remLoading ? "..." : "Verifier"}
              </button>
            </div>
            {reminders.length === 0 ? (
              <div className="text-xs text-charcoal-400">Cliquez Verifier pour voir les rappels a envoyer</div>
            ) : reminders.map((r, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-sand-200 last:border-0">
                <div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mr-2 ${r.type === "guide" ? "bg-sage-300/15 text-sage-300" : "bg-bronze-500/15 text-bronze-500"}`}>
                    {r.type === "guide" ? "Guide" : "Client"}
                  </span>
                  <span className="text-xs text-charcoal-800 font-semibold">{r.ref}</span>
                  <div className="text-[10px] text-charcoal-400 mt-0.5">{r.date}</div>
                </div>
                <a href={"https://wa.me/" + r.phone.replace(/[^0-9]/g, "") + "?text=" + encodeURIComponent("Rappel Laksor - Ref: " + r.ref + " - Visite le " + r.date)}
                  target="_blank"
                  className="bg-sage-300 text-white text-[10px] font-bold px-3 py-1.5 rounded-full no-underline">
                  Envoyer WA
                </a>
              </div>
            ))}
          </div>

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
                    {g.avatar ? <img src={g.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs font-bold text-charcoal-500">{g?.displayName?.[0]}</div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-charcoal-800 truncate">{g?.displayName}</div>
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
                        <div className="text-sm font-bold text-charcoal-800">{g?.displayName}</div>
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
      <div className="flex items-center gap-2">
        <input value={search} onChange={e=>setSearch(e.target.value)}
          placeholder="Rechercher un guide..." className={inputCls + " flex-1"} />
        <label className={"flex-shrink-0 text-xs font-bold px-3 py-3 rounded-xl cursor-pointer " + (importing ? "bg-sand-200 text-charcoal-400" : "bg-bronze-500 text-white")}>
          {importing ? "..." : "+ CSV"}
          <input type="file" accept=".csv,.txt,.xlsx,.xls" className="hidden" disabled={importing}
            onChange={e => { const f=e.target.files?.[0]; if(f) handleImport(f); }} />
        </label>
      </div>
      {importResult && (
        <div className={"text-xs rounded-xl px-3 py-2 mt-1 " + (importResult.errors?.length ? "bg-amber-50 text-amber-600" : "bg-sage-300/10 text-sage-300")}>
          ✅ {importResult.created} guides importés {importResult.errors?.length > 0 && "· ⚠️ " + importResult.errors.length + " erreurs"}
        </div>
      )}
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
                      <div className="text-sm font-bold text-charcoal-800">{g?.displayName}</div>
                      <div className="text-xs text-charcoal-400">📍 {g.city} · {g.halfDayPrice}/{g.fullDayPrice} MAD</div>
                      {g.user?.email && <div className="text-xs text-bronze-500 truncate">{g.user.email}</div>}
                    </div>
                    <span className={badge.cls}>{badge.label}</span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
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
                      <>
                        <button onClick={() => updateGuide(g.id,"SUSPENDED")}
                          className="bg-bronze-50 text-bronze-500 rounded-full px-3 py-1.5 text-xs font-bold border border-bronze-500">
                          Suspendre
                        </button>
                        <button onClick={() => { setEditGuide(g); setEditGuideForm({ displayName: g.displayName, city: g.city, bio: g.bio||"", languages: (g.languages||[]).join(", "), halfDayPrice: g.halfDayPrice, fullDayPrice: g.fullDayPrice, yearsExp: g.yearsExp||0, phone: g.phone||"", avatar: g.avatar||"", email: g.user?.email||"", userId: g.user?.id||"" }); }}
                          className="px-3 py-1.5 rounded-full text-xs font-bold bg-charcoal-800 text-white">
                          Modifier
                        </button>
                        <a href={"/guide/"+g.id} target="_blank"
                          className="px-3 py-1.5 rounded-full text-xs font-bold bg-sand-200 text-charcoal-600 border border-sand-300 no-underline">
                          Voir profil
                        </a>
                      </>
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
              const isOpen = openBookingId === b.id;
              return (
                <div key={i} className="bg-white rounded-2xl border border-sand-300 overflow-hidden">
                  {/* EN-TETE */}
                  <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => setOpenBookingId(isOpen ? null : b.id)}>
                    <div>
                      <div className="text-sm font-bold text-charcoal-800">{b.guide?.displayName}</div>
                      <div className="text-xs text-charcoal-400">{new Date(b.date).toLocaleDateString("fr-FR")} · {b.persons} pers.</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={badge.cls}>{badge.label}</span>
                      <span className="text-charcoal-400 text-xs">{isOpen ? "▲" : "▼"}</span>
                    </div>
                  </div>

                  {/* ACCORDEON */}
                  {isOpen && (
                    <div className="px-4 pb-4 border-t border-sand-200 flex flex-col gap-3 pt-3">
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          ["Date", new Date(b.date).toLocaleDateString("fr-FR")],
        ...(b.notes?.match(/EXP:([a-z0-9]+)/i) ? [["Expérience", allExperiences.find((e:any) => e.id === b.notes.match(/EXP:([a-z0-9]+)/i)?.[1])?.title || "Expérience Laksor"]] : [["Guide", b.guide?.displayName || "Guide Laksor"], ["Type", b.notes?.match(/TYPE:([A-Z_]+)/)?.[1] || "Visite guidée"]]),
                          ["Durée", b.duration==="HALF_DAY"?"4h":"8h"],
                          ["Pers.", String(b.persons||1)],
                          ["Paiement", b.paymentMethod||"cash"],
                          ["Commission", (b.commission||0)+" MAD"],
                          ["REF", b.notes?.match(/REF:([A-Z0-9-]+)/)?.[1]||"—"],
                        ].map(([k,v]) => (
                          <div key={k} className="bg-sand-200 rounded-lg p-2 text-center">
                            <div className="text-[9px] text-charcoal-400 uppercase">{k}</div>
                            <div className="text-xs font-bold text-charcoal-800 mt-0.5">{v}</div>
                          </div>
                        ))}
                      </div>

                      {/* Touriste */}
                      <div className="bg-sand-200 rounded-xl p-3">
                        <div className="text-[10px] text-charcoal-400 mb-1 font-bold uppercase">Touriste</div>
                        <div className="text-sm font-bold text-charcoal-800">{b.tourist?.name||b.guestName||"—"}</div>
                        <div className="text-xs text-charcoal-400">{b.tourist?.email||"—"}</div>
                      </div>

                      {/* Tour/Expérience */}
                      {b.slots?.[0]?.template?.title && (
                        <div className="bg-sand-200 rounded-xl p-3">
                          <div className="text-[10px] text-charcoal-400 mb-1 font-bold uppercase">Tour</div>
                          <div className="text-sm font-bold text-charcoal-800">{b.slots[0].template.title}</div>
                        </div>
                      )}

                      {/* Prix */}
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
                        </div>
                      </div>

                      {/* Actions statut */}
                      <div className="flex gap-2">
                        {b.status === "PENDING" && (
                          <button onClick={async () => {
                            await fetch("/api/admin/bookings", { method: "PATCH", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ id: b.id, status: "CONFIRMED" }) });
                            setBookings((prev:any[]) => prev.map((x:any) => x.id === b.id ? {...x, status: "CONFIRMED"} : x));
                          }} className="flex-1 bg-sage-300 text-white text-xs font-bold py-2.5 rounded-full">
                            ✓ Confirmer
                          </button>
                        )}
                        {(b.status === "PENDING" || b.status === "CONFIRMED") && (
                          <button onClick={async () => {
                            await fetch("/api/admin/bookings", { method: "PATCH", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ id: b.id, status: "CANCELLED" }) });
                            setBookings((prev:any[]) => prev.map((x:any) => x.id === b.id ? {...x, status: "CANCELLED"} : x));
                          }} className="flex-1 bg-red-50 text-red-400 border border-red-200 text-xs font-bold py-2.5 rounded-full">
                            ✕ Annuler
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ══ TOURS ══ */}
        
        {active === "experiences" && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-bold text-charcoal-800">Experiences guides ({allExperiences.length})</div>
            <div className="flex gap-2">
              <button onClick={fetchAllExperiences} className="text-xs text-bronze-500 font-bold">Actualiser</button>
              <button onClick={() => window.location.href="/dashboard/admin/create-experience"} className="bg-bronze-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">+ Creer</button>
            </div>
            </div>
            {allExperiences.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-sand-300">
                <div className="text-3xl mb-2">🧭</div>
                <div className="text-sm text-charcoal-400">Aucune experience soumise</div>
              </div>
            ) : allExperiences.map((exp: any) => (
              <div key={exp.id} className="bg-white rounded-2xl border border-sand-300 p-4">
                <div className="flex items-start gap-3 mb-3">
                  {exp.photos?.[0] ? (
                    <img src={exp.photos[0]} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-sand-200 flex items-center justify-center text-2xl flex-shrink-0">🧭</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-charcoal-800">{exp.title}</div>
                    <div className="text-xs text-charcoal-400">{exp.guide?.displayName} · {exp.guide?.city}</div>
                    <div className="text-xs text-charcoal-400">{exp.duration} · {exp.groupSize} · {exp.price} MAD</div>
                    <span className={"text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block " + (exp.status === "APPROVED" ? "bg-sage-300/15 text-sage-300" : exp.status === "PENDING" ? "bg-bronze-500/15 text-bronze-500" : "bg-red-100 text-red-400")}>
                      {exp.status === "APPROVED" ? "Approuvee" : exp.status === "PENDING" ? "En attente" : "Refusee"}
                    </span>
                  </div>
                </div>
                {exp.description && <p className="text-xs text-charcoal-400 mb-3 line-clamp-2">{exp.description}</p>}
                <div className="flex items-center gap-2 flex-wrap">
                  <button onClick={() => window.location.href="/dashboard/admin/edit-experience?id=" + exp.id}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-bronze-500 text-bronze-500 text-xs font-semibold">
                    <PencilSimple size={14} /> Modifier
                  </button>
                  {exp.status !== "APPROVED" && (
                    <button onClick={async () => {
                      await fetch("/api/admin/experiences", { method: "PATCH", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ id: exp.id, status: "APPROVED" }) });
                      fetchAllExperiences();
                    }} className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-bronze-500 text-white text-xs font-semibold">
                      <Check size={14} /> Approuver
                    </button>
                  )}
                  {exp.status !== "REFUSED" && (
                    <button onClick={async () => {
                      await fetch("/api/admin/experiences", { method: "PATCH", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ id: exp.id, status: "REFUSED" }) });
                      fetchAllExperiences();
                    }} className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-red-50 text-red-400 border border-red-200 text-xs font-semibold">
                      <X size={14} /> Refuser
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

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
                        itinerary_raw: (existing.itinerary||[]).map((s:any)=>s.time+" | "+s.title+" | "+(s.desc||"")).join("\n"),
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
                <div className="flex items-center gap-4 mb-4">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-sand-200 flex-shrink-0">
                {editGuideForm.avatar
                  ? <img src={editGuideForm.avatar} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center font-bold text-charcoal-400">{editGuide?.displayName?.[0]}</div>}
                <label className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer">
                  <span className="text-white text-lg">+</span>
                  <input type="file" accept="image/*" className="hidden" onChange={async e => {
                    const file = e.target.files?.[0];
                    const fd = new FormData();
                    if (!file) return;
                    fd.append("file", file as Blob);
                    fd.append("folder", "avatars");
                    const res = await fetch("/api/upload", { method: "POST", body: fd });
                    const { url } = await res.json();
                    if (url) setEditGuideForm({...editGuideForm, avatar: url});
                  }} />
                </label>
              </div>
              <div className="flex-1 font-display text-base font-bold text-charcoal-800">{editGuide?.displayName}</div>
            </div>
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
  { key:"itinerary_raw", label:"Itineraire (une etape par ligne: HH:MM | Titre | Description)", type:"textarea", ph:"09:00 | Depart medina | Rendez-vous place Jemaa el-Fna\n10:00 | Souks | Visite des souks authentiques" },
    ].map(f => (
      <div key={f.key} className="mb-3">
        <label className="text-[10px] font-bold text-charcoal-400 uppercase tracking-wider block mb-1">{f.label}</label>
        {f.type === "image" ? (
          <div>
            {tourForm[f.key] && <img src={tourForm[f.key]} className="w-full h-32 object-cover rounded-xl mb-2" />}
            <label className="flex items-center gap-2 cursor-pointer bg-sand-200 rounded-xl px-4 py-2 text-xs font-bold text-charcoal-600 w-full">
              📷 Uploader une image
              <input type="file" accept="image/*" className="hidden" onChange={async e => {
                const file = e.target.files?.[0];
                if (!file) return;
                const fd = new FormData();
                fd.append("file", file as Blob);
                fd.append("folder", "tours");
                const res = await fetch("/api/upload", { method: "POST", body: fd });
                const { url } = await res.json();
                if (url) setTourForm({...tourForm, [f.key]: url});
              }} />
            </label>
          </div>
        ) : f.type === "toggle" ? (
          <button onClick={() => setTourForm({...tourForm, [f.key]: !tourForm[f.key]})}
            className={"w-12 h-6 rounded-full relative transition-colors " + (tourForm[f.key] ? "bg-sage-300" : "bg-sand-300")}>
            <div className={"w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm " + (tourForm[f.key] ? "left-6" : "left-0.5")} />
          </button>
        ) : f.type === "textarea" ? (
          <textarea value={tourForm[f.key] || ""} onChange={e=>setTourForm({...tourForm, [f.key]:e.target.value})}
            placeholder={f.ph} rows={3} className={inputCls + " resize-none"} />
        ) : (
          <input value={tourForm[f.key] || ""} onChange={e=>setTourForm({...tourForm, [f.key]:e.target.value})}
            placeholder={f.ph} className={inputCls} />
        )}
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
                      <a href={"/api/invoice/token?bookingId="+b.id}
                        onClick={async (e) => {
                          e.preventDefault();
                          const res = await fetch("/api/invoice/token?bookingId="+b.id);
                          const data = await res.json();
                          window.open(data.url, "_blank");
                        }}
                        className="flex items-center gap-1 bg-bronze-500 text-white font-bold px-3 py-1.5 rounded-full text-xs no-underline cursor-pointer">
                        Facture
                      </a>
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
  
      {active === "providers" && (
        <div className="flex flex-col gap-3">
          <div className="font-display text-lg font-semibold text-charcoal-800 mb-2">Prestataires ({providers.length})</div>
          {providers.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-sand-200">
              <div className="text-sm text-charcoal-400">Aucun prestataire inscrit</div>
            </div>
          ) : providers.map((p: any) => (
            <div key={p.id} className="bg-white rounded-2xl p-4 border border-sand-200">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-display text-sm font-bold text-charcoal-800">{p.displayName}</div>
                  <div className="text-xs text-charcoal-400 mt-0.5">{p.email} · {p.phone}</div>
                  <div className="text-xs text-charcoal-400">{p.city}</div>
                </div>
                <span className={statusBadge(p.status).cls}>{statusBadge(p.status).label}</span>
              </div>
              <div className="text-xs text-charcoal-500 mb-3">{p.experiences?.length || 0} expérience(s) soumise(s)</div>
              {p.status === "PENDING" && (
                <div className="flex gap-2">
                  <button onClick={async () => {
                    await fetch("/api/admin/providers", {method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify({id:p.id, status:"APPROVED"})});
                    setProviders((prev:any[]) => prev.map((x:any) => x.id===p.id ? {...x, status:"APPROVED"} : x));
                  }} className="flex-1 py-2 rounded-full text-xs font-bold text-white" style={{background:"#7D8F69"}}>
                    ✓ Approuver
                  </button>
                  <button onClick={async () => {
                    await fetch("/api/admin/providers", {method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify({id:p.id, status:"REJECTED"})});
                    setProviders((prev:any[]) => prev.map((x:any) => x.id===p.id ? {...x, status:"REJECTED"} : x));
                  }} className="flex-1 py-2 rounded-full text-xs font-bold text-white" style={{background:"#ef4444"}}>
                    ✗ Refuser
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
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
      {/* MODAL EDIT GUIDE */}
      {editGuide && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm" onClick={() => setEditGuide(null)}>
          <div className="bg-white rounded-t-3xl w-full max-w-lg p-5 max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-4 mb-4">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-sand-200 flex-shrink-0">
                {editGuideForm.avatar
                  ? <img src={editGuideForm.avatar} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center font-bold text-charcoal-400">{editGuide?.displayName?.[0]}</div>}
                <label className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer">
                  <span className="text-white text-lg">+</span>
                  <input type="file" accept="image/*" className="hidden" onChange={async e => {
                    const file = e.target.files?.[0];
                    const fd = new FormData();
                    if (!file) return;
                    fd.append("file", file as Blob);
                    fd.append("folder", "avatars");
                    const res = await fetch("/api/upload", { method: "POST", body: fd });
                    const { url } = await res.json();
                    if (url) setEditGuideForm({...editGuideForm, avatar: url});
                  }} />
                </label>
              </div>
              <div className="flex-1 font-display text-base font-bold text-charcoal-800">{editGuide?.displayName}</div>
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="font-display text-base font-bold text-charcoal-800">Modifier — {editGuide?.displayName || "Guide"}</div>
              <button onClick={() => setEditGuide(null)} className="w-8 h-8 rounded-full bg-sand-200 flex items-center justify-center text-charcoal-600">✕</button>
            </div>
            <div className="flex flex-col gap-3">
              {[
                { key:"displayName", label:"Nom affiché" },
              { key:"email", label:"Email (vrai email du guide)" },
                { key:"city", label:"Ville" },
                { key:"phone", label:"WhatsApp (avec indicatif)" },
                { key:"halfDayPrice", label:"Prix demi-journée (MAD guide)" },
                { key:"fullDayPrice", label:"Prix journée complète (MAD guide)" },
                { key:"yearsExp", label:"Années d expérience" },
                { key:"languages", label:"Langues (séparées par virgule)" },
              ].map(f => (
                <div key={f.key}>
                  <div className="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest mb-1">{f.label}</div>
                  <input value={editGuideForm[f.key] || ""} onChange={e => setEditGuideForm({...editGuideForm, [f.key]: e.target.value})}
                    className="w-full border border-sand-300 rounded-xl px-3 py-2.5 text-sm text-charcoal-800 outline-none focus:border-bronze-500" />
                </div>
              ))}
              <div>
                <div className="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest mb-1">Bio</div>
                <textarea value={editGuideForm.bio || ""} onChange={e => setEditGuideForm({...editGuideForm, bio: e.target.value})}
                  rows={3} className="w-full border border-sand-300 rounded-xl px-3 py-2.5 text-sm text-charcoal-800 outline-none focus:border-bronze-500 resize-none" />
              </div>
              <button onClick={async () => {
                const langs = editGuideForm.languages.split(",").map((l:string)=>l.trim()).filter(Boolean);
                await fetch("/api/admin/guides", {
                  method: "PATCH",
                  headers: {"Content-Type":"application/json"},
                  body: JSON.stringify({ id: editGuide.id, ...editGuideForm, languages: langs, avatar: editGuideForm.avatar || editGuide.avatar })
                });
                fetchGuides();
                setEditGuide(null);
              }} className="w-full bg-bronze-500 text-white font-bold py-3.5 rounded-full text-sm">
                Sauvegarder
              </button>
              {/* DOCUMENTS */}
              {(editGuide?.guideCardUrl || editGuide?.nationalIdUrl) && (
                <div className="bg-sand-100 rounded-2xl p-3 border border-sand-300">
                  <div className="text-xs font-bold text-charcoal-800 mb-3">Documents soumis</div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key:"guideCardUrl", label:"Carte guide (recto)" },
                      { key:"guideCardBack", label:"Carte guide (verso)" },
                      { key:"nationalIdUrl", label:"CIN (recto)" },
                      { key:"nationalIdBack", label:"CIN (verso)" },
                    ].map(doc => editGuide[doc.key] && (
                      <div key={doc.key}>
                        <div className="text-[10px] text-charcoal-400 mb-1">{doc.label}</div>
                        <a href={editGuide[doc.key]} target="_blank" className="no-underline">
                          <img src={editGuide[doc.key]} className="w-full h-20 object-cover rounded-xl border border-sand-300" />
                        </a>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button onClick={async () => {
                      await fetch("/api/admin/guides", { method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ id: editGuide.id, docsStatus: "APPROVED" }) });
                      fetchGuides(); setEditGuide(null);
                    }} className="flex-1 bg-sage-300 text-white text-xs font-bold py-2.5 rounded-full">
                      ✅ Valider documents
                    </button>
                    <button onClick={async () => {
                      await fetch("/api/admin/guides", { method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ id: editGuide.id, docsStatus: "REFUSED" }) });
                      fetchGuides(); setEditGuide(null);
                    }} className="flex-1 bg-red-50 text-red-400 border border-red-200 text-xs font-bold py-2.5 rounded-full">
                      ❌ Refuser
                    </button>
                  </div>
                  <div className={"text-[10px] text-center mt-2 font-bold " + (editGuide.docsStatus === "APPROVED" ? "text-sage-300" : editGuide.docsStatus === "REFUSED" ? "text-red-400" : "text-bronze-500")}>
                    Statut : {editGuide.docsStatus === "APPROVED" ? "Documents validés" : editGuide.docsStatus === "REFUSED" ? "Documents refusés" : "En attente"}
                  </div>
                </div>
              )}

              {editGuideForm.email && (
                <button onClick={async () => {
                  const res = await fetch("/api/admin/invite", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ email: editGuideForm.email, name: editGuideForm.displayName }) });
                  const d = await res.json();
                  alert(d.success ? "Invitation envoyee a " + editGuideForm.email : "Erreur: " + d.error);
                }} className="w-full border-2 border-sage-300 text-sage-300 font-bold py-3 rounded-full text-sm mt-2">
                  Envoyer invitation
                </button>
              )}
            </div>
          </div>

      {/* MODAL CREATION EXPERIENCE LAKSOR */}
      {newExpForm && (
        <div className="fixed inset-x-0 top-0 bottom-0 z-50 bg-white flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-sand-200">
            <button onClick={() => setNewExpForm(null)} className="w-9 h-9 rounded-full border border-sand-200 flex items-center justify-center">
              <X size={16} className="text-charcoal-600" />
            </button>
            <span className="font-display text-sm font-bold text-charcoal-800">Nouvelle experience Laksor</span>
            <div className="w-9" />
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-4">
            {([
              { key:"title", label:"Titre *", ph:"Agafay Desert + Quad..." },
              { key:"description", label:"Description", ph:"Description...", area:true },
              { key:"price", label:"Prix / personne (MAD)", ph:"300" },
              { key:"city", label:"Ville", ph:"Marrakech" },
              { key:"meetingPoint", label:"Point de RDV", ph:"Place Jemaa el-Fna..." },
              { key:"duration", label:"Duree", ph:"4h" },
              { key:"groupSize", label:"Groupe", ph:"1-8 pers." },
              { key:"providerContact", label:"Contact prestataire", ph:"+212600000000" },
              { key:"tags", label:"Tags (virgule)", ph:"Desert, Aventure" },
              { key:"included", label:"Inclus (virgule)", ph:"Transport, Guide" },
              { key:"notIncluded", label:"Non inclus (virgule)", ph:"Repas" },
            ] as any[]).map((f: any) => (
              <div key={f.key}>
                <div className="text-xs font-bold text-charcoal-400 mb-1">{f.label}</div>
                {f.area ? (
                  <textarea value={newExpForm[f.key] || ""} onChange={e => setNewExpForm({...newExpForm, [f.key]: e.target.value})}
                    placeholder={f.ph} rows={3} className={inputCls + " resize-none"} />
                ) : (
                  <input value={newExpForm[f.key] || ""} onChange={e => setNewExpForm({...newExpForm, [f.key]: e.target.value})}
                    placeholder={f.ph} className={inputCls} />
                )}
              </div>
            ))}
            <button onClick={async () => {
              const data = {
                guideId: "admin",
                title: newExpForm.title,
                description: newExpForm.description || "",
                price: Number(newExpForm.price) || 0,
                city: newExpForm.city || "",
                meetingPoint: newExpForm.meetingPoint || "",
                duration: newExpForm.duration || "4h",
                groupSize: newExpForm.groupSize || "1-8 pers.",
                difficulty: "Facile",
                providerContact: newExpForm.providerContact || "",
                tags: newExpForm.tags ? newExpForm.tags.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
                included: newExpForm.included ? newExpForm.included.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
                notIncluded: newExpForm.notIncluded ? newExpForm.notIncluded.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
                photos: newExpForm.photos || [],
                transportRequired: false,
                isLaksorExp: true,
                pricePerPerson: true,
                status: "APPROVED",
                isActive: true,
              };
              const res = await fetch("/api/guide/experiences", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(data) });
              if (res.ok) { fetchAllExperiences(); setNewExpForm(null); }
            }} className="w-full text-white font-bold py-4 rounded-full text-sm"
              style={{background:"linear-gradient(135deg, #B88A44, #9A7238)"}}>
              Publier l experience
            </button>
          </div>
        </div>
      )}

        </div>
      )}
    </div>
  );
}
