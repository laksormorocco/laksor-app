"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

const B="#123EAB", Y="#F4C542";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [guideId, setGuideId] = useState<string|null>(null);
  const [role, setRole] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    async function loadUser(u: any) {
      setUser(u);
      const res = await fetch("/api/auth/me?supabaseId=" + u.id);
      const data = await res.json();
      if (data.guideId) setGuideId(data.guideId);
      setRole(data.role || "");
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) loadUser(session.user);
    });
    supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) loadUser(session.user);
    });
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <nav style={{ background:"#fff", borderBottom:"1px solid #e8e0d8", padding:"0 clamp(16px,4vw,40px)", height:66, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:200 }}>
      <a href="/" style={{ textDecoration:"none", display:"flex", alignItems:"center", gap:10 }}>
        <img src="/Logo.png" alt="Laksor" style={{ height:60, width:"auto" }}/>
      </a>

      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        {!user ? (
          <>
            <a href="/auth/login" style={{ fontSize:14, color:"#444", padding:"10px 16px", textDecoration:"none" }}>Se connecter</a>
            <a href="/auth/register" style={{ background:Y, color:"#1a1a1a", borderRadius:24, padding:"10px 22px", fontSize:13, fontWeight:700, textDecoration:"none" }}>Devenir guide</a>
          </>
        ) : (
          <div style={{ position:"relative" }}>
            <button onClick={()=>setMenuOpen(!menuOpen)} style={{ display:"flex", alignItems:"center", gap:8, background:"none", border:"2px solid #e8e0d6", borderRadius:24, padding:"6px 14px", cursor:"pointer" }}>
              {user.user_metadata?.avatar_url && <img src={user.user_metadata.avatar_url} alt="" style={{ width:28, height:28, borderRadius:"50%", objectFit:"cover" }}/>}
              <span style={{ fontSize:13, fontWeight:600, color:"#333" }}>{user.user_metadata?.full_name?.split(" ")[0] || "Mon compte"}</span>
              <span style={{ fontSize:10 }}>▼</span>
            </button>
            {menuOpen && (
              <div style={{ position:"absolute", right:0, top:"calc(100% + 8px)", background:"#fff", borderRadius:16, boxShadow:"0 8px 32px rgba(0,0,0,0.12)", minWidth:200, overflow:"hidden", zIndex:300 }}>
                <a href="/dashboard/tourist" style={{ display:"block", padding:"12px 16px", fontSize:14, color:"#333", textDecoration:"none", borderBottom:"1px solid #f0ebe4", fontWeight:600 }}>🧳 Mes reservations</a>
                {guideId && <a href={"/dashboard/guide?id="+guideId} style={{ display:"block", padding:"12px 16px", fontSize:14, color:"#333", textDecoration:"none", borderBottom:"1px solid #f0ebe4", fontWeight:600 }}>📊 Mon dashboard</a>}
                {role === "ADMIN" && <a href="/dashboard/admin" style={{ display:"block", padding:"12px 16px", fontSize:14, color:"#333", textDecoration:"none", borderBottom:"1px solid #f0ebe4" }}>⚙️ Admin</a>}
                <button onClick={logout} style={{ display:"block", width:"100%", padding:"12px 16px", fontSize:14, color:"#ef4444", textDecoration:"none", border:"none", background:"none", cursor:"pointer", textAlign:"left" }}>🚪 Deconnexion</button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
