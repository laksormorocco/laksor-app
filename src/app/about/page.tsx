import Link from "next/link";
const B="#123EAB",Y="#F4C542",T="#C96B4B",S="#F8F5F0";

export default function AboutPage() {
  return (
    <div style={{background:S,minHeight:"100vh",fontFamily:"Georgia,serif"}}>
      <div style={{background:"#fff",borderBottom:"1px solid #e8e0d6",padding:"0 24px",height:64,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100}}>
        <Link href="/" style={{textDecoration:"none"}}>
          <img src="/Logo.png" alt="Laksor" style={{height:70,width:"auto"}}/>
        </Link>
        <Link href="/" style={{fontSize:13,color:"#666",textDecoration:"none"}}>← Retour</Link>
      </div>

      <div style={{maxWidth:800,margin:"0 auto",padding:"60px 16px"}}>

        <div style={{textAlign:"center",marginBottom:60}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"#eef2ff",borderRadius:20,padding:"6px 16px",marginBottom:20}}>
            <span style={{color:B,fontWeight:700,fontSize:12,letterSpacing:2}}>NOTRE HISTOIRE</span>
          </div>
          <h1 style={{fontSize:"clamp(32px,5vw,52px)",fontWeight:900,color:B,margin:"0 0 24px",lineHeight:1.15}}>
            Laksor, une porte<br/>vers le vrai Maroc
          </h1>
          <p style={{fontSize:17,color:"#555",lineHeight:1.8,maxWidth:640,margin:"0 auto"}}>
            Dans la medina de Marrakech, certains lieux ne sont pas seulement des quartiers : ce sont des seuils. Des espaces ou l on entre dans la ville ancienne, ou l on se perd dans les ruelles, ou l on decouvre les souks, les riads, les conteurs, les artisans et les palais caches derriere des portes discretes.
          </p>
        </div>

        <div style={{background:"linear-gradient(135deg,#123EAB,#0a1f6e)",borderRadius:24,padding:"48px 32px",color:"#fff",marginBottom:48,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:-40,right:-40,width:200,height:200,borderRadius:"50%",background:"rgba(244,197,66,0.08)"}}/>
          <h2 style={{fontSize:"clamp(22px,4vw,32px)",fontWeight:900,marginBottom:20,lineHeight:1.3}}>
            Le nom qui porte une symbolique
          </h2>
          <p style={{fontSize:15,opacity:0.9,lineHeight:1.8,marginBottom:20}}>
            Le nom Laksor porte en lui une histoire profondement liee a Marrakech, a la medina et a l idee meme du voyage. Dans l imaginaire marocain, "Laksor" evoque les palais, les passages, les anciennes demeures du pouvoir et les portes qui menent au coeur vivant de la ville.
          </p>
          <p style={{fontSize:15,opacity:0.9,lineHeight:1.8}}>
            Marrakech fut fondee au XIe siecle par les Almoravides et devint rapidement une capitale imperiale riche de palais, de jardins et de caravansérails. Ce n est pas un hasard si ce nom est devenu un point de passage naturel pour les visiteurs.
          </p>
        </div>

        <div style={{background:"#fff",borderRadius:20,padding:36,marginBottom:48,boxShadow:"0 2px 16px rgba(0,0,0,0.06)"}}>
          <h2 style={{fontSize:24,fontWeight:900,color:T,marginBottom:20}}>
            Plus qu une plateforme
          </h2>
          <p style={{fontSize:15,color:"#444",lineHeight:1.8,marginBottom:16}}>
            Laksor devient alors plus qu un nom : c est une symbolique. Celle d un seuil que l on franchit pour entrer dans le Maroc authentique — loin des circuits touristiques standardises, au plus pres des hommes et des femmes qui font vivre cette culture millenaire.
          </p>
          <p style={{fontSize:15,color:"#444",lineHeight:1.8}}>
            Notre mission est simple : connecter les voyageurs du monde entier avec les guides locaux les plus passionnes du Maroc, pour que chaque visite devienne une memoire.
          </p>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:20,marginBottom:48}}>
          {[
            {icon:"🏰",title:"Ancrage local",desc:"Des guides nes et eleves dans les villes qu ils font decouvrir."},
            {icon:"✅",title:"Guides certifies",desc:"Chaque guide est verifie et approuve par notre equipe avant de rejoindre la plateforme."},
            {icon:"🌍",title:"7 langues",desc:"Nos guides parlent francais, anglais, espagnol, allemand, russe, hebreu et arabe."},
            {icon:"💫",title:"Experience unique",desc:"Chaque visite est une porte vers le Maroc que les touristes ne voient pas."},
          ].map((item,i)=>(
            <div key={i} style={{background:"#fff",borderRadius:20,padding:24,boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
              <div style={{fontSize:36,marginBottom:12}}>{item.icon}</div>
              <h3 style={{fontSize:15,fontWeight:800,color:B,marginBottom:8}}>{item.title}</h3>
              <p style={{fontSize:13,color:"#666",lineHeight:1.7,margin:0}}>{item.desc}</p>
            </div>
          ))}
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:16,marginBottom:48}}>
          {[
            {num:"50+",label:"Guides certifies",color:B},
            {num:"10+",label:"Villes couvertes",color:T},
            {num:"500+",label:"Voyageurs satisfaits",color:"#22c55e"},
            {num:"4.9★",label:"Note moyenne",color:"#d97706"},
          ].map((s,i)=>(
            <div key={i} style={{background:"#fff",borderRadius:20,padding:24,textAlign:"center",boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
              <div style={{fontSize:28,fontWeight:900,color:s.color,marginBottom:6}}>{s.num}</div>
              <div style={{fontSize:12,color:"#888"}}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{background:"#fff",borderRadius:20,padding:32,marginBottom:48,boxShadow:"0 2px 12px rgba(0,0,0,0.06)",textAlign:"center"}}>
          <div style={{width:80,height:80,borderRadius:"50%",background:"linear-gradient(135deg,#C96B4B,#e8845a)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",fontSize:36}}>🎨</div>
          <div style={{fontWeight:900,fontSize:20,color:B,marginBottom:4}}>IRA</div>
          <div style={{fontSize:13,color:"#999",marginBottom:4,letterSpacing:1}}>ACCOMPAGNATEUR VIP · ARTISTE PEINTRE</div>
          <div style={{fontSize:12,color:"#C96B4B",fontWeight:700,marginBottom:16}}>40 ans d experience · Depuis 1984</div>
          <p style={{fontSize:14,color:"#444",lineHeight:1.8,maxWidth:480,margin:"0 auto"}}>
            Accompagnateur de touristes VIP depuis 1984 et artiste peintre, IRA incarne l ame de Laksor. Sa connaissance profonde du Maroc, des medinas aux deserts, des palais aux ateliers d artisans, est le coeur battant de notre plateforme.
          </p>
        </div>

        <div style={{background:Y,borderRadius:20,padding:36,textAlign:"center"}}>
          <h2 style={{fontSize:24,fontWeight:900,color:"#111",marginBottom:12}}>
            Franchissez le seuil
          </h2>
          <p style={{fontSize:15,color:"#333",marginBottom:28,lineHeight:1.7}}>
            Vous etes guide ? Rejoignez Laksor et partagez votre passion pour le Maroc avec des voyageurs du monde entier.
          </p>
          <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
            <Link href="/auth/register" style={{background:B,color:"#fff",borderRadius:14,padding:"14px 32px",fontSize:15,fontWeight:700,textDecoration:"none"}}>
              Devenir guide
            </Link>
            <Link href="/search" style={{background:"#fff",color:B,borderRadius:14,padding:"14px 32px",fontSize:15,fontWeight:700,textDecoration:"none"}}>
              Trouver un guide
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
