"use client";
import { useState } from "react";
const B="#123EAB",Y="#F4C542",G="#22c55e",S="#F8F5F0";
const CITIES = ["Marrakech","Fes","Casablanca","Rabat","Chefchaouen","Essaouira","Agadir","Tanger","Meknes","Ouarzazate"];

export default function ProfileEditor({ guide, guideId, onSaved }: { guide: any; guideId: string; onSaved: () => void }) {
  const [form, setForm] = useState({
    displayName: guide.displayName || "",
    city: guide.city || "",
    phone: guide.phone || "",
    bio: guide.bio || "",
    halfDayPrice: guide.halfDayPrice || 500,
    fullDayPrice: guide.fullDayPrice || 950,
    languages: (guide.languages || []).join(", "),
    specialties: (guide.specialties || []).join(", "),
    avatar: guide.avatar || "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function update(key: string, val: string) { setForm(f => ({...f, [key]: val})); }

  async function handleSave() {
    setSaving(true);
    const res = await fetch("/api/guide/profile", {
      method: "PATCH",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        guideId,
        ...form,
        halfDayPrice: parseFloat(String(form.halfDayPrice)),
        fullDayPrice: parseFloat(String(form.fullDayPrice)),
        languages: form.languages.split(",").map((l:string)=>l.trim()).filter(Boolean),
        specialties: form.specialties.split(",").map((s:string)=>s.trim()).filter(Boolean),
      })
    });
    if (res.ok) { setSaved(true); onSaved(); setTimeout(()=>setSaved(false), 3000); }
    setSaving(false);
  }

  const inp = { width:"100%", border:"2px solid #e8e0d6", borderRadius:12, padding:"12px 16px", fontSize:15, boxSizing:"border-box" as const };
  const lbl = { fontSize:13, fontWeight:600 as const, color:"#444", display:"block" as const, marginBottom:6 };

  return (
    <div style={{background:"#fff",borderRadius:20,padding:24}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <h2 style={{fontSize:16,fontWeight:800,color:B,margin:0}}>Mon Profil</h2>
        {saved && <span style={{color:G,fontSize:13,fontWeight:700}}>✓ Sauvegarde !</span>}
      </div>

      <div style={{marginBottom:16}}>
        <label style={lbl}>Photo (URL)</label>
        <input value={form.avatar} onChange={e=>update("avatar",e.target.value)} placeholder="https://..." style={inp}/>
        {form.avatar && <img src={form.avatar} alt="" style={{width:80,height:80,borderRadius:"50%",objectFit:"cover",marginTop:8}}/>}
      </div>

      <div style={{marginBottom:16}}>
        <label style={lbl}>Nom complet</label>
        <input value={form.displayName} onChange={e=>update("displayName",e.target.value)} style={inp}/>
      </div>

      <div style={{marginBottom:16}}>
        <label style={lbl}>WhatsApp</label>
        <input value={form.phone} onChange={e=>update("phone",e.target.value)} placeholder="+212 6XX XXX XXX" style={inp}/>
      </div>

      <div style={{marginBottom:16}}>
        <label style={lbl}>Ville</label>
        <select value={form.city} onChange={e=>update("city",e.target.value)} style={inp}>
          <option value="">Choisir</option>
          {CITIES.map(c=><option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div style={{marginBottom:16}}>
        <label style={lbl}>Bio</label>
        <textarea value={form.bio} onChange={e=>update("bio",e.target.value)} rows={4} style={{...inp,resize:"vertical"}}/>
      </div>

      <div style={{marginBottom:16}}>
        <label style={lbl}>Langues (separees par virgule)</label>
        <input value={form.languages} onChange={e=>update("languages",e.target.value)} placeholder="Francais, Anglais" style={inp}/>
      </div>

      <div style={{marginBottom:16}}>
        <label style={lbl}>Specialites (separees par virgule)</label>
        <input value={form.specialties} onChange={e=>update("specialties",e.target.value)} placeholder="Histoire, Gastronomie" style={inp}/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:24}}>
        <div>
          <label style={lbl}>Demi-journee (MAD)</label>
          <input type="number" value={form.halfDayPrice} onChange={e=>update("halfDayPrice",e.target.value)} style={inp}/>
        </div>
        <div>
          <label style={lbl}>Journee (MAD)</label>
          <input type="number" value={form.fullDayPrice} onChange={e=>update("fullDayPrice",e.target.value)} style={inp}/>
        </div>
      </div>

      <button onClick={handleSave} disabled={saving} style={{width:"100%",background:B,color:"#fff",border:"none",borderRadius:14,padding:"16px 0",fontSize:15,fontWeight:800,cursor:"pointer"}}>
        {saving ? "Sauvegarde..." : "Sauvegarder les modifications"}
      </button>
    </div>
  );
}
