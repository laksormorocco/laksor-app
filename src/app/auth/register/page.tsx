"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function RegisterGuidePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ displayName:"", phone:"", city:"", bio:"", languages:"", specialties:"", halfDayPrice:"500", fullDayPrice:"950" });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      if (session?.user?.user_metadata?.full_name) {
        setForm(f => ({ ...f, displayName: session.user.user_metadata.full_name }));
      }
      setLoading(false);
    });
  }, []);

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: "https://laksor.vercel.app/auth/register" }
    });
  }

  async function handleSubmit() {
    if (!user) return;
    setSubmitting(true);
    const res = await fetch("/api/guide/register", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ ...form, supabaseId: user.id, email: user.email, halfDayPrice: parseFloat(form.halfDayPrice), fullDayPrice: parseFloat(form.fullDayPrice), languages: form.languages.split(",").map((l:string)=>l.trim()).filter(Boolean), specialties: form.specialties.split(",").map((s:string)=>s.trim()).filter(Boolean) })
    });
    if (res.ok) router.push("/auth/register/success");
    else alert("Erreur, reessaie.");
    setSubmitting(false);
  }

  const inp = { width:"100%", border:"1.5px solid #E2E8F0", borderRadius:12, padding:"12px 14px", fontSize:14, color:"#0F172A", background:"#F8FAFC", fontFamily:"inherit", outline:"none" } as any;
  const lbl = { fontSize:13, fontWeight:600 as const, color:"#374151", display:"block" as const, marginBottom:6 };

  if (loading) return <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#F7F7F7"}}><div style={{fontSize:32}}>⏳</div></div>;

  return (
    <div style={{ background: "#F7F7F7", minHeight: "100vh", fontFamily: "Inter, -apple-system, sans-serif", paddingBottom: 40 }}>

      {/* Navbar */}
      <nav style={{ background: "linear-gradient(135deg, #123EAB, #1a4fd6)", padding: "0 16px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 6, color: "#fff", textDecoration: "none" }}>
          <span style={{ fontSize: 18 }}>←</span>
          <span style={{ fontWeight: 500, fontSize: 14 }}>Retour</span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img src="https://igzqwsxbdfzskwqnvvth.supabase.co/storage/v1/object/public/avatars/logo.png" alt="Laksor" style={{ height: 36, width: "auto" }}/>
        </div>
        <div style={{ width: 60 }}/>
      </nav>

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #123EAB, #1a4fd6)", padding: "24px 16px 32px", textAlign: "center" }}>
        <div style={{ width: 64, height: 64, background: "rgba(255,255,255,0.15)", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 32 }}>🧭</div>
        <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Devenir Guide Laksor</h1>
        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, lineHeight: 1.5 }}>Rejoignez notre réseau de guides certifiés<br/>et développez votre activité</p>
      </div>

      {/* Progress */}
      <div style={{ background: "#fff", padding: "16px", borderBottom: "1px solid #EBEBEB" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          {[["1", "Connexion", true], ["2", "Profil", !!user], ["3", "Validation", false]].map(([num, label, done], i) => (
            <div key={num as string} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: done ? "#123EAB" : "#E2E8F0", color: done ? "#fff" : "#94A3B8", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{num as string}</div>
                <span style={{ fontSize: 10, color: done ? "#123EAB" : "#94A3B8", fontWeight: 600 }}>{label as string}</span>
              </div>
              {i < 2 && <div style={{ width: 40, height: 2, background: i === 0 && user ? "#123EAB" : "#E2E8F0", marginBottom: 14 }}/>}
            </div>
          ))}
        </div>
      </div>

      {/* Google Auth Banner */}
      {!user ? (
        <div style={{ padding: "20px 16px" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 24, textAlign: "center", border: "1px solid #EBEBEB" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔐</div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>Connectez-vous d abord</h2>
            <p style={{ color: "#718096", fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>Utilisez votre compte Google pour créer votre profil guide</p>
            <button onClick={signInWithGoogle} style={{ display: "flex", alignItems: "center", gap: 12, background: "#fff", border: "1.5px solid #E2E8F0", borderRadius: 30, padding: "14px 24px", fontSize: 15, fontWeight: 600, cursor: "pointer", width: "100%", justifyContent: "center", fontFamily: "inherit" }}>
              <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continuer avec Google
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Connected Banner */}
          <div style={{ background: "#F0FDF4", borderBottom: "1px solid #BBF7D0", padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, flexShrink: 0, overflow: "hidden" }}>
              {user.user_metadata?.avatar_url ? <img src={user.user_metadata.avatar_url} style={{ width: "100%", height: "100%", objectFit: "cover" }}/> : user.email?.[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13, color: "#166534" }}>Connecté : {user.user_metadata?.full_name || user.email}</div>
              <div style={{ fontSize: 11, color: "#166534", opacity: 0.8 }}>{user.email}</div>
            </div>
            <div style={{ marginLeft: "auto", background: "#22c55e", color: "#fff", borderRadius: 20, padding: "4px 10px", fontSize: 11, fontWeight: 700 }}>✓ Google</div>
          </div>

          {/* Form */}
          <div style={{ padding: "20px 16px 40px" }}>

            {/* Infos perso */}
            <div style={{ background: "#fff", borderRadius: 16, padding: 20, marginBottom: 16, border: "1px solid #EBEBEB" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#123EAB", letterSpacing: "1.5px", textTransform: "uppercase" as const, marginBottom: 16 }}>Informations personnelles</div>
              <div style={{ marginBottom: 14 }}>
                <label style={lbl}>Nom complet *</label>
                <input value={form.displayName} onChange={e=>setForm({...form,displayName:e.target.value})} placeholder="Mohammed El Fassi" style={inp}/>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={lbl}>WhatsApp *</label>
                <input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="+212 6XX XXX XXX" style={inp}/>
              </div>
              <div>
                <label style={lbl}>Ville principale *</label>
                <select value={form.city} onChange={e=>setForm({...form,city:e.target.value})} style={{...inp,appearance:"none" as const}}>
                  <option value="">Choisir une ville</option>
                  {["Marrakech","Fès","Casablanca","Rabat","Chefchaouen","Essaouira","Agadir","Tanger","Meknès","Ouarzazate"].map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Expérience */}
            <div style={{ background: "#fff", borderRadius: 16, padding: 20, marginBottom: 16, border: "1px solid #EBEBEB" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#123EAB", letterSpacing: "1.5px", textTransform: "uppercase" as const, marginBottom: 16 }}>Expérience & Expertise</div>
              <div style={{ marginBottom: 14 }}>
                <label style={lbl}>Bio *</label>
                <textarea value={form.bio} onChange={e=>setForm({...form,bio:e.target.value})} rows={4} placeholder="Décrivez votre expérience..." style={{...inp,resize:"vertical" as const}}/>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={lbl}>Langues * <span style={{ color: "#94A3B8", fontWeight: 400 }}>(séparées par virgule)</span></label>
                <input value={form.languages} onChange={e=>setForm({...form,languages:e.target.value})} placeholder="Français, Anglais, Arabe" style={inp}/>
              </div>
              <div>
                <label style={lbl}>Spécialités * <span style={{ color: "#94A3B8", fontWeight: 400 }}>(séparées par virgule)</span></label>
                <input value={form.specialties} onChange={e=>setForm({...form,specialties:e.target.value})} placeholder="Histoire, Gastronomie, Architecture" style={inp}/>
              </div>
            </div>

            {/* Tarifs */}
            <div style={{ background: "#fff", borderRadius: 16, padding: 20, marginBottom: 20, border: "1px solid #EBEBEB" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#123EAB", letterSpacing: "1.5px", textTransform: "uppercase" as const, marginBottom: 8 }}>Tarifs</div>
              <div style={{ background: "#EFF6FF", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 12, color: "#123EAB" }}>
                💡 Conseillés : ½ journée 500 MAD · Journée 950 MAD
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={lbl}>½ Journée (MAD)</label>
                  <input type="number" value={form.halfDayPrice} onChange={e=>setForm({...form,halfDayPrice:e.target.value})} style={{...inp,fontWeight:700,fontSize:15}}/>
                </div>
                <div>
                  <label style={lbl}>Journée (MAD)</label>
                  <input type="number" value={form.fullDayPrice} onChange={e=>setForm({...form,fullDayPrice:e.target.value})} style={{...inp,fontWeight:700,fontSize:15}}/>
                </div>
              </div>
            </div>

            <button onClick={handleSubmit} disabled={submitting} style={{ width: "100%", background: "#0B132B", color: "#fff", border: "none", borderRadius: 30, padding: 18, fontSize: 16, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", marginBottom: 12 }}>
              {submitting ? "Envoi en cours..." : "Soumettre ma candidature"}
            </button>
            <p style={{ textAlign: "center", fontSize: 12, color: "#94A3B8", lineHeight: 1.5 }}>
              En soumettant, vous acceptez nos CGU<br/>Validation par notre équipe sous 24h
            </p>
          </div>
        </>
      )}
    </div>
  );
}
