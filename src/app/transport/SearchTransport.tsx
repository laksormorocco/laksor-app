"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function toEur(mad: number) {
  return "€" + Math.round((mad * 1.25 + 25) * 0.092);
}

const VEHICLE_TYPES = ["All", "SEDAN", "VAN", "SUV", "MINIBUS"];
const CITIES = ["All", "Marrakech", "Fès", "Essaouira", "Chefchaouen", "Agadir", "Tanger", "Casablanca"];

export default function SearchTransport({ transports }: { transports: any[] }) {
  const [city, setCity] = useState("All");
  const [vType, setVType] = useState("All");

  const filtered = useMemo(() => {
    return transports.filter(t => {
      if (city !== "All" && t.city !== city) return false;
      if (vType !== "All" && t.vehicleType !== vType) return false;
      return true;
    });
  }, [transports, city, vType]);

  return (
    <div style={{ background: "var(--sand)", minHeight: "100vh", fontFamily: "var(--font-body)" }}>
      <Navbar />

      <div style={{ paddingTop: 100, paddingBottom: 40, px: 16, textAlign: "center", background: "#fff", borderBottom: "1px solid var(--sand-dark)" }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 32, marginBottom: 12 }}>Transport Privé</h1>
        <p style={{ color: "var(--soft)", marginBottom: 24 }}>Réservez votre chauffeur professionnel en un clic</p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <select value={city} onChange={e => setCity(e.target.value)} style={{ padding: "10px 16px", borderRadius: 12, border: "1.5px solid var(--sand-dark)" }}>
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={vType} onChange={e => setVType(e.target.value)} style={{ padding: "10px 16px", borderRadius: 12, border: "1.5px solid var(--sand-dark)" }}>
            {VEHICLE_TYPES.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "40px auto", padding: "0 16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
          {filtered.map(t => (
            <div key={t.id} style={{ background: "#fff", borderRadius: 24, padding: 24, border: "1px solid var(--sand-dark)", boxShadow: "var(--shadow-sm)" }}>
              <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 20 }}>
                <div style={{ width: 64, height: 64, borderRadius: 16, background: "var(--sand)", display: "flex", alignItems: "center", justifyCenter: "center", fontSize: 32 }}>
                  {t.vehicleType === "VAN" ? "🚐" : t.vehicleType === "MINIBUS" ? "🚌" : "🚗"}
                </div>
                <div>
                  <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 700 }}>{t.displayName}</h3>
                  <div style={{ fontSize: 12, color: "var(--bronze)", fontWeight: 700 }}>📍 {t.city}</div>
                </div>
              </div>

              <div style={{ fontSize: 13, color: "var(--soft)", marginBottom: 20, height: 40, overflow: "hidden" }}>{t.bio}</div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                <div style={{ background: "var(--sand)", borderRadius: 12, padding: 10, textAlign: "center" }}>
                  <div style={{ fontSize: 9, color: "var(--muted)", fontWeight: 800 }}>VÉHICULE</div>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>{t.vehicleModel || t.vehicleType}</div>
                </div>
                <div style={{ background: "var(--sand)", borderRadius: 12, padding: 10, textAlign: "center" }}>
                  <div style={{ fontSize: 9, color: "var(--muted)", fontWeight: 800 }}>CAPACITÉ</div>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>{t.capacity} pers.</div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 20, borderTop: "1px solid var(--sand)" }}>
                <div>
                  <div style={{ fontSize: 10, color: "var(--muted)", fontWeight: 800 }}>DÈS</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "var(--sage)" }}>{toEur(t.halfDayPrice)}</div>
                </div>
                <Link href={`/transport/${t.id}`} className="btn-bronze" style={{ padding: "10px 20px", fontSize: 12 }}>
                  Réserver
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
