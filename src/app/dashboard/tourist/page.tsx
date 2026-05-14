"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

const B="#123EAB",Y="#F4C542",G="#22c55e",R="#ef4444",S="#F8F5F0";

export default function TouristDashboard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { window.location.href = "/auth/login"; return; }
      setUser(session.user);
      const res = await fetch("/api/tourist/bookings?supabaseId=" + session.user.id);
      const data = await res.json();
      setBookings(data.bookings || []);
      setLoading(false);
    });
  }, []);

  async function cancelBooking(id: string) {
    if (!confirm("Annuler cette reservation ?")) return;
    await fetch("/api/tourist/bookings", {
      method: "PATCH",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ bookingId: id, status: "CANCELLED" })
    });
    setBookings(bookings.map(b => b.id === id ? {...b, status: "CANCELLED"} : b));
  }

  const statusColor = (s: string) => s === "CONFIRMED" ? G : s === "PENDING" ? "#f59e0b" : s === "CANCELLED" ? R : "#666";
  const statusBg = (s: string) => s === "CONFIRMED" ? "#dcfce7" : s === "PENDING" ? "#fef3c7" : s === "CANCELLED" ? "#fee2e2" : "#f0f0f0";
  const statusLabel = (s: string) => s === "CONFIRMED" ? "Confirme" : s === "PENDING" ? "En attente" : s === "CANCELLED" ? "Annule" : s;

  return (
    <div style={{background:S,minHeight:"100vh",fontFamily:"Georgia,serif"}}>
      <div style={{background:B,padding:"16px 24px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{color:"#fff",fontWeight:900,fontSize:18}}>Mes reservations</div>
        <a href="/" style={{color:"rgba(255,255,255,0.7)",fontSize:12,textDecoration:"none"}}>← Accueil</a>
      </div>

      <div style={{maxWidth:700,margin:"0 auto",padding:"32px 16px"}}>
        {user && (
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
            {user.user_metadata?.avatar_url && <img src={user.user_metadata.avatar_url} alt="" style={{width:48,height:48,borderRadius:"50%",objectFit:"cover"}}/>}
            <div>
              <div style={{fontWeight:800,fontSize:18}}>{user.user_metadata?.full_name || "Voyageur"}</div>
              <div style={{fontSize:13,color:"#666"}}>{user.email}</div>
            </div>
          </div>
        )}

        {loading && <div style={{textAlign:"center",padding:60,color:"#999"}}>Chargement...</div>}

        {!loading && bookings.length === 0 && (
          <div style={{background:"#fff",borderRadius:20,padding:48,textAlign:"center",boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
            <div style={{fontSize:48,marginBottom:16}}>🧭</div>
            <h2 style={{color:B,marginBottom:8}}>Aucune reservation</h2>
            <p style={{color:"#666",marginBottom:24}}>Trouvez votre guide ideal pour explorer le Maroc</p>
            <a href="/search" style={{background:Y,color:"#111",borderRadius:14,padding:"14px 28px",fontSize:14,fontWeight:700,textDecoration:"none"}}>Trouver un guide</a>
          </div>
        )}

        {bookings.map(b => (
          <div key={b.id} style={{background:"#fff",borderRadius:20,padding:24,marginBottom:16,boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16,flexWrap:"wrap",gap:8}}>
              <div style={{display:"flex",gap:12,alignItems:"center"}}>
                {b.guide?.avatar && <img src={b.guide.avatar} alt="" style={{width:52,height:52,borderRadius:12,objectFit:"cover"}}/>}
                <div>
                  <div style={{fontWeight:800,fontSize:16,color:B}}>{b.guide?.displayName}</div>
                  <div style={{fontSize:13,color:"#666"}}>📍 {b.guide?.city}</div>
                </div>
              </div>
              <span style={{fontSize:11,fontWeight:700,padding:"5px 12px",borderRadius:20,background:statusBg(b.status),color:statusColor(b.status)}}>
                {statusLabel(b.status)}
              </span>
            </div>

            <div style={{background:S,borderRadius:14,padding:16,marginBottom:16}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <div><div style={{fontSize:11,color:"#999",marginBottom:2}}>DATE</div><div style={{fontWeight:700,fontSize:14}}>{new Date(b.date).toLocaleDateString("fr-FR")}</div></div>
                <div><div style={{fontSize:11,color:"#999",marginBottom:2}}>DUREE</div><div style={{fontWeight:700,fontSize:14}}>{b.duration === "HALF_DAY" ? "Demi-journee" : "Journee"}</div></div>
                <div><div style={{fontSize:11,color:"#999",marginBottom:2}}>PERSONNES</div><div style={{fontWeight:700,fontSize:14}}>{b.persons}</div></div>
                <div><div style={{fontSize:11,color:"#999",marginBottom:2}}>TOTAL</div><div style={{fontWeight:800,fontSize:16,color:B}}>{b.totalPrice} MAD</div></div>
              </div>
            </div>

            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              {b.guide?.phone && (
                <a href={"https://wa.me/"+b.guide.phone.replace(/[^0-9]/g,"")} target="_blank" style={{background:"#25D366",color:"#fff",borderRadius:12,padding:"10px 16px",fontSize:13,fontWeight:700,textDecoration:"none"}}>
                  💬 WhatsApp guide
                </a>
              )}
              {b.status === "PENDING" && (
                <button onClick={()=>cancelBooking(b.id)} style={{background:"#fee2e2",color:R,border:"none",borderRadius:12,padding:"10px 16px",fontSize:13,fontWeight:700,cursor:"pointer"}}>
                  Annuler
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
