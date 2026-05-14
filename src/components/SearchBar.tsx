"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const B="#123EAB",Y="#F4C542";

const CITIES = ["","Marrakech","Fes","Casablanca","Rabat","Chefchaouen","Essaouira","Agadir","Tanger","Meknes","Ouarzazate"];
const TYPES = ["","Histoire","Culinaire","Shopping","Monuments","Aventure","Desert","Artisanat","Photographie"];
const LANGS = ["","Francais","Anglais","Arabe","Espagnol","Russe","Allemand","Hebreu"];

export default function SearchBar() {
  const router = useRouter();
  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const [lang, setLang] = useState("");

  function handleSearch() {
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (type) params.set("type", type);
    if (lang) params.set("lang", lang);
    router.push("/search?" + params.toString());
  }

  const sel = { width:"100%", border:"none", background:"transparent", fontSize:14, color:"#333", outline:"none", padding:"4px 0" };

  return (
    <div style={{ background:"#fff", borderRadius:20, padding:"16px 20px", boxShadow:"0 4px 24px rgba(0,0,0,0.1)", display:"flex", flexDirection:"column", gap:12 }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
        <div style={{ borderRight:"1px solid #e8e0d6", paddingRight:12 }}>
          <div style={{ fontSize:11, fontWeight:700, color:"#999", marginBottom:4 }}>VILLE</div>
          <select value={city} onChange={e=>setCity(e.target.value)} style={sel as any}>
            <option value="">Toutes les villes</option>
            {CITIES.filter(Boolean).map(c=><option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div style={{ borderRight:"1px solid #e8e0d6", paddingRight:12 }}>
          <div style={{ fontSize:11, fontWeight:700, color:"#999", marginBottom:4 }}>TYPE</div>
          <select value={type} onChange={e=>setType(e.target.value)} style={sel as any}>
            <option value="">Tous les types</option>
            {TYPES.filter(Boolean).map(t=><option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <div style={{ fontSize:11, fontWeight:700, color:"#999", marginBottom:4 }}>LANGUE</div>
          <select value={lang} onChange={e=>setLang(e.target.value)} style={sel as any}>
            <option value="">Toutes</option>
            {LANGS.filter(Boolean).map(l=><option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </div>
      <button onClick={handleSearch} style={{ background:Y, color:"#1a1a1a", border:"none", borderRadius:12, padding:"14px 0", fontSize:15, fontWeight:700, cursor:"pointer", width:"100%" }}>
        Rechercher un guide
      </button>
    </div>
  );
}
