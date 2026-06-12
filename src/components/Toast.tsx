"use client";
import { useState, useEffect } from "react";
import { CalendarBlank, XCircle } from "@phosphor-icons/react";

export default function Toast() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 z-50 max-w-sm mx-auto transition-all duration-500"
      style={{animation:"slide-up 0.5s ease-out"}}>
      <div className="flex items-center gap-3 px-4 py-3 rounded-full shadow-lg"
        style={{background:"linear-gradient(135deg, #B88A44, #9A7238)", boxShadow:"0 4px 20px rgba(184,138,68,0.35)"}}>
        <CalendarBlank size={18} weight="duotone" className="text-white flex-shrink-0" />
      <p className="text-xs font-semibold flex-1 leading-relaxed text-white">
          Lancement le <strong className="font-bold underline">1er septembre</strong> — Les réservations ouvrent bientôt !
        </p>
        <button onClick={() => setVisible(false)}
        className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full opacity-70">
          <XCircle size={16} weight="fill" className="text-white/70" />
        </button>
      </div>
    </div>
  );
}
