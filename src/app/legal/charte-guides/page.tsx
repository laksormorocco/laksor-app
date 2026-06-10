"use client";
export default function Page() {
  return (
    <div>
      <div className="mb-6">
        <div className="text-xs font-bold text-bronze-500 uppercase tracking-widest mb-1">Document légal</div>
        <h1 className="font-display text-2xl font-bold text-charcoal-800 mb-1">Charte des Guides Laksor</h1>
        <p className="text-xs text-charcoal-400">Document obligatoire · Signature requise à l'inscription</p>
      </div>
      <div key={"0"} className="mb-5">
          <h2 className="text-sm font-bold text-charcoal-800 mb-2 px-3 py-2 rounded-lg" style={{background:"rgba(184,138,68,0.08)", borderLeft:"3px solid #B88A44"}}>1. Conditions d'adhésion</h2>
          <p className="text-sm text-charcoal-600 leading-relaxed px-1">Carte guide officielle Ministère du Tourisme marocain · CIN valide · Minimum 1 an d'expérience · Acceptation de la charte · Note moyenne supérieure à 3.5/5.</p>
        </div>
        <div key={"1"} className="mb-5">
          <h2 className="text-sm font-bold text-charcoal-800 mb-2 px-3 py-2 rounded-lg" style={{background:"rgba(184,138,68,0.08)", borderLeft:"3px solid #B88A44"}}>2. Engagements</h2>
          <p className="text-sm text-charcoal-600 leading-relaxed px-1">Ponctualité : présent 10 min avant · Aucune commission de magasins tiers · Réponse WhatsApp sous 30 min · Pas de réservations directes les 12 premiers mois après mise en relation via Laksor.</p>
        </div>
        <div key={"2"} className="mb-5">
          <h2 className="text-sm font-bold text-charcoal-800 mb-2 px-3 py-2 rounded-lg" style={{background:"rgba(184,138,68,0.08)", borderLeft:"3px solid #B88A44"}}>3. Commission</h2>
          <p className="text-sm text-charcoal-600 leading-relaxed px-1">20 à 25% selon prestation. Rémunération versée dans les 48h suivant la prestation confirmée. Laksor ne prélève aucune commission shopping — le guide conserve 100% de sa rémunération de visite.</p>
        </div>
        <div key={"3"} className="mb-5">
          <h2 className="text-sm font-bold text-charcoal-800 mb-2 px-3 py-2 rounded-lg" style={{background:"rgba(184,138,68,0.08)", borderLeft:"3px solid #B88A44"}}>4. Annulation</h2>
          <p className="text-sm text-charcoal-600 leading-relaxed px-1">Plus de 48h : aucune pénalité · 24h-48h : avertissement · Moins de 24h : suspension temporaire · 3 annulations tardives en 6 mois : exclusion.</p>
        </div>
        <div key={"4"} className="mb-5">
          <h2 className="text-sm font-bold text-charcoal-800 mb-2 px-3 py-2 rounded-lg" style={{background:"rgba(184,138,68,0.08)", borderLeft:"3px solid #B88A44"}}>5. Badges</h2>
          <p className="text-sm text-charcoal-600 leading-relaxed px-1">⭐ Certifié : documents vérifiés · 🏆 Super Guide : note ≥4.8 + 50 avis · ⏰ Ponctuel 95% · ⚡ Réponse rapide <1h.</p>
        </div>
        <div key={"5"} className="mb-5">
          <h2 className="text-sm font-bold text-charcoal-800 mb-2 px-3 py-2 rounded-lg" style={{background:"rgba(184,138,68,0.08)", borderLeft:"3px solid #B88A44"}}>6. Exclusion</h2>
          <p className="text-sm text-charcoal-600 leading-relaxed px-1">Faux documents, comportement inapproprié, note <3/5, contournement répété, violation politique anti-commissions shopping.</p>
        </div>
    </div>
  );
}
