"use client";
import { useState, useEffect } from "react";
import { X } from "@phosphor-icons/react";

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
        style={{background:"#111111", border:"1px solid rgba(184,138,68,0.3)"}}>
        <span className="text-lg flex-shrink-0">🗓️</span>
        <p className="text-xs font-semibold flex-1 leading-relaxed" style={{color:"rgba(255,255,255,0.9)"}}>
          Lancement le <strong className="text-bronze-500">1er septembre</strong> — Les réservations ouvrent bientôt !
        </p>
        <button onClick={() => setVisible(false)}
          className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full"
          style={{background:"rgba(255,255,255,0.1)"}}>
          <X size={10} weight="bold" className="text-white" />
        </button>
      </div>
    </div>
  );
}
