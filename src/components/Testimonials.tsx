const B="#123EAB",Y="#F4C542",S="#F8F5F0";

const TESTIMONIALS = [
  { name:"Sophie M.", country:"🇫🇷 France", text:"Une experience incroyable a Marrakech ! Notre guide Youssef nous a fait decouvrir des endroits que nous n aurions jamais trouves seuls. Je recommande vivement Laksor !", rating:5, guide:"Youssef A.", city:"Marrakech" },
  { name:"John D.", country:"🇬🇧 Angleterre", text:"Best experience in Morocco! Our guide spoke perfect English and knew every hidden gem in Fes. The booking was super easy through Laksor.", rating:5, guide:"Hassan B.", city:"Fes" },
  { name:"Maria G.", country:"🇩🇪 Allemagne", text:"Wunderbare Erfahrung in Chefchaouen! Unser Fuhrer war sehr professionell und freundlich. Laksor ist die beste Plattform fur Reisefuhrer in Marokko.", rating:5, guide:"Fatima Z.", city:"Chefchaouen" },
  { name:"David L.", country:"🇺🇸 USA", text:"Laksor made our Sahara trip unforgettable. The guide was knowledgeable, punctual and made us feel safe throughout the journey. Will definitely use again!", rating:5, guide:"Omar K.", city:"Ouarzazate" },
];

export default function Testimonials() {
  return (
    <section style={{background:S,padding:"60px 16px"}}>
      <div style={{maxWidth:900,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:48}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"#fffbeb",borderRadius:20,padding:"6px 16px",marginBottom:16}}>
            <span style={{color:"#d97706",fontWeight:700,fontSize:12,letterSpacing:1}}>⭐ TEMOIGNAGES</span>
          </div>
          <h2 style={{fontSize:"clamp(24px,4vw,36px)",fontWeight:900,color:B,margin:"0 0 12px"}}>
            Ils ont vecu l experience
          </h2>
          <p style={{color:"#666",fontSize:16,maxWidth:500,margin:"0 auto"}}>
            Des voyageurs du monde entier nous font confiance
          </p>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:20}}>
          {TESTIMONIALS.map((t,i)=>(
            <div key={i} style={{background:"#fff",borderRadius:20,padding:24,boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
              <div style={{color:Y,fontSize:18,marginBottom:12}}>{"★".repeat(t.rating)}</div>
              <p style={{fontSize:14,color:"#444",lineHeight:1.7,margin:"0 0 20px",fontStyle:"italic"}}>"{t.text}"</p>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontWeight:700,fontSize:14,color:"#333"}}>{t.name}</div>
                  <div style={{fontSize:12,color:"#999"}}>{t.country}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:12,fontWeight:600,color:B}}>{t.guide}</div>
                  <div style={{fontSize:11,color:"#999"}}>📍 {t.city}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
