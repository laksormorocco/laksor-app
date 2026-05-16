import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ background: "#123EAB", color: "#fff", fontFamily: "Inter, -apple-system, sans-serif", padding: "40px 16px 32px" }}>

      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <span style={{ fontWeight: 900, fontSize: 22, color: "#fff" }}>LAKSOR</span>
          <span style={{ color: "#F4C542", fontSize: 12, fontWeight: 700, letterSpacing: "1px" }}>MOROCCO</span>
        </div>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, lineHeight: 1.6 }}>
          Connecter les voyageurs aux meilleurs<br/>guides locaux du Maroc
        </p>
      </div>

      {/* Links Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#F4C542", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 14 }}>Découvrir</div>
          {[
            ["Trouver un guide", "/search"],
            ["Comment ça marche", "/#how"],
            ["Guides certifiés", "/search"],
            ["Villes du Maroc", "/search"],
          ].map(([label, href]) => (
            <Link key={label} href={href} style={{ display: "block", color: "rgba(255,255,255,0.65)", fontSize: 13, marginBottom: 10, textDecoration: "none" }}>{label}</Link>
          ))}
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#F4C542", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 14 }}>Guides</div>
          {[
            ["Devenir guide", "/auth/register"],
            ["Dashboard guide", "/dashboard/guide"],
            ["FAQ", "/faq"],
            ["A propos", "/about"],
          ].map(([label, href]) => (
            <Link key={label} href={href} style={{ display: "block", color: "rgba(255,255,255,0.65)", fontSize: 13, marginBottom: 10, textDecoration: "none" }}>{label}</Link>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 32, background: "rgba(255,255,255,0.05)", borderRadius: 16, padding: 16 }}>
        {[["150+", "Guides"], ["12", "Villes"], ["4.9★", "Note"]].map(([val, label]) => (
          <div key={label} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#F4C542" }}>{val}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Contact */}
      <div style={{ display: "flex", gap: 10, marginBottom: 28, justifyContent: "center" }}>
        <a href="https://wa.me/212657436342" target="_blank" style={{ display: "flex", alignItems: "center", gap: 6, background: "#25D366", color: "#fff", borderRadius: 20, padding: "9px 16px", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
          💬 WhatsApp
        </a>
        <a href="mailto:laksor.morocco@gmail.com" style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.1)", color: "#fff", borderRadius: 20, padding: "9px 16px", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
          ✉️ Email
        </a>
      </div>

      {/* Bottom */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 20, textAlign: "center" }}>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, marginBottom: 8 }}>
          © 2026 Laksor Morocco · Tous droits réservés
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
          {[["CGU", "/cgu"], ["Confidentialité", "/privacy"], ["FAQ", "/faq"]].map(([label, href]) => (
            <Link key={label} href={href} style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, textDecoration: "none" }}>{label}</Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
