"use client";
import { useState, useEffect } from "react";
const B="#123EAB",Y="#F4C542",G="#22c55e",R="#ef4444",S="#F8F5F0";

const MENUS = [
  { id:"overview", icon:"📊", label:"Vue generale" },
  { id:"guides", icon:"🧭", label:"Guides" },
  { id:"bookings", icon:"📋", label:"Reservations" },
  { id:"commissions", icon:"💰", label:"Commissions" },
];

const PASSWORD = "laksor2024";

export default function AdminDashboard() {
  const [auth, setAuth] = useState(false);
  const [pwd, setPwd] = useState("");
  const [active, setActive] = useState("overview");
  const [sidebar, setSidebar] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [guides, setGuides] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [tab, setTab] = useState("pending");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (auth) { fetchStats(); fetchGuides(); fetchBookings(); }
  }, [auth, tab]);

  async function fetchStats() {
    const res = await fetch("/api/admin/stats");
    const data = await res.json();
    setStats(data);
  }

  async function fetchGuides() {
    setLoading(true);
    const res = await fetch("/api/admin/guides?status=" + tab.toUpperCase());
    const data = await res.json();
    setGuides(data.guides || []);
    setLoading(false);
  }

  async function fetchBookings() {
    const res = await fetch("/api/admin/bookings");
    const data = await res.json();
    setBookings(data.bookings || []);
  }

  async function updateGuide(id: string, status: string) {
    await fetch("/api/admin/guides", {
      method: "PATCH",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ id, status })
    });
    fetchGuides();
    fetchStats();
  }

  async function deleteGuide(id: string) {
    if (!confirm("Supprimer ce guide ?")) return;
    await fetch("/api/admin/guides/" + id, { method: "DELETE" });
    fetchGuides();
    fetchStats();
  }

  const filtered = guides.filter(g =>
    g.displayName?.toLowerCase().includes(search.toLowerCase()) ||
    g.city?.toLowerCase().includes(search.toLowerCase())
  );

  if (!auth) return (
    <div style={{minHeight:"100vh",background:S,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Georgia,serif"}}>
      <div style={{background:"#fff",borderRadius:24,padding:40,maxWidth:360,width:"100%",textAlign:"center",boxShadow:"0 4px 40px rgba(0,0,0,0.08)"}}>
        <div style={{width:56,height:56,borderRadius:16,background:B,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",color:"#fff",fontSize:24,fontWeight:900}}>🔐</div>
        <h1 style={{fontSize:22,fontWeight:900,color:B,marginBottom:8}}>Dashboard Admin</h1>
        <p style={{color:"#666",fontSize:14,marginBottom:24}}>Entrez le mot de passe</p>
        <input type="password" value={pwd} onChange={e=>setPwd(e.target.value)} onKeyDown={e=>e.key==="Enter"&&pwd===PASSWORD&&setAuth(true)} placeholder="Mot de passe" style={{width:"100%",border:"2px solid #e8e0d6",borderRadius:12,padding:"12px 16px",fontSize:15,boxSizing:"border-box",marginBottom:12}}/>
        <button onClick={()=>pwd===PASSWORD?setAuth(true):alert("Mot de passe incorrect")} style={{width:"100%",background:B,color:"#fff",border:"none",borderRadius:12,padding:"14px 0",fontSize:15,fontWeight:700,cursor:"pointer"}}>
          Connexion
        </button>
      </div>
    </div>
  );

  return (
    <div style={{display:"flex",minHeight:"100vh",background:S,fontFamily:"Georgia,serif"}}>
      <div style={{position:"fixed",top:0,left:0,right:0,background:B,padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",zIndex:100}}>
        <button onClick={()=>setSidebar(!sidebar)} style={{color:"#fff",fontSize:22,background:"none",border:"none",cursor:"pointer"}}>☰</button>
        <span style={{color:"#fff",fontWeight:700}}>Laksor Admin</span>
        <a href="/" style={{color:"rgba(255,255,255,0.7)",fontSize:12,textDecoration:"none"}}>Voir site</a>
      </div>

      {sidebar && (
        <div style={{position:"fixed",inset:0,zIndex:200,display:"flex"}}>
          <div style={{width:260,background:B,display:"flex",flexDirection:"column",padding:"72px 0 20px"}}>
            {MENUS.map(m=>(
              <button key={m.id} onClick={()=>{setActive(m.id);setSidebar(false);}} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 20px",background:active===m.id?"rgba(255,255,255,0.15)":"transparent",borderLeft:`3px solid ${active===m.id?Y:"transparent"}`,color:"#fff",fontSize:13,fontWeight:active===m.id?700:500,border:"none",cursor:"pointer",textAlign:"left",width:"100%"}}>
                <span>{m.icon}</span>{m.label}
              </button>
            ))}
            <button onClick={()=>setAuth(false)} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 20px",color:"rgba(255,255,255,0.6)",fontSize:13,border:"none",background:"none",cursor:"pointer",textAlign:"left",marginTop:"auto"}}>
              🚪 Deconnexion
            </button>
          </div>
          <div style={{flex:1,background:"rgba(0,0,0,0.5)"}} onClick={()=>setSidebar(false)}/>
        </div>
      )}

      <div style={{flex:1,padding:"72px 16px 32px",overflow:"auto"}}>

        {active === "overview" && stats && (
          <div>
            <h1 style={{fontSize:22,fontWeight:800,marginBottom:4}}>Vue generale 👋</h1>
            <p style={{color:"#777",fontSize:13,marginBottom:24}}>Tableau de bord Laksor</p>

            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:16,marginBottom:28}}>
              {[
                {icon:"🧭",label:"Guides total",val:stats.totalGuides,bg:"#eef2ff",color:B},
                {icon:"⏳",label:"En attente",val:stats.pendingGuides,bg:"#fef3c7",color:"#d97706"},
                {icon:"✅",label:"Approuves",val:stats.approvedGuides,bg:"#dcfce7",color:G},
                {icon:"📋",label:"Reservations",val:stats.totalBookings,bg:"#f0fdf4",color:G},
                {icon:"💰",label:"Revenus",val:stats.totalRevenue+" MAD",bg:"#eef2ff",color:B},
                {icon:"🏦",label:"Commissions",val:stats.totalCommission+" MAD",bg:"#fdf4ff",color:"#9333ea"},
              ].map(s=>(
                <div key={s.label} style={{background:"#fff",borderRadius:20,padding:20,boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
                  <div style={{width:44,height:44,borderRadius:12,background:s.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,marginBottom:14}}>{s.icon}</div>
                  <div style={{fontSize:18,fontWeight:800,color:s.color,marginBottom:4}}>{s.val}</div>
                  <div style={{fontSize:12,color:"#888"}}>{s.label}</div>
                </div>
              ))}
            </div>

            {stats.recentGuides?.length > 0 && (
              <div style={{background:"#fff",borderRadius:20,padding:24,marginBottom:20,boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
                <h2 style={{fontSize:16,fontWeight:800,color:B,marginBottom:16}}>⏳ Guides en attente de validation</h2>
                {stats.recentGuides.map((g:any)=>(
                  <div key={g.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 0",borderBottom:"1px solid #f0ebe4",flexWrap:"wrap",gap:8}}>
                    <div>
                      <div style={{fontWeight:700}}>{g.displayName}</div>
                      <div style={{fontSize:12,color:"#666"}}>📍 {g.city} · 📱 {g.phone}</div>
                    </div>
                    <div style={{display:"flex",gap:8}}>
                      <button onClick={()=>updateGuide(g.id,"APPROVED")} style={{background:G,color:"#fff",border:"none",borderRadius:10,padding:"8px 14px",fontSize:12,fontWeight:700,cursor:"pointer"}}>✓ Approuver</button>
                      <button onClick={()=>updateGuide(g.id,"REJECTED")} style={{background:R,color:"#fff",border:"none",borderRadius:10,padding:"8px 14px",fontSize:12,fontWeight:700,cursor:"pointer"}}>✗ Refuser</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{background:"#fff",borderRadius:20,padding:24,boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
              <h2 style={{fontSize:16,fontWeight:800,color:B,marginBottom:16}}>📋 Dernieres reservations</h2>
              {stats.recentBookings?.map((b:any)=>(
                <div key={b.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 0",borderBottom:"1px solid #f0ebe4",flexWrap:"wrap",gap:8}}>
                  <div>
                    <div style={{fontWeight:700,fontSize:14}}>{b.guide?.displayName || "Guide"}</div>
                    <div style={{fontSize:12,color:"#666"}}>{new Date(b.date).toLocaleDateString("fr-FR")} · {b.persons} pers. · {b.tourist?.name || "Touriste"}</div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <span style={{fontWeight:800,color:B}}>{b.totalPrice} MAD</span>
                    <span style={{fontSize:10,fontWeight:700,padding:"4px 10px",borderRadius:16,background:b.status==="CONFIRMED"?"#dcfce7":b.status==="PENDING"?"#fef3c7":"#fee2e2",color:b.status==="CONFIRMED"?G:b.status==="PENDING"?"#d97706":R}}>{b.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {active === "guides" && (
          <div>
            <h1 style={{fontSize:22,fontWeight:800,marginBottom:20}}>Gestion des guides</h1>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher par nom ou ville..." style={{width:"100%",border:"2px solid #e8e0d6",borderRadius:12,padding:"12px 16px",fontSize:14,boxSizing:"border-box",marginBottom:16}}/>
            <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
              {["pending","approved","rejected"].map(t=>(
                <button key={t} onClick={()=>{setTab(t);}} style={{padding:"8px 20px",borderRadius:20,border:"none",background:tab===t?B:"#fff",color:tab===t?"#fff":"#666",fontWeight:700,fontSize:13,cursor:"pointer"}}>
                  {t==="pending"?"En attente":t==="approved"?"Approuves":"Refuses"}
                </button>
              ))}
            </div>
            {loading ? <div style={{textAlign:"center",padding:40,color:"#999"}}>Chargement...</div> :
            filtered.length === 0 ? <div style={{background:"#fff",borderRadius:20,padding:40,textAlign:"center",color:"#999"}}>Aucun guide</div> :
            filtered.map((g:any)=>(
              <div key={g.id} style={{background:"#fff",borderRadius:20,padding:20,marginBottom:16,boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12,flexWrap:"wrap",gap:8}}>
                  <div>
                    <div style={{fontSize:17,fontWeight:900,color:B}}>{g.displayName}</div>
                    <div style={{fontSize:13,color:"#666"}}>📍 {g.city} · 📱 {g.phone} · 💰 {g.halfDayPrice}/{g.fullDayPrice} MAD</div>
                  </div>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    {g.phone && <a href={"https://wa.me/"+g.phone.replace(/[^0-9]/g,"")} target="_blank" style={{background:"#25D366",color:"#fff",borderRadius:10,padding:"8px 12px",fontSize:12,fontWeight:700,textDecoration:"none"}}>WhatsApp</a>}
                    {tab==="pending" && <button onClick={()=>updateGuide(g.id,"APPROVED")} style={{background:G,color:"#fff",border:"none",borderRadius:10,padding:"8px 12px",fontSize:12,fontWeight:700,cursor:"pointer"}}>✓ Approuver</button>}
                    {tab==="pending" && <button onClick={()=>updateGuide(g.id,"REJECTED")} style={{background:R,color:"#fff",border:"none",borderRadius:10,padding:"8px 12px",fontSize:12,fontWeight:700,cursor:"pointer"}}>✗ Refuser</button>}
                    {tab==="approved" && <button onClick={()=>updateGuide(g.id,"REJECTED")} style={{background:"#f59e0b",color:"#fff",border:"none",borderRadius:10,padding:"8px 12px",fontSize:12,fontWeight:700,cursor:"pointer"}}>Suspendre</button>}
                    <button onClick={()=>deleteGuide(g.id)} style={{background:"#fee2e2",color:R,border:"none",borderRadius:10,padding:"8px 12px",fontSize:12,fontWeight:700,cursor:"pointer"}}>🗑️</button>
                  </div>
                </div>
                <p style={{fontSize:13,color:"#444",lineHeight:1.6,margin:0}}>{g.bio?.substring(0,150)}{g.bio?.length>150?"...":""}</p>
              </div>
            ))}
          </div>
        )}

        {active === "bookings" && (
          <div>
            <h1 style={{fontSize:22,fontWeight:800,marginBottom:20}}>Toutes les reservations</h1>
            {bookings.length === 0 ? <div style={{background:"#fff",borderRadius:20,padding:40,textAlign:"center",color:"#999"}}>Aucune reservation</div> :
            bookings.map((b:any)=>(
              <div key={b.id} style={{background:"#fff",borderRadius:16,padding:16,marginBottom:12,boxShadow:"0 2px 8px rgba(0,0,0,0.05)"}}>
                <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
                  <div>
                    <div style={{fontWeight:700}}>{b.guide?.displayName} → {b.tourist?.name || "Touriste"}</div>
                    <div style={{fontSize:12,color:"#666"}}>{new Date(b.date).toLocaleDateString("fr-FR")} · {b.duration==="HALF_DAY"?"4h":"8h"} · {b.persons} pers.</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontWeight:800,color:B}}>{b.totalPrice} MAD</div>
                    <div style={{fontSize:11,color:"#9333ea"}}>Commission: {b.commission} MAD</div>
                    <span style={{fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:12,background:b.status==="CONFIRMED"?"#dcfce7":b.status==="PENDING"?"#fef3c7":"#fee2e2",color:b.status==="CONFIRMED"?G:b.status==="PENDING"?"#d97706":R}}>{b.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {active === "commissions" && (
          <div>
            <h1 style={{fontSize:22,fontWeight:800,marginBottom:20}}>Commissions</h1>
            {stats && (
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:16,marginBottom:24}}>
                <div style={{background:"#fff",borderRadius:20,padding:24,boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
                  <div style={{fontSize:13,color:"#999",marginBottom:8}}>REVENUS GUIDES</div>
                  <div style={{fontSize:24,fontWeight:900,color:B}}>{stats.totalRevenue} MAD</div>
                </div>
                <div style={{background:"#fff",borderRadius:20,padding:24,boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
                  <div style={{fontSize:13,color:"#999",marginBottom:8}}>VOS COMMISSIONS (24%)</div>
                  <div style={{fontSize:24,fontWeight:900,color:"#9333ea"}}>{Math.round(stats.totalRevenue * 0.24)} MAD</div>
                </div>
                <div style={{background:"#fff",borderRadius:20,padding:24,boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
                  <div style={{fontSize:13,color:"#999",marginBottom:8}}>RESERVATIONS CONFIRMEES</div>
                  <div style={{fontSize:24,fontWeight:900,color:G}}>{stats.confirmedBookings}</div>
                </div>
              </div>
            )}
            <div style={{background:"#fff",borderRadius:20,padding:24}}>
              <h2 style={{fontSize:16,fontWeight:800,color:B,marginBottom:16}}>Detail par reservation</h2>
              {bookings.filter((b:any)=>b.status==="CONFIRMED"||b.status==="COMPLETED").map((b:any)=>(
                <div key={b.id} style={{display:"flex",justifyContent:"space-between",padding:"12px 0",borderBottom:"1px solid #f0ebe4",flexWrap:"wrap",gap:8}}>
                  <div>
                    <div style={{fontWeight:700,fontSize:14}}>{b.guide?.displayName}</div>
                    <div style={{fontSize:12,color:"#666"}}>{new Date(b.date).toLocaleDateString("fr-FR")}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:14,fontWeight:700}}>{b.totalPrice} MAD</div>
                    <div style={{fontSize:12,color:"#9333ea",fontWeight:600}}>+{b.commission} MAD commission</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
