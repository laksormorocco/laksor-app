"use client";
import { useState, useEffect } from "react";
const B="#123EAB",Y="#F4C542",G="#22c55e",S="#F8F5F0";

export default function GuideStats({ guideId }: { guideId: string }) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/guide/stats?guideId=" + guideId)
      .then(r => r.json())
      .then(d => { setStats(d); setLoading(false); });
  }, [guideId]);

  if (loading) return <div style={{textAlign:"center",padding:40,color:"#999"}}>Chargement...</div>;
  if (!stats) return null;

  const maxRevenue = Math.max(...(stats.monthlyRevenue?.map((m:any) => m.revenue) || [1]), 1);

  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:16}}>
        {[
          {icon:"💰",label:"Revenus total",val:stats.totalRevenue+" MAD",bg:"#eef2ff",color:B},
          {icon:"🏆",label:"Tours realises",val:String(stats.completedTours),bg:"#fdf4ff",color:"#9333ea"},
          {icon:"⭐",label:"Note moyenne",val:Number(stats.avgRating).toFixed(1)+"/5",bg:"#fffbeb",color:"#d97706"},
          {icon:"📋",label:"Reservations",val:String(stats.totalBookings),bg:"#fff7ed",color:"#ea580c"},
          {icon:"✅",label:"Taux acceptation",val:stats.acceptanceRate+"%",bg:"#dcfce7",color:G},
        ].map(s=>(
          <div key={s.label} style={{background:"#fff",borderRadius:20,padding:20,boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
            <div style={{width:44,height:44,borderRadius:12,background:s.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,marginBottom:14}}>{s.icon}</div>
            <div style={{fontSize:18,fontWeight:800,color:s.color,marginBottom:4}}>{s.val}</div>
            <div style={{fontSize:12,color:"#888"}}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{background:"#fff",borderRadius:20,padding:24,boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
        <h3 style={{fontSize:15,fontWeight:800,color:B,marginBottom:20}}>📊 Revenus par mois</h3>
        <div style={{display:"flex",alignItems:"flex-end",gap:8,height:120}}>
          {stats.monthlyRevenue?.map((m:any,i:number)=>(
            <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
              <div style={{fontSize:10,color:"#999",fontWeight:600}}>{m.revenue}</div>
              <div style={{width:"100%",background:B,borderRadius:"6px 6px 0 0",height:Math.max((m.revenue/maxRevenue)*90,4)+"px",opacity:i===stats.monthlyRevenue.length-1?1:0.5}}/>
              <div style={{fontSize:9,color:"#999"}}>{m.month}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div style={{background:"#fff",borderRadius:20,padding:24,boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
          <h3 style={{fontSize:15,fontWeight:800,color:B,marginBottom:16}}>⏱️ Type de tours</h3>
          {stats.durationStats?.map((d:any)=>(
            <div key={d.type} style={{marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{fontSize:13,fontWeight:600}}>{d.type==="HALF_DAY"?"Demi-journee":"Journee"}</span>
                <span style={{fontSize:13,color:B,fontWeight:700}}>{d.count}</span>
              </div>
              <div style={{background:"#f0ebe4",borderRadius:6,height:8}}>
                <div style={{background:B,borderRadius:6,height:8,width:stats.totalBookings>0?(d.count/stats.totalBookings*100)+"%":"0%"}}/>
              </div>
            </div>
          ))}
        </div>
        <div style={{background:"#fff",borderRadius:20,padding:24,boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
          <h3 style={{fontSize:15,fontWeight:800,color:B,marginBottom:16}}>📈 Statut</h3>
          {[
            {label:"En attente",val:stats.pendingBookings,color:"#f59e0b",bg:"#fef3c7"},
            {label:"Confirmes",val:stats.confirmedBookings,color:G,bg:"#dcfce7"},
            {label:"Termines",val:stats.completedTours,color:B,bg:"#eef2ff"},
            {label:"Annules",val:stats.cancelledBookings,color:"#ef4444",bg:"#fee2e2"},
          ].map(s=>(
            <div key={s.label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid #f0ebe4"}}>
              <span style={{fontSize:13,color:"#444"}}>{s.label}</span>
              <span style={{fontSize:13,fontWeight:700,padding:"3px 10px",borderRadius:12,background:s.bg,color:s.color}}>{s.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
