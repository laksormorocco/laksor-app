"use client";
import { useState, useEffect } from "react";
import GuideStats from "@/components/GuideStats";
import ProfileEditor from "@/components/ProfileEditor";

const TABS = [
  { id:"home", icon:"🏠", label:"Accueil" },
  { id:"reservations", icon:"📋", label:"Réservations" },
  { id:"demandes", icon:"🎯", label:"Demandes" },
  { id:"stats", icon:"📈", label:"Stats" },
  { id:"profil", icon:"👤", label:"Profil" },
];

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
      const reqData = await reqRes.json();
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

  const pending = bookings.filter(b => b.status === "PENDING");
  const confirmed = bookings.filter(b => b.status === "CONFIRMED");
  const pendingRequests = customRequests.filter(r => r.status === "PENDING");

  if (loading) return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#F7F7F7",fontFamily:"Inter,sans-serif"}}>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:40,marginBottom:12}}>⏳</div>
        <div style={{color:"#94A3B8"}}>Chargement...</div>
      </div>
    </div>
  );

  if (!guideId) return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#F7F7F7",fontFamily:"Inter,sans-serif",padding:16}}>
      <div style={{background:"#fff",borderRadius:20,padding:32,textAlign:"center",maxWidth:360,width:"100%",border:"1px solid #EBEBEB"}}>
        <div style={{fontSize:40,marginBottom:12}}>🔐</div>
        <h2 style={{color:"#123EAB",marginBottom:8}}>Accès Dashboard</h2>
        <p style={{color:"#94A3B8",fontSize:14,marginBottom:20}}>Connectez-vous pour accéder à votre espace</p>
        <a href="/auth/login" style={{display:"block",background:"#0B132B",color:"#fff",borderRadius:30,padding:"14px 0",fontSize:15,fontWeight:600,textDecoration:"none"}}>Se connecter</a>
      </div>
    </div>
  );

  return (
    <div style={{background:"#F7F7F7",minHeight:"100vh",fontFamily:"Inter,-apple-system,sans-serif",paddingBottom:80}}>

      {/* Header */}
      <div style={{background:"#fff",padding:"16px",borderBottom:"1px solid #EBEBEB",position:"sticky",top:0,zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{position:"relative"}}>
              <div style={{width:44,height:44,borderRadius:"50%",overflow:"hidden",background:"#E2E8F0",border:"2px solid #E2E8F0"}}>
                {guide?.avatar && <img src={guide.avatar} style={{width:"100%",height:"100%",objectFit:"cover"}}/>}
              </div>
              <div style={{position:"absolute",bottom:0,right:0,width:12,height:12,background:"#22c55e",borderRadius:"50%",border:"2px solid #fff"}}/>
            </div>
            <div>
              <div style={{fontSize:12,color:"#94A3B8"}}>Bonjour,</div>
              <div style={{fontWeight:700,fontSize:16,color:"#222"}}>{guide?.displayName || "Guide"} 👋</div>
            </div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <div style={{position:"relative",width:40,height:40,background:"#F7F7F7",borderRadius:12,border:"1px solid #EBEBEB",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>
              🔔
              {(pending.length + pendingRequests.length) > 0 && <div style={{position:"absolute",top:6,right:8,width:8,height:8,background:"#F4C542",borderRadius:"50%",border:"1.5px solid #fff"}}/>}
            </div>
            <a href="/" style={{width:40,height:40,background:"#F7F7F7",borderRadius:12,border:"1px solid #EBEBEB",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,textDecoration:"none",color:"#666"}}>🏠</a>
          </div>
        </div>
      </div>

      <div style={{padding:"16px"}}>

        {/* HOME */}
        {active === "home" && (
          <>
            {/* Revenue Banner */}
            <div style={{background:"linear-gradient(135deg,#123EAB,#1a4fd6)",borderRadius:20,padding:20,marginBottom:16,position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:-20,right:-20,width:100,height:100,background:"rgba(255,255,255,0.06)",borderRadius:"50%"}}/>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.7)",marginBottom:4}}>Revenus total</div>
              <div style={{fontSize:32,fontWeight:800,color:"#fff",marginBottom:4}}>{totalRevenue} <span style={{fontSize:16,fontWeight:500}}>MAD</span></div>
              <div style={{display:"flex",gap:16,marginTop:8}}>
                <div><div style={{fontSize:11,color:"rgba(255,255,255,0.6)"}}>En attente</div><div style={{fontSize:16,fontWeight:700,color:"#F4C542"}}>{pending.length}</div></div>
                <div style={{width:1,background:"rgba(255,255,255,0.15)"}}/>
                <div><div style={{fontSize:11,color:"rgba(255,255,255,0.6)"}}>Confirmées</div><div style={{fontSize:16,fontWeight:700,color:"#4ade80"}}>{confirmed.length}</div></div>
                <div style={{width:1,background:"rgba(255,255,255,0.15)"}}/>
                <div><div style={{fontSize:11,color:"rgba(255,255,255,0.6)"}}>Note</div><div style={{fontSize:16,fontWeight:700,color:"#fff"}}>{Number(guide?.avgRating||0).toFixed(1)} ⭐</div></div><div style={{width:1,background:"rgba(255,255,255,0.15)"}} /><div><div style={{fontSize:11,color:"rgba(255,255,255,0.6)"}}>Vues</div><div style={{fontSize:16,fontWeight:700,color:"#fff"}}>{guide?.views || 0} 👁️</div></div>
              </div>
            </div>

            {/* Pending bookings */}
            {pending.length > 0 && (
              <div style={{background:"#fff",borderRadius:20,padding:18,marginBottom:16,border:"1px solid #EBEBEB"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                  <h2 style={{fontSize:15,fontWeight:700,color:"#222"}}>Réservations en attente</h2>
                  <span style={{background:"#FEF3C7",color:"#92400E",fontSize:11,fontWeight:700,padding:"4px 10px",borderRadius:20}}>{pending.length} nouvelles</span>
                </div>
                {pending.map((b:any) => (
                  <div key={b.id} style={{border:"1px solid #F1F5F9",borderRadius:14,padding:14,marginBottom:10}}>
                    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                      <div style={{width:38,height:38,borderRadius:"50%",background:"linear-gradient(135deg,#667eea,#764ba2)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:15,fontWeight:700,flexShrink:0}}>{b.tourist?.name?.[0] || "T"}</div>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:600,fontSize:14,color:"#222"}}>{b.tourist?.name || "Touriste"}</div>
                        <div style={{fontSize:11,color:"#94A3B8"}}>📧 {b.tourist?.email || "—"}</div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontWeight:800,fontSize:16,color:"#22c55e"}}>{b.totalPrice}</div>
                        <div style={{fontSize:10,color:"#94A3B8"}}>MAD</div>
                      </div>
                    </div>
                    <div style={{display:"flex",gap:8,marginBottom:12}}>
                      {[["Date",new Date(b.date).toLocaleDateString("fr-FR")],["Durée",b.duration==="HALF_DAY"?"4h":"8h"],["Pers.",String(b.persons)]].map(([k,v]) => (
                        <div key={k} style={{flex:1,background:"#F8FAFC",borderRadius:10,padding:8,textAlign:"center"}}>
                          <div style={{fontSize:9,color:"#94A3B8",textTransform:"uppercase" as const,letterSpacing:"0.5px"}}>{k}</div>
                          <div style={{fontSize:13,fontWeight:600,color:"#222",marginTop:2}}>{v}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{display:"flex",gap:8}}>
                      <button onClick={()=>updateBooking(b.id,"CONFIRMED")} style={{flex:1,background:"#22c55e",color:"#fff",border:"none",borderRadius:25,padding:11,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>✓ Accepter</button>
                      <button onClick={()=>updateBooking(b.id,"CANCELLED")} style={{width:44,height:44,background:"#FFF1F2",color:"#ef4444",border:"none",borderRadius:"50%",fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Confirmed */}
            {confirmed.length > 0 && (
              <div style={{background:"#fff",borderRadius:20,padding:18,border:"1px solid #EBEBEB"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                  <h2 style={{fontSize:15,fontWeight:700,color:"#222"}}>Prochains tours</h2>
                  <span style={{color:"#F59E0B",fontSize:12,fontWeight:600,cursor:"pointer"}} onClick={()=>setActive("reservations")}>Voir tout →</span>
                </div>
                {confirmed.slice(0,3).map((b:any,i:number) => (
                  <div key={b.id} style={{display:"flex",gap:12,alignItems:"center",padding:"12px 0",borderBottom:i<Math.min(confirmed.length,3)-1?"1px solid #F7F7F7":"none"}}>
                    <div style={{width:48,height:48,borderRadius:14,background:"#F0FDF4",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>👤</div>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:600,fontSize:14,color:"#222"}}>{b.tourist?.name || "Touriste"}</div>
                      <div style={{fontSize:12,color:"#94A3B8",marginTop:2}}>{new Date(b.date).toLocaleDateString("fr-FR")} · {b.duration==="HALF_DAY"?"4h":"8h"} · {b.persons} pers.</div>
                      {b.tourist?.email && <div style={{fontSize:11,color:"#94A3B8"}}>📧 {b.tourist.email}</div>}
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontWeight:700,fontSize:15,color:"#22c55e"}}>{b.totalPrice} MAD</div>
                      <div style={{background:"#DCFCE7",color:"#166534",fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:10,marginTop:3,display:"inline-block"}}>✓ Confirmé</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {pending.length === 0 && confirmed.length === 0 && (
              <div style={{background:"#fff",borderRadius:20,padding:48,textAlign:"center",border:"1px solid #EBEBEB"}}>
                <div style={{fontSize:48,marginBottom:16}}>📋</div>
                <div style={{fontWeight:700,color:"#0F172A",fontSize:16,marginBottom:8}}>Aucune réservation</div>
                <div style={{color:"#94A3B8",fontSize:14}}>Les nouvelles réservations apparaîtront ici</div>
              </div>
            )}
          </>
        )}

        {/* RESERVATIONS */}
        {active === "reservations" && (
          <div style={{background:"#fff",borderRadius:20,padding:18,border:"1px solid #EBEBEB"}}>
            <h2 style={{fontSize:15,fontWeight:700,color:"#222",marginBottom:14}}>Toutes les réservations</h2>
            {bookings.length === 0 ? <div style={{textAlign:"center",padding:40,color:"#94A3B8"}}>Aucune réservation</div> :
            bookings.map((b:any,i:number) => (
              <div key={b.id} style={{display:"flex",justifyContent:"space-between",padding:"14px 0",borderBottom:i<bookings.length-1?"1px solid #F1F5F9":"none",alignItems:"center"}}>
                <div style={{display:"flex",gap:10,alignItems:"center"}}>
                  <div style={{width:42,height:42,borderRadius:12,background:"#F8FAFC",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>👤</div>
                  <div>
                    <div style={{fontWeight:600,fontSize:14,color:"#222"}}>{b.tourist?.name || "Touriste"}</div>
                    <div style={{fontSize:11,color:"#94A3B8"}}>{new Date(b.date).toLocaleDateString("fr-FR")} · {b.duration==="HALF_DAY"?"4h":"8h"} · {b.persons} pers.</div>
                    {b.tourist?.email && <div style={{fontSize:11,color:"#94A3B8"}}>📧 {b.tourist.email}</div>}
                  </div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontWeight:700,fontSize:14,color:"#22c55e"}}>{b.totalPrice} MAD</div>
                  <div style={{fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:10,marginTop:3,display:"inline-block",background:b.status==="CONFIRMED"?"#DCFCE7":b.status==="PENDING"?"#FEF3C7":"#FEE2E2",color:b.status==="CONFIRMED"?"#166534":b.status==="PENDING"?"#92400E":"#ef4444"}}>{b.status}</div>
                  {b.status==="PENDING" && (
                    <div style={{display:"flex",gap:4,marginTop:6,justifyContent:"flex-end"}}>
                      <button onClick={()=>updateBooking(b.id,"CONFIRMED")} style={{background:"#22c55e",color:"#fff",border:"none",borderRadius:20,padding:"5px 10px",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>✓</button>
                      <button onClick={()=>updateBooking(b.id,"CANCELLED")} style={{background:"#FFF1F2",color:"#ef4444",border:"none",borderRadius:20,padding:"5px 10px",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>✕</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* DEMANDES */}
        {active === "demandes" && (
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <h2 style={{fontSize:15,fontWeight:700,color:"#222"}}>🎯 Demandes sur mesure ({customRequests.length})</h2>
            {customRequests.length === 0 ? (
              <div style={{background:"#fff",borderRadius:20,padding:40,textAlign:"center",border:"1px solid #EBEBEB"}}>
                <div style={{fontSize:40,marginBottom:12}}>🎯</div>
                <div style={{color:"#94A3B8"}}>Aucune demande sur mesure</div>
              </div>
            ) : customRequests.map((r:any) => (
              <div key={r.id} style={{background:"#fff",borderRadius:20,padding:20,border:"1px solid #EBEBEB"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:12,flexWrap:"wrap" as const,gap:8}}>
                  <div>
                    <div style={{fontWeight:700,fontSize:15,color:"#222"}}>{r.tourist?.name || "Touriste"}</div>
                    <div style={{fontSize:12,color:"#94A3B8"}}>📧 {r.tourist?.email}</div>
                  </div>
                  <span style={{fontSize:11,fontWeight:700,padding:"4px 12px",borderRadius:20,background:r.status==="PENDING"?"#FEF3C7":r.status==="QUOTED"?"#EFF6FF":r.status==="ACCEPTED"?"#DCFCE7":"#FEE2E2",color:r.status==="PENDING"?"#92400E":r.status==="QUOTED"?"#123EAB":r.status==="ACCEPTED"?"#166534":"#ef4444"}}>{r.status}</span>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>
                  {[["Date",new Date(r.startDate).toLocaleDateString("fr-FR")],["Jours",String(r.days)],["Pers.",String(r.persons)]].map(([k,v]) => (
                    <div key={k} style={{background:"#F8FAFC",borderRadius:10,padding:8,textAlign:"center"}}>
                      <div style={{fontSize:9,color:"#94A3B8",textTransform:"uppercase" as const}}>{k}</div>
                      <div style={{fontSize:13,fontWeight:600,color:"#222",marginTop:2}}>{v}</div>
                    </div>
                  ))}
                </div>
                <p style={{fontSize:14,color:"#475569",lineHeight:1.6,marginBottom:12}}>{r.description}</p>
                {r.status === "PENDING" && (
                  <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap" as const}}>
                    <input type="number" placeholder="Prix (MAD)" id={"price-"+r.id} style={{border:"1.5px solid #E2E8F0",borderRadius:10,padding:"8px 12px",fontSize:14,width:140,fontFamily:"inherit",outline:"none"}}/>
                    <button onClick={async()=>{
                      const inp = document.getElementById("price-"+r.id) as HTMLInputElement;
                      await updateRequest(r.id,"QUOTED",parseFloat(inp.value));
                    }} style={{background:"#123EAB",color:"#fff",border:"none",borderRadius:20,padding:"10px 16px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Proposer prix</button>
                    <button onClick={()=>updateRequest(r.id,"REFUSED")} style={{background:"#FFF1F2",color:"#ef4444",border:"none",borderRadius:20,padding:"10px 16px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Refuser</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* STATS */}
        {active === "stats" && guideId && <GuideStats guideId={guideId} />}

        {/* PROFIL */}
        {active === "profil" && guide && <ProfileEditor guide={guide} guideId={guideId} onSaved={()=>fetchData(guideId)} />}
      </div>

      {/* Bottom Nav */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:"#fff",borderTop:"1px solid #EBEBEB",display:"grid",gridTemplateColumns:"repeat(5,1fr)",zIndex:100}}>
        {TABS.map(t => (
          <button key={t.id} onClick={()=>setActive(t.id)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,background:"none",border:"none",borderTop:`2px solid ${active===t.id?"#123EAB":"transparent"}`,cursor:"pointer",padding:"10px 0",fontFamily:"inherit"}}>
            <span style={{fontSize:20}}>{t.icon}</span>
            <span style={{fontSize:10,color:active===t.id?"#123EAB":"#94A3B8",fontWeight:active===t.id?700:500}}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
