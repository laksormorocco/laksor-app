"use client";
import { useState, useEffect } from "react";
const Y = "#F4C542";

const SLIDES = [
    "https://images.unsplash.com/photo-1714229519446-fd7b491a3530?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D80",
      "https://images.unsplash.com/flagged/photo-1555169048-3c4845cfcf1c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D80",
        "https://images.unsplash.com/photo-1750008415039-65c10dcbb4a5?q=80&w=2075&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D80",
          "https://images.unsplash.com/photo-1729456229097-e60798212180?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D80",
          ];


export default function HeroSlider() {
  const [cur, setCur] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setCur(c => (c + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {SLIDES.map((url, i) => (
        <div key={i} style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: i === cur ? 1 : 0,
          transition: "opacity 1.5s ease-in-out",
        }} />
      ))}
      <div style={{ position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8, zIndex: 10 }}>
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => setCur(i)} style={{
            width: i === cur ? 24 : 8, height: 8, borderRadius: 4, border: "none",
            background: i === cur ? Y : "rgba(255,255,255,0.5)",
            cursor: "pointer", transition: "all 0.3s", padding: 0,
          }} />
        ))}
      </div>
    </div>
  );
}
