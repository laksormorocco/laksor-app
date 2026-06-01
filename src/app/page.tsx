import { prisma } from "@/lib/prisma";

function toEur(mad: number): string {
  return "€" + Math.round((mad * 1.25 + 25) * 0.092);
}

const CITIES = [
  { name: "Marrakech",   img: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=400&q=80" },
  { name: "Fès",         img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },
  { name: "Essaouira",   img: "https://images.unsplash.com/photo-1509741102003-ca64bfe8696f?w=400&q=80" },
  { name: "Agadir",      img: "https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?w=400&q=80" },
  { name: "Chefchaouen", img: "https://images.unsplash.com/photo-1553522991-fd5deb8e3b50?w=400&q=80" },
];

const MOODS = [
  { label: "Culture",   emoji: "🏛️", slug: "HISTOIRE"     },
  { label: "Food",      emoji: "🫖", slug: "CULINAIRE"    },
  { label: "Shopping",  emoji: "🛍️", slug: "SHOPPING"     },
  { label: "Monuments", emoji: "🕌", slug: "MONUMENTS"    },
  { label: "Adventure", emoji: "🏕️", slug: "AVENTURE"     },
  { label: "Desert",    emoji: "🐪", slug: "DESERT"       },
  { label: "Night",     emoji: "🌙", slug: "NIGHTLIFE"    },
  { label: "Photo",     emoji: "📸", slug: "PHOTOGRAPHIE" },
];

const TRUST = [
  { icon: "🛡️", title: "Certified Guides",  desc: "Every guide verified by Laksor" },
  { icon: "💬", title: "WhatsApp Updates",   desc: "Real-time notifications & guide contact" },
  { icon: "🔄", title: "72h Cancellation",   desc: "Free cancellation policy" },
  { icon: "🚗", title: "Transport Included", desc: "Book guide + ride in one checkout" },
];

const VEHICLES = [
  { icon: "🚗", label: "Sedan",   price: "€14", pax: "1–3" },
  { icon: "🚐", label: "Minivan", price: "€20", pax: "4–7" },
  { icon: "🚙", label: "4×4",     price: "€28", pax: "1–4" },
];

export default async function HomePage() {
  const guides = await prisma.guideProfile.findMany({
    where: { status: "APPROVED" },
    take: 4,
    orderBy: { avgRating: "desc" },
  });

  return (
    <div style={{ background: "var(--sand)", minHeight: "100vh", fontFamily: "var(--font-body)" }}>

      {/* ── HERO ── */}
      <div style={{ position: "relative", height: "clamp(580px,80vh,720px)", overflow: "hidden" }}>
        <img
          src="https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=1600&q=80"
          alt="Marrakech"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          fetchPriority="high"
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg,rgba(0,0,0,0.08) 0%,rgba(0,0,0,0.45) 45%,rgba(17,17,17,0.94) 100%)" }} />

        {/* NAVBAR */}
        <nav style={{
          position: "absolute", top: 0, left: 0, right: 0, zIndex: 10,
          padding: "18px clamp(20px,5vw,56px)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: "rgba(255,255,255,0.06)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)"
        }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
            <div style={{ width: 42, height: 42, borderRadius: 13, background: "var(--bronze-g)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(184,138,68,0.4)" }}>
              <span style={{ color: "#fff", fontWeight: 900, fontSize: 22, fontFamily: "var(--font-serif)", lineHeight: 1 }}>L</span>
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-serif)", fontWeight: 700, fontSize: 20, color: "#fff", lineHeight: 1 }}>Laksor</div>
              <div style={{ fontSize: 8, color: "rgba(255,255,255,0.4)", letterSpacing: 2, textTransform: "uppercase" }}>Morocco</div>
            </div>
          </a>

          <div style={{ display: "none", gap: 32, alignItems: "center" }}>
            {["Guides","Transport","Experiences","Destinations"].map((l) => (
              <a key={l} href={l === "Guides" ? "/search" : `/${l.toLowerCase()}`}
                style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.75)", textDecoration: "none" }}>
                {l}
              </a>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ display: "flex", gap: 3, marginRight: 4 }}>
              {(["FR","EN","HE"] as const).map((l, i) => (
                <span key={l} style={{
                  background: i === 0 ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.07)",
                  color: i === 0 ? "#fff" : "rgba(255,255,255,0.4)",
                  fontSize: 10, padding: "4px 10px", borderRadius: "999px",
                  cursor: "pointer", fontWeight: i === 0 ? 700 : 400
                }}>{l}</span>
              ))}
            </div>
            <a href="/auth/login" style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", padding: "9px 14px", fontWeight: 600, textDecoration: "none" }}>Login</a>
            <a href="/auth/register" style={{
              background: "var(--bronze-g)", color: "#fff", borderRadius: "999px",
              padding: "10px 20px", fontSize: 12, fontWeight: 700, textDecoration: "none",
              boxShadow: "0 4px 16px rgba(184,138,68,0.4)"
            }}>Join Free</a>
          </div>
        </nav>

        {/* HERO CONTENT */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 clamp(20px,5vw,56px) 40px", maxWidth: 680 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "rgba(184,138,68,0.18)", border: "1px solid rgba(184,138,68,0.5)",
            borderRadius: "999px", padding: "5px 14px", marginBottom: 18
          }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: "var(--bronze)", letterSpacing: 1.5, textTransform: "uppercase" }}>✦ Certified Local Experts</span>
          </div>

          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(36px,5.5vw,58px)", fontWeight: 700, color: "#fff", lineHeight: 1.08, marginBottom: 14, letterSpacing: -0.5 }}>
            Explore Morocco<br />
            <em style={{ fontStyle: "italic", color: "rgba(255,255,255,0.78)" }}>your way</em>
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", marginBottom: 28, lineHeight: 1.7, maxWidth: 400 }}>
            Passionate guides · Comfortable transfers · Unforgettable memories
          </p>

          {/* TOGGLE TABS */}
          <div style={{ display: "inline-flex", gap: 0, marginBottom: 16, background: "rgba(255,255,255,0.1)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.16)", borderRadius: "999px", padding: 4 }}>
            <a href="/search" style={{ padding: "9px 22px", borderRadius: "999px", fontSize: 12, fontWeight: 700, background: "rgba(255,255,255,0.92)", color: "var(--charcoal)", textDecoration: "none" }}>🧭 Guides</a>
            <a href="/transport" style={{ padding: "9px 22px", borderRadius: "999px", fontSize: 12, fontWeight: 600, background: "transparent", color: "rgba(255,255,255,0.6)", textDecoration: "none" }}>🚗 Transport</a>
          </div>

          {/* SEARCH WIDGET */}
          <div style={{
            background: "rgba(255,255,255,0.11)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.18)", borderRadius: 22, padding: 14, maxWidth: 500
          }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
              <a href="/search" style={{
                background: "rgba(255,255,255,0.13)", borderRadius: 14, padding: "11px 14px",
                textDecoration: "none", transition: "background 0.18s"
              }}>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.45)", marginBottom: 3, letterSpacing: 0.5 }}>📍 Destination</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>Marrakech</div>
              </a>
              <a href="/search" style={{ background: "rgba(255,255,255,0.13)", borderRadius: 14, padding: "11px 14px", textDecoration: "none" }}>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.45)", marginBottom: 3, letterSpacing: 0.5 }}>📅 Date</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.45)" }}>Choose a date</div>
              </a>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10 }}>
              <a href="/search" style={{ background: "rgba(255,255,255,0.13)", borderRadius: 14, padding: "11px 14px", textDecoration: "none" }}>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.45)", marginBottom: 3, letterSpacing: 0.5 }}>🌍 Language</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.45)" }}>Any language</div>
              </a>
              <a href="/search" style={{
                background: "var(--bronze-g)", color: "#fff", borderRadius: 14,
                padding: "11px 22px", fontSize: 14, fontWeight: 700,
                display: "flex", alignItems: "center", textDecoration: "none",
                boxShadow: "0 4px 18px rgba(184,138,68,0.45)"
              }}>Search →</a>
            </div>
          </div>
        </div>
      </div>

      {/* ── STATS BAR ── */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 clamp(16px,4vw,24px)" }}>
        <div style={{
          background: "var(--white)", borderRadius: 20, padding: "18px 28px",
          boxShadow: "0 8px 40px rgba(0,0,0,0.09)",
          display: "flex", justifyContent: "space-around", textAlign: "center",
          marginTop: -32, position: "relative", zIndex: 10,
          border: "1px solid rgba(234,220,200,0.5)"
        }}>
          {[
            { n: "47+",   label: "Guides",     color: "var(--bronze)"   },
            { n: "28+",   label: "Drivers",    color: "var(--sage)"     },
            { n: "⭐4.9", label: "Avg rating", color: "var(--charcoal)" },
            { n: "1.2k+", label: "Bookings",   color: "var(--charcoal)" },
          ].map((s, i) => (
            <div key={s.label} style={{ display: "flex", alignItems: "center" }}>
              <div>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 700, color: s.color }}>{s.n}</div>
                <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 2 }}>{s.label}</div>
              </div>
              {i < 3 && <div style={{ width: 1, background: "var(--sand-dark)", height: 30, margin: "0 20px" }} />}
            </div>
          ))}
        </div>
      </div>

      {/* ── MOODS ── */}
      <div style={{ maxWidth: 1000, margin: "60px auto 0", padding: "0 clamp(16px,4vw,24px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20 }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 24, fontWeight: 700, color: "var(--charcoal)" }}>What&apos;s your vibe?</h2>
          <a href="/search" style={{ fontSize: 12, color: "var(--bronze)", fontWeight: 700, textDecoration: "none" }}>See all →</a>
        </div>
        <div style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 8, scrollbarWidth: "none" }}>
          {MOODS.map((m) => (
            <a key={m.slug} href={`/search?type=${m.slug}`} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, flexShrink: 0, textDecoration: "none" }}>
              <div style={{
                width: 70, height: 70, borderRadius: "50%",
                background: "var(--white)", boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 28, border: "1.5px solid var(--sand-dark)",
                transition: "all 0.2s"
              }}>{m.emoji}</div>
              <span style={{ fontSize: 11, fontWeight: 600, color: "var(--soft)" }}>{m.label}</span>
            </a>
          ))}
        </div>
      </div>

      {/* ── TOP GUIDES ── */}
      <div style={{ maxWidth: 1000, margin: "60px auto 0", padding: "0 clamp(16px,4vw,24px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20 }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 24, fontWeight: 700, color: "var(--charcoal)" }}>Top Guides</h2>
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>{guides.length} results · Live from Supabase</div>
          </div>
          <a href="/search" style={{ fontSize: 12, color: "var(--bronze)", fontWeight: 700, textDecoration: "none" }}>See all →</a>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(230px,1fr))", gap: 18 }}>
          {guides.map((g) => (
            <div key={g.id}>
              <a href={`/guide/${g.id}`} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
              <div style={{
                background: "var(--white)", borderRadius: 28, overflow: "hidden",
                boxShadow: "0 4px 28px rgba(0,0,0,0.07)",
                border: "1px solid rgba(234,220,200,0.5)",
                transition: "all 0.22s"
              }}>
                <div style={{ position: "relative", height: 200 }}>
                  <img
                    src={g.avatar ?? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80"}
                    alt={g.displayName} loading="lazy"
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,transparent 35%,rgba(0,0,0,0.75))" }} />
                  <div style={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,0.42)", backdropFilter: "blur(8px)", borderRadius: 10, padding: "4px 10px", display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ color: "#F5A623", fontSize: 12 }}>★</span>
                    <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>{g.avgRating.toFixed(1)}</span>
                    <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 10 }}>({g.totalReviews})</span>
                  </div>
                  <div style={{ position: "absolute", top: 12, left: 12 }}>
                    <span style={{ background: "#E8F0E4", color: "var(--sage)", fontSize: 9, fontWeight: 700, padding: "3px 9px", borderRadius: "999px" }}>✓ Verified</span>
                  </div>
                  <div style={{ position: "absolute", bottom: 12, left: 14, right: 14 }}>
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>📍 {g.city}</div>
                    <div style={{ fontFamily: "var(--font-serif)", fontSize: 17, fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>{g.displayName}</div>
                  </div>
                </div>
                <div style={{ padding: "14px 16px" }}>
                  {g.languages.length > 0 && (
                    <div style={{ fontSize: 11, color: "var(--soft)", marginBottom: 12 }}>
                      {g.languages.slice(0, 3).join(" · ")} · {g.yearsExp} yrs
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 9, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 0.5 }}>From</div>
                      <div style={{ fontFamily: "var(--font-serif)", fontSize: 24, fontWeight: 700, color: "var(--charcoal)", lineHeight: 1 }}>{toEur(g.halfDayPrice)}</div>
                      <div style={{ fontSize: 9, color: "var(--muted)", marginTop: 2 }}>per person · 4h</div>
                    </div>
                    <a
                      href={`/booking?guide=${g.id}`}
                        style={{
                        background: "var(--bronze-g)", color: "#fff", borderRadius: "999px",
                        padding: "10px 18px", fontSize: 12, fontWeight: 700,
                        textDecoration: "none", boxShadow: "0 4px 14px rgba(184,138,68,0.35)"
                      }}
                    >Book →</a>
                  </div>
                </div>
              </div>
              </a>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 28 }}>
          <a href="/search" style={{
            display: "inline-block", padding: "13px 36px", fontSize: 13, fontWeight: 700,
            border: "1.5px solid var(--sand-dark)", borderRadius: "999px",
            background: "var(--white)", color: "var(--charcoal)", textDecoration: "none"
          }}>View all guides →</a>
        </div>
      </div>

      {/* ── TRANSPORT ── */}
      <div style={{ maxWidth: 1000, margin: "60px auto 0", padding: "0 clamp(16px,4vw,24px)" }}>
        <div style={{
          background: "var(--charcoal)", borderRadius: 28, overflow: "hidden",
          display: "grid", gridTemplateColumns: "1fr 1fr"
        }}>
          <div style={{ padding: "36px 32px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{
              display: "inline-block", background: "rgba(184,138,68,0.18)",
              border: "1px solid rgba(184,138,68,0.4)", borderRadius: "999px",
              padding: "5px 14px", fontSize: 10, fontWeight: 700,
              color: "var(--bronze)", letterSpacing: 1.2, textTransform: "uppercase",
              marginBottom: 18, width: "fit-content"
            }}>🚗 Transport</div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(20px,2.5vw,26px)", fontWeight: 700, color: "#fff", marginBottom: 10, lineHeight: 1.2 }}>
              Airport transfers &<br />private rides
            </h2>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: 24, lineHeight: 1.7 }}>Vetted drivers · Fixed prices · No surprises</p>
            <div style={{ display: "flex", gap: 10, marginBottom: 26, flexWrap: "wrap" }}>
              {VEHICLES.map((v) => (
                <div key={v.label} style={{ background: "rgba(255,255,255,0.07)", borderRadius: 14, padding: "10px 14px", textAlign: "center" }}>
                  <div style={{ fontSize: 20 }}>{v.icon}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 3 }}>{v.label}</div>
                  <div style={{ fontFamily: "var(--font-serif)", fontSize: 16, fontWeight: 700, color: "#fff" }}>{v.price}</div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>{v.pax} pax</div>
                </div>
              ))}
            </div>
            <a href="/transport" style={{
              background: "var(--bronze-g)", color: "#fff", borderRadius: "999px",
              padding: "13px 24px", fontSize: 13, fontWeight: 700,
              width: "fit-content", textDecoration: "none",
              boxShadow: "0 4px 16px rgba(184,138,68,0.35)"
            }}>Book a ride →</a>
          </div>
          <div style={{ position: "relative", minHeight: 260 }}>
            <img
              src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=700&q=80"
              alt="Transport" loading="lazy"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right,rgba(17,17,17,0.55),transparent)" }} />
          </div>
        </div>
      </div>

      {/* ── BUNDLE ── */}
      <div style={{ maxWidth: 1000, margin: "16px auto 0", padding: "0 clamp(16px,4vw,24px)" }}>
        <div style={{
          background: "linear-gradient(135deg,var(--sage),#5a6b4a)", borderRadius: 28,
          padding: "24px 32px", display: "flex", justifyContent: "space-between",
          alignItems: "center", flexWrap: "wrap", gap: 18
        }}>
          <div>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 5 }}>
              🎯 Best Value — Guide + Transport
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>Book both in one checkout and save up to €5 per trip.</div>
          </div>
          <a href="/booking" style={{
            background: "var(--bronze-g)", color: "#fff", borderRadius: "999px",
            padding: "14px 28px", fontSize: 13, fontWeight: 700,
            flexShrink: 0, textDecoration: "none",
            boxShadow: "0 4px 16px rgba(184,138,68,0.35)"
          }}>Book bundle →</a>
        </div>
      </div>

      {/* ── CITIES ── */}
      <div style={{ maxWidth: 1000, margin: "60px auto 0", padding: "0 clamp(16px,4vw,24px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20 }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 24, fontWeight: 700, color: "var(--charcoal)" }}>Explore by City</h2>
          <a href="/search" style={{ fontSize: 12, color: "var(--bronze)", fontWeight: 700, textDecoration: "none" }}>See all →</a>
        </div>
        <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 8, scrollbarWidth: "none" }}>
          {CITIES.map((c) => (
            <a key={c.name} href={`/search?city=${encodeURIComponent(c.name)}`} style={{
              position: "relative", width: 120, height: 150,
              borderRadius: 22, overflow: "hidden", flexShrink: 0, textDecoration: "none"
            }}>
              <img src={c.img} alt={c.name} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,transparent 40%,rgba(0,0,0,0.62))" }} />
              <div style={{ position: "absolute", bottom: 12, left: 12 }}>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>{c.name}</div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* ── WHY LAKSOR ── */}
      <div style={{ maxWidth: 1000, margin: "60px auto 0", padding: "48px clamp(16px,4vw,24px) 0", borderTop: "1px solid var(--sand-dark)" }}>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 24, fontWeight: 700, marginBottom: 28, textAlign: "center", color: "var(--charcoal)" }}>Why Laksor?</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(210px,1fr))", gap: 24 }}>
          {TRUST.map((t) => (
            <div key={t.title} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              <div style={{
                width: 52, height: 52, borderRadius: 16, background: "var(--white)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 24, flexShrink: 0
              }}>{t.icon}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4, color: "var(--charcoal)" }}>{t.title}</div>
                <div style={{ fontSize: 12, color: "var(--soft)", lineHeight: 1.6 }}>{t.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── JOIN CTA ── */}
      <div style={{ maxWidth: 1000, margin: "60px auto 80px", padding: "0 clamp(16px,4vw,24px)" }}>
        <div style={{
          background: "var(--charcoal)", borderRadius: 28, padding: "48px 32px",
          textAlign: "center"
        }}>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 28, fontWeight: 700, color: "#fff", marginBottom: 10 }}>
            Join Laksor
          </div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", marginBottom: 28, maxWidth: 400, margin: "0 auto 28px", lineHeight: 1.7 }}>
            Guide or Transport provider? Share your expertise with travelers worldwide.
          </div>
          <a href="/auth/register" style={{
            background: "var(--bronze-g)", color: "#fff", borderRadius: "999px",
            padding: "16px 40px", fontSize: 15, fontWeight: 700,
            textDecoration: "none", display: "inline-block",
            boxShadow: "0 6px 24px rgba(184,138,68,0.4)"
          }}>Apply Now ✦</a>
        </div>
      </div>

    </div>
  );
}
