"use client";
import { useState } from "react";

export default function MiniCal({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const today = new Date(); today.setHours(0,0,0,0);
  const [cur, setCur] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const MONTHS = ["Janvier","Fevrier","Mars","Avril","Mai","Juin","Juillet","Aout","Septembre","Octobre","Novembre","Decembre"];
  const DAYS = ["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"];
  const year = cur.getFullYear();
  const month = cur.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number|null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let i = 1; i <= daysInMonth; i++) cells.push(i);

  function toStr(d: number) {
    return year + "-" + String(month+1).padStart(2,"0") + "-" + String(d).padStart(2,"0");
  }
  function isPast(d: number) { return new Date(year, month, d) < today; }

  return (
    <div className="bg-white rounded-2xl border border-sand-300 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-sand-200">
        <button onClick={() => setCur(new Date(year, month-1, 1))}
          className="w-8 h-8 rounded-full border border-sand-300 flex items-center justify-center text-charcoal-600 hover:border-bronze-500 transition-colors text-sm font-bold">
          &lt;
        </button>
        <span className="font-display text-sm font-semibold text-charcoal-800">{MONTHS[month]} {year}</span>
        <button onClick={() => setCur(new Date(year, month+1, 1))}
          className="w-8 h-8 rounded-full border border-sand-300 flex items-center justify-center text-charcoal-600 hover:border-bronze-500 transition-colors text-sm font-bold">
          &gt;
        </button>
      </div>
      <div className="grid grid-cols-7 px-3 pt-2 pb-1">
        {DAYS.map(d => <div key={d} className="text-center text-[10px] font-bold text-charcoal-400">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1 px-3 pb-3">
        {cells.map((d, i) => {
          if (!d) return <div key={"e"+i} />;
          const str = toStr(d);
          const past = isPast(d);
          const sel = value === str;
          return (
            <button key={i} disabled={past} onClick={() => onChange(str)}
              className={"aspect-square rounded-full text-xs font-medium transition-all flex items-center justify-center " +
                (sel ? "bg-bronze-500 text-white font-bold" : past ? "text-charcoal-300 cursor-not-allowed" : "text-charcoal-700 hover:bg-sand-200")}>
              {d}
            </button>
          );
        })}
      </div>
      {value && (
        <div className="px-3 pb-3">
          <div className="bg-sage-300/10 border border-sage-300/30 rounded-xl px-3 py-2 text-xs font-semibold text-sage-300 text-center capitalize">
            {new Date(value + "T00:00:00").toLocaleDateString("fr-FR", { weekday:"long", day:"numeric", month:"long" })}
          </div>
        </div>
      )}
    </div>
  );
}
