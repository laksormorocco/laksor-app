export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import HeroSlider from "@/components/HeroSlider";
import SearchBar from "@/components/SearchBar";
import StatsSection from "@/components/StatsSection";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

const CATS = [
  { label: "Histoire", emoji: "🏛️", type: "HISTOIRE", bg: "#DBEAFE" },
  { label: "Culinaire", emoji: "🫖", type: "CULINAIRE", bg: "#FEF3C7" },
  { label: "Shopping", emoji: "🛍️", type: "SHOPPING", bg: "#FCE7F3" },
  { label: "Monuments", emoji: "🕌", type: "MONUMENTS", bg: "#D1FAE5" },
  { label: "Aventure", emoji: "🏕️", type: "AVENTURE", bg: "#FFF7ED" },
  { label: "Desert", emoji: "🐪", type: "DESERT", bg: "#FEF9C3" },
];

export default async function HomePage() {
  const guides = await prisma.guideProfile.findMany({
    where: { status: "APPROVED" },
    take: 20,
    orderBy: { avgRating: "desc" },
  });

  return (
    <div style={{ background: "#fff", minHeight: "100vh", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>
      <Navbar />

      {/* ── HERO ── */}
      <div style={{ position: "relative", height: "clamp(480px, 65vh, 620px)", overflow: "hidden" }}>
        <HeroSlider />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.7) 100%)" }}/>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 clamp(20px,5vw,80px)", maxWidth: 760 }}>
          <h1 style={{ color: "#fff", fontSize: "clamp(26px,5vw,52px)", fontWeight: 700, lineHeight: 1.15, margin: "0 0 16px", letterSpacing: "-0.5px" }}>
            Explorer le Maroc avec<br/>des guides locaux<br/>de confiance
          </h1>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "clamp(14px,2vw,17px)", margin: "0 0 28px", maxWidth: 460, lineHeight: 1.6 }}>
            Des guides certifiés et passionnés pour une expérience authentique et mémorable.
          </p>
          <Link href="/search" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#F59E0B", color: "#0F172A", borderRadius: 30, padding: "14px 28px", fontSize: 15, fontWeight: 600, textDecoration: "none", width: "fit-content" }}>
            Trouver un guide →
          </Link>
        </div>
      </div>

      {/* ── SEARCH BAR ── */}
      <div style={{ maxWidth: 860, margin: "-40px auto 0", padding: "0 16px", position: "relative", zIndex: 20 }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", boxShadow: "0 4px 20px rgba(0,0,0,0.10)" }}>
          <SearchBar />
        </div>
      </div>

      {/* ── CATEGORIES ── */}
      <div style={{ maxWidth: 1020, margin: "52px auto 0", padding: "0 16px" }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0F172A", fontFamily: "Georgia, serif", marginBottom: 16 }}>
          Catégories populaires
        </h2>
        <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8 }}>
          {CATS.map(cat => (
            <Link key={cat.type} href={"/search?type="+cat.type} style={{ textDecoration: "none", flexShrink: 0 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: 86 }}>
                <div style={{ width: 72, height: 72, borderRadius: "50%", background: cat.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>
                  {cat.emoji}
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#334155", textAlign: "center" }}>{cat.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── GUIDES LIST ── */}
      <div style={{ maxWidth: 1020, margin: "52px auto 0", padding: "0 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0F172A", fontFamily: "Georgia, serif", margin: 0 }}>
            Guides recommandés
          </h2>
          <Link href="/search" style={{ fontSize: 13, color: "#F59E0B", fontWeight: 600, textDecoration: "none" }}>
            Voir tout →
          </Link>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {guides.map(g => (
            <Link key={g.id} href={"/guide/"+g.id} style={{ textDecoration: "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, background: "#fff", borderRadius: 16, padding: 14, border: "1px solid #F1F5F9", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                {/* Photo */}
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div style={{ width: 80, height: 80, borderRadius: 12, overflow: "hidden", background: "#E2E8F0" }}>
                    {g.avatar && <img src={g.avatar} alt={g.displayName} style={{ width: "100%", height: "100%", objectFit: "cover" }}/>}
                  </div>
                  <div style={{ position: "absolute", top: -4, right: -4, width: 20, height: 20, borderRadius: "50%", background: "#fff", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>♡</div>
                </div>

                {/* Infos */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 15, color: "#0F172A", marginBottom: 2 }}>{g.displayName}</div>
                  <div style={{ color: "#F59E0B", fontSize: 12, fontWeight: 500, marginBottom: 3 }}>📍 {g.city}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
                    <span style={{ color: "#F59E0B", fontSize: 12 }}>★</span>
                    <span style={{ fontWeight: 600, fontSize: 12, color: "#1A202C" }}>{Number(g.avgRating).toFixed(1)}</span>
                    <span style={{ color: "#94A3B8", fontSize: 12 }}>({g.totalReviews})</span>
                  </div>
                  <div style={{ color: "#94A3B8", fontSize: 11 }}>{(g.languages as string[]).slice(0,3).join(", ")}</div>
                </div>

                {/* Prix */}
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 16, color: "#0F172A" }}>{g.halfDayPrice}</div>
                  <div style={{ fontSize: 11, color: "#94A3B8" }}>MAD / 4h</div>
                  <div style={{ marginTop: 6, background: "#0B132B", color: "#fff", borderRadius: 20, padding: "5px 12px", fontSize: 11, fontWeight: 600 }}>Voir</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── TRUST ── */}
      <div style={{ maxWidth: 1020, margin: "60px auto 0", padding: "0 16px 60px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 24, borderTop: "1px solid #E2E8F0", paddingTop: 48 }}>
          {[
            { icon: "🛡️", title: "Guides certifiés", desc: "Vérifiés et passionnés" },
            { icon: "🔒", title: "Paiement sécurisé", desc: "100% sécurisé en ligne" },
            { icon: "🔄", title: "Annulation flexible", desc: "Gratuite jusqu à 24h avant" },
            { icon: "💬", title: "Support 7j/7", desc: "Toujours disponible" },
          ].map(t => (
            <div key={t.title} style={{ display: "flex", gap: 14 }}>
              <div style={{ width: 46, height: 46, borderRadius: 12, background: "#F8FAFC", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{t.icon}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#0F172A", marginBottom: 3 }}>{t.title}</div>
                <div style={{ fontSize: 12, color: "#718096", lineHeight: 1.5 }}>{t.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <StatsSection />
      <HowItWorks />
      <Testimonials />
      <Footer />
    </div>
  );
}
