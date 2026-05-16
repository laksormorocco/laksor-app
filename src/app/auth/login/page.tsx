import LoginButton from "@/components/LoginButton";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#F7F7F7", fontFamily: "Inter, -apple-system, sans-serif", display: "flex", flexDirection: "column" }}>

      {/* Navbar */}
      <nav style={{ background: "linear-gradient(135deg, #123EAB, #1a4fd6)", padding: "0 16px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 6, color: "#fff", textDecoration: "none" }}>
          <span style={{ fontSize: 18 }}>←</span>
          <span style={{ fontWeight: 500, fontSize: 14 }}>Retour</span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img src="https://igzqwsxbdfzskwqnvvth.supabase.co/storage/v1/object/public/avatars/logo.png" alt="Laksor" style={{ height: 36, width: "auto" }}/>
        </div>
        <div style={{ width: 60 }}/>
      </nav>

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #123EAB, #1a4fd6)", padding: "32px 16px 48px", textAlign: "center" }}>
        <div style={{ width: 64, height: 64, background: "rgba(255,255,255,0.15)", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 32 }}>🧭</div>
        <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Bon retour !</h1>
        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 13 }}>Connectez-vous pour accéder à votre espace</p>
      </div>

      {/* Card */}
      <div style={{ flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "0 16px", marginTop: -24 }}>
        <div style={{ background: "#fff", borderRadius: 24, padding: 28, width: "100%", maxWidth: 420, border: "1px solid #EBEBEB", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>

          {/* Google Button */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 12, textAlign: "center" }}>Continuer avec Google</div>
            <LoginButton />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: "#EBEBEB" }}/>
            <span style={{ fontSize: 12, color: "#94A3B8" }}>Connexion sécurisée</span>
            <div style={{ flex: 1, height: 1, background: "#EBEBEB" }}/>
          </div>

          {/* Info Box */}
          <div style={{ background: "#F0FDF4", borderRadius: 14, padding: 16, marginBottom: 24, border: "1px solid #BBF7D0" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ fontSize: 20 }}>🔒</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13, color: "#166534", marginBottom: 3 }}>Connexion 100% sécurisée</div>
                <div style={{ fontSize: 12, color: "#166534", opacity: 0.8, lineHeight: 1.5 }}>Nous utilisons Google OAuth pour protéger votre compte. Aucun mot de passe requis.</div>
              </div>
            </div>
          </div>

          {/* Register Link */}
          <div style={{ textAlign: "center" }}>
            <span style={{ fontSize: 14, color: "#718096" }}>Pas encore de compte ? </span>
            <Link href="/auth/register" style={{ color: "#123EAB", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>Devenir guide →</Link>
          </div>

          <p style={{ textAlign: "center", fontSize: 11, color: "#94A3B8", marginTop: 16 }}>
            En vous connectant, vous acceptez nos CGU
          </p>
        </div>
      </div>
    </div>
  );
}
