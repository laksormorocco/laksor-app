import LoginButton from "@/components/LoginButton";
const B = "#123EAB", Y = "#F4C542", S = "#F8F5F0";
export default function LoginPage() {
  return (
    <div style={{ minHeight: "100vh", background: S, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#fff", borderRadius: 24, padding: 40, width: "100%", maxWidth: 400, textAlign: "center", boxShadow: "0 4px 40px rgba(0,0,0,0.08)" }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: B, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 24 }}>🧭</div>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: B, marginBottom: 8 }}>Bienvenue sur Laksor</h1>
        <p style={{ color: "#666", fontSize: 14, marginBottom: 32 }}>Connectez-vous pour réserver votre guide</p>
        <LoginButton />
        <p style={{ color: "#999", fontSize: 12, marginTop: 20 }}>En vous connectant, vous acceptez nos conditions d'utilisation</p>
      </div>
    </div>
  );
}
