"use client";
import { useState, useEffect } from "react";

const SLIDES = [
  { url: "https://images.unsplash.com/photo-1548869886-eb6f3f20a54f?w=1920&q=80", city: "Chefchaouen" },
  { url: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=1920&q=80", city: "Marrakech" },
  { url: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1920&q=80", city: "Sahara" },
  { url: "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=1920&q=80", city: "Fès" },
  { url: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1920&q=80", city: "Essaouira" },
];

export default function HeroSlideshow({ children }: { children: React.ReactNode }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ position: "relative", minHeight: "100svh", overflow: "hidden" }}>
      {SLIDES.map((s, i) => (
        <div key={i} style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${s.url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: i === current ? 1 : 0,
          transition: "opacity 1.2s ease-in-out",
          zIndex: 0,
        }} />
      ))}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,30,80,0.65) 0%, rgba(10,30,80,0.45) 60%, rgba(10,30,80,0.7) 100%)", zIndex: 1 }} />
      <div style={{ position: "relative", zIndex: 2, height: "100%" }}>
        {children}
      </div>
      <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8, zIndex: 3 }}>
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} style={{
            width: i === current ? 24 : 8, height: 8,
            borderRadius: 4, border: "none",
            background: i === current ? "#F4C542" : "rgba(255,255,255,0.5)",
            cursor: "pointer", transition: "all 0.3s", padding: 0,
          }} />
        ))}
      </div>
      <div style={{ position: "absolute", bottom: 40, right: 20, zIndex: 3, color: "rgba(255,255,255,0.7)", fontSize: 11, letterSpacing: 2 }}>
        {SLIDES[current].city.toUpperCase()}
      </div>
    </div>
  );
}
