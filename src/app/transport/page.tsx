"use client";
import { useState, useEffect } from "react";
import { MagnifyingGlass, MapPin, Car, Users, Clock, ArrowRight, Star, ShieldCheck } from "@phosphor-icons/react";
import MiniCal from "@/components/MiniCal";
import BottomNav from "@/components/BottomNav";

const VEHICLE_TYPES = [
  { id: "ALL", label: "Tous", emoji: "🚘" },
  { id: "SEDAN", label: "Berline", emoji: "🚗" },
  { id: "MINIVAN", label: "Minivan", emoji: "🚐" },
  { id: "SUV_4X4", label: "4x4", emoji: "🚙" },
];

const HOURS = Array.from({length: 18}, (_, i) => {
  const h = i + 5;
  return { value: String(h).padStart(2,"0") + ":00", label: String(h).padStart(2,"0") + "h00" };
});

const CITIES = ["Marrakech", "Fès", "Casablanca", "Agadir", "Essaouira", "Chefchaouen", "Tanger", "Rabat"];

export default function TransportPage() {
  const [transporters, setTransporters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [hour, setHour] = useState("09:00");
  const [persons, setPersons] = useState(2);
  const [vehicleType, setVehicleType] = useState("ALL");
  const [showSearch, setShowSearch] = useState(true);

  useEffect(() => {
    fetch("/api/transport")
      .then(r => r.json())
      .then(d => { setTransporters(d.transporters || []); setLoading(false); });
  }, []);

  const filtered = transporters.filter(t =>
    vehicleType === "ALL" || t.vehicles?.some((v: any) => v.type === vehicleType)
  );

  return (
    <div className="min-h-screen bg-sand-100 pb-24">

      {/* HEADER */}
      <div className="bg-charcoal-800 px-4 pt-6 pb-8">
        <div className="flex items-center justify-between mb-6">
          <a href="/"><img src="/logo7.png" alt="Laksor" style={{ height: 36, width: "auto", objectFit: "contain", maxWidth: 130, filter: "brightness(10)" }} /></a>
        </div>
        <h1 className="font-display text-2xl font-bold text-white mb-1">Transport privé</h1>
        <p className="text-sm text-white/60">Chauffeurs certifiés au Maroc</p>
      </div>

      {/* FORMULAIRE */}
      <div className="px-4 -mt-4">
        <div className="bg-white rounded-3xl shadow-lg border border-sand-200 p-4 flex flex-col gap-3">

          {/* Départ / Destination */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 border border-sand-300 rounded-xl px-3 py-2.5">
              <MapPin size={16} className="text-bronze-500 flex-shrink-0" weight="fill" />
              <input value={origin} onChange={e => setOrigin(e.target.value)}
                placeholder="Départ (ville, hôtel, aéroport...)"
                className="flex-1 text-sm outline-none text-charcoal-800 bg-transparent" />
            </div>
            <div className="flex items-center gap-2 border border-sand-300 rounded-xl px-3 py-2.5">
              <MapPin size={16} className="text-sage-300 flex-shrink-0" weight="fill" />
              <input value={destination} onChange={e => setDestination(e.target.value)}
                placeholder="Destination"
                className="flex-1 text-sm outline-none text-charcoal-800 bg-transparent" />
            </div>
          </div>

          {/* Calendrier */}
          <MiniCal value={date} onChange={setDate} />

          {/* Heure */}
          <div>
            <div className="text-xs font-bold text-charcoal-400 mb-2 flex items-center gap-1">
              <Clock size={12} /> Heure de départ
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1" style={{scrollbarWidth:"none"}}>
              {HOURS.map(h => (
                <button key={h.value} onClick={() => setHour(h.value)}
                  className={"flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border transition-all " + (hour === h.value ? "bg-charcoal-800 text-white border-charcoal-800" : "bg-white text-charcoal-400 border-sand-300")}>
                  {h.label}
                </button>
              ))}
            </div>
          </div>

          {/* Personnes */}
          <div className="flex items-center justify-between bg-sand-100 rounded-xl px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-charcoal-800">
              <Users size={16} className="text-bronze-500" /> Personnes
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setPersons(Math.max(1, persons-1))}
                className="w-8 h-8 rounded-full border border-sand-300 flex items-center justify-center text-charcoal-600 font-bold">-</button>
              <span className="text-sm font-bold text-charcoal-800 w-4 text-center">{persons}</span>
              <button onClick={() => setPersons(Math.min(20, persons+1))}
                className="w-8 h-8 rounded-full border border-sand-300 flex items-center justify-center text-charcoal-600 font-bold">+</button>
            </div>
          </div>

          <button className="w-full py-4 rounded-full text-white font-bold text-sm flex items-center justify-center gap-2"
            style={{background:"linear-gradient(135deg, #B88A44, #9A7238)", boxShadow:"0 4px 14px rgba(184,138,68,0.3)"}}>
            <MagnifyingGlass size={16} weight="bold" /> Rechercher un transport
          </button>
        </div>
      </div>

      {/* FILTRES TYPE */}
      <div className="px-4 mt-5 mb-3">
        <div className="flex gap-2 overflow-x-auto pb-1" style={{scrollbarWidth:"none"}}>
          {VEHICLE_TYPES.map(t => (
            <button key={t.id} onClick={() => setVehicleType(t.id)}
              className={"flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold border transition-all " + (vehicleType === t.id ? "bg-charcoal-800 text-white border-charcoal-800" : "bg-white text-charcoal-500 border-sand-300")}>
              {t.emoji} {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* LISTE */}
      <div className="px-4 flex flex-col gap-3">
        {loading ? (
          <div className="text-center py-8 text-charcoal-400 text-sm">Chargement...</div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-sand-300 p-8 text-center">
            <Car size={32} className="text-charcoal-300 mx-auto mb-3" />
            <div className="text-sm font-bold text-charcoal-800 mb-1">Aucun transporteur disponible</div>
            <div className="text-xs text-charcoal-400">Revenez bientôt !</div>
          </div>
        ) : filtered.map(t => (
          <div key={t.id} className="bg-white rounded-2xl border border-sand-300 overflow-hidden">
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                {t.avatar ? (
                  <img src={t.avatar} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-bronze-500/15 flex items-center justify-center flex-shrink-0">
                    <Car size={20} className="text-bronze-500" />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-sm font-bold text-charcoal-800">{t.displayName}</span>
                    {t.status === "APPROVED" && <ShieldCheck size={14} className="text-sage-300" weight="fill" />}
                  </div>
                  <div className="text-xs text-charcoal-400 flex items-center gap-1">
                    <MapPin size={10} /> {t.city}
                  </div>
                </div>
              </div>

              {/* Véhicules */}
              <div className="flex flex-col gap-2">
                {(t.vehicles || []).map((v: any) => (
                  <div key={v.id} className="flex items-center justify-between bg-sand-100 rounded-xl px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {v.type === "SEDAN" ? "🚗" : v.type === "MINIVAN" ? "🚐" : v.type === "SUV_4X4" ? "🚙" : "🚌"}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-charcoal-800">{v.brand} {v.model}</div>
                        <div className="text-[10px] text-charcoal-400 flex items-center gap-1">
                          <Users size={9} /> {v.capacity} pers.
                          {v.hasAC && " · ❄️"}
                          {v.hasWifi && " · 📶"}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {v.fixedPrice && <div className="text-sm font-bold text-charcoal-800">{v.fixedPrice} MAD</div>}
                      {v.pricePerKm && <div className="text-xs text-charcoal-400">{v.pricePerKm} MAD/km</div>}
                      <button className="mt-1 bg-bronze-500 text-white text-[10px] font-bold px-3 py-1 rounded-full">
                        Réserver
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
