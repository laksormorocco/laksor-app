"use client";
import { useState } from "react";

const DAYS = ["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"];
const MONTHS = ["Janvier","Fevrier","Mars","Avril","Mai","Juin","Juillet","Aout","Septembre","Octobre","Novembre","Decembre"];

type Props = {
  blockedDates?: string[];
  pricePerDay?: number;
  onSelectionChange?: (dates: string[], total: number) => void;
};

export default function CalendarPicker({ blockedDates=[], pricePerDay=600, onSelectionChange }: Props) {
  const today = new Date(); today.setHours(0,0,0,0);
  const [current, setCurrent] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDates, setSelectedDates] = useState<string[]>([]);

  const year = current.getFullYear();
  const month = current.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month+1, 0).getDate();

  function toStr(d: Date) { return d.toISOString().split("T")[0]; }
  function isBlocked(str: string) { return blockedDates.includes(str) || new Date(str+"T00:00:00") < today; }
  function isSelected(str: string) { return selectedDates.includes(str); }

  function handleClick(str: string) {
    if (isBlocked(str)) return;
    let newDates: string[];
    if (isSelected(str)) {
      newDates = selectedDates.filter(d => d !== str);
    } else {
      newDates = [...selectedDates, str].sort();
    }
    setSelectedDates(newDates);
    if (onSelectionChange) onSelectionChange(newDates, newDates.length * pricePerDay);
  }

  function clearAll() {
    setSelectedDates([]);
    if (onSelectionChange) onSelectionChange([], 0);
  }

  const cells: (string|null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let i = 1; i <= daysInMonth; i++) {
    cells.push(toStr(new Date(year, month, i)));
  }

  const total = selectedDates.length * pricePerDay;

  return (
    <div style={{ background:"#fff", borderRadius:16, border:"1px solid #E2E8F0", overflow:"hidden", fontFamily:"Inter,sans-serif" }}>

      {/* Header */}
      <div style={{ background:"linear-gradient(135deg,#123EAB,#1a4fd6)", padding:"12px 16px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <button onClick={()=>setCurrent(new Date(year,month-1,1))} style={{ background:"rgba(255,255,255,0.15)", border:"none", color:"#fff", width:32, height:32, borderRadius:"50%", cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center" }}>‹</button>
        <div style={{ color:"#fff", fontWeight:700, fontSize:15 }}>{MONTHS[month]} {year}</div>
        <button onClick={()=>setCurrent(new Date(year,month+1,1))} style={{ background:"rgba(255,255,255,0.15)", border:"none", color:"#fff", width:32, height:32, borderRadius:"50%", cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center" }}>›</button>
      </div>

      {/* Jours header */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", padding:"10px 8px 4px" }}>
        {DAYS.map(d => <div key={d} style={{ textAlign:"center", fontSize:11, fontWeight:700, color:"#94A3B8" }}>{d}</div>)}
      </div>

      {/* Grille */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", padding:"4px 8px 12px", gap:3 }}>
        {cells.map((str, i) => {
          if (!str) return <div key={"e"+i}/>;
          const blocked = isBlocked(str);
          const selected = isSelected(str);
          return (
            <div key={i}
              onClick={() => handleClick(str)}
              style={{
                textAlign:"center",
                padding:"8px 2px",
                cursor: blocked ? "not-allowed" : "pointer",
                borderRadius: 8,
                background: selected ? "#123EAB" : blocked ? "#FEE2E2" : "#F0FDF4",
                color: selected ? "#fff" : blocked ? "#ef4444" : "#166534",
                fontWeight: selected ? 700 : 400,
                fontSize: 13,
                textDecoration: blocked ? "line-through" : "none",
                position: "relative" as const,
                border: selected ? "2px solid #0a2d8a" : "2px solid transparent",
              }}>
              {new Date(str+"T00:00:00").getDate()}
              {selected && <div style={{ position:"absolute", top:2, right:2, width:5, height:5, background:"#F4C542", borderRadius:"50%" }}/>}
            </div>
          );
        })}
      </div>

      {/* Légende */}
      <div style={{ display:"flex", gap:10, padding:"6px 12px 10px", borderTop:"1px solid #F1F5F9", flexWrap:"wrap" as const }}>
        {[["#F0FDF4","#22c55e","Disponible"],["#FEE2E2","#ef4444","Indisponible"],["#123EAB","#0a2d8a","Sélectionné"]].map(([bg,border,label]) => (
          <div key={label} style={{ display:"flex", alignItems:"center", gap:3 }}>
            <div style={{ width:10, height:10, borderRadius:2, background:bg, border:"1px solid "+border }}/>
            <span style={{ fontSize:10, color:"#94A3B8" }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Résumé */}
      {selectedDates.length > 0 && (
        <div style={{ margin:"0 12px 12px", background:"#F8FAFC", borderRadius:12, padding:12 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
            <span style={{ fontSize:13, fontWeight:600, color:"#0F172A" }}>
              {selectedDates.length} jour{selectedDates.length>1?"s":""} sélectionné{selectedDates.length>1?"s":""}
            </span>
            <button onClick={clearAll} style={{ background:"#FEE2E2", color:"#ef4444", border:"none", borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
              Tout effacer
            </button>
          </div>
          <div style={{ display:"flex", flexWrap:"wrap" as const, gap:4, marginBottom:10 }}>
            {selectedDates.map(d => (
              <div key={d} style={{ background:"#EFF6FF", color:"#123EAB", fontSize:11, fontWeight:600, padding:"3px 8px", borderRadius:20 }}>
                {new Date(d+"T00:00:00").toLocaleDateString("fr-FR",{day:"numeric",month:"short"})}
              </div>
            ))}
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", paddingTop:8, borderTop:"1px solid #E2E8F0" }}>
            <span style={{ fontSize:13, color:"#475569" }}>{selectedDates.length} j × {pricePerDay} MAD</span>
            <span style={{ fontSize:18, fontWeight:800, color:"#22c55e" }}>{total} MAD</span>
          </div>
        </div>
      )}
    </div>
  );
}
