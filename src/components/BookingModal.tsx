"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import CalendarPicker from "@/components/CalendarPicker";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

type Props = { guideName: string; halfDayPrice: number; fullDayPrice: number; guideId: string };

export default function BookingModal({ guideName, halfDayPrice, fullDayPrice, guideId }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const [duration, setDuration] = useState<"half"|"full">("half");
  const [persons, setPersons] = useState(1);
  const [loading, setLoading] = useState(false);
  const [bookedDates, setBookedDates] = useState<{date:string;duration:string}[]>([]);

  useEffect(() => {
    fetch("/api/guide/availability?guideId=" + guideId)
      .then(r => r.json())
      .then(d => setBookedDates(d.bookedDates || []));
  }, [guideId]);

  const pricePerDay = duration === "full" ? fullDayPrice : halfDayPrice;
  const adjustedTotal = persons <= 2 ? total : Math.round(total * (1 + (persons-2)*0.1));

  async function handleOpen() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.href } });
    } else { setOpen(true); }
  }

  async function handleConfirm() {
    if (selectedDates.length === 0) return alert("Choisissez au moins une date !");
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { alert("Connectez-vous"); setLoading(false); return; }
      await fetch("/api/auth/sync", {
        method: "POST", headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ supabaseId: session.user.id, email: session.user.email, name: session.user.user_metadata?.full_name || session.user.email, avatar: session.user.user_metadata?.avatar_url || null })
      });
      const res = await fetch("/api/bookings", {
        method: "POST", headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
          guideId,
          supabaseId: session.user.id,
          date: selectedDates[0],
          duration: duration==="full"?"FULL_DAY":"HALF_DAY",
          persons,
          totalPrice: adjustedTotal,
          notes: selectedDates.length > 1 ? "Dates: " + selectedDates.join(", ") : ""
        })
      });
      const data = await res.json();
      if (!res.ok) { alert(data.error || "Erreur"); setLoading(false); return; }
      if (data.whatsappUrl) window.open(data.whatsappUrl, "_blank");
      router.push("/booking/confirmation?guide=" + encodeURIComponent(guideName) + "&price=" + adjustedTotal + "&persons=" + persons);
    } catch(e) { alert("Erreur reseau"); }
    setLoading(false);
  }

  const B = "#123EAB";

  if (!open) return (
    <button onClick={handleOpen} style={{ width:"100%", background:"#0B132B", color:"#fff", border:"none", borderRadius:30, padding:16, textAlign:"center", fontWeight:600, fontSize:16, cursor:"pointer", fontFamily:"inherit" }}>
      Reserver ce guide
    </button>
  );

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", zIndex:1000, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
      <div style={{ background:"#fff", borderRadius:"24px 24px 0 0", padding:"24px 20px 40px", width:"100%", maxWidth:480, maxHeight:"90vh", overflowY:"auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <h2 style={{ fontSize:18, fontWeight:700, color:"#0F172A" }}>Reserver {guideName}</h2>
          <button onClick={()=>setOpen(false)} style={{ background:"#F1F5F9", border:"none", borderRadius:"50%", width:32, height:32, cursor:"pointer", fontSize:16 }}>x</button>
        </div>

        {/* Duree */}
        <div style={{ marginBottom:16 }}>
          <label style={{ fontSize:13, fontWeight:600, color:"#374151", display:"block", marginBottom:8 }}>Type de visite</label>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            {(["half","full"] as const).map(d => (
              <button key={d} onClick={()=>setDuration(d)} style={{ padding:"12px 0", borderRadius:12, border:"2px solid "+(duration===d?B:"#E2E8F0"), background:duration===d?"#EFF6FF":"#fff", color:duration===d?B:"#475569", fontWeight:600, fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>
                {d==="half"?"Demi-journee (4h)":"Journee complete (8h)"}
                <div style={{ fontSize:12, marginTop:2, color:duration===d?B:"#94A3B8" }}>{d==="half"?halfDayPrice:fullDayPrice} MAD/j</div>
              </button>
            ))}
          </div>
        </div>

        {/* Calendrier */}
        <div style={{ marginBottom:16 }}>
          <label style={{ fontSize:13, fontWeight:600, color:"#374151", display:"block", marginBottom:8 }}>
            Selectionnez vos dates <span style={{ color:"#94A3B8", fontWeight:400 }}>(plusieurs dates possibles)</span>
          </label>
          <CalendarPicker
            blockedDates={bookedDates.map((b: any) => b.date)}
            priceHalfDay={halfDayPrice}
            priceFullDay={fullDayPrice}
            onSelectionChange={(slots: any[], t: number) => {
              setSelectedDates(slots.map((s: any) => s.date));
              setTotal(t);
            }}
          />
        </div>

        {/* Personnes */}
        <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:16 }}>
          <span style={{ fontSize:14, fontWeight:600, color:"#374151" }}>Personnes:</span>
          <button onClick={()=>setPersons(Math.max(1,persons-1))} style={{ width:36, height:36, borderRadius:"50%", border:"1.5px solid #E2E8F0", background:"#fff", fontSize:18, cursor:"pointer" }}>-</button>
          <span style={{ fontSize:18, fontWeight:700, minWidth:24, textAlign:"center" }}>{persons}</span>
          <button onClick={()=>setPersons(Math.min(20,persons+1))} style={{ width:36, height:36, borderRadius:"50%", border:"1.5px solid #E2E8F0", background:"#fff", fontSize:18, cursor:"pointer" }}>+</button>
        </div>

        {/* Total avec personnes */}
        {selectedDates.length > 0 && persons > 2 && (
          <div style={{ background:"#FFF7ED", borderRadius:12, padding:10, marginBottom:12, fontSize:12, color:"#92400E" }}>
            +10% par personne supplementaire au-dela de 2 personnes
          </div>
        )}

        <button onClick={handleConfirm} disabled={loading||selectedDates.length===0} style={{ width:"100%", background:selectedDates.length>0?"#0B132B":"#E2E8F0", color:selectedDates.length>0?"#fff":"#94A3B8", border:"none", borderRadius:30, padding:16, fontSize:15, fontWeight:600, cursor:selectedDates.length>0?"pointer":"not-allowed", fontFamily:"inherit" }}>
          {loading ? "Envoi..." : selectedDates.length > 0 ? "Confirmer - " + adjustedTotal + " MAD" : "Selectionnez vos dates"}
        </button>
      </div>
    </div>
  );
}
