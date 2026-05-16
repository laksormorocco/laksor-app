"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

const B="#123EAB",G="#22c55e";
const CITIES = ["Marrakech","Fes","Casablanca","Rabat","Chefchaouen","Essaouira","Agadir","Tanger","Meknes","Ouarzazate"];

export default function ProfileEditor({ guide, guideId, onSaved }: { guide: any; guideId: string; onSaved: () => void }) {
  const [form, setForm] = useState({
    displayName: guide.displayName || "",
    city: guide.city || "",
    phone: guide.phone || "",
    bio: guide.bio || "",
    halfDayPrice: guide.halfDayPrice || 600,
    fullDayPrice: guide.fullDayPrice || 1100,
    languages: (guide.languages || []).join(", "),
    specialties: (guide.specialties || []).join(", "),
    coveredCities: (guide.coveredCities || []).join(", "),
    certifications: (guide.certifications || []).join(", "),
    yearsExp: guide.yearsExp || 0,
    avatar: guide.avatar || "",
    gallery: (guide.gallery || []).join("|"),
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);

  function update(key: string, val: any) { setForm(f => ({...f, [key]: val})); }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const filename = guideId + "-" + Date.now() + "." + file.name.split(".").pop();
    const { error } = await supabase.storage.from("avatars").upload(filename, file, { upsert: true });
    if (!error) {
      const { data } = supabase.storage.from("avatars").getPublicUrl(filename);
      update("avatar", data.publicUrl);
    }
    setUploading(false);
  }

  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    const urls: string[] = [];
    for (const file of files) {
      const filename = guideId + "-gal-" + Date.now() + "." + file.name.split(".").pop();
      const { error } = await supabase.storage.from("avatars").upload(filename, file, { upsert: true });
      if (!error) {
        const { data } = supabase.storage.from("avatars").getPublicUrl(filename);
        urls.push(data.publicUrl);
      }
    }
    const existing = form.gallery ? form.gallery.split("|").filter(Boolean) : [];
    update("gallery", [...existing, ...urls].join("|"));
    setUploading(false);
  }

  async function handleSave() {
    setSaving(true);
    const res = await fetch("/api/guide/profile", {
      method: "PATCH",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        guideId,
        displayName: form.displayName,
        city: form.city,
        phone: form.phone,
        bio: form.bio,
        halfDayPrice: parseFloat(String(form.halfDayPrice)),
        fullDayPrice: parseFloat(String(form.fullDayPrice)),
        languages: form.languages.split(",").map((l:string)=>l.trim()).filter(Boolean),
        specialties: form.specialties.split(",").map((s:string)=>s.trim()).filter(Boolean),
        coveredCities: form.coveredCities.split(",").map((c:string)=>c.trim()).filter(Boolean),
        certifications: form.certifications.split(",").map((c:string)=>c.trim()).filter(Boolean),
        yearsExp: parseInt(String(form.yearsExp)) || 0,
        avatar: form.avatar,
        gallery: form.gallery.split("|").map((u:string)=>u.trim()).filter(Boolean),
      })
    });
    if (res.ok) { setSaved(true); onSaved(); setTimeout(()=>setSaved(false), 3000); }
    setSaving(false);
  }

  const inp = { width:"100%", border:"1.5px solid #E2E8F0", borderRadius:12, padding:"12px 14px", fontSize:14, color:"#0F172A", background:"#F8FAFC", fontFamily:"inherit", outline:"none" } as any;
  const lbl = { fontSize:13, fontWeight:600 as const, color:"#374151", display:"block" as const, marginBottom:6 };
  const sec = { fontSize:11, fontWeight:700 as const, color:B, letterSpacing:"1.5px", textTransform:"uppercase" as const, marginBottom:16 };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16, fontFamily:"Inter, -apple-system, sans-serif" }}>
      <div style={{ background:"#fff", borderRadius:16, padding:20, border:"1px solid #EBEBEB" }}>
        <div style={sec}>Photo de profil</div>
        <div style={{ textAlign:"center", marginBottom:16 }}>
          <div style={{ width:90, height:90, borderRadius:"50%", overflow:"hidden", background:"#E2E8F0", margin:"0 auto 12px" }}>
            {form.avatar && <img src={form.avatar} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>}
          </div>
          <label style={{ display:"inline-flex", alignItems:"center", gap:8, background:B, color:"#fff", borderRadius:20, padding:"10px 20px", fontSize:13, fontWeight:700, cursor:"pointer" }}>
            {uploading ? "Upload..." : "Changer la photo"}
            <input type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display:"none" }} disabled={uploading}/>
          </label>
        </div>
        <label style={lbl}>Ou URL directe</label>
        <input value={form.avatar} onChange={e=>update("avatar",e.target.value)} placeholder="https://..." style={inp}/>
      </div>

      <div style={{ background:"#fff", borderRadius:16, padding:20, border:"1px solid #EBEBEB" }}>
        <div style={sec}>Informations personnelles</div>
        <div style={{ marginBottom:14 }}><label style={lbl}>Nom complet</label><input value={form.displayName} onChange={e=>update("displayName",e.target.value)} style={inp}/></div>
        <div style={{ marginBottom:14 }}><label style={lbl}>WhatsApp</label><input value={form.phone} onChange={e=>update("phone",e.target.value)} placeholder="+212 6XX XXX XXX" style={inp}/></div>
        <div style={{ marginBottom:14 }}>
          <label style={lbl}>Ville principale</label>
          <select value={form.city} onChange={e=>update("city",e.target.value)} style={inp}>
            <option value="">Choisir</option>
            {CITIES.map(c=><option key={c}>{c}</option>)}
          </select>
        </div>
        <div style={{ marginBottom:14 }}><label style={lbl}>Villes couvertes (virgule)</label><input value={form.coveredCities} onChange={e=>update("coveredCities",e.target.value)} placeholder="Marrakech, Essaouira" style={inp}/></div>
        <div><label style={lbl}>Années d experience</label><input type="number" value={form.yearsExp} onChange={e=>update("yearsExp",e.target.value)} min={0} style={inp}/></div>
      </div>

      <div style={{ background:"#fff", borderRadius:16, padding:20, border:"1px solid #EBEBEB" }}>
        <div style={sec}>Expertise</div>
        <div style={{ marginBottom:14 }}><label style={lbl}>Bio</label><textarea value={form.bio} onChange={e=>update("bio",e.target.value)} rows={4} style={{...inp,resize:"vertical" as const}}/></div>
        <div style={{ marginBottom:14 }}><label style={lbl}>Langues (virgule)</label><input value={form.languages} onChange={e=>update("languages",e.target.value)} placeholder="Français, Anglais" style={inp}/></div>
        <div style={{ marginBottom:14 }}><label style={lbl}>Specialites (virgule)</label><input value={form.specialties} onChange={e=>update("specialties",e.target.value)} placeholder="Histoire, Gastronomie" style={inp}/></div>
        <div><label style={lbl}>Certifications (virgule)</label><input value={form.certifications} onChange={e=>update("certifications",e.target.value)} placeholder="Guide agree ministere" style={inp}/></div>
      </div>

      <div style={{ background:"#fff", borderRadius:16, padding:20, border:"1px solid #EBEBEB" }}>
        <div style={sec}>Tarifs</div>
        <div style={{ background:"#EFF6FF", borderRadius:10, padding:"10px 14px", marginBottom:14, fontSize:12, color:B }}>Conseilles : 600 MAD / 4h · 1100 MAD / 8h</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <div><label style={lbl}>Demi-journee (MAD)</label><input type="number" value={form.halfDayPrice} onChange={e=>update("halfDayPrice",e.target.value)} style={{...inp,fontWeight:700,fontSize:16}}/></div>
          <div><label style={lbl}>Journee (MAD)</label><input type="number" value={form.fullDayPrice} onChange={e=>update("fullDayPrice",e.target.value)} style={{...inp,fontWeight:700,fontSize:16}}/></div>
        </div>
      </div>

      <div style={{ background:"#fff", borderRadius:16, padding:20, border:"1px solid #EBEBEB" }}>
        <div style={sec}>Galerie photos</div>
        <label style={{ display:"inline-flex", alignItems:"center", gap:8, background:B, color:"#fff", borderRadius:20, padding:"10px 20px", fontSize:13, fontWeight:700, cursor:"pointer", marginBottom:14 }}>
          {uploading ? "Upload..." : "Ajouter photos"}
          <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} style={{ display:"none" }} disabled={uploading}/>
        </label>
        <label style={lbl}>Ou URLs (separees par |)</label>
        <input value={form.gallery} onChange={e=>update("gallery",e.target.value)} placeholder="https://photo1.jpg|https://photo2.jpg" style={inp}/>
        {form.gallery && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:12 }}>
            {form.gallery.split("|").filter(Boolean).slice(0,4).map((url:string,i:number) => (
              <div key={i} style={{ borderRadius:10, overflow:"hidden", height:80, background:"#E2E8F0" }}>
                <img src={url.trim()} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
              </div>
            ))}
          </div>
        )}
      </div>

      <button onClick={handleSave} disabled={saving} style={{ width:"100%", background:"#0B132B", color:"#fff", border:"none", borderRadius:30, padding:18, fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
        {saving ? "Sauvegarde..." : "Sauvegarder"}
      </button>
      {saved && <div style={{ textAlign:"center", color:G, fontWeight:700 }}>Modifications sauvegardees !</div>}
    </div>
  );
}
