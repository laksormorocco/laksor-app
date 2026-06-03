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

const HOURS = ["08h00","09h00","10h00","11h00","14h00","15h00","16h00"];
const PAYMENT_OPTIONS = [
  { id: "deposit", label: "💳 Acompte 30%", desc: "+ 70% le jour J · Annulation gratuite 72h" },
  { id: "full",    label: "💳 100% en ligne", desc: "Annulation gratuite 72h" },
  { id: "cash",    label: "💵 Cash le jour J", desc: "Aucun prépaiement" },
];

export default function BookingModal({ guideName, halfDayPrice, fullDayPrice, guideId }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const [duration, setDuration] = useState<"half"|"full">("half");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [selectedHour, setSelectedHour] = useState("10h00");
  const [transport, setTransport] = useState(false);
  const [payment, setPayment] = useState("deposit");
  const [loading, setLoading] = useState(false);
  const [bookedDates, setBookedDates] = useState<{date:string;duration:string}[]>([]);

  useEffect(() => {
    fetch("/api/guide/availability?guideId=" + guideId)
      .then(r => r.json())
      .then(d => setBookedDates(d.bookedDates || []));
  }, [guideId]);

  const pricePerDay = duration === "full" ? fullDayPrice : halfDayPrice;
  const persons = adults + children;
  const extraPersonCost = persons > 2 ? Math.round(total * (persons - 2) * 0.1) : 0;
  const transportCost = transport ? 150 : 0;
  const serviceFee = 25;
  const adjustedTotal = total + extraPersonCost + transportCost + (selectedDates.length > 0 ? serviceFee : 0);
  const deposit = Math.round(adjustedTotal * 0.3);

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
          notes: `Heure: ${selectedHour}${selectedDates.length > 1 ? " | Dates: " + selectedDates.join(", ") : ""}${transport ? " | Transport inclus" : ""}`
        })
      });
      const data = await res.json();
      if (!res.ok) { alert(data.error || "Erreur"); setLoading(false); return; }
      if (data.whatsappUrl) window.open(data.whatsappUrl, "_blank");
      router.push("/booking/confirmation?guide=" + encodeURIComponent(guideName) + "&price=" + adjustedTotal + "&persons=" + persons);
    } catch(e) { alert("Erreur reseau"); }
    setLoading(false);
  }

  if (!open) return (
    <button onClick={handleOpen} className="btn-bronze" style={{ width: "100%", padding: 16, fontSize: 15, justifyContent: "center" }}>
      Vérifier les disponibilités →
    </button>
  );

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 1000, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div style={{ background: "var(--sand)", borderRadius: "28px 28px 0 0", width: "100%", maxWidth: 520, maxHeight: "92vh", overflowY: "auto", display: "flex", flexDirection: "column" }}>

        {/* ── HEADER SAGE ── */}
        <div style={{ background: "var(--sage)", padding: "16px 20px 0", flexShrink: 0 }}>
          <button onClick={() => setOpen(false)} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "999px", color: "#fff", padding: "7px 14px", fontSize: 12, cursor: "pointer", fontFamily: "inherit", marginBottom: 14 }}>← Fermer</button>
          <div style={{ display: "flex", gap: 10, alignItems: "center", paddingBottom: 14, borderBottom: "1px solid rgba(255,255,255,0.15)" }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>👤</div>
            <div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Réservation avec</div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: 16, fontWeight: 700, color: "#fff" }}>{guideName}</div>
            </div>
          </div>

          {/* Service sélectionné */}
          <div style={{ padding: "12px 0 14px" }}>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>Service sélectionné</div>
            <div style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 16, padding: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>
                  {duration === "half" ? "🌅 Demi-journée (4h)" : "☀️ Journée complète (8h)"}
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 3 }}>
                  {duration === "half" ? halfDayPrice : fullDayPrice} MAD · {adults} adulte{adults > 1 ? "s" : ""}{children > 0 ? ` · ${children} enfant${children > 1 ? "s" : ""}` : ""}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── CONTENT ── */}
        <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>

          {/* Durée */}
          <div className="card" style={{ padding: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: "var(--charcoal)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12 }}>⏱️ Durée</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {(["half","full"] as const).map(d => (
                <button key={d} onClick={() => setDuration(d)} style={{
                  padding: "12px 8px", borderRadius: 14,
                  border: `2px solid ${duration === d ? "var(--bronze)" : "var(--sand-dark)"}`,
                  background: duration === d ? "#FEF3E8" : "var(--sand)",
                  color: duration === d ? "var(--bronze)" : "var(--soft)",
                  fontWeight: 600, fontSize: 12, cursor: "pointer", fontFamily: "inherit"
                }}>
                  {d === "half" ? "Demi-journée (4h)" : "Journée complète (8h)"}
                  <div style={{ fontSize: 14, marginTop: 4, fontWeight: 700, color: duration === d ? "var(--bronze)" : "var(--charcoal)" }}>
                    {d === "half" ? halfDayPrice : fullDayPrice} MAD
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div className="card" style={{ padding: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: "var(--charcoal)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12 }}>📅 Date</div>
            <CalendarPicker
              blockedDates={bookedDates.map(b => b.date)}
              priceHalfDay={pricePerDay} priceFullDay={pricePerDay * 2}
              onSelectionChange={(dates, t) => { setSelectedDates(dates.map(s => s.date)); setTotal(t); }}
            />
          </div>

          {/* Heure */}
          <div className="card" style={{ padding: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: "var(--charcoal)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12 }}>🕘 Heure</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {HOURS.map(h => (
                <button key={h} onClick={() => setSelectedHour(h)}
                  className={selectedHour === h ? "pill active" : "pill"}>
                  {h}
                </button>
              ))}
            </div>
          </div>

          {/* Participants */}
          <div className="card" style={{ padding: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: "var(--charcoal)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12 }}>👥 Participants</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "👤 Adultes", desc: "12 ans +", val: adults, set: setAdults, min: 1 },
                { label: "🧒 Enfants", desc: "Moins de 12 ans", val: children, set: setChildren, min: 0 },
              ].map(p => (
                <div key={p.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--sand)", borderRadius: 14, padding: "11px 14px" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{p.label}</div>
                    <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 1 }}>{p.desc}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <button onClick={() => p.set(Math.max(p.min, p.val - 1))} style={{ width: 32, height: 32, borderRadius: "50%", border: "1.5px solid var(--sand-dark)", background: "var(--white)", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                    <span style={{ fontFamily: "var(--font-serif)", fontSize: 20, fontWeight: 700, minWidth: 22, textAlign: "center" }}>{p.val}</span>
                    <button onClick={() => p.set(Math.min(20, p.val + 1))} style={{ width: 32, height: 32, borderRadius: "50%", border: "none", background: "var(--charcoal)", color: "#fff", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transport */}
          <div className="card" style={{ padding: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: "var(--charcoal)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>🚗 Transport</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--sand)", borderRadius: 14, padding: "12px 14px" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>Prise en charge hôtel/riad</div>
                <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 1 }}>+150 MAD aller-retour</div>
              </div>
              <div onClick={() => setTransport(!transport)} style={{ width: 48, height: 26, background: transport ? "var(--sage)" : "var(--sand-dark)", borderRadius: 13, position: "relative", cursor: "pointer", flexShrink: 0, transition: "background 0.3s" }}>
                <div style={{ width: 20, height: 20, background: "#fff", borderRadius: "50%", position: "absolute", top: 3, left: transport ? 25 : 3, transition: "left 0.3s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
              </div>
            </div>
          </div>

          {/* Paiement */}
          <div className="card" style={{ padding: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: "var(--charcoal)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12 }}>💳 Paiement</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {PAYMENT_OPTIONS.map(opt => (
                <div key={opt.id} onClick={() => setPayment(opt.id)} style={{
                  background: payment === opt.id ? "#FEF3E8" : "var(--sand)",
                  border: `${payment === opt.id ? "2" : "1.5"}px solid ${payment === opt.id ? "var(--bronze)" : "var(--sand-dark)"}`,
                  borderRadius: 14, padding: "12px 14px",
                  display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer"
                }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--charcoal)" }}>{opt.label}</div>
                    <div style={{ fontSize: 11, color: "var(--soft)", marginTop: 2 }}>{opt.desc}</div>
                  </div>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${payment === opt.id ? "var(--bronze)" : "var(--sand-dark)"}`, background: payment === opt.id ? "var(--bronze)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {payment === opt.id && <div style={{ width: 7, height: 7, background: "#fff", borderRadius: "50%" }} />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Récapitulatif */}
          {selectedDates.length > 0 && (
            <div style={{ background: "var(--sage)", borderRadius: "var(--r-card)", padding: 18 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>Récapitulatif</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 7, paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
                  <span>{duration === "half" ? "Demi-journée" : "Journée"} · {selectedDates.length} jour{selectedDates.length > 1 ? "s" : ""} · {persons} pers.</span>
                  <span style={{ color: "#fff" }}>{total} MAD</span>
                </div>
                {extraPersonCost > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
                    <span>+10% pers. supplémentaires</span>
                    <span style={{ color: "#fff" }}>+{extraPersonCost} MAD</span>
                  </div>
                )}
                {transport && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
                    <span>🚗 Transport</span>
                    <span style={{ color: "#fff" }}>+150 MAD</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
                  <span>🔧 Frais de service</span>
                  <span style={{ color: "#fff" }}>+{serviceFee} MAD</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
                  <span>Commission Laksor (25%)</span>
                  <span>inclus</span>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 12 }}>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Total</span>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "var(--font-serif)", fontSize: 32, fontWeight: 700, color: "#fff", lineHeight: 1 }}>{adjustedTotal} MAD</div>
                  {payment === "deposit" && <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>Acompte dû : {deposit} MAD</div>}
                </div>
              </div>
            </div>
          )}

          {/* Bouton confirmer */}
          <button
            onClick={handleConfirm}
            disabled={loading || selectedDates.length === 0}
            className={selectedDates.length > 0 ? "btn-bronze" : ""}
            style={{
              width: "100%", padding: 16, fontSize: 15, fontWeight: 700,
              borderRadius: "999px", border: "none",
              cursor: selectedDates.length > 0 ? "pointer" : "not-allowed",
              background: selectedDates.length > 0 ? undefined : "var(--sand-dark)",
              color: selectedDates.length > 0 ? undefined : "var(--muted)",
              fontFamily: "inherit", justifyContent: "center", display: "flex", alignItems: "center"
            }}
          >
            {loading ? "Envoi en cours..." : selectedDates.length > 0 ? `Confirmer la réservation ✦` : "Sélectionnez vos dates"}
          </button>

          <div style={{ textAlign: "center", fontSize: 11, color: "var(--muted)", marginTop: -4, paddingBottom: 8 }}>
            🔒 Paiement sécurisé · CMI · Visa · Mastercard
          </div>
        </div>
      </div>
    </div>
  );
}
