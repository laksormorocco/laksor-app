"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import BookingModal from "@/components/BookingModal";

export default function GuidePageClient({ guide }: { guide: any }) {
  const [tab, setTab] = useState("apropos");

  useEffect(() => {
    fetch("/api/guide/views", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ guideId: guide.id }) });
  }, [guide.id]);

  return (
    <div style={{ background: "#fff", minHeight: "100vh", fontFamily: "Inter, -apple-system, sans-serif", paddingBottom: 180 }}>

      <nav style={{ background: "#fff", borderBottom: "1px solid #F1F5F9", padding: "0 16px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <Link href="/search" style={{ display: "flex", alignItems: "center", gap: 6, color: "#1A202C", textDecoration: "none" }}>
          <span style={{ fontSize: 18 }}>←</span>
          <span style={{ fontWeight: 600, fontSize: 14 }}>Retour</span>
        </Link>
        <Link href="/"><img src="/Logo.png" alt="Laksor" style={{ height: 40, width: "auto" }}/></Link>
        <div style={{ display: "flex", gap: 16 }}>
          <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20 }}>♡</button>
          <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20 }}>↤</button>
        </div>
      </nav>

      <div style={{ position: "relative", height: 340, overflow: "hidden", background: "linear-gradient(135deg,#123EAB,#1a4fd6)" }}>
        {guide.avatar && <img src={guide.avatar} alt={guide.displayName} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}/>}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)" }}/>
        <div style={{ position: "absolute", bottom: 20, left: 20, right: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ color: "#fff", fontSize: 26, fontWeight: 700 }}>{guide.displayName}</span>
            <span style={{ background: "#123EAB", color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>✓ Certifié</span>
          </div>
          <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, marginBottom: 8 }}>📍 {guide.city}, Morocco</div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(0,0,0,0.5)", borderRadius: 20, padding: "4px 12px" }}>
            <span style={{ color: "#F4C542", fontSize: 13 }}>★</span>
            <span style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{Number(guide.avgRating).toFixed(1)}</span>
            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>({guide.totalReviews} avis)</span>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", textAlign: "center", padding: "16px 20px", borderBottom: "1px solid #E2E8F0" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 20, marginBottom: 4 }}>🌍</div>
          <div style={{ color: "#718096", fontSize: 11, marginBottom: 3, textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>Langues</div>
          <div style={{ color: "#1A202C", fontSize: 13, fontWeight: 600 }}>{(guide.languages as string[]).slice(0,2).join(", ")}</div>
        </div>
        <div style={{ flex: 1, borderLeft: "1px solid #E2E8F0", borderRight: "1px solid #E2E8F0" }}>
          <div style={{ fontSize: 20, marginBottom: 4 }}>📅</div>
          <div style={{ color: "#718096", fontSize: 11, marginBottom: 3, textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>Expérience</div>
          <div style={{ color: "#1A202C", fontSize: 13, fontWeight: 600 }}>{guide.yearsExp || "—"} ans</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 20, marginBottom: 4 }}>⚡</div>
          <div style={{ color: "#718096", fontSize: 11, marginBottom: 3, textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>Réponse</div>
          <div style={{ color: "#1A202C", fontSize: 13, fontWeight: 600 }}>{"< 1h"}</div>
        </div>
      </div>

      <div style={{ display: "flex", borderBottom: "1px solid #E2E8F0", background: "#fff", position: "sticky", top: 56, zIndex: 50 }}>
        {[["apropos", "À propos"], ["services", "Services"], ["avis", `Avis (${guide.totalReviews})`], ["galerie", "Galerie"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{ flex: 1, padding: "14px 4px", fontSize: 13, fontWeight: tab === id ? 700 : 500, color: tab === id ? "#0F172A" : "#718096", background: "none", border: "none", borderBottom: `2px solid ${tab === id ? "#0F172A" : "transparent"}`, cursor: "pointer", fontFamily: "inherit" }}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ padding: "20px 20px 0" }}>

        {tab === "apropos" && (
          <div>
            <h2 style={{ color: "#0F172A", fontSize: 18, fontWeight: 700, marginBottom: 10 }}>À propos de {guide.displayName.split(" ")[0]}</h2>
            <p style={{ color: "#475569", fontSize: 15, lineHeight: 1.7, marginBottom: 20 }}>{guide.bio}</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
              {(guide.specialties as string[]).map((s:string) => (
                <span key={s} style={{ background: "#F1F5F9", color: "#334155", padding: "6px 14px", borderRadius: 20, fontSize: 13, fontWeight: 500 }}>{s}</span>
              ))}
            </div>
            {[
              { icon: "🗣️", label: "Langues", val: (guide.languages as string[]).join(", ") },
              { icon: "🗺️", label: "Zones couvertes", val: (guide.coveredCities as string[]).length > 0 ? (guide.coveredCities as string[]).join(", ") : guide.city },
              { icon: "🏅", label: "Certifications", val: (guide.certifications as string[]).length > 0 ? (guide.certifications as string[]).join(", ") : "Guide certifié Laksor" },
            ].map(item => (
              <div key={item.label} style={{ display: "flex", gap: 14, padding: "14px 0", borderBottom: "1px solid #F1F5F9" }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: 11, color: "#A0AEC0", fontWeight: 700, marginBottom: 3, textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>{item.label}</div>
                  <div style={{ fontSize: 14, color: "#334155" }}>{item.val}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "services" && (
          <div>
            {[
              { title: "Demi-journée (4h)", desc: "Découverte de la médina, souks et monuments principaux", price: guide.halfDayPrice },
              { title: "Journée complète (8h)", desc: "Exploration complète de la ville et des environs", price: guide.fullDayPrice },
              { title: "Tour culinaire", desc: "Dégustation et cours de cuisine marocaine authentique", price: 400 },
              { title: "Excursion désert", desc: "Journée dans le désert avec chameau et coucher de soleil", price: 800 },
            ].map(s => (
              <div key={s.title} style={{ padding: "18px 0", borderBottom: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#0F172A", marginBottom: 4 }}>{s.title}</div>
                  <div style={{ fontSize: 13, color: "#718096" }}>{s.desc}</div>
                </div>
                <div style={{ fontSize: 17, fontWeight: 800, color: "#22c55e", flexShrink: 0 }}>{s.price} MAD</div>
              </div>
            ))}
          </div>
        )}

        {tab === "avis" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24, padding: 20, background: "#F8FAFC", borderRadius: 16 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 44, fontWeight: 800, color: "#0F172A" }}>{Number(guide.avgRating).toFixed(1)}</div>
                <div style={{ color: "#F4C542", fontSize: 18 }}>★★★★★</div>
                <div style={{ fontSize: 11, color: "#A0AEC0", marginTop: 4 }}>{guide.totalReviews} avis</div>
              </div>
              <div style={{ flex: 1 }}>
                {[5,4,3,2,1].map(star => (
                  <div key={star} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: "#A0AEC0", width: 10 }}>{star}</span>
                    <span style={{ color: "#F4C542", fontSize: 10 }}>★</span>
                    <div style={{ flex: 1, height: 6, background: "#E2E8F0", borderRadius: 3 }}>
                      <div style={{ height: "100%", background: "#F4C542", borderRadius: 3, width: star === 5 ? "90%" : star === 4 ? "8%" : "2%" }}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {guide.reviews?.length === 0 && <p style={{ textAlign: "center", color: "#94A3B8", padding: 20 }}>Aucun avis pour le moment</p>}
            {guide.reviews?.map((r: any) => (
              <div key={r.id} style={{ padding: "16px 0", borderBottom: "1px solid #F1F5F9" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#E2E8F0", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#475569", fontSize: 14 }}>
                    {r.author?.avatar ? <img src={r.author.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }}/> : r.author?.name?.[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: "#1A202C" }}>{r.author?.name || "Voyageur"}</div>
                    <div style={{ color: "#F4C542", fontSize: 12 }}>{"★".repeat(r.rating)}</div>
                  </div>
                  <div style={{ marginLeft: "auto", color: "#A0AEC0", fontSize: 12 }}>{new Date(r.createdAt).toLocaleDateString("fr-FR")}</div>
                </div>
                <p style={{ color: "#475569", fontSize: 14, lineHeight: 1.6 }}>{r.comment}</p>
              </div>
            ))}
          </div>
        )}

        {tab === "galerie" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {guide.avatar && <div style={{ borderRadius: 14, overflow: "hidden", height: 160 }}><img src={guide.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}/></div>}
            {(guide.gallery as string[]).map((img: string, i: number) => (
              <div key={i} style={{ borderRadius: 14, overflow: "hidden", height: 160 }}>
                <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: "#fff", borderTop: "1px solid #E2E8F0", padding: "12px 20px 28px", zIndex: 100 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <div style={{ textAlign: "center", flex: 1 }}>
            <div style={{ color: "#0F172A", fontWeight: 700, fontSize: 18 }}>{guide.halfDayPrice} <span style={{ fontSize: 13, fontWeight: 400, color: "#718096" }}>MAD</span></div>
            <div style={{ color: "#718096", fontSize: 11 }}>4h · Demi-journée</div>
          </div>
          <div style={{ width: 1, background: "#E2E8F0", margin: "0 12px" }}/>
          <div style={{ textAlign: "center", flex: 1 }}>
            <div style={{ color: "#0F172A", fontWeight: 700, fontSize: 18 }}>{guide.fullDayPrice} <span style={{ fontSize: 13, fontWeight: 400, color: "#718096" }}>MAD</span></div>
            <div style={{ color: "#718096", fontSize: 11 }}>8h · Journée</div>
          </div>
        </div>
        <BookingModal guideName={guide.displayName} halfDayPrice={Number(guide.halfDayPrice)} fullDayPrice={Number(guide.fullDayPrice)} guideId={guide.id}/>
        <Link href={"/custom-request?guideId="+guide.id} style={{ display: "block", background: "#fff", color: "#0B132B", border: "2px solid #0B132B", borderRadius: 30, padding: 12, textAlign: "center", fontWeight: 600, fontSize: 14, textDecoration: "none", marginTop: 8 }}>
          🎯 Demande sur mesure
        </Link>
      </div>
    </div>
  );
}
