const B="#123EAB",Y="#F4C542",S="#F8F5F0";

const STEPS = [
  { num:"01", icon:"🔍", title:"Trouvez votre guide", desc:"Parcourez notre selection de guides certifies par ville, langue et specialite." },
  { num:"02", icon:"📅", title:"Reservez en ligne", desc:"Choisissez vos dates et duree. Connectez-vous avec Google en quelques secondes." },
  { num:"03", icon:"🧭", title:"Vivez l experience", desc:"Rencontrez votre guide et decouvrez le Maroc autrement. Payez cash sur place." },
];

export default function HowItWorks() {
  return (
    <section style={{background:"#fff",padding:"60px 16px"}}>
      <div style={{maxWidth:900,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:48}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"#eef2ff",borderRadius:20,padding:"6px 16px",marginBottom:16}}>
            <span style={{color:B,fontWeight:700,fontSize:12,letterSpacing:1}}>COMMENT CA MARCHE</span>
          </div>
          <h2 style={{fontSize:"clamp(24px,4vw,36px)",fontWeight:900,color:B,margin:"0 0 12px"}}>
            Simple comme bonjour
          </h2>
          <p style={{color:"#666",fontSize:16,maxWidth:500,margin:"0 auto"}}>
            De la recherche a la rencontre en 3 etapes
          </p>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:32}}>
          {STEPS.map((s,i)=>(
            <div key={i} style={{textAlign:"center",position:"relative"}}>
              <div style={{width:72,height:72,borderRadius:20,background:"linear-gradient(135deg,#123EAB,#1a4fd6)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",fontSize:32}}>
                {s.icon}
              </div>
              <div style={{position:"absolute",top:0,right:"50%",transform:"translateX(200%)",background:Y,color:"#111",borderRadius:10,padding:"3px 8px",fontSize:11,fontWeight:900}}>
                {s.num}
              </div>
              <h3 style={{fontSize:18,fontWeight:800,color:B,marginBottom:10}}>{s.title}</h3>
              <p style={{fontSize:14,color:"#666",lineHeight:1.7,margin:0}}>{s.desc}</p>
            </div>
          ))}
        </div>

        <div style={{marginTop:48,textAlign:"center"}}>
          <a href="/search" style={{background:B,color:"#fff",borderRadius:32,padding:"16px 40px",fontSize:16,fontWeight:700,textDecoration:"none",display:"inline-block"}}>
            Trouver mon guide →
          </a>
        </div>
      </div>
    </section>
  );
}
