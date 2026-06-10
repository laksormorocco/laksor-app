"use client";
export default function Page() {
  return (
    <div>
      <div className="mb-6">
        <div className="text-xs font-bold text-bronze-500 uppercase tracking-widest mb-1">Document légal</div>
        <h1 className="font-display text-2xl font-bold text-charcoal-800 mb-1">Conditions Générales d'Utilisation</h1>
        <p className="text-xs text-charcoal-400">Applicable à tous les utilisateurs · Juin 2025</p>
      </div>
      <div key={"0"} className="mb-5">
          <h2 className="text-sm font-bold text-charcoal-800 mb-2 px-3 py-2 rounded-lg" style={{background:"rgba(184,138,68,0.08)", borderLeft:"3px solid #B88A44"}}>1. Accès</h2>
          <p className="text-sm text-charcoal-600 leading-relaxed px-1">Gratuit pour les touristes. L'inscription guide nécessite vérification de documents (carte guide + CIN). Laksor peut suspendre tout compte ne respectant pas les CGU.</p>
        </div>
        <div key={"1"} className="mb-5">
          <h2 className="text-sm font-bold text-charcoal-800 mb-2 px-3 py-2 rounded-lg" style={{background:"rgba(184,138,68,0.08)", borderLeft:"3px solid #B88A44"}}>2. Compte</h2>
          <p className="text-sm text-charcoal-600 leading-relaxed px-1">Informations exactes obligatoires. Comptes frauduleux suspendus immédiatement. L'utilisateur est responsable de la confidentialité de ses identifiants.</p>
        </div>
        <div key={"2"} className="mb-5">
          <h2 className="text-sm font-bold text-charcoal-800 mb-2 px-3 py-2 rounded-lg" style={{background:"rgba(184,138,68,0.08)", borderLeft:"3px solid #B88A44"}}>3. Utilisations interdites</h2>
          <p className="text-sm text-charcoal-600 leading-relaxed px-1">Interdit : contourner la plateforme pour réservations directes (12 premiers mois), faux avis, harcèlement, utilisation commerciale non autorisée.</p>
        </div>
        <div key={"3"} className="mb-5">
          <h2 className="text-sm font-bold text-charcoal-800 mb-2 px-3 py-2 rounded-lg" style={{background:"rgba(184,138,68,0.08)", borderLeft:"3px solid #B88A44"}}>4. Propriété intellectuelle</h2>
          <p className="text-sm text-charcoal-600 leading-relaxed px-1">Contenu Laksor protégé par le droit marocain. Les guides conservent leurs droits sur leurs contenus et accordent à Laksor une licence d'utilisation.</p>
        </div>
        <div key={"4"} className="mb-5">
          <h2 className="text-sm font-bold text-charcoal-800 mb-2 px-3 py-2 rounded-lg" style={{background:"rgba(184,138,68,0.08)", borderLeft:"3px solid #B88A44"}}>5. Avis</h2>
          <p className="text-sm text-charcoal-600 leading-relaxed px-1">Avis authentiques obligatoires. Laksor peut supprimer tout avis frauduleux ou offensant.</p>
        </div>
        <div key={"5"} className="mb-5">
          <h2 className="text-sm font-bold text-charcoal-800 mb-2 px-3 py-2 rounded-lg" style={{background:"rgba(184,138,68,0.08)", borderLeft:"3px solid #B88A44"}}>6. Disponibilité</h2>
          <p className="text-sm text-charcoal-600 leading-relaxed px-1">Laksor vise 24h/24 7j/7. Des interruptions de maintenance peuvent survenir.</p>
        </div>
    </div>
  );
}
