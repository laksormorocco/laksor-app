"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

const B="#123EAB",Y="#F4C542",T="#C96B4B",S="#F8F5F0";
type Slot = { date: string; duration: "half" | "full" };
type Props = { guideName: string; halfDayPrice: number; fullDayPrice: number; guideId: string };

export default function BookingModal({ guideName, halfDayPrice, fullDayPrice, guideId }: Props) {
  const [open, setOpen] = useState(false);
  const [slots, setSlots] = useState<Slot[]>([{ date: "", duration: "half" }]);
  const [persons, setPersons] = useState(1);
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookedDates, setBookedDates] = useState<{date:string,duration:string}[]>([]);
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    fetch("/api/guide/availability?guideId=" + guideId)
      .then(r => r.json())
      .then(d => setBookedDates(d.bookedDates || []));
  }, [guideId]);

  function isDateBlocked(date: string, duration: "half" | "full") {
    return bookedDates.some(b => {
      if (b.date !== date) return false;
      if (duration === "full") return true;
      if (b.duration === "FULL_DAY") return true;
      return b.duration === "HALF_DAY";
    });
  }

  function slotPrice(d: "half" | "full") {
    const base = d === "half" ? halfDayPrice : fullDayPrice;
    return persons <= 2 ? base : Math.round(base * (1 + (persons - 2) * 0.1));
  }
  const total = slots.reduce((s, sl) => s + slotPrice(sl.duration), 0);
  const commission = Math.round(total * 0.24);

  function addSlot() { setSlots([...slots, { date: "", duration: "half" }]); }
  function removeSlot(i: number) { setSlots(slots.filter((_, j) => j !== i)); }
  function updateSlot(i: number, key: keyof Slot, val: string) {
    setSlots(slots.map((s, j) => j === i ? { ...s, [key]: val } : s));
  }

  async function handleOpen() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: window.location.href }
      });
    } else {
      setOpen(true);
    }
  }

  async function handleConfirm() {
    if (slots.some(s => !s.date)) return alert("Choisis une date pour chaque creneau !");
    const blocked = slots.find(s => isDateBlocked(s.date, s.duration));
    if (blocked) return alert("La date " + blocked.date + " est deja reservee pour cette duree !");
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guideId, slots, persons, total, commission, touristSupabaseId: session?.user?.id }),
      });
      const result = await res.json();
      if (result.whatsappUrl) window.open(result.whatsappUrl, "_blank");
      await fetch("/api/email", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
          to: "laksor.morocco@gmail.com",
          guideName, date: slots[0].date, persons, price: total,
          duration: slots[0].duration === "half" ? "Demi-journee (4h)" : "Journee complete (8h)"
        })
      });
      setConfirmed(true);
      setTimeout(() => {
        window.location.href = "/booking/confirmation?guide=" + encodeURIComponent(guideName) + "&price=" + total + "&persons=" + persons;
      }, 3000);
    } catch { alert("Erreur, reessaie."); }
    setLoading(false);
  }

  return (
    <>
      <button onClick={handleOpen} style={{ width:"100%", background:Y, color:"#111", border:"none", borderRadius:14, padding:"18px 0", fontSize:16, fontWeight:800, cursor:"pointer" }}>
        Reserver ce guide
      </button>
      {open && (
        <div onClick={() => { setOpen(false); setConfirmed(false); }} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.55)", zIndex:100, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
          <div onClick={e => e.stopPropagation()} style={{ background:"#fff", borderRadius:"24px 24px 0 0", width:"100%", maxWidth:520, padding:28, paddingBottom:48, maxHeight:"90vh", overflowY:"auto" }}>
            {confirmed ? (
              <div style={{ textAlign:"center", padding:"16px 0" }}>
                <div style={{ fontSize:52, marginBottom:12 }}>🎉</div>
                <div style={{ fontSize:20, fontWeight:900, color:B, marginBottom:8 }}>Demande envoyee !</div>
                <div style={{ fontSize:14, color:"#666", lineHeight:1.6, marginBottom:20 }}><strong>{guideName}</strong> te contactera sous 24h.</div>
                <div style={{ background:S, borderRadius:14, padding:"14px 20px", marginBottom:20 }}>
                  <div style={{ fontSize:13, color:"#999", marginBottom:6 }}>{slots.length} creneau{slots.length>1?"x":""} · {persons} personne{persons>1?"s":""}</div>
                  <div style={{ fontSize:22, fontWeight:900, color:B }}>{total} MAD</div>
                  <div style={{ fontSize:11, color:"#999", marginTop:4 }}>dont {commission} MAD frais service</div>
                </div>
                <button onClick={() => { setOpen(false); setConfirmed(false); }} style={{ background:B, color:"#fff", border:"none", borderRadius:12, padding:"14px 32px", fontSize:14, fontWeight:700, cursor:"pointer" }}>Fermer</button>
              </div>
            ) : (
              <>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
                  <div style={{ fontSize:17, fontWeight:900, color:B }}>Reserver · {guideName}</div>
                  <button onClick={() => setOpen(false)} style={{ background:"none", border:"none", fontSize:22, cursor:"pointer", color:"#999" }}>✕</button>
                </div>

                <div style={{ fontSize:12, fontWeight:700, color:"#999", letterSpacing:1, marginBottom:10 }}>PERSONNES</div>
                <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:24 }}>
                  <button onClick={() => setPersons(Math.max(1, persons-1))} style={{ width:36, height:36, borderRadius:10, border:"2px solid #e8e0d6", background:"#fff", fontSize:18, cursor:"pointer", fontWeight:700 }}>-</button>
                  <div style={{ fontWeight:900, fontSize:20, color:B, minWidth:24, textAlign:"center" }}>{persons}</div>
                  <button onClick={() => setPersons(persons+1)} style={{ width:36, height:36, borderRadius:10, border:"2px solid #e8e0d6", background:"#fff", fontSize:18, cursor:"pointer", fontWeight:700 }}>+</button>
                  {persons >= 3 && <span style={{ fontSize:12, color:T, fontWeight:600 }}>+{(persons-2)*10}% / pers. suppl.</span>}
                </div>

                <div style={{ fontSize:12, fontWeight:700, color:"#999", letterSpacing:1, marginBottom:10 }}>CRENEAUX</div>
                {slots.map((sl, i) => (
                  <div key={i} style={{ background:S, borderRadius:14, padding:16, marginBottom:12 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                      <span style={{ fontWeight:700, color:B, fontSize:13 }}>Creneau {i+1}</span>
                      {slots.length > 1 && <button onClick={() => removeSlot(i)} style={{ background:"none", border:"none", color:"#999", cursor:"pointer", fontSize:18 }}>✕</button>}
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
                      {(["half","full"] as const).map(d => (
                        <button key={d} onClick={() => updateSlot(i,"duration",d)} style={{ border:`2px solid ${sl.duration===d?B:"#e8e0d6"}`, borderRadius:10, padding:"10px 6px", background:sl.duration===d?"#eef2ff":"#fff", cursor:"pointer", textAlign:"center" }}>
                          <div style={{ fontWeight:800, color:B, fontSize:15 }}>{slotPrice(d)} MAD</div>
                          <div style={{ fontSize:11, color:"#666" }}>{d==="half"?"4h":"8h"}</div>
                        </button>
                      ))}
                    </div>
                    <input type="date" min={today} value={sl.date}
                      onChange={e => updateSlot(i,"date",e.target.value)}
                      style={{ width:"100%", border:`2px solid ${sl.date && isDateBlocked(sl.date, sl.duration) ? "#ef4444" : "#e8e0d6"}`, borderRadius:10, padding:"10px 14px", fontSize:14, boxSizing:"border-box" }} />
                    {sl.date && isDateBlocked(sl.date, sl.duration) && (
                      <div style={{ color:"#ef4444", fontSize:12, marginTop:6, fontWeight:600 }}>
                        ❌ Date non disponible — choisissez une autre date
                      </div>
                    )}
                  </div>
                ))}

                <button onClick={addSlot} style={{ width:"100%", border:"2px dashed #e8e0d6", borderRadius:14, padding:"12px 0", background:"#fff", color:"#666", fontSize:14, cursor:"pointer", marginBottom:20 }}>
                  + Ajouter un creneau
                </button>

                <div style={{ background:S, borderRadius:14, padding:"14px 20px", display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                  <div>
                    <div style={{ fontSize:12, color:"#999" }}>{slots.length} creneau{slots.length>1?"x":""} · {persons} pers.</div>
                    <div style={{ fontSize:11, color:"#bbb", marginTop:2 }}>dont {commission} MAD frais service</div>
                  </div>
                  <span style={{ fontWeight:900, fontSize:20, color:B }}>{total} MAD</span>
                </div>

                <button onClick={handleConfirm} disabled={loading} style={{ width:"100%", background:Y, color:"#111", border:"none", borderRadius:14, padding:"18px 0", fontSize:16, fontWeight:800, cursor:"pointer" }}>
                  {loading ? "Envoi..." : "Confirmer la reservation"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
