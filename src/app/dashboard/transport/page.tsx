"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Car, Plus, Pencil, Trash, SignOut, MapPin, Users, CurrencyDollar, CheckCircle, Clock, X, GasPump, WifiHigh, Drop } from "@phosphor-icons/react";
import BottomNav from "@/components/BottomNav";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

const VEHICLE_TYPES = [
  { id: "SEDAN", label: "Berline", emoji: "🚗" },
  { id: "MINIVAN", label: "Minivan", emoji: "🚐" },
  { id: "SUV_4X4", label: "4x4 / SUV", emoji: "🚙" },
  { id: "BUS", label: "Bus", emoji: "🚌" },
];

export default function TransporterDashboard() {
  const [loading, setLoading] = useState(true);
  const [transporter, setTransporter] = useState<any>(null);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [editVehicle, setEditVehicle] = useState<any>(null);
  const [vehicleForm, setVehicleForm] = useState<any>({
    type: "SEDAN", brand: "", model: "", year: "", color: "",
    capacity: 4, hasAC: true, hasWifi: false, hasWater: false,
    pricePerKm: "", fixedPrice: ""
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { window.location.href = "/auth/login"; return; }
      const res = await fetch("/api/auth/me?email=" + encodeURIComponent(session.user.email || ""));
      const data = await res.json();
      if (data.transporterId) {
        fetchTransporter(data.transporterId);
      } else {
        setLoading(false);
      }
    }
    init();
  }, []);

  async function fetchTransporter(id: string) {
    const res = await fetch("/api/transport?id=" + id);
    if (res.ok) {
      const data = await res.json();
      setTransporter(data.transporter);
      setVehicles(data.transporter?.vehicles || []);
    }
    setLoading(false);
  }

  async function saveVehicle() {
    setSaving(true);
    const method = editVehicle ? "PATCH" : "POST";
    const body = editVehicle
      ? { id: editVehicle.id, ...vehicleForm }
      : { transporterId: transporter?.id, ...vehicleForm };
    const res = await fetch("/api/transport/vehicles", {
      method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body)
    });
    if (res.ok) {
      const data = await res.json();
      if (editVehicle) {
        setVehicles(vehicles.map(v => v.id === editVehicle.id ? data.vehicle : v));
      } else {
        setVehicles([...vehicles, data.vehicle]);
      }
      setShowVehicleForm(false);
      setEditVehicle(null);
    }
    setSaving(false);
  }

  async function deleteVehicle(id: string) {
    await fetch("/api/transport/vehicles?id=" + id, { method: "DELETE" });
    setVehicles(vehicles.filter(v => v.id !== id));
  }

  if (loading) return (
    <div className="min-h-screen bg-sand-200 flex flex-col items-center justify-center gap-6">
      <img src="/logo7.png" alt="Laksor" style={{ height: 56, width: "auto", objectFit: "contain", maxWidth: 180 }} />
      <div className="w-8 h-8 rounded-full animate-spin" style={{ borderWidth: 3, borderStyle: "solid", borderColor: "#B88A44 transparent transparent transparent" }} />
    </div>
  );

  return (
    <div className="min-h-screen bg-sand-100 pb-24">
      {/* HEADER */}
      <div className="bg-white border-b border-sand-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <img src="/logo7.png" alt="Laksor" style={{ height: 36, width: "auto", objectFit: "contain", maxWidth: 130 }} />
        <div className="flex items-center gap-2">
          {transporter && (
            <span className={"text-[10px] font-bold px-2.5 py-1 rounded-full " + (transporter.status === "APPROVED" ? "bg-sage-300/15 text-sage-300" : "bg-bronze-500/15 text-bronze-500")}>
              {transporter.status === "APPROVED" ? "✅ Approuvé" : "⏳ En attente"}
            </span>
          )}
          <button onClick={async () => { await supabase.auth.signOut(); window.location.href = "/"; }}
            className="w-9 h-9 rounded-full border border-sand-300 flex items-center justify-center">
            <SignOut size={16} className="text-charcoal-400" />
          </button>
        </div>
      </div>

      <div className="px-4 py-5 flex flex-col gap-4">

        {/* PROFIL */}
        {transporter ? (
          <div className="bg-white rounded-2xl border border-sand-300 p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-bronze-500/15 flex items-center justify-center">
                <Car size={22} className="text-bronze-500" />
              </div>
              <div>
                <div className="font-display text-sm font-bold text-charcoal-800">{transporter.displayName}</div>
                <div className="text-xs text-charcoal-400 flex items-center gap-1">
                  <MapPin size={10} /> {transporter.city || "Ville non définie"}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-sand-300 p-6 text-center">
            <Car size={40} className="text-charcoal-300 mx-auto mb-3" />
            <div className="text-sm font-bold text-charcoal-800 mb-1">Profil transporteur</div>
            <div className="text-xs text-charcoal-400 mb-4">Vous n avez pas encore de profil transporteur</div>
            <a href="/auth/register-transport" className="bg-bronze-500 text-white text-xs font-bold px-6 py-3 rounded-full no-underline">
              Créer mon profil
            </a>
          </div>
        )}

        {/* VÉHICULES */}
        {transporter && (
          <>
            <div className="flex items-center justify-between">
              <div className="text-sm font-bold text-charcoal-800">Mes véhicules ({vehicles.length})</div>
              <button onClick={() => { setEditVehicle(null); setVehicleForm({ type:"SEDAN", brand:"", model:"", year:"", color:"", capacity:4, hasAC:true, hasWifi:false, hasWater:false, pricePerKm:"", fixedPrice:"" }); setShowVehicleForm(true); }}
                className="flex items-center gap-1.5 bg-bronze-500 text-white text-xs font-bold px-4 py-2 rounded-full">
                <Plus size={12} weight="bold" /> Ajouter
              </button>
            </div>

            {vehicles.length === 0 ? (
              <div className="bg-white rounded-2xl border border-sand-300 p-8 text-center">
                <Car size={32} className="text-charcoal-300 mx-auto mb-3" />
                <div className="text-sm text-charcoal-400">Aucun véhicule ajouté</div>
              </div>
            ) : vehicles.map(v => (
              <div key={v.id} className="bg-white rounded-2xl border border-sand-300 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sand-200 flex items-center justify-center text-xl">
                      {VEHICLE_TYPES.find(t => t.id === v.type)?.emoji || "🚗"}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-charcoal-800">{v.brand} {v.model}</div>
                      <div className="text-xs text-charcoal-400">{VEHICLE_TYPES.find(t => t.id === v.type)?.label} · {v.year}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditVehicle(v); setVehicleForm({...v}); setShowVehicleForm(true); }}
                      className="w-8 h-8 rounded-full border border-sand-300 flex items-center justify-center">
                      <Pencil size={13} className="text-charcoal-400" />
                    </button>
                    <button onClick={() => deleteVehicle(v.id)}
                      className="w-8 h-8 rounded-full border border-red-200 flex items-center justify-center">
                      <Trash size={13} className="text-red-400" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="flex items-center gap-1 text-xs text-charcoal-400">
                    <Users size={11} /> {v.capacity} pers.
                  </span>
                  {v.hasAC && <span className="text-xs text-charcoal-400">❄️ AC</span>}
                  {v.hasWifi && <span className="text-xs text-charcoal-400">📶 Wifi</span>}
                  {v.hasWater && <span className="text-xs text-charcoal-400">💧 Eau</span>}
                </div>
                <div className="mt-3 pt-3 border-t border-sand-200 flex items-center justify-between">
                  {v.fixedPrice && <div className="text-xs"><span className="font-bold text-charcoal-800">{v.fixedPrice} MAD</span> <span className="text-charcoal-400">prix fixe</span></div>}
                  {v.pricePerKm && <div className="text-xs"><span className="font-bold text-charcoal-800">{v.pricePerKm} MAD</span> <span className="text-charcoal-400">/km</span></div>}
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* MODAL VÉHICULE */}
      {showVehicleForm && (
        <div className="fixed inset-x-0 top-0 bottom-0 z-50 bg-white flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-sand-200">
            <button onClick={() => setShowVehicleForm(false)}
              className="w-9 h-9 rounded-full border border-sand-200 flex items-center justify-center">
              <X size={16} className="text-charcoal-600" />
            </button>
            <span className="font-display text-sm font-bold text-charcoal-800">{editVehicle ? "Modifier" : "Ajouter"} un véhicule</span>
            <div className="w-9" />
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-4">

            {/* Type de véhicule */}
            <div>
              <div className="text-xs font-bold text-charcoal-400 mb-2">Type de véhicule</div>
              <div className="grid grid-cols-2 gap-2">
                {VEHICLE_TYPES.map(t => (
                  <button key={t.id} onClick={() => setVehicleForm({...vehicleForm, type: t.id})}
                    className={"flex items-center gap-2 px-3 py-3 rounded-xl border text-sm font-semibold transition-all " + (vehicleForm.type === t.id ? "border-bronze-500 bg-bronze-500/10 text-bronze-500" : "border-sand-300 text-charcoal-600")}>
                    <span>{t.emoji}</span> {t.label}
                  </button>
                ))}
              </div>
            </div>

            {[
              { key: "brand", label: "Marque", ph: "Toyota, Mercedes..." },
              { key: "model", label: "Modèle", ph: "Camry, Vito..." },
              { key: "year", label: "Année", ph: "2020" },
              { key: "color", label: "Couleur", ph: "Blanc, Noir..." },
              { key: "capacity", label: "Capacité (personnes)", ph: "4" },
              { key: "fixedPrice", label: "Prix fixe (MAD)", ph: "300" },
              { key: "pricePerKm", label: "Prix par km (MAD)", ph: "3.5" },
            ].map(f => (
              <div key={f.key}>
                <div className="text-xs font-bold text-charcoal-400 mb-1">{f.label}</div>
                <input value={vehicleForm[f.key] || ""} onChange={e => setVehicleForm({...vehicleForm, [f.key]: e.target.value})}
                  placeholder={f.ph}
                  className="w-full border border-sand-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-bronze-500" />
              </div>
            ))}

            {/* Équipements */}
            <div>
              <div className="text-xs font-bold text-charcoal-400 mb-2">Équipements</div>
              {[
                { key: "hasAC", label: "Climatisation", icon: "❄️" },
                { key: "hasWifi", label: "Wifi", icon: "📶" },
                { key: "hasWater", label: "Eau offerte", icon: "💧" },
              ].map(eq => (
                <div key={eq.key} className="flex items-center justify-between bg-sand-100 rounded-xl px-4 py-3 mb-2">
                  <div className="text-sm text-charcoal-800">{eq.icon} {eq.label}</div>
                  <button onClick={() => setVehicleForm({...vehicleForm, [eq.key]: !vehicleForm[eq.key]})}
                    className={"w-12 h-6 rounded-full relative transition-colors " + (vehicleForm[eq.key] ? "bg-sage-300" : "bg-sand-300")}>
                    <div className={"w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm " + (vehicleForm[eq.key] ? "left-6" : "left-0.5")} />
                  </button>
                </div>
              ))}
            </div>

            <button onClick={saveVehicle} disabled={saving}
              className="w-full text-white font-bold py-4 rounded-full text-sm"
              style={{ background: "linear-gradient(135deg, #B88A44, #9A7238)", boxShadow: "0 4px 14px rgba(184,138,68,0.3)" }}>
              {saving ? "Enregistrement..." : editVehicle ? "Mettre à jour" : "Ajouter le véhicule"}
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
