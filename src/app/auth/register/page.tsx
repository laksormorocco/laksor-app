"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  {}
);

const B="#123EAB",Y="#F4C542",S="#F8F5F0";

export default function RegisterGuidePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setLoading(false);
    });
  }, []);

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: "https://laksor.vercel.app/auth/register" }
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    const form = e.currentTarget;
    const data = {
      supabaseId: user.id,
      email: user.email,
      displayName: (form as any).displayName.value,
      city: (form as any).city.value,
      phone: (form as any).phone.value,
      bio: (form as any).bio.value,
      halfDayPrice: parseFloat((form as any).halfDayPrice.value) || 500,
      fullDayPrice: parseFloat((form as any).fullDayPrice.value) || 950,
      languages: (form as any).languages.value.split(",").map((l:string)=>l.trim()).filter(Boolean),
      specialties: (form as any).specialties.value.split(",").map((s:string)=>s.trim()).filter(Boolean),
    };
    try {
      const res = await fetch("/api/guide/register", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const result = await res.json();
        if (result.whatsappUrl) window.open(result.whatsappUrl, "_blank");
        router.push("/auth/register/success");
      }
      else alert("Erreur, reessaie.");
    } catch { alert("Erreur serveur."); }
    setSubmitting(false);
  }

  if (loading) return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:S}}>
      <div style={{fontSize:48}}>⏳</div>
    </div>
  );

  if (!user) return (
    <div style={{minHeight:"100vh",background:S,display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"Georgia,serif"}}>
      <div style={{background:"#fff",borderRadius:24,padding:40,maxWidth:400,width:"100%",textAlign:"center",boxShadow:"0 4px 40px rgba(0,0,0,0.08)"}}>
        <div style={{width:56,height:56,borderRadius:16,background:B,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",color:"#fff",fontSize:28,fontWeight:900}}>L</div>
        <h1 style={{fontSize:22,fontWeight:900,color:B,marginBottom:8}}>Devenir Guide Laksor</h1>
        <p style={{color:"#666",fontSize:14,marginBottom:32}}>Connectez-vous d abord avec Google pour continuer</p>
        <button onClick={signInWithGoogle} style={{display:"flex",alignItems:"center",gap:12,background:"#fff",border:"2px solid #e8e0d6",borderRadius:14,padding:"14px 24px",fontSize:15,fontWeight:600,cursor:"pointer",width:"100%",justifyContent:"center"}}>
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continuer avec Google
        </button>
      </div>
    </div>
  );

  return (
    <div style={{background:S,minHeight:"100vh",padding:"40px 20px",fontFamily:"Georgia,serif"}}>
      <div style={{maxWidth:600,margin:"0 auto"}}>
        <div style={{background:"#dcfce7",borderRadius:14,padding:"12px 16px",marginBottom:24,display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:20}}>✅</span>
          <div>
            <div style={{fontWeight:700,fontSize:14,color:"#166534"}}>Connecte en tant que {user.user_metadata?.full_name}</div>
            <div style={{fontSize:12,color:"#166534"}}>{user.email}</div>
          </div>
        </div>

        <div style={{textAlign:"center",marginBottom:32}}>
          <h1 style={{fontSize:26,fontWeight:900,color:B,marginBottom:8}}>Votre profil guide</h1>
          <p style={{color:"#666",fontSize:15}}>Remplis le formulaire - validation sous 24h</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{background:"#fff",borderRadius:20,padding:24,marginBottom:20}}>
            <div style={{fontSize:13,fontWeight:700,color:B,letterSpacing:1,marginBottom:16}}>INFORMATIONS PERSONNELLES</div>
            <div style={{marginBottom:16}}>
              <label style={{fontSize:13,fontWeight:600,color:"#444",display:"block",marginBottom:6}}>Nom complet *</label>
              <input name="displayName" required defaultValue={user.user_metadata?.full_name} style={{width:"100%",border:"2px solid #e8e0d6",borderRadius:12,padding:"12px 16px",fontSize:15,boxSizing:"border-box"}}/>
            </div>
            <div style={{marginBottom:16}}>
              <label style={{fontSize:13,fontWeight:600,color:"#444",display:"block",marginBottom:6}}>WhatsApp *</label>
              <input name="phone" required placeholder="+212 6XX XXX XXX" style={{width:"100%",border:"2px solid #e8e0d6",borderRadius:12,padding:"12px 16px",fontSize:15,boxSizing:"border-box"}}/>
            </div>
            <div>
              <label style={{fontSize:13,fontWeight:600,color:"#444",display:"block",marginBottom:6}}>Ville principale *</label>
              <select name="city" required style={{width:"100%",border:"2px solid #e8e0d6",borderRadius:12,padding:"12px 16px",fontSize:15,boxSizing:"border-box",background:"#fff"}}>
                <option value="">Choisir une ville</option>
                <option>Marrakech</option><option>Fes</option><option>Casablanca</option>
                <option>Rabat</option><option>Chefchaouen</option><option>Essaouira</option>
                <option>Agadir</option><option>Tanger</option><option>Meknes</option>
                <option>Ouarzazate</option><option>Zagora</option><option>Dakhla</option>
              </select>
            </div>
          </div>

          <div style={{background:"#fff",borderRadius:20,padding:24,marginBottom:20}}>
            <div style={{fontSize:13,fontWeight:700,color:B,letterSpacing:1,marginBottom:16}}>EXPERIENCE</div>
            <div style={{marginBottom:16}}>
              <label style={{fontSize:13,fontWeight:600,color:"#444",display:"block",marginBottom:6}}>Bio *</label>
              <textarea name="bio" required rows={4} placeholder="Parlez de votre experience..." style={{width:"100%",border:"2px solid #e8e0d6",borderRadius:12,padding:"12px 16px",fontSize:15,boxSizing:"border-box",resize:"vertical"}}/>
            </div>
            <div style={{marginBottom:16}}>
              <label style={{fontSize:13,fontWeight:600,color:"#444",display:"block",marginBottom:6}}>Langues * <span style={{color:"#999",fontWeight:400}}>(separees par virgule)</span></label>
              <input name="languages" required placeholder="Francais, Anglais, Arabe" style={{width:"100%",border:"2px solid #e8e0d6",borderRadius:12,padding:"12px 16px",fontSize:15,boxSizing:"border-box"}}/>
            </div>
            <div>
              <label style={{fontSize:13,fontWeight:600,color:"#444",display:"block",marginBottom:6}}>Specialites * <span style={{color:"#999",fontWeight:400}}>(separees par virgule)</span></label>
              <input name="specialties" required placeholder="Histoire, Gastronomie, Architecture" style={{width:"100%",border:"2px solid #e8e0d6",borderRadius:12,padding:"12px 16px",fontSize:15,boxSizing:"border-box"}}/>
            </div>
          </div>

          <div style={{background:"#fff",borderRadius:20,padding:24,marginBottom:20}}>
            <div style={{fontSize:13,fontWeight:700,color:B,letterSpacing:1,marginBottom:8}}>TARIFS</div>
            <div style={{background:"#eef2ff",borderRadius:12,padding:"10px 14px",marginBottom:16,fontSize:12,color:B}}>
              Conseilles : demi-journee 500 MAD · Journee 950 MAD
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div>
                <label style={{fontSize:13,fontWeight:600,color:"#444",display:"block",marginBottom:6}}>Demi-journee (MAD)</label>
                <input name="halfDayPrice" type="number" defaultValue={500} style={{width:"100%",border:"2px solid #e8e0d6",borderRadius:12,padding:"12px 16px",fontSize:15,boxSizing:"border-box"}}/>
              </div>
              <div>
                <label style={{fontSize:13,fontWeight:600,color:"#444",display:"block",marginBottom:6}}>Journee (MAD)</label>
                <input name="fullDayPrice" type="number" defaultValue={950} style={{width:"100%",border:"2px solid #e8e0d6",borderRadius:12,padding:"12px 16px",fontSize:15,boxSizing:"border-box"}}/>
              </div>
            </div>
          </div>

          <button type="submit" disabled={submitting} style={{width:"100%",background:B,color:"#fff",border:"none",borderRadius:14,padding:"18px 0",fontSize:16,fontWeight:800,cursor:"pointer",marginBottom:12}}>
            {submitting ? "Envoi en cours..." : "Soumettre ma candidature"}
          </button>
          <p style={{textAlign:"center",fontSize:12,color:"#999"}}>Validation sous 24h · Vous serez contacte sur WhatsApp</p>
        </form>
      </div>
    </div>
  );
}
