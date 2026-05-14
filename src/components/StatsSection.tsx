const B="#123EAB",Y="#F4C542";

const STATS = [
  { num:"50+", label:"Guides certifies", icon:"🧭" },
  { num:"500+", label:"Touristes satisfaits", icon:"😊" },
  { num:"10+", label:"Villes couvertes", icon:"📍" },
  { num:"4.9", label:"Note moyenne", icon:"⭐" },
];

export default function StatsSection() {
  return (
    <section style={{background:"linear-gradient(135deg,#123EAB,#0a1f6e)",padding:"60px 16px"}}>
      <div style={{maxWidth:900,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:48}}>
          <h2 style={{fontSize:"clamp(22px,4vw,34px)",fontWeight:900,color:"#fff",margin:"0 0 12px"}}>
            Laksor en chiffres
          </h2>
          <p style={{color:"rgba(255,255,255,0.7)",fontSize:15,margin:0}}>
            La plateforme de reference pour les guides au Maroc
          </p>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:24}}>
          {STATS.map((s,i)=>(
            <div key={i} style={{textAlign:"center",background:"rgba(255,255,255,0.1)",borderRadius:20,padding:28,backdropFilter:"blur(10px)"}}>
              <div style={{fontSize:36,marginBottom:12}}>{s.icon}</div>
              <div style={{fontSize:40,fontWeight:900,color:Y,marginBottom:6}}>{s.num}</div>
              <div style={{fontSize:14,color:"rgba(255,255,255,0.8)",fontWeight:600}}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
