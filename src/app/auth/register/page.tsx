"use client";
import { useState } from "react";

const B = "#123EAB";
const Y = "#F4C542";

export default function RegisterPage() {
  const [role, setRole] = useState<"tourist" | "guide">("tourist");

  return (
    <div style={{ background: "#F8F5F0", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>

      <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 36 }}>
        <div style={{ width: 46, height: 46, borderRadius: 14, background: B, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: Y, fontWeight: 900, fontSize: 26, fontFamily: "Georgia, serif" }}>L</span>
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 18, color: B }}>LAKSOR</div>
          <div style={{ fontSize: 10, color: "#888" }}>Tour Guide Morocco</div>
        </div>
      </a>

      <div style={{ background: "#fff", borderRadius: 24, padding: "36px 32px", width: "100%", maxWidth: 440, boxShadow: "0 8px 40px rgba(0,0,0,0.1)" }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 8px", textAlign: "center" }}>Créer un compte</h1>
        <p style={{ fontSize: 14, color: "#777", textAlign: "center", margin: "0 0 24px" }}>Rejoignez la communauté Laksor</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
          {([["tourist", "🧳", "Touriste", "Je cherche un guide"], ["guide", "🗺️", "Guide", "Je propose mes services"]] as const).map(([val, icon, label, desc]) => (
            <button key={val} onClick={() => setRole(val)} style={{ padding: "16px 12px", borderRadius: 16, border: `2px solid ${role === val ? B : "#e0e0e0"}`, background: role === val ? "#eef2ff" : "#fff", textAlign: "center" }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{icon}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: role === val ? B : "#555", marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 11, color: "#888", lineHeight: 1.3 }}>{desc}</div>
            </button>
          ))}
        </div>

        {[["Prénom", "Jean"], ["Nom", "Dupont"], ["Email", "votre@email.com"]].map(([label, ph]) => (
          <div key={label} style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#555", marginBottom: 6 }}>{label}</div>
            <input placeholder={ph} style={{ width: "100%", border: "1.5px solid #e0e0e0", borderRadius: 12, padding: "13px 16px", fontSize: 14, outline: "none" }} />
          </div>
        ))}

        {role === "guide" && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#555", marginBottom: 6 }}>Ville principale</div>
            <select style={{ width: "100%", border: "1.5px solid #e0e0e0", borderRadius: 12, padding: "13px 16px", fontSize: 14, background: "#fff" }}>
              {["Marrakech", "Fès", "Casablanca", "Agadir", "Essaouira", "Chefchaouen"].map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        )}

        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#555", marginBottom: 6 }}>Mot de passe</div>
          <input type="password" placeholder="••••••••" style={{ width: "100%", border: "1.5px solid #e0e0e0", borderRadius: 12, padding: "13px 16px", fontSize: 14, outline: "none" }} />
        </div>

        <button style={{ width: "100%", background: role === "guide" ? Y : B, color: role === "guide" ? "#1a1a1a" : "#fff", borderRadius: 14, padding: 15, fontSize: 15, fontWeight: 700, marginBottom: 14 }}>
          {role === "guide" ? "Devenir guide →" : "Créer mon compte →"}
        </button>

        <p style={{ textAlign: "center", fontSize: 13, color: "#777" }}>
          Déjà un compte ?{" "}
          <a href="/auth/login" style={{ color: B, fontWeight: 700 }}>Se connecter</a>
        </p>
      </div>
    </div>
  );
}
