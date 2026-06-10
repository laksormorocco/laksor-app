"use client";
export default function Page() {
  return (
    <div>
      <div className="mb-6">
        <div className="text-xs font-bold text-bronze-500 uppercase tracking-widest mb-1">Document légal</div>
        <h1 className="font-display text-2xl font-bold text-charcoal-800 mb-1">Conditions Générales de Vente</h1>
        <p className="text-xs text-charcoal-400">Dernière mise à jour : Juin 2025 · Applicable aux touristes</p>
      </div>
      <div key={"0"} className="mb-5">
          <h2 className="text-sm font-bold text-charcoal-800 mb-2 px-3 py-2 rounded-lg" style={{background:"rgba(184,138,68,0.08)", borderLeft:"3px solid #B88A44"}}>1. Objet</h2>
          <p className="text-sm text-charcoal-600 leading-relaxed px-1">Les présentes CGV régissent les réservations sur laksor.ma. Laksor est une marketplace de mise en relation entre touristes et guides locaux certifiés au Maroc. Laksor agit en qualité d'intermédiaire. Toute réservation implique l'acceptation des présentes CGV.</p>
        </div>
        <div key={"1"} className="mb-5">
          <h2 className="text-sm font-bold text-charcoal-800 mb-2 px-3 py-2 rounded-lg" style={{background:"rgba(184,138,68,0.08)", borderLeft:"3px solid #B88A44"}}>2. Services</h2>
          <p className="text-sm text-charcoal-600 leading-relaxed px-1">Laksor propose : (1) Tours avec guides locaux certifiés — visites privées dans les villes marocaines. (2) Expériences Laksor — activités authentiques opérées par des prestataires partenaires vérifiés.</p>
        </div>
        <div key={"2"} className="mb-5">
          <h2 className="text-sm font-bold text-charcoal-800 mb-2 px-3 py-2 rounded-lg" style={{background:"rgba(184,138,68,0.08)", borderLeft:"3px solid #B88A44"}}>3. Réservation</h2>
          <p className="text-sm text-charcoal-600 leading-relaxed px-1">Confirmée après réception de l'email avec référence REF:LAK-XXXX. Étapes : sélection du guide, choix de la date, informations personnelles, mode de paiement, confirmation email.</p>
        </div>
        <div key={"3"} className="mb-5">
          <h2 className="text-sm font-bold text-charcoal-800 mb-2 px-3 py-2 rounded-lg" style={{background:"rgba(184,138,68,0.08)", borderLeft:"3px solid #B88A44"}}>4. Paiement</h2>
          <p className="text-sm text-charcoal-600 leading-relaxed px-1">Prix en MAD et équivalent €. Commission Laksor incluse. Modes : (1) Acompte 30% + 70% le jour J. (2) 100% en ligne. (3) Cash le jour J selon guide. Aucune donnée bancaire stockée.</p>
        </div>
        <div key={"4"} className="mb-5">
          <h2 className="text-sm font-bold text-charcoal-800 mb-2 px-3 py-2 rounded-lg" style={{background:"rgba(184,138,68,0.08)", borderLeft:"3px solid #B88A44"}}>5. Annulation</h2>
          <p className="text-sm text-charcoal-600 leading-relaxed px-1">Plus de 72h : 100% remboursé. 48h-72h : 70%. 24h-48h : 50%. Moins de 24h : non remboursé. No-show : non remboursé. Annulation par guide : 100% remboursé. Contact : support@laksor.ma avec référence REF.</p>
        </div>
        <div key={"5"} className="mb-5">
          <h2 className="text-sm font-bold text-charcoal-800 mb-2 px-3 py-2 rounded-lg" style={{background:"rgba(184,138,68,0.08)", borderLeft:"3px solid #B88A44"}}>6. Responsabilités</h2>
          <p className="text-sm text-charcoal-600 leading-relaxed px-1">Laksor est intermédiaire. Les guides sont responsables de leurs prestations. Laksor vérifie les certifications des guides avant mise en ligne. Non responsable des conditions météo ou force majeure.</p>
        </div>
        <div key={"6"} className="mb-5">
          <h2 className="text-sm font-bold text-charcoal-800 mb-2 px-3 py-2 rounded-lg" style={{background:"rgba(184,138,68,0.08)", borderLeft:"3px solid #B88A44"}}>7. Réclamations</h2>
          <p className="text-sm text-charcoal-600 leading-relaxed px-1">7 jours après la prestation pour contacter Laksor. Traitement sous 5 jours ouvrés. Contact : support@laksor.ma</p>
        </div>
        <div key={"7"} className="mb-5">
          <h2 className="text-sm font-bold text-charcoal-800 mb-2 px-3 py-2 rounded-lg" style={{background:"rgba(184,138,68,0.08)", borderLeft:"3px solid #B88A44"}}>8. Droit applicable</h2>
          <p className="text-sm text-charcoal-600 leading-relaxed px-1">Droit marocain applicable. Tribunaux de Marrakech compétents en cas de litige.</p>
        </div>
    </div>
  );
}
