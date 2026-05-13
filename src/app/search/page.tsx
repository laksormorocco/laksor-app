"use client";
import { useState } from "react";

const B = "#123EAB";
const Y = "#F4C542";
const S = "#F8F5F0";

const GUIDES = [
  { id: 1, name: "Youssef A.", city: "Marrakech", rating: 4.9, reviews: 128, halfDay: 350, fullDay: 650, types: ["Culture", "Histoire", "Monuments"], langs: ["Français", "Anglais", "Arabe"], badge: true, img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
  { id: 2, name: "Amina E.", city: "Fès", rating: 4.8, reviews: 96, halfDay: 300, fullDay: 600, types: ["Culinaire", "Shopping"], langs: ["Français", "Espagnol"], badge: true, img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80" },
  { id: 3, name: "Hamza B.", city: "Essaouira", rating: 4.9, reviews: 82, halfDay: 350, fullDay: 700, types: ["Aventure", "Photographie"], langs: ["Anglais", "Français"], badge: true, img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80" },
  { id: 4, name: "Zahra L.", city: "Chefchaouen", rating: 4.8, reviews: 64, halfDay: 300, fullDay: 600, types: ["Culture", "Photographie"], langs: ["Français", "Arabe"], badge: false, img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80" },
  { id: 5, name: "Karim M.", city: "Agadir", rating: 4.7, reviews: 54, halfDay: 280, fullDay: 560, types: ["Désert", "Aventure"], langs: ["Français", "Anglais"], badge: true, img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80" },
  { id: 6, name: "Fatima Z.", city: "Marrakech", rating: 4.9, reviews: 110, halfDay: 380, fullDay: 720, types: ["Culinaire", "Artisanat"], langs: ["Français", "Italien", "Arabe"], badge: true, img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80" },
];

const CITIES = ["Toutes", "Marrakech", "Fès", "Essaouira", "Chefchaouen", "Agadir"];
const TYPES = ["Culture", "Histoire", "Culinaire", "Shopping", "Aventure", "Désert", "Artisanat", "Photographie", "Monuments"];
const LANGS = ["Toutes", "Français", "Anglais", "Espagnol", "Arabe", "Italien"];

export default function SearchPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [city, setCity] = useState("Toutes");
  const [lang, setLang] = useState("Toutes");
  const [maxPrice, setMaxPrice] = useState(1000);
  const [types, setTypes] = useState<string[]>([]);

  const toggle = (t: string) => setTypes((s) => s.includes(t) ? s.filter((x) => x !== t) : [...s, t]);
  const reset = () => { setCity("Toutes"); setLang("Toutes"); setTypes([]); setMaxPrice(1000); };

  const filtered = GUIDES.filter((g) => {
    if (city !== "Toutes" && g.city !== city) return false;
    if (lang !== "Toutes" && !g.langs.includes(lang)) return false;
    if (g.halfDay > maxPrice) return false;
    if (types.length > 0 && !types.some((t) => g.types.includes(t))) return false;
    return true;
  });

  return (
    <div style={{ background: S, minHeight: "100vh" }}>

      <div style={{ background: B, padding: "14px 16px", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 16px rgba(0,0,0,0.2)" }}>
        <div style={{ maxWidth: 1020, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <a href="/" style={{ color: "#fff", fontSize: 24, lineHeight: 1, flexShrink: 0, fontWeight: 700 }}>←</a>
            <div style={{ flex: 1, background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "11px 16px" }}>
              <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 13 }}>🔍 Rechercher un guide, une ville...</span>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 13, fontWeight: 600 }}>
              {filtered.length} guides trouvés
            </span>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setShowFilters(!showFilters)} style={{ background: showFilters || types.length > 0 ? Y : "rgba(255,255,255,0.2)", color: showFilters || types.length > 0 ? "#1a1a1a" : "#fff", borderRadius: 20, padding: "7px 16px", fontSize: 12, fontWeight: 700 }}>
                ⚙ Filtres {types.length > 0 ? `(${types.length})` : ""}
              </button>
              <button style={{ background: "rgba(255,255,255,0.2)", color: "#fff", borderRadius: 20, padding: "7px 16px", fontSize: 12, fontWeight: 600 }}>
                ↕ Trier
              </button>
            </div>
          </div>
        </div>
      </div>

      {showFilters && (
        <div style={{ background: "#fff", padding: 20, borderBottom: "1px solid #eee" }}>
          <div style={{ maxWidth: 1020, margin: "0 auto" }}>
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 10 }}>Ville</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {CITIES.map((c) => (
                  <button key={c} onClick={() => setCity(c)} style={{ padding: "7px 16px", borderRadius: 20, border: `1.5px solid ${city === c ? B : "#e0e0e0"}`, background: city === c ? B : "#fff", color: city === c ? "#fff" : "#555", fontSize: 12, fontWeight: 600 }}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 10 }}>Type de visite</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {TYPES.map((t) => (
                  <button key={t} onClick={() => toggle(t)} style={{ padding: "7px 16px", borderRadius: 20, border: `1.5px solid ${types.includes(t) ? B : "#e0e0e0"}`, background: types.includes(t) ? B : "#fff", color: types.includes(t) ? "#fff" : "#555", fontSize: 12, fontWeight: 600 }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 10 }}>Langue</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {LANGS.map((l) => (
                  <button key={l} onClick={() => setLang(l)} style={{ padding: "7px 16px", borderRadius: 20, border: `1.5px solid ${lang === l ? B : "#e0e0e0"}`, background: lang === l ? B : "#fff", color: lang === l ? "#fff" : "#555", fontSize: 12, fontWeight: 600 }}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 22 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 10 }}>
                Prix maximum (4h) : <span style={{ color: B, fontWeight: 800 }}>{maxPrice} MAD</span>
              </div>
              <input type="range" min={100} max={1000} step={50} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} style={{ width: "100%", accentColor: B }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#888", marginTop: 4 }}>
                <span>100 MAD</span><span>1000+ MAD</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={reset} style={{ flex: 1, padding: 13, border: "1.5px solid #e0e0e0", borderRadius: 12, background: "#fff", fontSize: 13, fontWeight: 600, color: "#555" }}>
                Réinitialiser
              </button>
              <button onClick={() => setShowFilters(false)} style={{ flex: 2, padding: 13, borderRadius: 12, background: B, color: "#fff", fontSize: 13, fontWeight: 700 }}>
                Voir {filtered.length} résultats
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 1020, margin: "0 auto", padding: 20 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>🔍</div>
            <h3 style={{ fontSize: 20, marginBottom: 8 }}>Aucun guide trouvé</h3>
            <p style={{ color: "#888", fontSize: 14 }}>Essayez de modifier vos filtres</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {filtered.map((g) => (
              <a key={g.id} href={`/guide/${g.id}`}>
                <div style={{ background: "#fff", borderRadius: 18, overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.07)", display: "flex", border: "1px solid #f0e8e0" }}>
                  <div style={{ position: "relative", width: 130, flexShrink: 0 }}>
                    <img src={g.img} alt={g.name} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", minHeight: 150 }} />
                    {g.badge && (
                      <div style={{ position: "absolute", top: 8, left: 8, background: "#22c55e", color: "#fff", fontSize: 9, fontWeight: 700, borderRadius: 10, padding: "2px 7px" }}>✓</div>
                    )}
                  </div>
                  <div style={{ padding: 16, flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                      <div style={{ fontWeight: 700, fontSize: 16, color: "#1a1a1a" }}>{g.name}</div>
                      <span style={{ fontSize: 18, color: "#ddd" }}>♡</span>
                    </div>
                    <div style={{ fontSize: 13, color: "#888", marginBottom: 8 }}>📍 {g.city}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                      <span style={{ color: Y, fontSize: 12 }}>★★★★★</span>
                      <span style={{ fontSize: 13, fontWeight: 700 }}>{g.rating}</span>
                      <span style={{ fontSize: 12, color: "#888" }}>({g.reviews})</span>
                    </div>
                    <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
                      {g.types.slice(0, 2).map((t) => (
                        <span key={t} style={{ fontSize: 10, padding: "3px 10px", borderRadius: 20, background: "#eef2ff", color: B, fontWeight: 600 }}>{t}</span>
                      ))}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <span style={{ fontSize: 10, color: "#888" }}>À partir de </span>
                        <span style={{ fontSize: 16, fontWeight: 800, color: B }}>{g.halfDay} MAD</span>
                        <span style={{ fontSize: 10, color: "#888" }}> (4h)</span>
                      </div>
                      <span style={{ background: B, color: "#fff", borderRadius: 10, padding: "7px 14px", fontSize: 12, fontWeight: 700 }}>Voir →</span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
