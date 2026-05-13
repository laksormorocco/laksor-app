"use client";
import { useState } from "react";

const B = "#123EAB";
const Y = "#F4C542";
const G = "#22c55e";

const BOOKINGS = [
  { tourist: "Sarah M.", guide: "Youssef A.", type: "Demi-journée", price: 350, status: "Confirmée", color: G },
  { tourist: "John D.", guide: "Hamza B.", type: "Journée", price: 650, status: "Confirmée", color: G },
  { tourist: "Marie L.", guide: "Amina E.", type: "Demi-journée", price: 350, status: "Confirmée", color: G },
  { tourist: "Lucas P.", guide: "Zahra L.", type: "Journée", price: 650, status: "En attente", color: "#f59e0b" },
];

const MENUS = [
  { id: "dashboard", icon: "📊", label: "Dashboard" },
  { id: "guides", icon: "🗺️", label: "Guides" },
  { id: "reservations", icon: "📋", label: "Réservations" },
  { id: "users", icon: "👥", label: "Utilisateurs" },
  { id: "revenus", icon: "💰", label: "Revenus" },
  { id: "parametres", icon: "⚙️", label: "Paramètres" },
];

const BARS = [40, 55, 35, 70, 60, 85, 65, 90, 75, 95, 80, 100, 85, 110, 95, 120, 100, 115, 105, 125, 110, 130, 120, 140, 125, 145, 130, 150, 140, 156];

export default function AdminDashboard() {
  const [active, setActive] = useState("dashboard");
  const [sidebar, setSidebar] = useState(false);
  const max = Math.max(...BARS);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F8F5F0" }}>

      <div className="mobile-only" style={{ position: "fixed", top: 0, left: 0, right: 0, background: B, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 100 }}>
        <button onClick={() => setSidebar(!sidebar)} style={{ color: "#fff", fontSize: 22 }}>☰</button>
        <span style={{ color: "#fff", fontWeight: 700 }}>Admin</span>
        <span style={{ color: "#fff", fontSize: 20 }}>🔔</span>
      </div>

      <div className={sidebar ? "" : "desktop-only"} style={{ width: 248, background: B, display: "flex", flexDirection: "column", flexShrink: 0, position: sidebar ? "fixed" : "static", inset: sidebar ? "0 auto 0 0" : "auto", zIndex: 200, height: sidebar ? "100vh" : "auto" }}>
        <div style={{ padding: "24px 20px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: Y, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: B, fontWeight: 900, fontSize: 22, fontFamily: "Georgia, serif" }}>L</span>
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15, color: "#fff" }}>LAKSOR</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)" }}>Administration</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>👤</div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>Admin</div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>Administrateur</div>
            </div>
          </div>
        </div>

        <nav style={{ padding: "16px 0", flex: 1 }}>
          {MENUS.map((m) => (
            <button key={m.id} onClick={() => { setActive(m.id); setSidebar(false); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "13px 20px", background: active === m.id ? "rgba(255,255,255,0.15)" : "transparent", borderLeft: `3px solid ${active === m.id ? Y : "transparent"}`, color: "#fff", fontSize: 13, fontWeight: active === m.id ? 700 : 500, textAlign: "left" }}>
              <span>{m.icon}</span>{m.label}
            </button>
          ))}
        </nav>

        <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <a href="/" style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>🚪 Déconnexion</a>
        </div>
      </div>

      <div style={{ flex: 1, padding: "clamp(56px, 8vw, 32px) 16px 32px", overflow: "auto" }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 800, margin: "0 0 4px" }}>Dashboard Admin</h1>
          <p style={{ fontSize: 14, color: "#777" }}>Vue d'ensemble de la plateforme</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16, marginBottom: 28 }}>
          {[
            { icon: "🗺️", label: "Guides", val: "156", bg: "#eef2ff" },
            { icon: "👥", label: "Utilisateurs", val: "1 245", bg: "#fffbeb" },
            { icon: "📋", label: "Réservations", val: "2 356", bg: "#f0fdf4" },
            { icon: "💰", label: "Revenus", val: "187 450 MAD", bg: "#fdf4ff" },
          ].map((s) => (
            <div key={s.label} style={{ background: "#fff", borderRadius: 20, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 14 }}>{s.icon}</div>
              <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>{s.val}</div>
              <div style={{ fontSize: 12, color: "#888" }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 18 }}>Dernières réservations</h2>
            {BOOKINGS.map((b) => (
              <div key={b.tourist} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid #f5f5f5", flexWrap: "wrap" }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>👤</div>
                <div style={{ flex: 1, minWidth: 120 }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{b.tourist}</div>
                  <div style={{ fontSize: 11, color: "#888" }}>{b.guide} · {b.type}</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 800, color: B }}>{b.price} MAD</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: b.color, background: `${b.color}18`, padding: "3px 10px", borderRadius: 16 }}>{b.status}</div>
              </div>
            ))}
          </div>

          <div style={{ background: "#fff", borderRadius: 20, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 18 }}>Analytics</h2>
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 12, color: "#777" }}>Réservations (30j)</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: G }}>+24%</span>
              </div>
              <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 70 }}>
                {BARS.map((h, i) => (
                  <div key={i} style={{ flex: 1, background: i === BARS.length - 1 ? B : `${B}40`, borderRadius: "3px 3px 0 0", height: `${(h / max) * 100}%`, minWidth: 0 }} />
                ))}
              </div>
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: "#777" }}>Revenus (30j)</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: G }}>+18%</span>
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: B, marginBottom: 12 }}>187 450 MAD</div>
              <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 50 }}>
                {BARS.map((h, i) => (
                  <div key={i} style={{ flex: 1, background: i === BARS.length - 1 ? Y : `${Y}60`, borderRadius: "3px 3px 0 0", height: `${(h / max) * 100}%`, minWidth: 0 }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
