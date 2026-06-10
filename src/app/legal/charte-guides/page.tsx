"use client";
export default function Page() {
  const articles = [
    { title: "1. Conditions d'adhesion", content: "Carte guide officielle Ministere du Tourisme marocain. CIN valide. Minimum 1 an d'experience. Acceptation de la charte. Note moyenne superieure a 3.5/5." },
    { title: "2. Engagements", content: "Ponctualite : present 10 min avant. Aucune commission de magasins tiers. Reponse WhatsApp sous 30 min. Pas de reservations directes les 12 premiers mois apres mise en relation via Laksor." },
    { title: "3. Commission", content: "20 a 25% selon prestation. Remuneration versee dans les 48h suivant la prestation confirmee. Laksor ne preleve aucune commission shopping." },
    { title: "4. Annulation", content: "Plus de 48h : aucune penalite. 24h-48h : avertissement. Moins de 24h : suspension temporaire. 3 annulations tardives en 6 mois : exclusion." },
    { title: "5. Badges", content: "Certifie : documents verifies. Super Guide : note >=4.8 + 50 avis. Ponctuel 95%. Reponse rapide <1h." },
    { title: "6. Exclusion", content: "Faux documents, comportement inapproprie, note <3/5, contournement repete, violation politique anti-commissions shopping." },
  ];
  return (
    <div>
      <div className="mb-6">
        <div className="text-xs font-bold text-bronze-500 uppercase tracking-widest mb-1">Document legal</div>
        <h1 className="font-display text-2xl font-bold text-charcoal-800 mb-1">Charte des Guides Laksor</h1>
        <p className="text-xs text-charcoal-400">Document obligatoire - Signature requise a l inscription</p>
      </div>
      {articles.map((a, i) => (
        <div key={i} className="mb-5">
          <h2 className="text-sm font-bold text-charcoal-800 mb-2 px-3 py-2 rounded-lg" style={{background:"rgba(184,138,68,0.08)", borderLeft:"3px solid #B88A44"}}>{a.title}</h2>
          <p className="text-sm text-charcoal-600 leading-relaxed px-1">{a.content}</p>
        </div>
      ))}
    </div>
  );
}
