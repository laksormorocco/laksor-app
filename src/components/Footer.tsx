import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{background:"#1A1A1A", color:"#fff", fontFamily:"var(--font-body)", padding:"48px 20px 32px"}}>

      {/* TOP : Logo + tagline */}
      <div style={{textAlign:"center", marginBottom:40}}>
        <img src="/logo7.png" alt="Laksor" style={{height:40, width:"auto", objectFit:"contain", maxWidth:140, marginBottom:12, filter:"brightness(0) invert(1)"}} />
        <p style={{color:"rgba(255,255,255,0.4)", fontSize:12, lineHeight:1.7, maxWidth:280, margin:"0 auto"}}>
          Discover Morocco with certified local guides.<br/>
          Authentic experiences · Private tours
        </p>
      </div>

      {/* GRID LINKS */}
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"32px 16px", marginBottom:36}}>
        <div>
          <div style={{fontSize:10, fontWeight:800, color:"#B88A44", letterSpacing:2, textTransform:"uppercase", marginBottom:14}}>Discover</div>
          {[
            ["Find a guide", "/search"],
            ["Experiences", "/experiences"],
            ["Marrakech guides", "/search?city=Marrakech"],
            ["Fès guides", "/search?city=Fes"],
            ["Essaouira guides", "/search?city=Essaouira"],
          ].map(([l, h]) => (
            <Link key={l} href={h} style={{display:"block", color:"rgba(255,255,255,0.45)", fontSize:13, marginBottom:10, textDecoration:"none"}}>{l}</Link>
          ))}
        </div>
        <div>
          <div style={{fontSize:10, fontWeight:800, color:"#B88A44", letterSpacing:2, textTransform:"uppercase", marginBottom:14}}>Guides</div>
          {[
            ["Become a guide", "/auth/register"],
            ["Guide dashboard", "/dashboard/guide"],
            ["Guide charter", "/legal/charte-guides"],
            ["About Laksor", "/about"],
          ].map(([l, h]) => (
            <Link key={l} href={h} style={{display:"block", color:"rgba(255,255,255,0.45)", fontSize:13, marginBottom:10, textDecoration:"none"}}>{l}</Link>
          ))}
        </div>
      </div>

      {/* STATS */}
      <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:32, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:"16px 12px"}}>
        {[{val:"47+",lbl:"Guides"},{val:"5",lbl:"Cities"},{val:"⭐4.9",lbl:"Rating"}].map(s => (
          <div key={s.lbl} style={{textAlign:"center"}}>
            <div style={{fontFamily:"var(--font-serif)", fontSize:18, fontWeight:700, color:"#B88A44"}}>{s.val}</div>
            <div style={{fontSize:10, color:"rgba(255,255,255,0.3)", marginTop:3}}>{s.lbl}</div>
          </div>
        ))}
      </div>

      {/* CONTACT */}
      <div style={{display:"flex", gap:10, justifyContent:"center", marginBottom:32}}>
        <a href="https://wa.me/212657436342" target="_blank" rel="noopener noreferrer"
          style={{display:"flex", alignItems:"center", gap:6, background:"#25D366", color:"#fff", borderRadius:999, padding:"9px 18px", fontSize:12, fontWeight:700, textDecoration:"none"}}>
          💬 WhatsApp
        </a>
        <a href="mailto:contact@laksor.ma"
          style={{display:"flex", alignItems:"center", gap:6, background:"rgba(255,255,255,0.08)", color:"#fff", borderRadius:999, padding:"9px 18px", fontSize:12, fontWeight:700, textDecoration:"none"}}>
          ✉️ Email
        </a>
        <a href="https://instagram.com/laksor.ma" target="_blank" rel="noopener noreferrer"
          style={{display:"flex", alignItems:"center", gap:6, background:"rgba(255,255,255,0.08)", color:"#fff", borderRadius:999, padding:"9px 18px", fontSize:12, fontWeight:700, textDecoration:"none"}}>
          📸 Instagram
        </a>
      </div>

      {/* BOTTOM */}
      <div style={{borderTop:"1px solid rgba(255,255,255,0.08)", paddingTop:20, textAlign:"center"}}>
        <p style={{color:"rgba(255,255,255,0.2)", fontSize:11, marginBottom:12}}>
          © 2026 Laksor Morocco · All rights reserved
        </p>
        <div style={{display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap"}}>
          {[["Terms","/ legal/cgv"],["Usage Policy","/legal/cgu"],["Privacy","/legal/privacy"],["Guide Charter","/legal/charte-guides"]].map(([l,h]) => (
            <Link key={l} href={h} style={{color:"rgba(255,255,255,0.2)", fontSize:11, textDecoration:"none"}}>{l}</Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
