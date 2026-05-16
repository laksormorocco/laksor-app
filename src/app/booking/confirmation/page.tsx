import Link from "next/link";

export default function ConfirmationPage({ searchParams }: { searchParams: { guide?: string; price?: string; persons?: string } }) {
  return (
    <div style={{ minHeight:"100vh", background:"#F7F7F7", fontFamily:"Inter, -apple-system, sans-serif", display:"flex", flexDirection:"column" }}>

      {/* Navbar */}
      <nav style={{ background:"linear-gradient(135deg,#123EAB,#1a4fd6)", padding:"0 16px", height:60, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontWeight:900, color:"#fff", fontSize:18 }}>LAKSOR</span>
          <span style={{ color:"#F4C542", fontSize:11, fontWeight:700, letterSpacing:"1px" }}>MOROCCO</span>
        </div>
      </nav>

      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 16px" }}>
        <div style={{ background:"#fff", borderRadius:24, padding:32, maxWidth:420, width:"100%", textAlign:"center", border:"1px solid #EBEBEB", boxShadow:"0 4px 24px rgba(0,0,0,0.06)" }}>

          {/* Success Icon */}
          <div style={{ width:80, height:80, background:"linear-gradient(135deg,#22c55e,#16a34a)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 24px", fontSize:36 }}>
            🎉
          </div>

          <h1 style={{ fontSize:24, fontWeight:700, color:"#0F172A", marginBottom:8 }}>
            Demande envoyée !
          </h1>
          <p style={{ color:"#718096", fontSize:15, lineHeight:1.6, marginBottom:24 }}>
            <strong>{searchParams.guide || "Votre guide"}</strong> va examiner votre demande et vous contacter sous 24h.
          </p>

          {/* Details */}
          {(searchParams.price || searchParams.persons) && (
            <div style={{ background:"#F8FAFC", borderRadius:16, padding:18, marginBottom:20, textAlign:"left" }}>
              {searchParams.persons && (
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                  <span style={{ color:"#94A3B8", fontSize:14 }}>Personnes</span>
                  <span style={{ fontWeight:600, fontSize:14, color:"#0F172A" }}>{searchParams.persons}</span>
                </div>
              )}
              {searchParams.price && (
                <div style={{ display:"flex", justifyContent:"space-between", paddingTop:8, borderTop:"1px solid #E2E8F0" }}>
                  <span style={{ color:"#123EAB", fontWeight:700, fontSize:15 }}>Total</span>
                  <span style={{ fontWeight:900, fontSize:20, color:"#22c55e" }}>{searchParams.price} MAD</span>
                </div>
              )}
            </div>
          )}

          {/* Payment info */}
          <div style={{ background:"#FFF7ED", borderRadius:14, padding:14, marginBottom:24, border:"1px solid #FED7AA", textAlign:"left" }}>
            <div style={{ fontWeight:700, fontSize:13, color:"#c2410c", marginBottom:4 }}>💵 Paiement cash</div>
            <div style={{ fontSize:12, color:"#9a3412", lineHeight:1.5 }}>Le paiement s effectue directement au guide le jour de la visite.</div>
          </div>

          {/* Steps */}
          <div style={{ background:"#F8FAFC", borderRadius:16, padding:16, marginBottom:24, textAlign:"left" }}>
            {[
              { icon:"✅", title:"Demande soumise", done:true },
              { icon:"💬", title:"Le guide vous contacte sous 24h", done:false },
              { icon:"🧭", title:"Vivez l experience !", done:false },
            ].map((s,i) => (
              <div key={i} style={{ display:"flex", gap:12, alignItems:"center", marginBottom:i<2?12:0 }}>
                <div style={{ width:32, height:32, borderRadius:"50%", background:s.done?"#DCFCE7":"#F1F5F9", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>{s.icon}</div>
                <div style={{ fontSize:13, fontWeight:s.done?600:400, color:s.done?"#166534":"#475569" }}>{s.title}</div>
              </div>
            ))}
          </div>

          <Link href="/dashboard/tourist" style={{ display:"block", background:"#0B132B", color:"#fff", borderRadius:30, padding:"16px 32px", fontSize:15, fontWeight:600, textDecoration:"none", marginBottom:10 }}>
            Voir mes réservations
          </Link>
          <Link href="/search" style={{ display:"block", background:"#F7F7F7", color:"#123EAB", borderRadius:30, padding:"14px 32px", fontSize:14, fontWeight:600, textDecoration:"none", border:"1px solid #EBEBEB" }}>
            Explorer d autres guides
          </Link>
        </div>
      </div>
    </div>
  );
}
