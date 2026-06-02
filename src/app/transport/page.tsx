import Navbar from "@/components/Navbar";

const PROVIDERS = [
  {
    id: "1", name: "Karim Tazi", city: "Marrakech",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    rating: 4.8, rides: 156, verified: true, guidePartner: true,
    services: ["✈️ Aéroport", "🏙️ Ville", "🏔️ Atlas"],
    vehicles: [
      { type: "Sedan",   icon: "🚗", price: 14, pax: "1–3" },
      { type: "Minivan", icon: "🚐", price: 20, pax: "4–7" },
      { type: "4×4",    icon: "🚙", price: 28, pax: "1–4" },
    ],
    equipment: ["❄️ AC", "📶 WiFi", "🍶 Eau", "🎵 BT"],
  },
  {
    id: "2", name: "Atlas Premium", city: "Marrakech",
    avatar: null,
    rating: 4.9, rides: 89, verified: true, guidePartner: false,
    services: ["🏔️ Excursion", "👤 Privé"],
    vehicles: [
      { type: "4×4 SUV", icon: "🚙", price: 28, pax: "1–4" },
    ],
    equipment: ["❄️ AC", "🏔️ Off-road", "🎵 BT"],
  },
  {
    id: "3", name: "Fès Transfers", city: "Fès",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    rating: 4.7, rides: 64, verified: true, guidePartner: true,
    services: ["✈️ Aéroport", "🏙️ Ville"],
    vehicles: [
      { type: "Sedan",   icon: "🚗", price: 14, pax: "1–3" },
      { type: "Minivan", icon: "🚐", price: 20, pax: "4–7" },
    ],
    equipment: ["❄️ AC", "🍶 Eau"],
  },
];

const FILTERS = ["Tous", "Aéroport", "Ville", "Excursion", "Privé"];

