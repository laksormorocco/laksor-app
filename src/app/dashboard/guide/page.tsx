"use client";
import { useState } from "react";

const B = "#123EAB";
const Y = "#F4C542";
const G = "#22c55e";

const BOOKINGS = [
  { name: "Sarah M.", flag: "🇫🇷", type: "Demi-journée (4h)", date: "23 Mai", persons: 2, city: "Marrakech", price: 350, status: "Confirmée", color: G },
  { name: "John D.", flag: "🇬🇧", type: "Journée (8h)", date: "24 Mai", persons: 3, city: "Essaouira", price: 650, status: "Confirmée", color: G },
  { name: "Marie L.", flag: "🇩🇪", type: "Demi-journée (4h)", date: "26 Mai", persons: 1, city: "Marrakech", price: 350, status: "Confirmée", color: G },
  { name: "Lucas P.", flag: "🇧🇷", type: "Journée (8h)", date: "28 Mai", persons: 4, city: "Fès", price: 650, status: "En attente", color: "#f59e0b" },
];

const MENUS = [
  { id: "dashboard", icon: "📊", label: "Tableau de bord" },
  { id: "reservations", icon: "📋", label: "Réservations" },
  { id: "calendrier", icon: "📅", label: "Calendrier" },
  { id: "revenus", icon: "💰", label: "Revenus" },
  { id: "avis", icon: "⭐", label: "Avis" },
  { id: "messages", icon: "💬", label: "Messages" },
  { id: "profil", icon: "👤", label: "Mon Profil" },
];

export default function GuideDashboard() {
  const [active, setActive] = useState("dashboard");
  const [sidebar, setSidebar] = useState(false);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F8F5F0" }}>

      {/* Mobile top bar */}
      <div className="mobile-only" style={{ position: "fixed", top: 0, left: 0, right: 0, background: B, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 100 }}>
        <button onClick={() => setSidebar(!sidebar)} style={{ color: "#fff", fontSize: 22 }}>☰</button>
        <span style={{ color: "#fff", fontWeight: 700 }}>Mon Dashboard</span>
        <span style={{ color: "#fff", fontSize: 20 }}>🔔</span>
      </div>

      <div className={sidebar ? "" : "desktop-only"} style={{ width: 248, background: B, display: "flex", flexDirection: "column", flexShrink: 0, position: sidebar ? "fixed" : "static", inset: sidebar ? "0 auto 0 0" : "auto", zIndex: 200, height: sidebar ? "100vh" : "auto" }}>
        <div style={{ padding: "24px 20px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: Y, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: B, fontWeight: 900, fontSize: 22, fontFamily: "Georgia, serif" }}>L</span>
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15, color: "#fff" }}>LAKSOR</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)" }}>Tour Guide Morocco</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" alt="" style={{ width: 46, height: 46, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(255,255,255,0.3)" }} />
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>Youssef A.</div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>Guide certifié ✓</div>
            </div>
          </div>
        </div>

        <nav style={{ padding: "16px 0", flex: 1 }}>
          {MENUS.map((m) => (
            <button key={m.id} onClick={() => { setActive(m.id); setSidebar(false); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "13px 20px", background: active === m.id ? "rgba(255,255,255,0.15)" : "transparent", borderLeft: `3px solid ${active === m.id ? Y : "transparent"}`, color: "#fff", fontSize: 13, fontWeight: active === m.id ? 700 : 500, textAlign: "left" }}>
              <span style={{ fontSize: 16 }}>{m.icon}</span>
              {m.label}
            </button>
          ))}
        </nav>

        <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <a href="/" style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>🚪 Déconnexion</a>
        </div>
      </div>

      <div style={{ flex: 1, padding: "clamp(56px, 8vw, 32px) 16px 32px", overflow: "auto" }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 800, margin: "0 0 4px" }}>Bonjour, Youssef 👋</h1>
          <p style={{ fontSize: 14, color: "#777" }}>Voici un aperçu de votre activité</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16, marginBottom: 28 }}>
          {[
            { icon: "📋", label: "Réservations", val: "24", sub: "Ce mois", bg: "#eef2ff" },
            { icon: "⭐", label: "Avis", val: "128", sub: "4.9/5", bg: "#fffbeb" },
            { icon: "💰", label: "Revenus", val: "18 450 MAD", sub: "+18%", bg: "#f0fdf4" },
            { icon: "👥", label: "Clients", val: "98", sub: "Total", bg: "#fdf4ff" },
          ].map((s) => (
            <div key={s.label} style={{ background: "#fff", borderRadius: 20, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 14 }}>{s.icon}</div>
              <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>{s.val}</div>
              <div style={{ fontSize: 12, color: "#888" }}>{s.label}</div>
              <div style={{ fontSize: 11, color: G, fontWeight: 600, marginTop: 4 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ background: "#fff", borderRadius: 20, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ fontSize: 17, fontWeight: 800 }}>Prochaines réservations</h2>
            <button style={{ background: "#eef2ff", color: B, borderRadius: 10, padding: "7px 14px", fontSize: 12, fontWeight: 700 }}>Voir tout</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {BOOKINGS.map((b) => (
              <div key={b.name} style={{ display: "flex", alignItems: "center", gap: 14, padding: 14, background: "#F8F5F0", borderRadius: 14, flexWrap: "wrap" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{b.flag}</div>
                <div style={{ flex: 1, minWidth: 150 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{b.name}</div>
                  <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{b.date} · {b.type} · {b.persons} pers. · {b.city}</div>
                </div>
                <div style={{ fontSize: 15, fontWeight: 800, color: B, flexShrink: 0 }}>{b.price} MAD</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: b.color, background: `${b.color}20`, padding: "4px 10px", borderRadius: 16, flexShrink: 0 }}>{b.status}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
