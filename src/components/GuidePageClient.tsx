"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import BookingModal from "@/components/BookingModal";

function toEur(mad: number): string {
  return "€" + Math.round((mad * 1.25 + 25) * 0.092);
}

export default function GuidePageClient({ guide }: { guide: any }) {
  const [tab, setTab] = useState("apropos");

  useEffect(() => {
    fetch("/api/guide/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guideId: guide.id })
    });
  }, [guide.id]);

  return (
    <div style={{ background: "var(--sand)", minHeight: "100vh", paddingBottom: 200 }}>

      {/* ── COVER ── */}
      <div style={{ position: "relative", height: 240 }}>
        <img
          src={guide.avatar ?? "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&q=80"}
          alt={guide.displayName}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,rgba(0,0,0,0.05),rgba(0,0,0,0.72))" }} />

        {/* Top buttons */}
        <div style={{ position: "absolute", top: 14, left: 14, right: 14, display: "flex", justifyContent: "space-between" }}>
          <Link href="/search" className="btn-ghost" style={{ padding: "7px 14px", fontSize: 12 }}>← Retour</Link>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn-ghost" style={{ width: 36, height: 36, padding: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>♡</button>
            <button className="btn-ghost" style={{ width: 36, height: 36, padding: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⬆</button>
          </div>
        </div>

        {/* Bottom info */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "18px 20px" }}>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 30, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{guide.city}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img
              src={guide.avatar ?? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80"}
              style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(255,255,255,0.4)" }}
            />
            <div>
              <div style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>{guide.displayName}</div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>Guide local · {guide.yearsExp} ans</div>
            </div>
            <span className="badge badge-sage" style={{ marginLeft: "auto" }}>✓ Vérifié</span>
          </div>
        </div>
      </div>

      {/* ── STATS BAR ── */}
      <div style={{ background: "var(--charcoal)", padding: "12px 20px", display: "grid", gridTemplateColumns: "repeat(4,1fr)", textAlign: "center" }}>
        {[
          { val: Number(guide.avgRating).toFixed(1), label: "Note",     color: "var(--bronze)" },
          { val: guide.totalReviews,                  label: "Avis",     color: "#fff" },
          { val: guide.yearsExp,                      label: "Ans exp.", color: "#fff" },
          { val: (guide.visitTypes as string[]).length || "5", label: "Circuits", color: "#fff" },
        ].map((s, i) => (
          <div key={s.label} style={{ borderRight: i < 3 ? "1px solid rgba(255,255,255,0.08)" : "none", padding: "0 4px" }}>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 17, fontWeight: 700, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", marginTop: 1 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── BADGES ── */}
      <div style={{ background: "var(--white)", padding: "12px 16px", display: "flex", gap: 8, overflowX: "auto", borderBottom: "1px solid var(--sand)", scrollbarWidth: "none" }}>
        <div style={{ background: "#E8F0E4", border: "1.5px solid var(--sage)", borderRadius: 12, padding: "7px 12px", display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
          <span style={{ fontSize: 16 }}>⏰</span>
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, color: "var(--sage)" }}>100% PONCTUEL</div>
            <div style={{ fontSize: 9, color: "var(--muted)" }}>{guide.totalReviews} visites</div>
          </div>
        </div>
        {Number(guide.avgRating) >= 4.8 && (
          <div style={{ background: "#FEF3E8", border: "1.5px solid var(--bronze)", borderRadius: 12, padding: "7px 12px", display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
            <span style={{ fontSize: 16 }}>🏆</span>
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, color: "var(--bronze)" }}>SUPER GUIDE</div>
              <div style={{ fontSize: 9, color: "var(--muted)" }}>Top 5%</div>
            </div>
          </div>
        )}
        <div style={{ background: "var(--sand)", border: "1.5px solid var(--sand-dark)", borderRadius: 12, padding: "7px 12px", display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
          <span style={{ fontSize: 16 }}>⚡</span>
          <div style={{ fontSize: 10, fontWeight: 800, color: "var(--charcoal)" }}>RÉPONSE &lt;1H</div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="tab-bar" style={{ position: "sticky", top: 0, zIndex: 50 }}>
        {[
          ["apropos", "À propos"],
          ["services", "Services"],
          ["avis", `Avis (${guide.totalReviews})`],
          ["photos", "Photos"],
        ].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`tab-btn${tab === id ? " active" : ""}`}
          >{label}</button>
        ))}
      </div>

      {/* ── TAB: À PROPOS ── */}
      {tab === "apropos" && (
        <div style={{ padding: 20 }}>
          <div className="card" style={{ padding: 18, marginBottom: 14 }}>
            <p style={{ fontSize: 13, color: "var(--soft)", lineHeight: 1.7, fontStyle: "italic", marginBottom: 14, paddingBottom: 14, borderBottom: "1px solid var(--sand)" }}>
              &ldquo;{guide.bio}&rdquo;
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <div style={{ background: "var(--sand)", borderRadius: 12, padding: 10 }}>
                <div style={{ fontSize: 9, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>📍 Ville</div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{guide.city}</div>
              </div>
              <div style={{ background: "var(--sand)", borderRadius: 12, padding: 10 }}>
                <div style={{ fontSize: 9, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>🚗 Transport</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--sage)" }}>Disponible</div>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: 18, marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Langues</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {(guide.languages as string[]).map((l: string) => (
                <span key={l} className="btn-bronze" style={{ padding: "6px 14px", fontSize: 12 }}>{l}</span>
              ))}
            </div>
          </div>

          {(guide.specialties as string[]).length > 0 && (
            <div className="card" style={{ padding: 18, marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Spécialités</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                {(guide.specialties as string[]).map((s: string) => (
                  <span key={s} className="pill">{s}</span>
                ))}
              </div>
            </div>
          )}

          <button onClick={() => setTab("services")} className="btn-bronze" style={{ width: "100%", padding: 15, fontSize: 14 }}>
            Voir les services · à partir de {guide.halfDayPrice} MAD
          </button>
        </div>
      )}

      {/* ── TAB: SERVICES ── */}
      {tab === "services" && (
        <div style={{ padding: 20 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { title: "Demi-journée (4h)",     desc: "Découverte de la médina, souks et monuments principaux", price: guide.halfDayPrice, popular: true },
              { title: "Journée complète (8h)", desc: "Exploration complète de la ville et des environs",        price: guide.fullDayPrice, popular: false },
              { title: "Tour culinaire",        desc: "Dégustation et cours de cuisine marocaine authentique",   price: 400,               popular: false },
              { title: "Excursion désert",      desc: "Journée dans le désert avec chameau et coucher de soleil",price: 800,               popular: false },
            ].map(s => (
              <div key={s.title} className="card" style={{ padding: "18px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, border: s.popular ? "1.5px solid rgba(184,138,68,0.4)" : "none" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "var(--charcoal)" }}>{s.title}</div>
                    {s.popular && <span className="badge badge-sage">Populaire</span>}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>{s.desc}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 700, color: "var(--charcoal)" }}>{s.price} MAD</div>
                  <div style={{ fontSize: 10, color: "var(--muted)" }}>{toEur(Number(s.price))}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB: AVIS ── */}
      {tab === "avis" && (
        <div style={{ padding: 20 }}>
          <div className="card" style={{ padding: 18, marginBottom: 14 }}>
            <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 14, paddingBottom: 14, borderBottom: "1px solid var(--sand)" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: 44, fontWeight: 700, color: "var(--bronze)", lineHeight: 1 }}>{Number(guide.avgRating).toFixed(1)}</div>
                <div style={{ color: "var(--bronze)", fontSize: 17, marginTop: 4 }}>★★★★★</div>
                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>{guide.totalReviews} avis</div>
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 7 }}>
                {[
                  { label: "⏰ Ponctualité",   val: "5.0", color: "var(--sage)",   w: "100%" },
                  { label: "🗣️ Communication", val: "4.9", color: "var(--sage)",   w: "98%"  },
                  { label: "🏛️ Connaissance",  val: "5.0", color: "var(--sage)",   w: "100%" },
                  { label: "💰 Qualité/prix",  val: "4.8", color: "var(--bronze)", w: "96%"  },
                ].map(r => (
                  <div key={r.label}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 3 }}>
                      <span style={{ color: "var(--soft)" }}>{r.label}</span>
                      <span style={{ fontWeight: 700, color: r.color }}>{r.val}</span>
                    </div>
                    <div className="progress-bar">
                      <div style={{ height: "100%", borderRadius: 3, background: r.color, width: r.w }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--sage)", textAlign: "center" }}>
              👍 97% recommandent {guide.displayName.split(" ")[0]}
            </div>
          </div>

          {guide.reviews?.length === 0 && (
            <div className="card" style={{ padding: "40px 20px", textAlign: "center", color: "var(--muted)" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>💬</div>
              <div>Aucun avis pour le moment</div>
            </div>
          )}

          {guide.reviews?.map((r: any) => (
            <div key={r.id} className="card" style={{ padding: 16, marginBottom: 10 }}>
              <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--sand-dark)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "var(--soft)", fontSize: 14, flexShrink: 0 }}>
                  {r.author?.avatar
                    ? <img src={r.author.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : r.author?.name?.[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{r.author?.name || "Voyageur"}</div>
                  <div style={{ fontSize: 10, color: "var(--muted)" }}>{new Date(r.createdAt).toLocaleDateString("fr-FR")}</div>
                </div>
                <div style={{ color: "var(--bronze)", fontSize: 13 }}>{"★".repeat(r.rating)}</div>
              </div>
              <p style={{ fontSize: 13, color: "var(--soft)", lineHeight: 1.6, fontStyle: "italic", margin: 0 }}>&ldquo;{r.comment}&rdquo;</p>
              <div style={{ fontSize: 11, fontWeight: 600, color: "var(--sage)", marginTop: 8 }}>👍 Recommandé</div>
            </div>
          ))}
        </div>
      )}

      {/* ── TAB: PHOTOS ── */}
      {tab === "photos" && (
        <div style={{ padding: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {guide.avatar && (
              <img src={guide.avatar} alt="" style={{ width: "100%", height: 130, objectFit: "cover", borderRadius: 16 }} />
            )}
            {(guide.gallery as string[]).map((img: string, i: number) => (
              <img key={i} src={img} alt="" style={{ width: "100%", height: 130, objectFit: "cover", borderRadius: 16 }} />
            ))}
            {(guide.gallery as string[]).length === 0 && (
              <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px", color: "var(--muted)" }} className="card">
                <div style={{ fontSize: 32, marginBottom: 8 }}>📷</div>
                <div>Aucune photo disponible</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── STICKY FOOTER ── */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 680,
        background: "rgba(255,255,255,0.97)", backdropFilter: "blur(16px)",
        borderTop: "1px solid var(--sand-dark)", padding: "12px 20px 28px", zIndex: 100
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <div style={{ textAlign: "center", flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 18 }}>{guide.halfDayPrice} <span style={{ fontSize: 13, fontWeight: 400, color: "var(--muted)" }}>MAD</span></div>
            <div style={{ color: "var(--muted)", fontSize: 11 }}>4h · Demi-journée</div>
          </div>
          <div style={{ width: 1, background: "var(--sand-dark)", margin: "0 12px" }} />
          <div style={{ textAlign: "center", flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 18 }}>{guide.fullDayPrice} <span style={{ fontSize: 13, fontWeight: 400, color: "var(--muted)" }}>MAD</span></div>
            <div style={{ color: "var(--muted)", fontSize: 11 }}>8h · Journée</div>
          </div>
        </div>
        <BookingModal
          guideName={guide.displayName}
          halfDayPrice={Number(guide.halfDayPrice)}
          fullDayPrice={Number(guide.fullDayPrice)}
          guideId={guide.id}
        />
      </div>
    </div>
  );
}
