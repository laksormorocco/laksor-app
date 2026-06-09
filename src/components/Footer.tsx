import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{
      background: "var(--charcoal)",
      color: "#fff",
      fontFamily: "var(--font-body)",
      padding: "40px 20px 32px",
    }}>

      {/* LOGO */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--bronze-g)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontWeight: 900, fontSize: 18, fontFamily: "var(--font-serif)" }}>L</span>
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-serif)", fontWeight: 700, fontSize: 18, color: "#fff", lineHeight: 1 }}>Laksor</div>
            <div style={{ fontSize: 8, color: "rgba(255,255,255,0.35)", letterSpacing: 1.5, textTransform: "uppercase" }}>Morocco</div>
          </div>
        </div>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, lineHeight: 1.65, maxWidth: 260, margin: "0 auto" }}>
          Connecter les voyageurs aux meilleurs guides locaux du Maroc
        </p>
      </div>

      {/* LINKS */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 800, color: "var(--bronze)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 14 }}>
            Découvrir
          </div>
          {[
            ["Trouver un guide",  "/search"],
            ["Transport privé",   "/transport"],
            ["Comment ça marche", "/#how"],
            ["Villes du Maroc",   "/search"],
          ].map(([label, href]) => (
            <Link key={label} href={href} style={{ display: "block", color: "rgba(255,255,255,0.5)", fontSize: 12, marginBottom: 10, textDecoration: "none" }}>
              {label}
            </Link>
          ))}
        </div>
        <div>
          <div style={{ fontSize: 10, fontWeight: 800, color: "var(--bronze)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 14 }}>
            Guides & Pros
          </div>
          {[
            ["Devenir guide",    "/auth/register"],
            ["Dashboard guide",  "/dashboard/guide"],
            ["FAQ",              "/faq"],
            ["À propos",         "/about"],
          ].map(([label, href]) => (
            <Link key={label} href={href} style={{ display: "block", color: "rgba(255,255,255,0.5)", fontSize: 12, marginBottom: 10, textDecoration: "none" }}>
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* STATS */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
        gap: 10, marginBottom: 28,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 16, padding: "16px 12px",
      }}>
        {[
          { val: "47+",  label: "Guides"  },
          { val: "5",    label: "Villes"  },
          { val: "⭐4.9", label: "Note"   },
        ].map(s => (
          <div key={s.label} style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 700, color: "var(--bronze)" }}>{s.val}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* CONTACT */}
      <div style={{ display: "flex", gap: 10, marginBottom: 28, justifyContent: "center" }}>
        <a
          href="https://wa.me/212657436342"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "flex", alignItems: "center", gap: 6, background: "#25D366", color: "#fff", borderRadius: "999px", padding: "9px 18px", fontSize: 12, fontWeight: 700, textDecoration: "none" }}
        >
          💬 WhatsApp
        </a>
        <a
          href="mailto:laksor.morocco@gmail.com"
          style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.08)", color: "#fff", borderRadius: "999px", padding: "9px 18px", fontSize: 12, fontWeight: 700, textDecoration: "none" }}
        >
          ✉️ Email
        </a>
      </div>

      {/* BOTTOM */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 20, textAlign: "center" }}>
        <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 11, marginBottom: 10 }}>
          © 2026 Laksor Morocco · Tous droits réservés
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
          {[["CGV", "/legal/cgv"], ["CGU", "/legal/cgu"], ["Confidentialité", "/legal/privacy"], ["Charte Guides", "/legal/charte-guides"]].map(([label, href]) => (
            <Link key={label} href={href} style={{ color: "rgba(255,255,255,0.25)", fontSize: 11, textDecoration: "none" }}>
              {label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
