import Link from "next/link";
const B="#123EAB",Y="#F4C542";

export default function Footer() {
  return (
    <footer style={{background:"#0f1f5c",padding:"48px 16px 24px",color:"#fff"}}>
      <div style={{maxWidth:900,margin:"0 auto"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:32,marginBottom:40}}>
          
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
              <div style={{width:40,height:40,borderRadius:12,background:B,border:"2px solid rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",color:Y,fontWeight:900,fontSize:20}}>L</div>
              <div>
                <div style={{fontWeight:900,fontSize:15,color:"#fff"}}>LAKSOR</div>
                <div style={{fontSize:9,color:"rgba(255,255,255,0.5)",letterSpacing:2}}>TOUR GUIDE MOROCCO</div>
              </div>
            </div>
            <p style={{fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.7,margin:"0 0 16px"}}>
              La plateforme qui connecte les voyageurs avec les meilleurs guides locaux du Maroc.
            </p>
            <a href="https://instagram.com/laksor.morocco" target="_blank" style={{display:"inline-flex",alignItems:"center",gap:8,background:"linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)",borderRadius:10,padding:"8px 14px",textDecoration:"none",fontSize:13,fontWeight:700,color:"#fff"}}>
              📸 @laksor.morocco
            </a>
          </div>

          <div>
            <div style={{fontWeight:700,fontSize:13,color:Y,letterSpacing:1,marginBottom:16}}>EXPLORER</div>
            {[
              {label:"Trouver un guide",href:"/search"},
              {label:"Devenir guide",href:"/auth/register"},
              {label:"Marrakech",href:"/search?city=Marrakech"},
              {label:"Fes",href:"/search?city=Fes"},
              {label:"Chefchaouen",href:"/search?city=Chefchaouen"},
            ].map(l=>(
              <Link key={l.label} href={l.href} style={{display:"block",color:"rgba(255,255,255,0.7)",textDecoration:"none",fontSize:13,marginBottom:10,lineHeight:1.5}}>
                {l.label}
              </Link>
            ))}
          </div>

          <div>
            <div style={{fontWeight:700,fontSize:13,color:Y,letterSpacing:1,marginBottom:16}}>INFORMATIONS</div>
            {[
              {label:"Comment ca marche",href:"/#how-it-works"},
              {label:"Tarifs et commissions",href:"/#tarifs"},
              {label:"Devenir guide",href:"/auth/register"},
              {label:"Nous contacter",href:"mailto:laksor.morocco@gmail.com"},
            ].map(l=>(
              <a key={l.label} href={l.href} style={{display:"block",color:"rgba(255,255,255,0.7)",textDecoration:"none",fontSize:13,marginBottom:10}}>
                {l.label}
              </a>
            ))}
          </div>

          <div>
            <div style={{fontWeight:700,fontSize:13,color:Y,letterSpacing:1,marginBottom:16}}>CONTACT</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.7)",marginBottom:10}}>📧 laksor.morocco@gmail.com</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.7)",marginBottom:10}}>📍 Maroc</div>
            <a href="https://wa.me/212657436342" target="_blank" style={{display:"inline-flex",alignItems:"center",gap:8,background:"#25D366",borderRadius:10,padding:"8px 14px",textDecoration:"none",fontSize:13,fontWeight:700,color:"#fff",marginTop:8}}>
              💬 WhatsApp
            </a>
          </div>

        </div>

        <div style={{borderTop:"1px solid rgba(255,255,255,0.1)",paddingTop:24,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.5)"}}>
            © 2025 Laksor. Tous droits reserves.
          </div>
          <div style={{display:"flex",gap:20}}>
            <a href="#" style={{fontSize:12,color:"rgba(255,255,255,0.5)",textDecoration:"none"}}>CGU</a>
            <a href="#" style={{fontSize:12,color:"rgba(255,255,255,0.5)",textDecoration:"none"}}>Confidentialite</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
