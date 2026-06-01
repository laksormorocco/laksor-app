"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Logo } from "@/components/ui/Logo";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [guideId, setGuideId] = useState<string|null>(null);
  const [role, setRole] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    async function loadUser(u:any) {
      setUser(u);
      const res = await fetch("/api/auth/me?supabaseId="+u.id);
      const data = await res.json();
      if (data.guideId) setGuideId(data.guideId);
      setRole(data.role||"");
    }
    supabase.auth.getSession().then(({data:{session}})=>{ if(session?.user) loadUser(session.user); });
    supabase.auth.onAuthStateChange((_,session)=>{ if(session?.user) loadUser(session.user); });
  }, []);

  async function logout() { await supabase.auth.signOut(); window.location.href="/"; }

  return (
    <nav style={{
      background: scrolled?"rgba(246,241,232,0.96)":"rgba(246,241,232,0.85)",
      backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)",
      borderBottom: scrolled?"1px solid rgba(184,138,68,0.15)":"1px solid transparent",
      padding:"0 clamp(16px,4vw,40px)", height:80,
      display:"flex", alignItems:"center", justifyContent:"space-between",
      position:"sticky", top:0, zIndex:200, transition:"all 0.3s ease",
    }}>
      <a href="/"><Logo size="lg" variant="bronze"/></a>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        {!user ? (
          <>
            <a href="/auth/login" style={{fontSize:14,color:"#111",padding:"10px 16px",fontFamily:"var(--font-inter),sans-serif",fontWeight:500,opacity:0.75}}>Se connecter</a>
            <a href="/auth/register" style={{background:"linear-gradient(135deg,#B88A44,#A17635)",color:"#fff",borderRadius:999,padding:"10px 22px",fontSize:13,fontWeight:700,fontFamily:"var(--font-inter),sans-serif",boxShadow:"0 4px 16px rgba(184,138,68,0.30)",textDecoration:"none"}}>Devenir guide</a>
          </>
        ) : (
          <div style={{position:"relative"}}>
            <button onClick={()=>setMenuOpen(!menuOpen)} style={{display:"flex",alignItems:"center",gap:8,background:"none",border:"1.5px solid #EADCC8",borderRadius:999,padding:"6px 14px",cursor:"pointer"}}>
              {user.user_metadata?.avatar_url&&<img src={user.user_metadata.avatar_url} alt="" style={{width:28,height:28,borderRadius:"50%",objectFit:"cover"}}/>}
              <span style={{fontSize:13,fontWeight:600,color:"#111",fontFamily:"var(--font-inter),sans-serif"}}>{user.user_metadata?.full_name?.split(" ")[0]||"Mon compte"}</span>
              <span style={{fontSize:10,color:"#888"}}>▼</span>
            </button>
            {menuOpen&&(
              <div style={{position:"absolute",right:0,top:"calc(100% + 8px)",background:"#fff",borderRadius:20,boxShadow:"0 8px 40px rgba(0,0,0,0.12)",border:"1px solid #EADCC8",minWidth:210,overflow:"hidden",zIndex:300}}>
                <a href="/dashboard/tourist" style={{display:"block",padding:"13px 18px",fontSize:14,color:"#111",borderBottom:"1px solid #F6F1E8",fontWeight:600,fontFamily:"var(--font-inter),sans-serif"}}>🧳 Mes réservations</a>
                {guideId&&<a href={"/dashboard/guide?id="+guideId} style={{display:"block",padding:"13px 18px",fontSize:14,color:"#111",borderBottom:"1px solid #F6F1E8",fontWeight:600,fontFamily:"var(--font-inter),sans-serif"}}>📊 Mon dashboard</a>}
                {role==="ADMIN"&&<a href="/dashboard/admin" style={{display:"block",padding:"13px 18px",fontSize:14,color:"#111",borderBottom:"1px solid #F6F1E8",fontFamily:"var(--font-inter),sans-serif"}}>⚙️ Admin</a>}
                <button onClick={logout} style={{display:"block",width:"100%",padding:"13px 18px",fontSize:14,color:"#ef4444",border:"none",background:"none",cursor:"pointer",textAlign:"left",fontFamily:"var(--font-inter),sans-serif"}}>🚪 Déconnexion</button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
