"use client";
import { useState } from "react";

export default function HomeHero() {
  const [tab,      setTab]      = useState<"guides"|"transport">("guides");
  const [tType,    setTType]    = useState<"airport"|"private">("airport");
  const [tVehicle, setTVehicle] = useState("sedan");
  const [tPax,     setTPax]     = useState(2);
  const [tFlight,  setTFlight]  = useState("");
  const [tHotel,   setTHotel]   = useState("");
  const [tFrom,    setTFrom]    = useState("");
  const [tTo,      setTTo]      = useState("");

  const prices: Record<string,number> = { sedan:14, minivan:20, "4x4":28 };

  function buildUrl() {
    const p = new URLSearchParams({ type:tType, vehicle:tVehicle, pax:String(tPax), flight:tFlight, hotel:tHotel, from:tFrom, to:tTo });
    return `/transport?${p}`;
  }

  return (
    <div style={{ position:"relative", height:"clamp(520px,72vh,680px)", overflow:"hidden" }}>
      <img src="https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=1600&q=80" alt="Marrakech" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom,rgba(0,0,0,0.1) 0%,rgba(0,0,0,0.5) 50%,rgba(17,17,17,0.92) 100%)" }} />

      {/* NAVBAR */}
      <nav style={{ position:"absolute", top:0, left:0, right:0, zIndex:10, padding:"14px clamp(16px,4vw,40px)", display:"flex", justifyContent:"space-between", alignItems:"center", background:"rgba(255,255,255,0.08)", backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)" }}>
        <a href="/" style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none" }}>
          <div style={{ width:38, height:38, borderRadius:10, background:"var(--bronze-g)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ color:"#fff", fontWeight:900, fontSize:20, fontFamily:"var(--font-serif)" }}>L</span>
          </div>
          <div>
            <div style={{ fontFamily:"var(--font-serif)", fontWeight:700, fontSize:18, color:"#fff" }}>Laksor</div>
            <div style={{ fontSize:8, color:"rgba(255,255,255,0.45)", letterSpacing:1.5, textTransform:"uppercase" }}>Morocco</div>
          </div>
        </a>
        <div style={{ display:"flex", gap:3 }}>
          {(["EN","FR","HE"] as const).map((l,i) => (
            <span key={l} style={{ background:i===0?"rgba(255,255,255,0.22)":"rgba(255,255,255,0.08)", color:i===0?"#fff":"rgba(255,255,255,0.45)", fontSize:10, padding:"4px 9px", borderRadius:"999px", cursor:"pointer", fontWeight:i===0?700:400 }}>{l}</span>
          ))}
        </div>
        <div style={{ display:"flex", gap:6 }}>
          <a href="/auth/login"    style={{ fontSize:12, color:"rgba(255,255,255,0.7)", padding:"8px 12px", fontWeight:600, textDecoration:"none" }}>Login</a>
          <a href="/auth/register" style={{ background:"var(--bronze-g)", color:"#fff", borderRadius:"999px", padding:"9px 18px", fontSize:12, fontWeight:700, textDecoration:"none" }}>Join Free</a>
        </div>
      </nav>

      {/* CONTENT */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"0 clamp(16px,5vw,40px) 28px" }}>
        <div style={{ display:"inline-block", background:"rgba(184,138,68,0.2)", border:"1px solid rgba(184,138,68,0.45)", borderRadius:"999px", padding:"5px 14px", fontSize:10, fontWeight:700, color:"var(--bronze)", letterSpacing:1.5, textTransform:"uppercase", marginBottom:12 }}>
          ✦ Certified Local Experts
        </div>
        <h1 style={{ fontFamily:"var(--font-serif)", fontSize:"clamp(26px,5vw,44px)", fontWeight:700, color:"#fff", lineHeight:1.12, marginBottom:8 }}>
          Explore Morocco<br /><em style={{ color:"rgba(255,255,255,0.8)" }}>your way</em>
        </h1>
        <p style={{ fontSize:13, color:"rgba(255,255,255,0.55)", marginBottom:18, lineHeight:1.65, maxWidth:400 }}>
          Passionate guides · Comfortable transfers · Unforgettable memories
        </p>

        {/* TOGGLE */}
        <div style={{ display:"inline-flex", background:"rgba(255,255,255,0.1)", backdropFilter:"blur(16px)", border:"1px solid rgba(255,255,255,0.18)", borderRadius:"999px", padding:4, marginBottom:14, gap:4 }}>
          {(["guides","transport"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding:"8px 20px", borderRadius:"999px", fontSize:12, fontWeight:700, border:"none", fontFamily:"var(--font-body)", cursor:"pointer", transition:"all 0.2s", background:tab===t?"rgba(255,255,255,0.9)":"transparent", color:tab===t?"var(--charcoal)":"rgba(255,255,255,0.65)" }}>
              {t==="guides" ? "🧭 Guides" : "🚗 Transport"}
            </button>
          ))}
        </div>

        {/* GUIDES SEARCH */}
        {tab==="guides" && (
          <div style={{ background:"rgba(255,255,255,0.1)", backdropFilter:"blur(20px)", border:"1px solid rgba(255,255,255,0.18)", borderRadius:20, padding:12, maxWidth:480 }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:8 }}>
              <a href="/search" style={{ background:"rgba(255,255,255,0.12)", borderRadius:14, padding:"10px 12px", textDecoration:"none" }}>
                <div style={{ fontSize:9, color:"rgba(255,255,255,0.45)", marginBottom:2 }}>📍 Destination</div>
                <div style={{ fontSize:13, fontWeight:600, color:"#fff" }}>Marrakech</div>
              </a>
              <a href="/search" style={{ background:"rgba(255,255,255,0.12)", borderRadius:14, padding:"10px 12px", textDecoration:"none" }}>
                <div style={{ fontSize:9, color:"rgba(255,255,255,0.45)", marginBottom:2 }}>📅 Date</div>
                <div style={{ fontSize:13, fontWeight:600, color:"rgba(255,255,255,0.4)" }}>Choose a date</div>
              </a>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:8 }}>
              <a href="/search" style={{ background:"rgba(255,255,255,0.12)", borderRadius:14, padding:"10px 12px", textDecoration:"none" }}>
                <div style={{ fontSize:9, color:"rgba(255,255,255,0.45)", marginBottom:2 }}>🌍 Language</div>
                <div style={{ fontSize:13, fontWeight:600, color:"rgba(255,255,255,0.4)" }}>Any language</div>
              </a>
              <a href="/search" style={{ background:"var(--bronze-g)", color:"#fff", borderRadius:14, padding:"10px 20px", fontSize:13, fontWeight:700, textDecoration:"none", display:"flex", alignItems:"center" }}>Search →</a>
            </div>
          </div>
        )}

        {/* TRANSPORT FILTERS */}
        {tab==="transport" && (
          <div style={{ background:"rgba(255,255,255,0.1)", backdropFilter:"blur(20px)", border:"1px solid rgba(255,255,255,0.18)", borderRadius:20, padding:14, maxWidth:480 }}>

            {/* Type — Aéroport / Privé uniquement */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:12 }}>
              {[
                { id:"airport" as const, icon:"✈️", label:"Transfert Aéroport" },
                { id:"private" as const, icon:"👤", label:"Chauffeur Privé"    },
              ].map(t => (
                <button key={t.id} onClick={() => setTType(t.id)}
                  style={{ padding:"10px 8px", borderRadius:14, border:"none", cursor:"pointer", fontFamily:"var(--font-body)", textAlign:"center", transition:"all 0.2s", background:tType===t.id?"rgba(255,255,255,0.9)":"rgba(255,255,255,0.08)", color:tType===t.id?"var(--charcoal)":"rgba(255,255,255,0.7)" }}
                >
                  <div style={{ fontSize:20, marginBottom:4 }}>{t.icon}</div>
                  <div style={{ fontSize:11, fontWeight:700 }}>{t.label}</div>
                </button>
              ))}
            </div>

            {/* Véhicule + Passagers */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:12 }}>
              <div style={{ background:"rgba(255,255,255,0.12)", borderRadius:14, padding:"10px 12px" }}>
                <div style={{ fontSize:9, color:"rgba(255,255,255,0.45)", fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>Véhicule</div>
                <div style={{ display:"flex", gap:5, marginBottom:6 }}>
                  {[{id:"sedan",icon:"🚗"},{id:"minivan",icon:"🚐"},{id:"4x4",icon:"🚙"}].map(v => (
                    <button key={v.id} onClick={() => setTVehicle(v.id)}
                      style={{ flex:1, padding:"5px 4px", borderRadius:8, border:"none", cursor:"pointer", fontSize:14, background:tVehicle===v.id?"rgba(255,255,255,0.9)":"rgba(255,255,255,0.1)", transition:"all 0.15s" }}
                    >{v.icon}</button>
                  ))}
                </div>
                <div style={{ fontSize:10, color:"rgba(255,255,255,0.6)", fontWeight:700 }}>
                  {tVehicle==="sedan"?"Sedan — €14":tVehicle==="minivan"?"Minivan — €20":"4×4 — €28"}
                </div>
              </div>

              <div style={{ background:"rgba(255,255,255,0.12)", borderRadius:14, padding:"10px 12px" }}>
                <div style={{ fontSize:9, color:"rgba(255,255,255,0.45)", fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>Passagers</div>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <button onClick={() => setTPax(Math.max(1,tPax-1))} style={{ width:28, height:28, borderRadius:"50%", background:"rgba(255,255,255,0.15)", border:"none", color:"#fff", fontSize:16, cursor:"pointer" }}>−</button>
                  <span style={{ fontFamily:"var(--font-serif)", fontSize:22, fontWeight:700, color:"#fff" }}>{tPax}</span>
                  <button onClick={() => setTPax(Math.min(7,tPax+1))} style={{ width:28, height:28, borderRadius:"50%", background:"rgba(255,255,255,0.15)", border:"none", color:"#fff", fontSize:16, cursor:"pointer" }}>+</button>
                </div>
                <div style={{ fontSize:9, color:"rgba(255,255,255,0.4)", marginTop:4, textAlign:"center" }}>personnes</div>
              </div>
            </div>

            {/* AÉROPORT → hôtel + numéro de vol */}
            {tType==="airport" && (
              <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:12 }}>
                <input
                  value={tHotel} onChange={e => setTHotel(e.target.value)}
                  placeholder="🏨 Nom de votre hôtel / riad"
                  style={{ background:"rgba(255,255,255,0.12)", border:"none", borderRadius:14, padding:"10px 14px", color:"#fff", fontFamily:"var(--font-body)", fontSize:12, outline:"none" }}
                />
                <input
                  value={tFlight} onChange={e => setTFlight(e.target.value)}
                  placeholder="✈️ Numéro de vol (ex: AT703)"
                  style={{ background:"rgba(255,255,255,0.12)", border:"none", borderRadius:14, padding:"10px 14px", color:"#fff", fontFamily:"var(--font-body)", fontSize:12, outline:"none", letterSpacing:1 }}
                />
              </div>
            )}

            {/* PRIVÉ → départ / arrivée */}
            {tType==="private" && (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:12 }}>
                <input
                  value={tFrom} onChange={e => setTFrom(e.target.value)}
                  placeholder="📍 Ville de prise en charge"
                  style={{ background:"rgba(255,255,255,0.12)", border:"none", borderRadius:14, padding:"10px 12px", color:"#fff", fontFamily:"var(--font-body)", fontSize:12, outline:"none" }}
                />
                <input
                  value={tTo} onChange={e => setTTo(e.target.value)}
                />
              </div>
            )}

            {/* PRIX + CTA */}
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:9, color:"rgba(255,255,255,0.4)", marginBottom:2 }}>Tarif fixe</div>
                <div style={{ fontFamily:"var(--font-serif)", fontSize:22, fontWeight:700, color:"#fff" }}>€{prices[tVehicle]}</div>
              </div>
              <a href={buildUrl()} style={{ flex:2, background:"var(--bronze-g)", color:"#fff", borderRadius:14, padding:"12px 16px", fontSize:13, fontWeight:700, textDecoration:"none", textAlign:"center", boxShadow:"0 4px 16px rgba(184,138,68,0.4)" }}>
                {tType==="airport" ? "Réserver le transfert →" : "Trouver un chauffeur →"}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
