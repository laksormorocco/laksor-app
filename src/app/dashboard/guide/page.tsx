"use client";
import { useState, useEffect } from "react";
import GuideStats from "@/components/GuideStats";
import ProfileEditor from "@/components/ProfileEditor";
const B="#123EAB",Y="#F4C542",G="#22c55e",R="#ef4444",S="#F8F5F0";

const MENUS = [
  { id:"dashboard", icon:"📊", label:"Tableau de bord" },
  { id:"reservations", icon:"📋", label:"Reservations" },
  { id:"stats", icon:"📊", label:"Statistiques" },
  { id:"demandes", icon:"🎯", label:"Demandes sur mesure" },
  { id:"profil", icon:"👤", label:"Mon Profil" },
];

export default function GuideDashboard() {
  const [active, setActive] = useState("dashboard");
  const [sidebar, setSidebar] = useState(false);
  const [guide, setGuide] = useState<any>(null);
  const [customRequests, setCustomRequests] = useState<any[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [guideId, setGuideId] = useState("");

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id");
    if (id) { setGuideId(id); fetchData(id); }
    else setLoading(false);
  }, []);

  async function fetchData(id: string) {
    setLoading(true);
    const res = await fetch("/api/guide/dashboard?guideId=" + id);
    const data = await res.json();
    if (data.guide) { setGuide(data.guide); setTotalRevenue(data.totalRevenue); }
      const reqRes = await fetch("/api/custom-request?guideId=" + id);
      const reqData = await reqRes.json();
      setCustomRequests(reqData.requests || []);
    setLoading(false);
  }

  async function updateBooking(bookingId: string, status: string) {
    const res = await fetch("/api/guide/booking", {
      method: "PATCH",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ bookingId, status })
    });
    const result = await res.json();
    if (result.whatsappUrl) window.open(result.whatsappUrl, "_blank");
    if (guideId) fetchData(guideId);
  }

  const pending = guide?.bookings?.filter((b:any) => b.status === "PENDING") || [];
  const confirmed = guide?.bookings?.filter((b:any) => b.status === "CONFIRMED") || [];

  return (
    <div style={{display:"flex",minHeight:"100vh",background:S,fontFamily:"Georgia,serif"}}>
      <div style={{position:"fixed",top:0,left:0,right:0,background:B,padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",zIndex:100}}>
        <button onClick={()=>setSidebar(!sidebar)} style={{color:"#fff",fontSize:22,background:"none",border:"none",cursor:"pointer"}}>☰</button>
        <span style={{color:"#fff",fontWeight:700}}>Dashboard Guide</span>
        <a href="/" style={{color:"rgba(255,255,255,0.7)",fontSize:12,textDecoration:"none"}}>Voir site</a>
      </div>

      {sidebar && (
        <div style={{position:"fixed",inset:0,zIndex:200,display:"flex"}}>
          <div style={{width:260,background:B,display:"flex",flexDirection:"column",padding:"80px 0 20px"}}>
            {guide && (
              <div style={{padding:"0 20px 20px",borderBottom:"1px solid rgba(255,255,255,0.1)",marginBottom:12}}>
                <div style={{color:"#fff",fontWeight:700,fontSize:15}}>{guide.displayName}</div>
                <div style={{color:"rgba(255,255,255,0.6)",fontSize:12}}>📍 {guide.city}</div>
              </div>
            )}
            {MENUS.map(m=>(
              <button key={m.id} onClick={()=>{setActive(m.id);setSidebar(false);}} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 20px",background:active===m.id?"rgba(255,255,255,0.15)":"transparent",borderLeft:`3px solid ${active===m.id?Y:"transparent"}`,color:"#fff",fontSize:13,fontWeight:active===m.id?700:500,border:"none",cursor:"pointer",textAlign:"left",width:"100%"}}>
                <span>{m.icon}</span>{m.label}
              </button>
            ))}
          </div>
          <div style={{flex:1,background:"rgba(0,0,0,0.5)"}} onClick={()=>setSidebar(false)}/>
        </div>
      )}

      <div style={{flex:1,padding:"72px 16px 32px",overflow:"auto"}}>
        {!guideId && !loading && (
          <div style={{background:"#fff",borderRadius:20,padding:32,textAlign:"center",marginTop:20}}>
            <div style={{fontSize:48,marginBottom:16}}>🔐</div>
            <h2 style={{color:B,marginBottom:8}}>Acces Dashboard</h2>
            <p style={{color:"#666",marginBottom:20}}>Entrez votre ID guide</p>
            <input placeholder="ID du guide" onChange={e=>setGuideId(e.target.value)} style={{border:"2px solid #e8e0d6",borderRadius:12,padding:"12px 16px",fontSize:15,width:"100%",boxSizing:"border-box",marginBottom:12}}/>
            <button onClick={()=>fetchData(guideId)} style={{background:B,color:"#fff",border:"none",borderRadius:12,padding:"12px 0",width:"100%",fontSize:15,fontWeight:700,cursor:"pointer"}}>Acceder</button>
          </div>
        )}

        {loading && <div style={{textAlign:"center",padding:60,color:"#999"}}>Chargement...</div>}

        {guide && active === "dashboard" && (
          <div>
            <h1 style={{fontSize:22,fontWeight:800,marginBottom:4}}>Bonjour, {guide.displayName} 👋</h1>
            <p style={{color:"#777",fontSize:13,marginBottom:24}}>Voici votre activite</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:16,marginBottom:28}}>
              {[
                {icon:"📋",label:"En attente",val:String(pending.length),bg:"#fef3c7",color:"#d97706"},
                {icon:"✅",label:"Confirmes",val:String(confirmed.length),bg:"#dcfce7",color:G},
                {icon:"💰",label:"Revenus",val:totalRevenue+" MAD",bg:"#eef2ff",color:B},
                {icon:"⭐",label:"Note",val:Number(guide.avgRating).toFixed(1)+"/5",bg:"#fffbeb",color:"#d97706"},
              ].map(s=>(
                <div key={s.label} style={{background:"#fff",borderRadius:20,padding:20,boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
                  <div style={{width:44,height:44,borderRadius:12,background:s.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,marginBottom:14}}>{s.icon}</div>
                  <div style={{fontSize:18,fontWeight:800,color:s.color,marginBottom:4}}>{s.val}</div>
                  <div style={{fontSize:12,color:"#888"}}>{s.label}</div>
                </div>
              ))}
            </div>

            {pending.length > 0 && (
              <div style={{background:"#fff",borderRadius:20,padding:24,boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
                <h2 style={{fontSize:16,fontWeight:800,marginBottom:16,color:B}}>⏳ Demandes en attente ({pending.length})</h2>
                {pending.map((b:any)=>(
                  <div key={b.id} style={{background:S,borderRadius:14,padding:16,marginBottom:12}}>
                    <div style={{fontWeight:700,fontSize:14,marginBottom:4}}>{b.tourist?.name || "Touriste"}</div>
                    <div style={{fontSize:12,color:"#666",marginBottom:4}}>{new Date(b.date).toLocaleDateString("fr-FR")} · {b.duration === "HALF_DAY" ? "4h" : "8h"} · {b.persons} pers. · {b.totalPrice} MAD</div>
                    <div style={{fontSize:12,color:"#666",marginBottom:12}}>📧 {b.tourist?.email || "Email non disponible"}</div>
                    <div style={{display:"flex",gap:10}}>
                      <button onClick={()=>updateBooking(b.id,"CONFIRMED")} style={{flex:1,background:G,color:"#fff",border:"none",borderRadius:10,padding:"10px 0",fontSize:13,fontWeight:700,cursor:"pointer"}}>✓ Accepter</button>
                      <button onClick={()=>updateBooking(b.id,"CANCELLED")} style={{flex:1,background:R,color:"#fff",border:"none",borderRadius:10,padding:"10px 0",fontSize:13,fontWeight:700,cursor:"pointer"}}>✗ Refuser</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {guide && active === "reservations" && (
          <div style={{background:"#fff",borderRadius:20,padding:24}}>
            <h2 style={{fontSize:16,fontWeight:800,marginBottom:16,color:B}}>Toutes les reservations</h2>
            {guide.bookings?.length === 0 && <p style={{color:"#999",textAlign:"center",padding:20}}>Aucune reservation</p>}
            {guide.bookings?.map((b:any)=>(
              <div key={b.id} style={{display:"flex",alignItems:"center",gap:14,padding:14,background:S,borderRadius:14,marginBottom:12,flexWrap:"wrap"}}>
                <div style={{flex:1,minWidth:150}}>
                  <div style={{fontWeight:700,fontSize:14}}>{b.tourist?.name || "Touriste"}</div>
                  <div style={{fontSize:11,color:"#888",marginTop:2}}>{new Date(b.date).toLocaleDateString("fr-FR")} · {b.duration === "HALF_DAY" ? "4h" : "8h"} · {b.persons} pers.</div>
                </div>
                <div style={{fontSize:15,fontWeight:800,color:B}}>{b.totalPrice} MAD</div>
                <div style={{fontSize:10,fontWeight:700,padding:"4px 10px",borderRadius:16,background:b.status==="CONFIRMED"?"#dcfce7":b.status==="PENDING"?"#fef3c7":"#fee2e2",color:b.status==="CONFIRMED"?G:b.status==="PENDING"?"#d97706":R}}>{b.status}</div>
                {b.status === "PENDING" && (
                  <div style={{display:"flex",gap:8}}>
                    <button onClick={()=>updateBooking(b.id,"CONFIRMED")} style={{background:G,color:"#fff",border:"none",borderRadius:8,padding:"6px 12px",fontSize:12,fontWeight:700,cursor:"pointer"}}>✓</button>
                    <button onClick={()=>updateBooking(b.id,"CANCELLED")} style={{background:R,color:"#fff",border:"none",borderRadius:8,padding:"6px 12px",fontSize:12,fontWeight:700,cursor:"pointer"}}>✗</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {guide && active === "stats" && (
          <GuideStats guideId={guideId} />
        )}
        {guide && active === "profil" && (
          <ProfileEditor guide={guide} guideId={guideId} onSaved={()=>fetchData(guideId)} />
        )}
      </div>
    </div>
  );
}
