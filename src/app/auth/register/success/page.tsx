const B="#123EAB",Y="#F4C542",S="#F8F5F0";
export default function SuccessPage() {
  return (
    <div style={{background:S,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"Georgia,serif"}}>
      <div style={{background:"#fff",borderRadius:24,padding:40,maxWidth:400,textAlign:"center",boxShadow:"0 4px 40px rgba(0,0,0,0.08)"}}>
        <div style={{fontSize:64,marginBottom:20}}>🎉</div>
        <h1 style={{fontSize:24,fontWeight:900,color:B,marginBottom:12}}>Candidature envoyée !</h1>
        <p style={{color:"#666",fontSize:15,lineHeight:1.6,marginBottom:24}}>
          Nous avons bien reçu votre demande. Notre équipe va examiner votre profil et vous contacter sur WhatsApp sous 24h.
        </p>
        <a href="/" style={{background:Y,color:"#111",borderRadius:14,padding:"14px 32px",fontSize:15,fontWeight:700,textDecoration:"none",display:"inline-block"}}>
          Retour à l accueil
        </a>
      </div>
    </div>
  );
}
