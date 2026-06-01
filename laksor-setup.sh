#!/bin/bash
# ═══════════════════════════════════════════
# LAKSOR — Setup design system
# Usage: bash laksor-setup.sh
# ═══════════════════════════════════════════

set -e
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}► Laksor setup starting...${NC}"

# ─── Detect project root (src/app or app)
if [ -d "src/app" ]; then
  APP="src/app"
elif [ -d "app" ]; then
  APP="app"
else
  echo "❌ No app/ or src/app/ found. Run this from your project root."
  exit 1
fi

echo -e "${BLUE}► Found app dir: $APP${NC}"

# ─── Backup existing files
[ -f "$APP/layout.tsx" ]    && cp "$APP/layout.tsx"    "$APP/layout.tsx.bak"    && echo "  ✓ layout.tsx backed up"
[ -f "$APP/globals.css" ]   && cp "$APP/globals.css"   "$APP/globals.css.bak"   && echo "  ✓ globals.css backed up"
[ -f "$APP/page.tsx" ]      && cp "$APP/page.tsx"      "$APP/page.tsx.bak"      && echo "  ✓ page.tsx backed up"

# ═══════════════════════════════════════════
# layout.tsx
# ═══════════════════════════════════════════
cat > "$APP/layout.tsx" << 'EOF'
import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "600", "700", "800"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Laksor — Local Guides & Transport in Morocco",
  description:
    "Book certified local guides and private transport in Marrakech, Fès, Essaouira, Chefchaouen and Agadir.",
  keywords: ["guide marrakech", "guide local maroc", "transport marrakech", "tour guide morocco"],
  openGraph: {
    title: "Laksor — Local Guides & Transport in Morocco",
    description: "Authentic local experiences with certified guides and vetted transport providers.",
    url: "https://laksor.ma",
    siteName: "Laksor",
    locale: "en_US",
    type: "website",
  },
  other: { "theme-color": "#B88A44" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
EOF
echo -e "${GREEN}  ✓ layout.tsx written${NC}"

# ═══════════════════════════════════════════
# globals.css
# ═══════════════════════════════════════════
cat > "$APP/globals.css" << 'EOF'
/* LAKSOR — Global Design System */

:root {
  --sand:        #F6F1E8;
  --sand-dark:   #EADCC8;
  --bronze:      #B88A44;
  --bronze-dark: #A17635;
  --bronze-g:    linear-gradient(135deg, #B88A44, #A17635);
  --sage:        #7D8F69;
  --charcoal:    #111111;
  --white:       #FFFFFF;
  --muted:       #999999;
  --soft:        #666666;
  --font-serif:  var(--font-playfair), Georgia, serif;
  --font-body:   var(--font-inter), system-ui, -apple-system, sans-serif;
  --r-card: 24px;
  --r-btn:  999px;
  --r-sm:   12px;
  --r-md:   16px;
  --shadow-sm: 0 4px 16px rgba(0,0,0,0.06);
  --shadow:    0 8px 32px rgba(0,0,0,0.08);
  --shadow-lg: 0 16px 48px rgba(0,0,0,0.12);
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { -webkit-text-size-adjust: 100%; }
body { font-family: var(--font-body); font-size: 14px; line-height: 1.5; color: var(--charcoal); background: var(--sand); -webkit-font-smoothing: antialiased; }
a { text-decoration: none; color: inherit; }
img { display: block; max-width: 100%; }
button { cursor: pointer; font-family: var(--font-body); border: none; background: none; }
input, select, textarea { font-family: var(--font-body); }

h1, h2, h3 { font-family: var(--font-serif); font-weight: 700; line-height: 1.15; color: var(--charcoal); }
h1 { font-size: clamp(26px,5vw,44px); }
h2 { font-size: clamp(20px,3.5vw,28px); }
h3 { font-size: clamp(17px,2.5vw,22px); }

/* Buttons — NEVER black, always bronze */
.btn-bronze, .btn-primary {
  display: inline-flex; align-items: center; justify-content: center; gap: 6px;
  background: var(--bronze-g); color: #fff; border-radius: var(--r-btn);
  font-family: var(--font-body); font-weight: 700; font-size: 14px;
  padding: 12px 22px; border: none; cursor: pointer;
  transition: opacity 0.2s, transform 0.2s; white-space: nowrap; text-decoration: none;
}
.btn-bronze:hover, .btn-primary:hover { opacity: 0.87; transform: translateY(-1px); }

.btn-ghost {
  display: inline-flex; align-items: center; justify-content: center; gap: 6px;
  background: transparent; color: var(--soft); border: 1.5px solid var(--sand-dark);
  border-radius: var(--r-btn); font-family: var(--font-body); font-weight: 600;
  font-size: 14px; padding: 12px 22px; cursor: pointer;
  transition: border-color 0.2s, color 0.2s; text-decoration: none;
}
.btn-ghost:hover { border-color: var(--bronze); color: var(--bronze); }

.btn-sage {
  display: inline-flex; align-items: center; justify-content: center;
  background: var(--sage); color: #fff; border-radius: var(--r-btn);
  font-family: var(--font-body); font-weight: 700; font-size: 14px;
  padding: 12px 22px; border: none; cursor: pointer; transition: opacity 0.2s; text-decoration: none;
}
.btn-sage:hover { opacity: 0.87; }

.btn-outline {
  display: inline-flex; align-items: center; justify-content: center;
  background: transparent; color: var(--bronze); border: 1.5px solid var(--bronze);
  border-radius: var(--r-btn); font-family: var(--font-body); font-weight: 700;
  font-size: 14px; padding: 12px 22px; cursor: pointer;
  transition: background 0.2s, color 0.2s; text-decoration: none;
}
.btn-outline:hover { background: var(--bronze); color: #fff; }

/* Cards */
.card    { background: var(--white); border-radius: var(--r-card); box-shadow: var(--shadow); }
.card-sm { background: var(--white); border-radius: var(--r-md);   box-shadow: var(--shadow-sm); }

/* Badges — verified = always sage */
.badge          { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: var(--r-btn); font-size: 10px; font-weight: 700; white-space: nowrap; }
.badge-sage, .badge-verified { background: #E8F0E4; color: var(--sage); }
.badge-bronze   { background: #FEF3E8; color: var(--bronze); }
.badge-grey     { background: var(--sand-dark); color: var(--soft); }
.badge-red      { background: #FEE8E8; color: #D94F4F; }
.badge-blue     { background: #E8F0FF; color: #3B6FE8; }

/* Forms */
.form-label { display: block; font-size: 11px; font-weight: 700; color: var(--charcoal); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
.form-input { width: 100%; padding: 12px 14px; border: 1.5px solid var(--sand-dark); border-radius: 14px; font-family: var(--font-body); font-size: 13px; background: var(--white); color: var(--charcoal); outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
.form-input:focus { border-color: var(--bronze); box-shadow: 0 0 0 3px rgba(184,138,68,0.12); }
.form-input::placeholder { color: var(--muted); }
.form-group { margin-bottom: 16px; }

/* Toggle */
.toggle { width: 44px; height: 24px; background: var(--sand-dark); border-radius: 12px; position: relative; cursor: pointer; transition: background 0.3s; flex-shrink: 0; }
.toggle.on { background: var(--sage); }
.toggle::after { content: ''; position: absolute; width: 18px; height: 18px; background: #fff; border-radius: 50%; top: 3px; left: 3px; transition: left 0.3s; box-shadow: 0 1px 4px rgba(0,0,0,0.2); }
.toggle.on::after { left: 23px; }

/* Progress */
.progress-bar { height: 6px; background: var(--sand-dark); border-radius: 3px; overflow: hidden; }
.fill-bronze { height: 100%; border-radius: 3px; background: var(--bronze-g); }
.fill-sage   { height: 100%; border-radius: 3px; background: var(--sage); }
.fill-red    { height: 100%; border-radius: 3px; background: #D94F4F; }

/* Pills */
.pill { padding: 8px 16px; border-radius: var(--r-btn); background: var(--white); border: 1.5px solid var(--sand-dark); font-size: 12px; font-weight: 600; color: var(--soft); cursor: pointer; white-space: nowrap; transition: all 0.2s; font-family: var(--font-body); }
.pill:hover { border-color: var(--bronze); color: var(--bronze); }
.pill.active, .pill.sel { background: var(--charcoal); color: #fff; border-color: var(--charcoal); }

/* Tabs */
.tab-bar { display: flex; overflow-x: auto; background: var(--white); border-bottom: 1px solid var(--sand-dark); padding: 0 4px; scrollbar-width: none; }
.tab-bar::-webkit-scrollbar { display: none; }
.tab-btn { padding: 13px 14px; font-size: 11px; color: var(--muted); border: none; border-bottom: 2.5px solid transparent; background: none; cursor: pointer; font-family: var(--font-body); white-space: nowrap; font-weight: 600; margin-bottom: -1px; transition: color 0.2s, border-color 0.2s; flex-shrink: 0; }
.tab-btn.active { color: var(--bronze); border-bottom-color: var(--bronze); font-weight: 700; }

/* Bottom Nav */
.bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; background: rgba(255,255,255,0.95); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-top: 1px solid var(--sand-dark); z-index: 100; padding: 8px 0 max(12px,env(safe-area-inset-bottom)); display: flex; }
.bnav-item { display: flex; flex-direction: column; align-items: center; gap: 2px; cursor: pointer; flex: 1; padding: 4px 0; transition: opacity 0.15s; }
.bnav-icon  { font-size: 20px; }
.bnav-label { font-size: 9px; font-weight: 600; color: var(--muted); }
.bnav-item.active .bnav-label { color: var(--bronze); }

/* Glassmorphism */
.navbar-glass { position: absolute; top: 0; left: 0; right: 0; z-index: 10; padding: 14px clamp(16px,4vw,48px); display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.08); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); }

/* Sheet */
.overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.52); backdrop-filter: blur(4px); z-index: 500; align-items: flex-end; justify-content: center; }
.overlay.open { display: flex; }
.sheet { background: var(--white); border-radius: 28px 28px 0 0; padding: 24px 20px max(40px,env(safe-area-inset-bottom)); width: 100%; animation: slideUp 0.3s ease; max-height: 85vh; overflow-y: auto; }
@keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.sheet-handle { width: 40px; height: 4px; background: var(--sand-dark); border-radius: 2px; margin: 0 auto 18px; }

/* Alerts */
.alert-ok   { background: #E8F5E9; border: 1px solid var(--sage); border-radius: 12px; padding: 12px 14px; }
.alert-warn { background: #FFF8E8; border: 1px solid #F0C040;     border-radius: 12px; padding: 12px 14px; }
.alert-info { background: #E8F0FF; border: 1px solid #5B8DEF;     border-radius: 12px; padding: 12px 14px; }
.alert-err  { background: #FEE8E8; border: 1px solid #D94F4F;     border-radius: 12px; padding: 12px 14px; }

/* Utils */
.text-serif  { font-family: var(--font-serif); }
.text-bronze { color: var(--bronze); }
.text-sage   { color: var(--sage); }
.text-muted  { color: var(--muted); }
.text-soft   { color: var(--soft); }
.font-bold   { font-weight: 700; }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }

/* Responsive */
@media (max-width: 768px) { .desktop-only { display: none !important; } }
@media (min-width: 769px) { .mobile-only  { display: none !important; } }

/* Scrollbar */
::-webkit-scrollbar       { width: 5px; height: 5px; }
::-webkit-scrollbar-track { background: var(--sand); }
::-webkit-scrollbar-thumb { background: var(--sand-dark); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--bronze); }

/* Focus */
a:focus-visible, button:focus-visible, input:focus-visible { outline: 3px solid var(--bronze); outline-offset: 2px; border-radius: 4px; }
::selection { background: rgba(184,138,68,0.18); color: var(--charcoal); }
EOF
echo -e "${GREEN}  ✓ globals.css written${NC}"

# ═══════════════════════════════════════════
# page.tsx
# ═══════════════════════════════════════════
cat > "$APP/page.tsx" << 'EOF'
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
  { icon: "🛡️", title: "Certified Guides",    desc: "Every guide verified by Laksor" },
  { icon: "💬", title: "WhatsApp Updates",     desc: "Real-time notifications & guide contact" },
  { icon: "🔄", title: "72h Cancellation",     desc: "Free cancellation policy" },
  { icon: "🚗", title: "Transport Included",   desc: "Book guide + ride in one checkout" },
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

      {/* HERO */}
      <div style={{ position: "relative", height: "clamp(520px,72vh,680px)", overflow: "hidden" }}>
        <img src="https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=1600&q=80" alt="Marrakech" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} fetchPriority="high" />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,rgba(0,0,0,0.1) 0%,rgba(0,0,0,0.5) 50%,rgba(17,17,17,0.92) 100%)" }} />

        {/* NAVBAR */}
        <nav style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10, padding: "14px clamp(16px,4vw,48px)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.08)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: "var(--bronze-g)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontWeight: 900, fontSize: 20, fontFamily: "var(--font-serif)" }}>L</span>
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-serif)", fontWeight: 700, fontSize: 18, color: "#fff" }}>Laksor</div>
              <div style={{ fontSize: 8, color: "rgba(255,255,255,0.45)", letterSpacing: 1.5, textTransform: "uppercase" }}>Morocco</div>
            </div>
          </a>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <div style={{ display: "flex", gap: 3, marginRight: 6 }}>
              {(["EN", "FR", "HE"] as const).map((l, i) => (
                <span key={l} style={{ background: i === 0 ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.08)", color: i === 0 ? "#fff" : "rgba(255,255,255,0.45)", fontSize: 10, padding: "4px 9px", borderRadius: "999px", cursor: "pointer", fontWeight: i === 0 ? 700 : 400 }}>{l}</span>
              ))}
            </div>
            <a href="/auth/login" style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", padding: "8px 12px", fontWeight: 600 }}>Login</a>
            <a href="/auth/register" className="btn-bronze" style={{ padding: "9px 18px", fontSize: 12 }}>Join Free</a>
          </div>
        </nav>

        {/* HERO CONTENT */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 clamp(16px,5vw,48px) 32px", maxWidth: 640 }}>
          <div style={{ display: "inline-block", background: "rgba(184,138,68,0.2)", border: "1px solid rgba(184,138,68,0.45)", borderRadius: "999px", padding: "5px 14px", fontSize: 10, fontWeight: 700, color: "var(--bronze)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 14 }}>
            ✦ Certified Local Experts
          </div>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(28px,5vw,48px)", fontWeight: 700, color: "#fff", lineHeight: 1.12, marginBottom: 10 }}>
            Explore Morocco<br /><em style={{ fontStyle: "italic", color: "rgba(255,255,255,0.85)" }}>your way</em>
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 22, lineHeight: 1.65, maxWidth: 420 }}>
            Passionate guides · Comfortable transfers · Unforgettable memories
          </p>
          <div style={{ display: "inline-flex", gap: 0, marginBottom: 14, background: "rgba(255,255,255,0.1)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: "999px", padding: 4 }}>
            <a href="/search"    style={{ padding: "8px 20px", borderRadius: "999px", fontSize: 12, fontWeight: 700, background: "rgba(255,255,255,0.9)", color: "var(--charcoal)" }}>🧭 Guides</a>
            <a href="/transport" style={{ padding: "8px 20px", borderRadius: "999px", fontSize: 12, fontWeight: 700, background: "transparent", color: "rgba(255,255,255,0.65)" }}>🚗 Transport</a>
          </div>
          <div style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 20, padding: 12, maxWidth: 480 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
              <a href="/search" style={{ background: "rgba(255,255,255,0.12)", borderRadius: 14, padding: "10px 12px" }}><div style={{ fontSize: 9, color: "rgba(255,255,255,0.45)", marginBottom: 2 }}>📍 Destination</div><div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>Marrakech</div></a>
              <a href="/search" style={{ background: "rgba(255,255,255,0.12)", borderRadius: 14, padding: "10px 12px" }}><div style={{ fontSize: 9, color: "rgba(255,255,255,0.45)", marginBottom: 2 }}>📅 Date</div><div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>Choose a date</div></a>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8 }}>
              <a href="/search" style={{ background: "rgba(255,255,255,0.12)", borderRadius: 14, padding: "10px 12px" }}><div style={{ fontSize: 9, color: "rgba(255,255,255,0.45)", marginBottom: 2 }}>🌍 Language</div><div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>Any language</div></a>
              <a href="/search" className="btn-bronze" style={{ padding: "10px 20px", fontSize: 13, display: "flex", alignItems: "center", borderRadius: 14 }}>Search →</a>
            </div>
          </div>
        </div>
      </div>

      {/* TRUST BAR */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 clamp(16px,4vw,24px)" }}>
        <div style={{ background: "var(--white)", borderRadius: 18, padding: "16px 20px", boxShadow: "var(--shadow)", display: "flex", justifyContent: "space-around", textAlign: "center", marginTop: -28, position: "relative", zIndex: 10 }}>
          {[{ n: "47+", label: "Guides", color: "var(--bronze)" },{ n: "28+", label: "Drivers", color: "var(--sage)" },{ n: "⭐4.9", label: "Avg rating", color: "var(--charcoal)" },{ n: "1.2k+", label: "Bookings", color: "var(--charcoal)" }].map((s, i) => (
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

      {/* MOODS */}
      <div style={{ maxWidth: 960, margin: "52px auto 0", padding: "0 clamp(16px,4vw,24px)" }}>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 700, marginBottom: 18 }}>What&apos;s your vibe?</h2>
        <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 6 }}>
          {MOODS.map((m) => (
            <a key={m.slug} href={`/search?type=${m.slug}`} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flexShrink: 0 }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--white)", boxShadow: "var(--shadow-sm)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, border: "1.5px solid var(--sand-dark)" }}>{m.emoji}</div>
              <span style={{ fontSize: 11, fontWeight: 600, color: "var(--soft)" }}>{m.label}</span>
            </a>
          ))}
        </div>
      </div>

      {/* GUIDES GRID */}
      <div style={{ maxWidth: 960, margin: "52px auto 0", padding: "0 clamp(16px,4vw,24px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 700 }}>Top Guides</h2>
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>{guides.length} results · Live from Supabase</div>
          </div>
          <a href="/search" style={{ fontSize: 12, color: "var(--bronze)", fontWeight: 700 }}>See all →</a>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 16 }}>
          {guides.map((g) => (
            <a key={g.id} href={`/guide/${g.id}`} style={{ display: "block" }}>
              <div style={{ background: "var(--white)", borderRadius: "var(--r-card)", overflow: "hidden", boxShadow: "var(--shadow)" }}>
                <div style={{ position: "relative", height: 185 }}>
                  <img src={g.avatar ?? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80"} alt={g.displayName} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,transparent 40%,rgba(0,0,0,0.72))" }} />
                  <div style={{ position: "absolute", top: 10, right: 10, background: "rgba(0,0,0,0.38)", backdropFilter: "blur(8px)", borderRadius: 8, padding: "3px 8px", display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ color: "#FFD700", fontSize: 11 }}>★</span>
                    <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>{g.avgRating.toFixed(1)}</span>
                    <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 10 }}>({g.totalReviews})</span>
                  </div>
                  <div style={{ position: "absolute", top: 10, left: 10 }}>
                    <span style={{ background: "#E8F0E4", color: "var(--sage)", fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: "999px" }}>✓ Verified</span>
                  </div>
                  <div style={{ position: "absolute", bottom: 10, left: 12, right: 12 }}>
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,0.55)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>📍 {g.city}</div>
                    <div style={{ fontFamily: "var(--font-serif)", fontSize: 16, fontWeight: 700, color: "#fff" }}>{g.displayName}</div>
                  </div>
                </div>
                <div style={{ padding: "12px 14px" }}>
                  {g.languages.length > 0 && <div style={{ fontSize: 11, color: "var(--soft)", marginBottom: 10 }}>{g.languages.slice(0,3).join(" · ")} · {g.yearsExp} yrs</div>}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 9, color: "var(--muted)" }}>From</div>
                      <div style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 700, color: "var(--charcoal)" }}>{toEur(g.halfDayPrice)}</div>
                      <div style={{ fontSize: 9, color: "var(--muted)" }}>per person · 4h</div>
                    </div>
                    <a href={`/booking?guide=${g.id}`} onClick={(e) => e.stopPropagation()} className="btn-bronze" style={{ padding: "9px 16px", fontSize: 12 }}>Book →</a>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <a href="/search" className="btn-ghost" style={{ padding: "13px 32px", fontSize: 13 }}>View all guides →</a>
        </div>
      </div>

      {/* TRANSPORT */}
      <div style={{ maxWidth: 960, margin: "56px auto 0", padding: "0 clamp(16px,4vw,24px)" }}>
        <div style={{ background: "var(--charcoal)", borderRadius: "var(--r-card)", overflow: "hidden", display: "grid", gridTemplateColumns: "1fr 1fr" }}>
          <div style={{ padding: "32px 28px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ display: "inline-block", background: "rgba(184,138,68,0.18)", border: "1px solid rgba(184,138,68,0.4)", borderRadius: "999px", padding: "4px 12px", fontSize: 10, fontWeight: 700, color: "var(--bronze)", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 14, width: "fit-content" }}>🚗 Transport</div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(18px,2.5vw,24px)", fontWeight: 700, color: "#fff", marginBottom: 8, lineHeight: 1.2 }}>Airport transfers &<br />private rides</h2>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginBottom: 20, lineHeight: 1.65 }}>Vetted drivers · Fixed prices · No surprises</p>
            <div style={{ display: "flex", gap: 8, marginBottom: 22, flexWrap: "wrap" }}>
              {VEHICLES.map((v) => (
                <div key={v.label} style={{ background: "rgba(255,255,255,0.07)", borderRadius: 12, padding: "8px 12px", textAlign: "center" }}>
                  <div style={{ fontSize: 18 }}>{v.icon}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{v.label}</div>
                  <div style={{ fontFamily: "var(--font-serif)", fontSize: 15, fontWeight: 700, color: "#fff" }}>{v.price}</div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>{v.pax} pax</div>
                </div>
              ))}
            </div>
            <a href="/transport" className="btn-bronze" style={{ padding: "12px 22px", fontSize: 13, width: "fit-content" }}>Book a ride →</a>
          </div>
          <div style={{ position: "relative", minHeight: 240 }}>
            <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=700&q=80" alt="Transport" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right,rgba(17,17,17,0.5),transparent)" }} />
          </div>
        </div>
      </div>

      {/* BUNDLE */}
      <div style={{ maxWidth: 960, margin: "16px auto 0", padding: "0 clamp(16px,4vw,24px)" }}>
        <div style={{ background: "linear-gradient(135deg,var(--sage),#5a6b4a)", borderRadius: "var(--r-card)", padding: "22px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 4 }}>🎯 Best Value — Guide + Transport</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>Book both in one checkout and save up to €5 per trip.</div>
          </div>
          <a href="/booking" className="btn-bronze" style={{ padding: "13px 24px", fontSize: 13, flexShrink: 0 }}>Book bundle →</a>
        </div>
      </div>

      {/* CITIES */}
      <div style={{ maxWidth: 960, margin: "56px auto 0", padding: "0 clamp(16px,4vw,24px)" }}>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 700, marginBottom: 18 }}>Explore by City</h2>
        <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 6 }}>
          {CITIES.map((c) => (
            <a key={c.name} href={`/search?city=${encodeURIComponent(c.name)}`} style={{ position: "relative", width: 110, height: 135, borderRadius: 18, overflow: "hidden", flexShrink: 0 }}>
              <img src={c.img} alt={c.name} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.32)" }} />
              <div style={{ position: "absolute", bottom: 10, left: 10 }}><div style={{ color: "#fff", fontWeight: 700, fontSize: 12 }}>{c.name}</div></div>
            </a>
          ))}
        </div>
      </div>

      {/* WHY LAKSOR */}
      <div style={{ maxWidth: 960, margin: "56px auto 0", padding: "48px clamp(16px,4vw,24px) 0", borderTop: "1px solid var(--sand-dark)" }}>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 700, marginBottom: 24, textAlign: "center" }}>Why Laksor?</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 22 }}>
          {TRUST.map((t) => (
            <div key={t.title} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: "var(--white)", boxShadow: "var(--shadow-sm)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{t.icon}</div>
              <div><div style={{ fontWeight: 700, fontSize: 13, marginBottom: 3 }}>{t.title}</div><div style={{ fontSize: 12, color: "var(--soft)", lineHeight: 1.55 }}>{t.desc}</div></div>
            </div>
          ))}
        </div>
      </div>

      {/* JOIN CTA */}
      <div style={{ maxWidth: 960, margin: "56px auto 72px", padding: "0 clamp(16px,4vw,24px)" }}>
        <div style={{ background: "var(--charcoal)", borderRadius: "var(--r-card)", padding: "36px 28px", textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 24, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Join Laksor</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: 22, maxWidth: 380, margin: "0 auto 22px", lineHeight: 1.65 }}>
            Guide or Transport provider? Share your expertise with travelers worldwide.
          </div>
          <a href="/auth/register" className="btn-bronze" style={{ padding: "14px 32px", fontSize: 14 }}>Apply Now ✦</a>
        </div>
      </div>

    </div>
  );
}
EOF
echo -e "${GREEN}  ✓ page.tsx written${NC}"

echo ""
echo -e "${GREEN}✅ Done! 3 files updated in $APP/${NC}"
echo ""
echo "  Next steps:"
echo "  npm run dev"