export default function TransportPage() {
  return (
    <div style={{ background: "var(--sand)", minHeight: "100vh", fontFamily: "var(--font-body)" }}>
      <Navbar />

      {/* HERO */}
      <div style={{
        background: "var(--charcoal)",
        padding: "32px 20px 28px",
      }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{
            display: "inline-block",
            background: "rgba(184,138,68,0.2)",
            border: "1px solid rgba(184,138,68,0.4)",
            borderRadius: "999px", padding: "4px 14px",
            fontSize: 10, fontWeight: 700, color: "var(--bronze)",
            letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 14,
          }}>
            🚗 Transport Privé
          </div>
          <h1 style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(24px,6vw,36px)",
            fontWeight: 700, color: "#fff", marginBottom: 8, lineHeight: 1.2,
          }}>
            Voyagez en confort<br />à travers le Maroc
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 22, lineHeight: 1.65 }}>
            Chauffeurs vérifiés · Prix fixes · Aucune surprise
          </p>

          {/* VEHICLE PRICES */}
          <div style={{ display: "flex", gap: 8 }}>
            {[
              { icon: "🚗", label: "Sedan",   price: "€14", pax: "1–3 pax" },
              { icon: "🚐", label: "Minivan", price: "€20", pax: "4–7 pax" },
              { icon: "🚙", label: "4×4",     price: "€28", pax: "1–4 pax" },
            ].map(v => (
              <div key={v.label} style={{
                flex: 1, background: "rgba(255,255,255,0.07)",
                borderRadius: 14, padding: "10px 8px", textAlign: "center",
              }}>
                <div style={{ fontSize: 20, marginBottom: 3 }}>{v.icon}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 2 }}>{v.label}</div>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: 16, fontWeight: 700, color: "#fff" }}>{v.price}</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>{v.pax}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BUNDLE BANNER */}
      <div style={{ padding: "12px 20px 0", maxWidth: 640, margin: "0 auto" }}>
        <div style={{
          background: "linear-gradient(135deg,var(--sage),#5a6b4a)",
          borderRadius: 18, padding: "14px 18px",
          display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
        }}>
          <div>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 2 }}>
              🧭 Ajoute un guide — économise €5
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>
              Guide + transport en 1 réservation
            </div>
          </div>
          <a href="/booking" style={{
            background: "var(--bronze-g)", color: "#fff",
            borderRadius: "999px", padding: "9px 16px",
            fontSize: 11, fontWeight: 700, textDecoration: "none", flexShrink: 0,
          }}>
            Bundle →
          </a>
        </div>
      </div>

      {/* PROVIDERS */}
      <div style={{ padding: "20px 20px 80px", maxWidth: 640, margin: "0 auto" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 20, fontWeight: 700 }}>
            Nos transporteurs
          </h2>
          <span style={{ fontSize: 11, color: "var(--muted)" }}>{PROVIDERS.length} disponibles</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {PROVIDERS.map(p => (
            <div key={p.id} style={{
              background: "var(--white)", borderRadius: 24,
              overflow: "hidden", boxShadow: "var(--shadow-sm)",
              border: "1px solid rgba(234,220,200,0.6)",
            }}>
              {/* HEADER */}
              <div style={{ padding: "16px 16px 12px", display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{
                  width: 50, height: 50, borderRadius: 14, overflow: "hidden",
                  background: "var(--sand-dark)", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 22,
                }}>
                  {p.avatar
                    ? <img src={p.avatar} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : "🚙"
                  }
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "var(--font-serif)", fontSize: 16, fontWeight: 700, marginBottom: 2 }}>{p.name}</div>
                  <div style={{ fontSize: 10, color: "var(--muted)", marginBottom: 5 }}>📍 {p.city}</div>
                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                    <span style={{ background: "#E8F0E4", color: "var(--sage)", fontSize: 9, fontWeight: 800, padding: "2px 8px", borderRadius: "999px" }}>✓ Vérifié</span>
                    {p.guidePartner && <span style={{ background: "#FEF3E8", color: "var(--bronze)", fontSize: 9, fontWeight: 800, padding: "2px 8px", borderRadius: "999px" }}>🧭 Guide partner</span>}
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 3, justifyContent: "flex-end" }}>
                    <span style={{ color: "#FFD700", fontSize: 12 }}>★</span>
                    <span style={{ fontWeight: 800, fontSize: 14 }}>{p.rating}</span>
                  </div>
                  <div style={{ fontSize: 10, color: "var(--muted)" }}>{p.rides} rides</div>
                </div>
              </div>

              {/* VEHICLES */}
              <div style={{ display: "flex", gap: 8, padding: "0 16px 12px" }}>
                {p.vehicles.map(v => (
                  <div key={v.type} style={{
                    flex: 1, background: "var(--sand)", borderRadius: 12,
                    padding: "10px 8px", textAlign: "center",
                  }}>
                    <div style={{ fontSize: 20, marginBottom: 3 }}>{v.icon}</div>
                    <div style={{ fontSize: 10, color: "var(--muted)", marginBottom: 2 }}>{v.type}</div>
                    <div style={{ fontFamily: "var(--font-serif)", fontSize: 16, fontWeight: 700 }}>€{v.price}</div>
                    <div style={{ fontSize: 9, color: "var(--muted)" }}>{v.pax}</div>
                  </div>
                ))}
              </div>

              {/* EQUIPMENT + SERVICES */}
              <div style={{ padding: "0 16px 14px" }}>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 8 }}>
                  {p.services.map(s => (
                    <span key={s} style={{ background: "var(--sand)", border: "1px solid var(--sand-dark)", borderRadius: "999px", padding: "3px 10px", fontSize: 10, fontWeight: 600, color: "var(--soft)" }}>{s}</span>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                  {p.equipment.map(e => (
                    <span key={e} style={{ fontSize: 11, color: "var(--muted)" }}>{e}</span>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div style={{ padding: "0 16px 16px", display: "flex", gap: 8 }}>
                <a href={`/transport/${p.id}`} style={{
                  flex: 1, background: "var(--white)", border: "1.5px solid var(--sand-dark)",
                  borderRadius: "999px", padding: "11px", fontSize: 12, fontWeight: 600,
                  color: "var(--soft)", textDecoration: "none", textAlign: "center",
                }}>
                  Voir profil
                </a>
                <a href={`/booking?transport=${p.id}`} style={{
                  flex: 2, background: "var(--bronze-g)", color: "#fff",
                  borderRadius: "999px", padding: "11px",
                  fontSize: 13, fontWeight: 700, textDecoration: "none", textAlign: "center",
                  boxShadow: "0 4px 14px rgba(184,138,68,0.3)",
                }}>
                  Réserver →
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* TRUST */}
        <div style={{ marginTop: 24, background: "var(--white)", borderRadius: 20, padding: "18px 20px" }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12, textAlign: "center" }}>
            Pourquoi Laksor Transport
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { icon: "💰", text: "Prix fixes, aucune surprise" },
              { icon: "✓",  text: "Chauffeurs vérifiés" },
              { icon: "🔄", text: "Annulation gratuite 72h" },
              { icon: "💬", text: "WhatsApp en temps réel" },
            ].map(t => (
              <div key={t.text} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <span style={{ fontSize: 15, flexShrink: 0 }}>{t.icon}</span>
                <span style={{ fontSize: 11, color: "var(--soft)", lineHeight: 1.4 }}>{t.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
