export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

const B="#123EAB",Y="#F4C542",T="#C96B4B",S="#F8F5F0";

const CITIES = ["Toutes","Marrakech","Fes","Casablanca","Rabat","Chefchaouen","Essaouira","Agadir","Tanger","Meknes","Ouarzazate"];
const LANGS = ["Toutes","Francais","Anglais","Espagnol","Russe","Allemand","Hebreu","Italien"];
const TYPES = ["Tous","Histoire","Culinaire","Shopping","Monuments","Aventure","Desert","Artisanat","Photographie"];

export default async function SearchPage({ searchParams }: { searchParams: { city?: string; lang?: string; type?: string; q?: string } }) {
  const guides = await prisma.guideProfile.findMany({
    where: {
      status: "APPROVED",
      ...(searchParams.city && searchParams.city !== "Toutes" ? { city: searchParams.city } : {}),
      ...(searchParams.lang && searchParams.lang !== "Toutes" ? { languages: { has: searchParams.lang } } : {}),
      ...(searchParams.q ? { displayName: { contains: searchParams.q, mode: "insensitive" } } : {}),
    },
    orderBy: { avgRating: "desc" },
    take: 50,
  });

  const activeFilters = [searchParams.city, searchParams.lang, searchParams.type, searchParams.q].filter(Boolean).length;

  return (
    <div style={{background:S,minHeight:"100vh",fontFamily:"Georgia,serif"}}>
      <div style={{background:"#fff",borderBottom:"1px solid #e8e0d6",padding:"0 24px",height:64,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100}}>
        <Link href="/" style={{textDecoration:"none",display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:36,height:36,borderRadius:10,background:B,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:900,fontSize:16}}>L</div>
          <div style={{fontWeight:900,fontSize:15,color:B}}>LAKSOR</div>
        </Link>
        <Link href="/" style={{fontSize:13,color:"#666",textDecoration:"none"}}>← Retour</Link>
      </div>

      <div style={{maxWidth:900,margin:"0 auto",padding:"32px 16px"}}>
        <h1 style={{fontSize:26,fontWeight:900,color:B,marginBottom:4}}>Trouver un guide</h1>
        <p style={{color:"#666",fontSize:14,marginBottom:24}}>{guides.length} guide{guides.length>1?"s":""} disponible{guides.length>1?"s":""}</p>

        <form method="GET" action="/search">
          <div style={{background:"#fff",borderRadius:20,padding:20,marginBottom:24,boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
            <div style={{marginBottom:16}}>
              <input name="q" defaultValue={searchParams.q} placeholder="🔍 Rechercher un guide par nom..." style={{width:"100%",border:"2px solid #e8e0d6",borderRadius:12,padding:"12px 16px",fontSize:15,boxSizing:"border-box"}}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:16}}>
              <div>
                <label style={{fontSize:11,fontWeight:700,color:"#999",display:"block",marginBottom:6}}>VILLE</label>
                <select name="city" defaultValue={searchParams.city} style={{width:"100%",border:"2px solid #e8e0d6",borderRadius:12,padding:"10px 14px",fontSize:14,background:"#fff"}}>
                  {CITIES.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{fontSize:11,fontWeight:700,color:"#999",display:"block",marginBottom:6}}>LANGUE</label>
                <select name="lang" defaultValue={searchParams.lang} style={{width:"100%",border:"2px solid #e8e0d6",borderRadius:12,padding:"10px 14px",fontSize:14,background:"#fff"}}>
                  {LANGS.map(l=><option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label style={{fontSize:11,fontWeight:700,color:"#999",display:"block",marginBottom:6}}>TYPE</label>
                <select name="type" defaultValue={searchParams.type} style={{width:"100%",border:"2px solid #e8e0d6",borderRadius:12,padding:"10px 14px",fontSize:14,background:"#fff"}}>
                  {TYPES.map(t=><option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div style={{display:"flex",gap:10}}>
              <button type="submit" style={{flex:1,background:B,color:"#fff",border:"none",borderRadius:12,padding:"14px 0",fontSize:15,fontWeight:700,cursor:"pointer"}}>
                Rechercher
              </button>
              {activeFilters > 0 && (
                <Link href="/search" style={{background:"#fee2e2",color:"#ef4444",borderRadius:12,padding:"14px 20px",fontSize:14,fontWeight:700,textDecoration:"none"}}>
                  Effacer
                </Link>
              )}
            </div>
          </div>
        </form>

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:20}}>
          {guides.map(g => (
            <Link key={g.id} href={`/guide/${g.id}`} style={{textDecoration:"none"}}>
              <div style={{background:"#fff",borderRadius:20,overflow:"hidden",boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
                <div style={{position:"relative",height:200,background:`linear-gradient(135deg,${B},#1a4fd6)`}}>
                  {g.avatar && <img src={g.avatar} alt={g.displayName} style={{width:"100%",height:"100%",objectFit:"cover"}}/>}
                  <div style={{position:"absolute",top:12,left:12,background:"#22c55e",color:"#fff",borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:700}}>✓ Certifie</div>
                  <div style={{position:"absolute",bottom:12,left:12,color:"#fff"}}>
                    <div style={{fontWeight:800,fontSize:16}}>{g.displayName}</div>
                    <div style={{fontSize:12,opacity:0.9}}>📍 {g.city}</div>
                  </div>
                </div>
                <div style={{padding:16}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
                    <span style={{color:Y,fontSize:14}}>★</span>
                    <span style={{fontWeight:700,fontSize:14}}>{Number(g.avgRating).toFixed(1)}</span>
                    <span style={{color:"#999",fontSize:12}}>({g.totalReviews} avis)</span>
                  </div>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
                    {(g.languages as string[]).slice(0,3).map(l=>(
                      <span key={l} style={{background:"#eef2ff",color:B,padding:"3px 10px",borderRadius:12,fontSize:11,fontWeight:600}}>{l}</span>
                    ))}
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div>
                      <span style={{fontSize:18,fontWeight:900,color:B}}>{g.halfDayPrice} MAD</span>
                      <span style={{fontSize:11,color:"#999"}}> / 4h</span>
                    </div>
                    <div style={{background:B,color:"#fff",borderRadius:10,padding:"8px 14px",fontSize:12,fontWeight:700}}>Voir profil</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {guides.length === 0 && (
          <div style={{textAlign:"center",padding:60,color:"#999"}}>
            <div style={{fontSize:48,marginBottom:16}}>🔍</div>
            <div style={{fontSize:18,fontWeight:700,marginBottom:8}}>Aucun guide trouve</div>
            <Link href="/search" style={{color:B,fontSize:14}}>Effacer les filtres</Link>
          </div>
        )}
      </div>
    </div>
  );
}
