import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TransportPage() {
  return (
    <div style={{ background: "var(--sand)", minHeight: "100vh", fontFamily: "var(--font-body)", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "100px 20px" }}>
        <div style={{ textAlign: "center", maxWidth: 500 }}>
          <div style={{ fontSize: 64, marginBottom: 24 }}>🚐</div>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(32px, 8vw, 48px)", color: "var(--charcoal)", marginBottom: 16 }}>
            Transport Privé
          </h1>
          <div style={{ 
            display: "inline-block", 
            background: "var(--bronze-g)", 
            color: "#fff", 
            padding: "8px 24px", 
            borderRadius: 99, 
            fontSize: 12, 
            fontWeight: 800, 
            textTransform: "uppercase", 
            letterSpacing: 2, 
            marginBottom: 24 
          }}>
            Bientôt disponible
          </div>
          <p style={{ color: "var(--soft)", fontSize: 18, lineHeight: 1.6 }}>
            Nos services de transport privé et transferts aéroport arrivent bientôt sur Laksor. Préparez-vous à voyager avec les meilleurs chauffeurs du Maroc.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
