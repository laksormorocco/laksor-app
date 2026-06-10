export default function Page() {
  return (
    <div>
      <div className="mb-6">
        <div className="text-xs font-bold text-bronze-500 uppercase tracking-widest mb-1">Document légal</div>
        <h1 className="font-display text-2xl font-bold text-charcoal-800 mb-1">Politique de Confidentialité</h1>
        <p className="text-xs text-charcoal-400">Conforme Loi 09-08 Maroc · RGPD résidents UE · Juin 2025</p>
      </div>
      <div key={"0"} className="mb-5">
          <h2 className="text-sm font-bold text-charcoal-800 mb-2 px-3 py-2 rounded-lg" style={{background:"rgba(184,138,68,0.08)", borderLeft:"3px solid #B88A44"}}>1. Responsable</h2>
          <p className="text-sm text-charcoal-600 leading-relaxed px-1">Laksor, opérant laksor.ma. Contact DPO : privacy@laksor.ma</p>
        </div>
        <div key={"1"} className="mb-5">
          <h2 className="text-sm font-bold text-charcoal-800 mb-2 px-3 py-2 rounded-lg" style={{background:"rgba(184,138,68,0.08)", borderLeft:"3px solid #B88A44"}}>2. Données collectées</h2>
          <p className="text-sm text-charcoal-600 leading-relaxed px-1">Nom, email, téléphone (gestion compte et réservations) · Photo profil (identification) · Documents guides — CIN, carte guide (vérification) · Données réservation (facturation) · Avis (amélioration service).</p>
        </div>
        <div key={"2"} className="mb-5">
          <h2 className="text-sm font-bold text-charcoal-800 mb-2 px-3 py-2 rounded-lg" style={{background:"rgba(184,138,68,0.08)", borderLeft:"3px solid #B88A44"}}>3. Conservation</h2>
          <p className="text-sm text-charcoal-600 leading-relaxed px-1">Compte actif : durée utilisation + 3 ans. Réservations : 5 ans. Documents guides : durée contrat + 1 an. Logs : 1 an.</p>
        </div>
        <div key={"3"} className="mb-5">
          <h2 className="text-sm font-bold text-charcoal-800 mb-2 px-3 py-2 rounded-lg" style={{background:"rgba(184,138,68,0.08)", borderLeft:"3px solid #B88A44"}}>4. Partage</h2>
          <p className="text-sm text-charcoal-600 leading-relaxed px-1">Laksor ne vend jamais vos données. Partage uniquement avec : guides certifiés (nécessaire à la prestation), prestataires de paiement, hébergeur technique, autorités légales sur réquisition.</p>
        </div>
        <div key={"4"} className="mb-5">
          <h2 className="text-sm font-bold text-charcoal-800 mb-2 px-3 py-2 rounded-lg" style={{background:"rgba(184,138,68,0.08)", borderLeft:"3px solid #B88A44"}}>5. Vos droits</h2>
          <p className="text-sm text-charcoal-600 leading-relaxed px-1">Droits d'accès, rectification, effacement, opposition et portabilité. Contact : privacy@laksor.ma — Réponse sous 30 jours.</p>
        </div>
        <div key={"5"} className="mb-5">
          <h2 className="text-sm font-bold text-charcoal-800 mb-2 px-3 py-2 rounded-lg" style={{background:"rgba(184,138,68,0.08)", borderLeft:"3px solid #B88A44"}}>6. Sécurité</h2>
          <p className="text-sm text-charcoal-600 leading-relaxed px-1">Chiffrement SSL/TLS, authentification Supabase sécurisée, accès restreint aux données sensibles, sauvegardes régulières.</p>
        </div>
    </div>
  );
}
