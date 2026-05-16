import Link from "next/link";

export default function SuccessPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#F7F7F7", fontFamily: "Inter, -apple-system, sans-serif", display: "flex", flexDirection: "column" }}>

      {/* Navbar */}
      <nav style={{ background: "linear-gradient(135deg, #123EAB, #1a4fd6)", padding: "0 16px", height: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img src="https://igzqwsxbdfzskwqnvvth.supabase.co/storage/v1/object/public/avatars/logo.png" alt="Laksor" style={{ height: 36, width: "auto" }}/>
        </div>
      </nav>

      {/* Content */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 16px" }}>
        <div style={{ background: "#fff", borderRadius: 24, padding: 40, maxWidth: 420, width: "100%", textAlign: "center", border: "1px solid #EBEBEB", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>

          {/* Success Icon */}
          <div style={{ width: 80, height: 80, background: "linear-gradient(135deg, #22c55e, #16a34a)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: 36 }}>
            🎉
          </div>

          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>
            Candidature envoyée !
          </h1>
          <p style={{ color: "#718096", fontSize: 15, lineHeight: 1.6, marginBottom: 28 }}>
            Nous avons bien reçu votre demande. Notre équipe va examiner votre profil et vous contacter sur <strong>WhatsApp</strong> sous 24h.
          </p>

          {/* Steps */}
          <div style={{ background: "#F8FAFC", borderRadius: 16, padding: 20, marginBottom: 28, textAlign: "left" }}>
            {[
              { icon: "✅", title: "Candidature soumise", desc: "Votre profil a été envoyé", done: true },
              { icon: "🔍", title: "Vérification en cours", desc: "Notre équipe examine votre dossier", done: false },
              { icon: "📱", title: "Contact WhatsApp", desc: "Réponse sous 24h", done: false },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: i < 2 ? 14 : 0 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: s.done ? "#DCFCE7" : "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{s.icon}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: s.done ? "#166534" : "#0F172A" }}>{s.title}</div>
                  <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <Link href="/" style={{ display: "block", background: "#0B132B", color: "#fff", borderRadius: 30, padding: "16px 32px", fontSize: 15, fontWeight: 600, textDecoration: "none", marginBottom: 12 }}>
            Retour à l accueil
          </Link>
          <Link href="/search" style={{ display: "block", background: "#F7F7F7", color: "#123EAB", borderRadius: 30, padding: "14px 32px", fontSize: 14, fontWeight: 600, textDecoration: "none", border: "1px solid #EBEBEB" }}>
            Explorer les guides
          </Link>
        </div>
      </div>
    </div>
  );
}
