"use client";
import { useState } from "react";

const B = "#123EAB";
const Y = "#F4C542";
const S = "#F8F5F0";

const GUIDE = {
  id: 1,
  name: "Youssef A.",
  city: "Marrakech",
  halfDay: 350,
  fullDay: 650,
  img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
};

const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [duration, setDuration] = useState<"half" | "full">("half");
  const [selectedDate, setSelectedDate] = useState(23);
  const [persons, setPersons] = useState(2);

  const price = duration === "half" ? GUIDE.halfDay : GUIDE.fullDay;
  const total = price * persons;

  return (
    <div style={{ background: S, minHeight: "100vh" }}>

      <nav style={{ background: B, padding: "0 20px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href={`/guide/${GUIDE.id}`} style={{ color: "#fff", fontSize: 22 }}>←</a>
        <span style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>Réserver avec {GUIDE.name}</span>
        <div style={{ width: 22 }} />
      </nav>

      <div style={{ background: "#fff", borderBottom: "1px solid #eee", padding: "16px 20px" }}>
        <div style={{ maxWidth: 560, margin: "0 auto", display: "flex", alignItems: "center" }}>
          {[["1", "Détails"], ["2", "Paiement"], ["3", "Confirmation"]].map(([n, label], i) => (
            <div key={n} style={{ display: "flex", alignItems: "center", flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: parseInt(n) <= step ? B : "#e0e0e0", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>
                  {parseInt(n) < step ? "✓" : n}
                </div>
                <span style={{ fontSize: 12, fontWeight: parseInt(n) <= step ? 700 : 500, color: parseInt(n) <= step ? B : "#aaa" }}>{label}</span>
              </div>
              {i < 2 && <div style={{ flex: 1, height: 2, background: parseInt(n) < step ? B : "#e0e0e0", margin: "0 12px" }} />}
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 560, margin: "28px auto", padding: "0 16px" }}>

        {step === 1 && (
          <div>
            <div style={{ background: "#fff", borderRadius: 18, padding: 18, display: "flex", gap: 16, marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <img src={GUIDE.img} alt={GUIDE.name} style={{ width: 64, height: 64, borderRadius: 14, objectFit: "cover" }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 17 }}>{GUIDE.name}</div>
                <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>📍 {GUIDE.city}</div>
                <div style={{ fontSize: 12, color: "#22c55e", fontWeight: 600, marginTop: 4 }}>✓ Guide Certifié</div>
              </div>
            </div>

            <div style={{ background: "#fff", borderRadius: 18, padding: 20, marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Choisissez la durée</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {([["half", "Demi-journée (4h)", GUIDE.halfDay], ["full", "Journée (8h)", GUIDE.fullDay]] as const).map(([val, label, p]) => (
                  <button key={val} onClick={() => setDuration(val)} style={{ padding: "16px 12px", borderRadius: 14, border: `2px solid ${duration === val ? B : "#e0e0e0"}`, background: duration === val ? "#eef2ff" : "#fff", textAlign: "left" }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: duration === val ? B : "#555", marginBottom: 6 }}>{label}</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: duration === val ? B : "#333" }}>{p} MAD</div>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ background: "#fff", borderRadius: 18, padding: 20, marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Sélectionnez la date</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <button style={{ fontSize: 20, color: B }}>‹</button>
                <span style={{ fontWeight: 700, fontSize: 15 }}>Mai 2024</span>
                <button style={{ fontSize: 20, color: B }}>›</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
                {DAYS.map((d) => (
                  <div key={d} style={{ textAlign: "center", fontSize: 11, color: "#888", fontWeight: 700, paddingBottom: 8 }}>{d}</div>
                ))}
                {[1, 2, 3].map((_, i) => <div key={`e${i}`} />)}
                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                  <button key={d} onClick={() => d >= 20 && setSelectedDate(d)} style={{ aspectRatio: "1", borderRadius: "50%", background: selectedDate === d ? B : "transparent", color: selectedDate === d ? "#fff" : d < 20 ? "#ccc" : "#333", fontWeight: selectedDate === d ? 700 : 500, fontSize: 13 }}>
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ background: "#fff", borderRadius: 18, padding: 20, marginBottom: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Nombre de personnes</div>
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <button onClick={() => setPersons(Math.max(1, persons - 1))} style={{ width: 40, height: 40, borderRadius: "50%", border: `2px solid ${B}`, background: "#fff", fontSize: 20, color: B }}>−</button>
                <span style={{ fontSize: 24, fontWeight: 800, minWidth: 30, textAlign: "center" }}>{persons}</span>
                <button onClick={() => setPersons(persons + 1)} style={{ width: 40, height: 40, borderRadius: "50%", background: B, fontSize: 20, color: "#fff" }}>+</button>
              </div>
            </div>

            <div style={{ background: S, borderRadius: 16, padding: 20, marginBottom: 20, border: "1px solid #e0d8d0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 13, color: "#777" }}>{price} MAD × {persons} pers.</span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{total} MAD</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid #e0d8d0" }}>
                <span style={{ fontSize: 15, fontWeight: 700 }}>Total</span>
                <span style={{ fontSize: 22, fontWeight: 800, color: B }}>{total} MAD</span>
              </div>
            </div>

            <button onClick={() => setStep(2)} style={{ width: "100%", background: Y, color: "#1a1a1a", borderRadius: 16, padding: 18, fontSize: 16, fontWeight: 800 }}>
              Continuer vers le paiement →
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <div style={{ background: "#fff", borderRadius: 18, padding: 24, marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Récapitulatif</div>
              <div style={{ display: "flex", gap: 16, padding: 16, background: S, borderRadius: 14, marginBottom: 16 }}>
                <img src={GUIDE.img} alt="" style={{ width: 56, height: 56, borderRadius: 10, objectFit: "cover" }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{GUIDE.name}</div>
                  <div style={{ fontSize: 13, color: "#888", marginTop: 2 }}>{duration === "half" ? "Demi-journée (4h)" : "Journée (8h)"}</div>
                  <div style={{ fontSize: 13, color: "#888", marginTop: 2 }}>📅 {selectedDate} Mai 2024 · 👥 {persons} pers.</div>
                </div>
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: B, textAlign: "center", padding: "16px 0", borderTop: "1px solid #eee" }}>
                Total : {total} MAD
              </div>
            </div>

            <div style={{ background: "#fff", borderRadius: 18, padding: 24, marginBottom: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>💳 Paiement sécurisé</div>
              {[["Numéro de carte", "1234 5678 9012 3456"], ["Date d'expiration", "MM/AA"], ["CVV", "•••"]].map(([label, ph]) => (
                <div key={label} style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#888", marginBottom: 6 }}>{label}</div>
                  <input placeholder={ph} style={{ width: "100%", border: "1.5px solid #e0e0e0", borderRadius: 12, padding: "13px 14px", fontSize: 14, outline: "none" }} />
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setStep(1)} style={{ flex: 1, padding: 16, border: "1.5px solid #e0e0e0", borderRadius: 16, background: "#fff", fontSize: 14, fontWeight: 600, color: "#555" }}>
                ← Retour
              </button>
              <button onClick={() => setStep(3)} style={{ flex: 2, padding: 16, borderRadius: 16, background: B, color: "#fff", fontSize: 14, fontWeight: 700 }}>
                Payer {total} MAD
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ width: 88, height: 88, borderRadius: "50%", background: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 42, margin: "0 auto 24px", color: "#fff" }}>✓</div>
            <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 10 }}>Réservation confirmée !</h2>
            <p style={{ color: "#777", fontSize: 14, marginBottom: 28 }}>Votre guide vous contactera dans les 24h.</p>
            <div style={{ background: "#fff", borderRadius: 18, padding: 24, marginBottom: 20, textAlign: "left", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              {[
                ["Guide", GUIDE.name],
                ["Date", `${selectedDate} Mai 2024`],
                ["Durée", duration === "half" ? "Demi-journée (4h)" : "Journée (8h)"],
                ["Personnes", `${persons}`],
                ["Total", `${total} MAD`],
              ].map(([label, val]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #f0f0f0" }}>
                  <span style={{ fontSize: 13, color: "#888" }}>{label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: label === "Total" ? B : "#1a1a1a" }}>{val}</span>
                </div>
              ))}
            </div>
            <a href="/" style={{ display: "block", background: B, color: "#fff", borderRadius: 16, padding: 16, fontSize: 15, fontWeight: 700 }}>
              Retour à l'accueil
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
