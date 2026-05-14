export const dynamic = "force-dynamic";
import Link from "next/link";
const B="#123EAB",Y="#F4C542",S="#F8F5F0";

export default function ConfirmationPage({ searchParams }: { searchParams: { guide?: string; date?: string; price?: string; persons?: string } }) {
  return (
    <div style={{background:S,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"Georgia,serif"}}>
      <div style={{background:"#fff",borderRadius:24,padding:40,maxWidth:480,width:"100%",textAlign:"center",boxShadow:"0 4px 40px rgba(0,0,0,0.08)"}}>
        <div style={{fontSize:64,marginBottom:16}}>🎉</div>
        <h1 style={{fontSize:24,fontWeight:900,color:B,marginBottom:8}}>Reservation confirmee !</h1>
        <p style={{color:"#666",fontSize:15,lineHeight:1.6,marginBottom:24}}>
          Votre demande a bien ete envoyee a <strong>{searchParams.guide || "votre guide"}</strong>.<br/>
          Il vous contactera sous 24h pour confirmer.
        </p>

        <div style={{background:S,borderRadius:16,padding:20,marginBottom:24,textAlign:"left"}}>
          {searchParams.date && <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{color:"#666",fontSize:14}}>Date</span><span style={{fontWeight:700,fontSize:14}}>{searchParams.date}</span></div>}
          {searchParams.persons && <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{color:"#666",fontSize:14}}>Personnes</span><span style={{fontWeight:700,fontSize:14}}>{searchParams.persons}</span></div>}
          {searchParams.price && <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"#666",fontSize:14}}>Total</span><span style={{fontWeight:900,fontSize:18,color:B}}>{searchParams.price} MAD</span></div>}
        </div>

        <div style={{background:"#fff7ed",borderRadius:14,padding:16,marginBottom:24,textAlign:"left",border:"1px solid #fed7aa"}}>
          <div style={{fontSize:13,fontWeight:700,color:"#c2410c",marginBottom:4}}>Paiement cash</div>
          <div style={{fontSize:13,color:"#9a3412",lineHeight:1.5}}>Le paiement s effectue directement au guide le jour de la visite.</div>
        </div>

        <Link href="/" style={{background:B,color:"#fff",borderRadius:14,padding:"14px 32px",fontSize:15,fontWeight:700,textDecoration:"none",display:"inline-block",marginRight:12}}>
          Retour accueil
        </Link>
        <Link href="/search" style={{background:Y,color:"#111",borderRadius:14,padding:"14px 32px",fontSize:15,fontWeight:700,textDecoration:"none",display:"inline-block"}}>
          Voir guides
        </Link>
      </div>
    </div>
  );
}
