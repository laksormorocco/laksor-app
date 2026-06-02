import { prisma } from "@/lib/prisma";
import HomeHero from "./HomeHero";

function toEur(mad: number) {
  return "€" + Math.round((mad * 1.25 + 25) * 0.092);
}

const CITIES = [
  { name: "Marrakech",   img: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=400&q=80" },
  { name: "Fès",         img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },
  { name: "Essaouira",   img: "https://images.unsplash.com/photo-1509741102003-ca64bfe8696f?w=400&q=80" },
  { name: "Agadir",      img: "https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?w=400&q=80" },
  { name: "Chefchaouen", img: "https://images.unsplash.com/photo-1553522991-fd5deb8e3b50?w=400&q=80" },
];

const TRUST = [
  { icon: "🛡️", title: "Certified Guides",  desc: "Every guide verified by Laksor" },
  { icon: "💬", title: "WhatsApp Updates",  desc: "Real-time notifications" },
  { icon: "🔄", title: "72h Cancellation", desc: "Free cancellation policy" },
  { icon: "🚗", title: "Transport",         desc: "Book guide + ride together" },
];

export default async function HomePage() {
  const guides = await prisma.guideProfile.findMany({
    where: { status: "APPROVED" },
    take: 4,
    orderBy: { avgRating: "desc" },
  });

  return (
    <div style={{ background: "var(--sand)", minHeight: "100vh", fontFamily: "var(--font-body)" }}>

      <HomeHero />

      {/* TRUST BAR */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 clamp(16px,4vw,24px)" }}>
        <div style={{ background: "var(--white)", borderRadius: 18, padding: "16px 20px", boxShadow: "var(--shadow)", display: "flex", justifyContent: "space-around", textAlign: "center", marginTop: -28, position: "relative", zIndex: 10 }}>
          {[
            { n: "47+",   label: "Guides",   color: "var(--bronze)"   },
            { n: "28+",   label: "Drivers",  color: "var(--sage)"     },
            { n: "⭐4.9", label: "Rating",   color: "var(--charcoal)" },
            { n: "1.2k+", label: "Bookings", color: "var(--charcoal)" },
          ].map((s, i) => (
            <div key={s.label} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: 20, fontWeight: 700, color: s.color }}>{s.n}</div>
                <div style={{ fontSize: 9, color: "var(--muted)" }}>{s.label}</div>
              </div>
              {i < 3 && <div style={{ width: 1, background: "var(--sand-dark)", height: 28, margin: "0 16px" }} />}
            </div>
          ))}
        </div>
      </div>

      {/* GUIDES */}
      <div style={{ maxWidth: 960, margin: "52px auto 0", padding: "0 clamp(16px,4vw,24px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 700 }}>Top Guides</h2>
          <a href="/search" style={{ fontSize: 12, color: "var(--bronze)", fontWeight: 700, textDecoration: "none" }}>See all →</a>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 16 }}>
          {guides.map((g) => (
            <a key={g.id} href={`/guide/${g.id}`} style={{ textDecoration: "none", display: "block" }}>
              <div style={{ background: "var(--white)", borderRadius: "var(--r-card)", overflow: "hidden", boxShadow: "var(--shadow)" }}>

                {/* IMAGE */}
                <div style={{ position: "relative", height: 200 }}>
                  <img
                    src={g.avatar ?? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80"}
                    alt={g.displayName} loading="lazy"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,transparent 35%,rgba(0,0,0,0.78))" }} />

                  {/* Rating */}
                  <div style={{ position: "absolute", top: 10, right: 10, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)", borderRadius: 8, padding: "3px 8px", display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ color: "#FFD700", fontSize: 11 }}>★</span>
                    <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>{g.avgRating.toFixed(1)}</span>
                    <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 10 }}>({g.totalReviews})</span>
                  </div>

                  {/* Verified */}
                  <div style={{ position: "absolute", top: 10, left: 10 }}>
                    <span style={{ background: "#E8F0E4", color: "var(--sage)", fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: "999px" }}>✓ Verified</span>
                  </div>

                  {/* Ville AU-DESSUS du nom */}
                  <div style={{ position: "absolute", bottom: 12, left: 12, right: 12 }}>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.75)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>
                      📍 {g.city}
                    </div>
                    <div style={{ fontFamily: "var(--font-serif)", fontSize: 17, fontWeight: 700, color: "#fff", lineHeight: 1.15 }}>
                      {g.displayName}
                    </div>
                  </div>
                </div>

                {/* BODY */}
                <div style={{ padding: "12px 14px" }}>

                  {/* Langues */}
                  {g.languages.length > 0 && (
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 10 }}>
                      {g.languages.slice(0, 3).map(l => (
                        <span key={l} style={{ background: "var(--sand)", border: "1px solid var(--sand-dark)", borderRadius: "999px", padding: "2px 9px", fontSize: 10, fontWeight: 600, color: "var(--soft)" }}>
                          {l}
                        </span>
                      ))}
                      <span style={{ fontSize: 10, color: "var(--muted)", display: "flex", alignItems: "center" }}>
                        · {g.yearsExp} yrs
                      </span>
                    </div>
                  )}

                  {/* Prix + CTA */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 9, color: "var(--muted)" }}>From</div>
                      <div style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 700, color: "var(--charcoal)" }}>
                        {toEur(g.halfDayPrice)}
                      </div>
                      <div style={{ fontSize: 9, color: "var(--muted)" }}>per person · 4h</div>
                    </div>
                    <a
                      href={`/booking?guide=${g.id}`}
                      onClick={(e) => e.stopPropagation()}
                      style={{ background: "var(--bronze-g)", color: "#fff", borderRadius: "999px", padding: "9px 16px", fontSize: 12, fontWeight: 700, textDecoration: "none" }}
                    >
                      Book →
                    </a>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <a href="/search" style={{ display: "inline-block", border: "1.5px solid var(--sand-dark)", borderRadius: "999px", padding: "13px 32px", fontSize: 13, fontWeight: 600, color: "var(--soft)", textDecoration: "none" }}>
            View all guides →
          </a>
        </div>
      </div>

      {/* CITIES */}
      <div style={{ maxWidth: 960, margin: "52px auto 0", padding: "0 clamp(16px,4vw,24px)" }}>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 700, marginBottom: 18 }}>Explore by City</h2>
        <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 6 }}>
          {CITIES.map((c) => (
            <a key={c.name} href={`/search?city=${encodeURIComponent(c.name)}`} style={{ position: "relative", width: 110, height: 135, borderRadius: 18, overflow: "hidden", flexShrink: 0, textDecoration: "none" }}>
              <img src={c.img} alt={c.name} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.32)" }} />
              <div style={{ position: "absolute", bottom: 10, left: 10 }}>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 12 }}>{c.name}</div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* WHY */}
      <div style={{ maxWidth: 960, margin: "52px auto 0", padding: "48px clamp(16px,4vw,24px) 0", borderTop: "1px solid var(--sand-dark)" }}>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 700, marginBottom: 24, textAlign: "center" }}>Why Laksor?</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 20 }}>
          {TRUST.map((t) => (
            <div key={t.title} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: "var(--white)", boxShadow: "var(--shadow-sm)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{t.icon}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 3 }}>{t.title}</div>
                <div style={{ fontSize: 12, color: "var(--soft)", lineHeight: 1.55 }}>{t.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* JOIN */}
      <div style={{ maxWidth: 960, margin: "52px auto 72px", padding: "0 clamp(16px,4vw,24px)" }}>
        <div style={{ background: "var(--charcoal)", borderRadius: "var(--r-card)", padding: "36px 28px", textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 24, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Join Laksor</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: 22, maxWidth: 380, margin: "0 auto 22px", lineHeight: 1.65 }}>
            Guide or Transport provider? Share your expertise with travelers worldwide.
          </div>
          <a href="/auth/register" style={{ background: "var(--bronze-g)", color: "#fff", borderRadius: "999px", padding: "14px 32px", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
            Apply Now ✦
          </a>
        </div>
      </div>

    </div>
  );
}
