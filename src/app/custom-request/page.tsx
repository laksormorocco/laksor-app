"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

const B="#123EAB",Y="#F4C542",S="#F8F5F0";

export default function CustomRequestPage() {
  const router = useRouter();
  const [guides, setGuides] = useState<any[]>([]);
  const [form, setForm] = useState({ guideId:"", startDate:"", days:1, persons:1, description:"" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { window.location.href = "/auth/login"; return; }
      setUser(session.user);
    });
    fetch("/api/admin/guides?status=APPROVED").then(r=>r.json()).then(d=>setGuides(d.guides||[]));
  }, []);

  async function handleSubmit() {
    if (!form.guideId || !form.startDate || !form.description) return alert("Remplis tous les champs !");
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch("/api/custom-request", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ ...form, supabaseId: session?.user?.id })
    });
    const result = await res.json();
    if (result.whatsappUrl) window.open(result.whatsappUrl, "_blank");
    if (res.ok) setSubmitted(true);
    setLoading(false);
  }

  if (submitted) return (
    <div style={{minHeight:"100vh",background:S,display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"Georgia,serif"}}>
      <div style={{background:"#fff",borderRadius:24,padding:40,maxWidth:400,textAlign:"center",boxShadow:"0 4px 40px rgba(0,0,0,0.08)"}}>
        <div style={{fontSize:64,marginBottom:16}}>🎉</div>
        <h1 style={{fontSize:22,fontWeight:900,color:B,marginBottom:8}}>Demande envoyee !</h1>
        <p style={{color:"#666",fontSize:14,lineHeight:1.6,marginBottom:24}}>Le guide va examiner votre demande et vous proposer un prix sous 24h.</p>
        <button onClick={()=>router.push("/")} style={{background:B,color:"#fff",border:"none",borderRadius:14,padding:"14px 28px",fontSize:14,fontWeight:700,cursor:"pointer"}}>Retour accueil</button>
      </div>
    </div>
  );

  const inp = {width:"100%",border:"2px solid #e8e0d6",borderRadius:12,padding:"12px 16px",fontSize:15,boxSizing:"border-box" as const};
  const lbl = {fontSize:13,fontWeight:600 as const,color:"#444",display:"block" as const,marginBottom:6};

  return (
    <div style={{background:S,minHeight:"100vh",padding:"40px 20px",fontFamily:"Georgia,serif"}}>
      <div style={{maxWidth:600,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{fontSize:48,marginBottom:12}}>🎯</div>
          <h1 style={{fontSize:26,fontWeight:900,color:B,marginBottom:8}}>Demande sur mesure</h1>
          <p style={{color:"#666",fontSize:15}}>Decrivez votre voyage ideal — le guide vous propose un prix personnalise</p>
        </div>

        <div style={{background:"#fff",borderRadius:20,padding:24,marginBottom:20}}>
          <div style={{fontSize:13,fontWeight:700,color:B,letterSpacing:1,marginBottom:16}}>CHOISIR UN GUIDE</div>
          <select value={form.guideId} onChange={e=>setForm({...form,guideId:e.target.value})} style={{...inp,background:"#fff"}}>
            <option value="">Selectionner un guide</option>
            {guides.map(g=><option key={g.id} value={g.id}>{g.displayName} — {g.city}</option>)}
          </select>
        </div>

        <div style={{background:"#fff",borderRadius:20,padding:24,marginBottom:20}}>
          <div style={{fontSize:13,fontWeight:700,color:B,letterSpacing:1,marginBottom:16}}>DETAILS DU VOYAGE</div>
          <div style={{marginBottom:16}}>
            <label style={lbl}>Date de debut *</label>
            <input type="date" value={form.startDate} min={new Date().toISOString().split("T")[0]} onChange={e=>setForm({...form,startDate:e.target.value})} style={inp}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
            <div>
              <label style={lbl}>Nombre de jours</label>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <button onClick={()=>setForm({...form,days:Math.max(1,form.days-1)})} style={{width:36,height:36,borderRadius:10,border:"2px solid #e8e0d6",background:"#fff",fontSize:18,cursor:"pointer",fontWeight:700}}>-</button>
                <span style={{fontWeight:900,fontSize:20,color:B,minWidth:24,textAlign:"center"}}>{form.days}</span>
                <button onClick={()=>setForm({...form,days:form.days+1})} style={{width:36,height:36,borderRadius:10,border:"2px solid #e8e0d6",background:"#fff",fontSize:18,cursor:"pointer",fontWeight:700}}>+</button>
              </div>
            </div>
            <div>
              <label style={lbl}>Personnes</label>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <button onClick={()=>setForm({...form,persons:Math.max(1,form.persons-1)})} style={{width:36,height:36,borderRadius:10,border:"2px solid #e8e0d6",background:"#fff",fontSize:18,cursor:"pointer",fontWeight:700}}>-</button>
                <span style={{fontWeight:900,fontSize:20,color:B,minWidth:24,textAlign:"center"}}>{form.persons}</span>
                <button onClick={()=>setForm({...form,persons:form.persons+1})} style={{width:36,height:36,borderRadius:10,border:"2px solid #e8e0d6",background:"#fff",fontSize:18,cursor:"pointer",fontWeight:700}}>+</button>
              </div>
            </div>
          </div>
          <div>
            <label style={lbl}>Description de votre voyage *</label>
            <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} rows={5} placeholder="Decrivez ce que vous souhaitez decouvrir, vos interets, vos preferences..." style={{...inp,resize:"vertical"}}/>
          </div>
        </div>

        <div style={{background:"#eef2ff",borderRadius:14,padding:"14px 20px",marginBottom:20,fontSize:13,color:B}}>
          💡 Le guide vous repondra avec un prix personnalise sous 24h. Vous pourrez accepter ou negocier.
        </div>

        <button onClick={handleSubmit} disabled={loading} style={{width:"100%",background:B,color:"#fff",border:"none",borderRadius:14,padding:"18px 0",fontSize:16,fontWeight:800,cursor:"pointer"}}>
          {loading ? "Envoi en cours..." : "Envoyer ma demande"}
        </button>
      </div>
    </div>
  );
}
