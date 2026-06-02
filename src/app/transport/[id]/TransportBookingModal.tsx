"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import CalendarPicker from "@/components/CalendarPicker";

type Props = { transportName: string; halfDayPrice: number; fullDayPrice: number; transportId: string };

const HOURS = ["08h00","09h00","10h00","11h00","14h00","15h00","16h00"];

export default function TransportBookingModal({ transportName, halfDayPrice, fullDayPrice, transportId }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const [duration, setDuration] = useState<"half"|"full">("half");
  const [persons, setPersons] = useState(2);
  const [selectedHour, setSelectedHour] = useState("10h00");
  const [loading, setLoading] = useState(false);

  async function handleOpen() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.href } });
    } else { setOpen(true); }
  }

  async function handleConfirm() {
    if (selectedDates.length === 0) return alert("Choisissez une date");
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch("/api/bookings", {
        method: "POST", headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
          transportId,
          supabaseId: session?.user.id,
          date: selectedDates[0],
          duration: duration==="full"?"FULL_DAY":"HALF_DAY",
          persons,
          totalPrice: total,
          notes: `Heure: ${selectedHour}`
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.whatsappUrl) window.open(data.whatsappUrl, "_blank");
        router.push("/booking/confirmation?transport=" + encodeURIComponent(transportName) + "&price=" + total);
      }
    } catch(e) { alert("Erreur"); }
    setLoading(false);
  }

  if (!open) return (
    <button onClick={handleOpen} className="btn-bronze" style={{ width: "100%", padding: 16, fontSize: 15, justifyContent: "center" }}>
      Réserver ce chauffeur
    </button>
  );

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: "24px 24px 0 0", width: "100%", maxWidth: 500, padding: 24, maxHeight: "90vh", overflowY: "auto" }}>
        <button onClick={() => setOpen(false)} style={{ float: "right" }}>✕</button>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 22, marginBottom: 20 }}>Réserver {transportName}</h2>
        
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>DURÉE</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <button onClick={() => setDuration("half")} style={{ padding: 12, borderRadius: 12, border: `2px solid ${duration==="half"?"var(--bronze)":"var(--sand-dark)"}`, background: duration==="half"?"#FEF3E8":"#fff" }}>
              1/2 Journée ({halfDayPrice} MAD)
            </button>
            <button onClick={() => setDuration("full")} style={{ padding: 12, borderRadius: 12, border: `2px solid ${duration==="full"?"var(--bronze)":"var(--sand-dark)"}`, background: duration==="full"?"#FEF3E8":"#fff" }}>
              Journée ({fullDayPrice} MAD)
            </button>
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>DATE</div>
          <CalendarPicker 
            blockedDates={[]} 
            pricePerDay={duration === "full" ? fullDayPrice : halfDayPrice} 
            onSelectionChange={(dates, t) => { setSelectedDates(dates); setTotal(t); }} 
          />
        </div>

        <button onClick={handleConfirm} disabled={loading || selectedDates.length === 0} className="btn-bronze" style={{ width: "100%", padding: 16 }}>
          {loading ? "Chargement..." : `Confirmer (${total} MAD)`}
        </button>
      </div>
    </div>
  );
}
