"use client";
import { useState } from "react";
import Link from "next/link";

const FAQS = [
  {
    category: "🧳 Pour les touristes",
    items: [
      { q: "Comment réserver un guide sur Laksor ?", a: "Cherchez un guide selon votre ville et vos préférences, consultez son profil, puis cliquez sur Réserver ce guide. Choisissez votre date, durée et nombre de personnes. Le guide reçoit votre demande et vous confirme sous 24h." },
      { q: "Comment se passe le paiement ?", a: "Le paiement se fait directement en cash au guide le jour de la visite. Aucun paiement en ligne n est requis pour réserver." },
      { q: "Puis-je annuler ma réservation ?", a: "Oui, vous pouvez annuler gratuitement jusqu à 72h avant la date de visite depuis votre dashboard. Passé ce délai, l annulation n est plus possible." },
      { q: "Les guides parlent-ils ma langue ?", a: "Chaque guide affiche les langues qu il parle sur son profil. Vous pouvez filtrer par langue (Français, Anglais, Espagnol, Hébreu, Russe, Allemand, Arabe) depuis la page de recherche." },
      { q: "Qu est-ce qu une demande sur mesure ?", a: "La demande sur mesure vous permet de créer un itinéraire personnalisé. Décrivez vos envies, dates et budget — le guide vous propose un prix adapté." },
    ]
  },
  {
    category: "🧭 Pour les guides",
    items: [
      { q: "Comment devenir guide sur Laksor ?", a: "Cliquez sur Devenir guide, connectez-vous avec Google, remplissez votre profil (bio, langues, spécialités, tarifs). Notre équipe valide votre candidature sous 24h." },
      { q: "Quelle est la commission Laksor ?", a: "Laksor prend une commission de 24% sur chaque réservation confirmée. Par exemple, pour une demi-journée à 600 MAD, vous recevez 456 MAD." },
      { q: "Comment recevoir mes paiements ?", a: "Le touriste vous paie directement en cash le jour de la visite. La commission Laksor est déduite a posteriori selon les modalités convenues." },
      { q: "Quels tarifs conseille Laksor ?", a: "Nous conseillons 600 MAD pour une demi-journée (4h) et 1100 MAD pour une journée complète (8h). Ces tarifs sont indicatifs, vous êtes libre de les ajuster." },
      { q: "Comment gérer mes réservations ?", a: "Depuis votre dashboard guide, vous recevez les demandes en temps réel. Vous pouvez accepter ou refuser chaque réservation et contacter le touriste via WhatsApp." },
    ]
  }
];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({ "0-0": true });
  const [search, setSearch] = useState("");

  function toggle(key: string) {
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
  }

  const filtered = FAQS.map(cat => ({
    ...cat,
    items: cat.items.filter(item =>
      !search || item.q.toLowerCase().includes(search.toLowerCase()) || item.a.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(cat => cat.items.length > 0);

  return (
    <div style={{ background: "#F7F7F7", minHeight: "100vh", fontFamily: "Inter, -apple-system, sans-serif", paddingBottom: 40 }}>

      {/* Navbar */}
      <nav style={{ background: "linear-gradient(135deg, #123EAB, #1a4fd6)", padding: "0 16px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 6, color: "#fff", textDecoration: "none" }}>
          <span style={{ fontSize: 18 }}>←</span>
          <span style={{ fontWeight: 500, fontSize: 14 }}>Retour</span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontWeight: 900, color: "#fff", fontSize: 18 }}>LAKSOR</span>
          <span style={{ color: "#F4C542", fontSize: 11, fontWeight: 700, letterSpacing: "1px" }}>MOROCCO</span>
        </div>
        <div style={{ width: 60 }}/>
      </nav>

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #123EAB, #1a4fd6)", padding: "24px 16px 40px", textAlign: "center" }}>
        <div style={{ width: 64, height: 64, background: "rgba(255,255,255,0.15)", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 32 }}>❓</div>
        <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Questions fréquentes</h1>
        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 13 }}>Tout ce que vous devez savoir sur Laksor</p>
      </div>

      {/* Search */}
      <div style={{ padding: "0 16px", marginTop: -20, position: "relative", zIndex: 10, marginBottom: 20 }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: "14px 16px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ color: "#94A3B8", fontSize: 16 }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher une question..." style={{ border: "none", outline: "none", fontSize: 14, color: "#475569", width: "100%", fontFamily: "inherit", background: "transparent" }}/>
          {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", fontSize: 16 }}>✕</button>}
        </div>
      </div>

      <div style={{ padding: "0 16px 40px" }}>
        {filtered.map((cat, ci) => (
          <div key={ci} style={{ marginBottom: 24 }}>
            <div style={{ display: "inline-block", background: "#EFF6FF", color: "#123EAB", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20, marginBottom: 12 }}>
              {cat.category}
            </div>
            {cat.items.map((item, ii) => {
              const key = ci + "-" + ii;
              const isOpen = openItems[key];
              return (
                <div key={ii} style={{ background: "#fff", borderRadius: 16, marginBottom: 10, border: "1px solid #EBEBEB", overflow: "hidden" }}>
                  <div onClick={() => toggle(key)} style={{ padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                    <span style={{ fontWeight: 600, fontSize: 14, color: "#0F172A", flex: 1, paddingRight: 12, lineHeight: 1.4 }}>{item.q}</span>
                    <span style={{ fontSize: 12, color: "#94A3B8", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }}>▼</span>
                  </div>
                  {isOpen && (
                    <div style={{ padding: "0 20px 18px", color: "#475569", fontSize: 14, lineHeight: 1.7, borderTop: "1px solid #F1F5F9" }}>
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: 40, background: "#fff", borderRadius: 20, border: "1px solid #EBEBEB" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <div style={{ color: "#94A3B8", fontSize: 14 }}>Aucune question trouvée</div>
          </div>
        )}

        {/* Contact */}
        <div style={{ background: "linear-gradient(135deg, #123EAB, #1a4fd6)", borderRadius: 20, padding: 20, textAlign: "center" }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>💬</div>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#fff", marginBottom: 6 }}>Vous avez d autres questions ?</div>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, marginBottom: 16 }}>Notre équipe est disponible 7j/7</p>
          <a href="https://wa.me/212657436342" target="_blank" style={{ background: "#25D366", color: "#fff", borderRadius: 30, padding: "12px 28px", fontSize: 14, fontWeight: 700, textDecoration: "none", display: "inline-block" }}>
            💬 Contacter sur WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
