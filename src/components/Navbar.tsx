"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function Navbar() {
  const [user,     setUser]     = useState<any>(null);
  const [guideId,  setGuideId]  = useState<string|null>(null);
  const [role,     setRole]     = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    async function loadUser(u: any) {
      setUser(u);
      const res  = await fetch("/api/auth/me?supabaseId=" + u.id);
      const data = await res.json();
      if (data.guideId) setGuideId(data.guideId);
      setRole(data.role || "");
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) loadUser(session.user);
    });
    supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) loadUser(session.user);
      else setUser(null);
    });
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <nav style={{
      background: "rgba(246,241,232,0.95)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      borderBottom: "1px solid var(--sand-dark)",
      padding: "0 clamp(16px,4vw,40px)",
      height: 62,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      position: "sticky", top: 0, zIndex: 200,
    }}>

      {/* LOGO */}
      <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
        <img src="/logo7.png" alt="Laksor" style={{ height: 44, width: "auto", objectFit: "contain" }} />
      </a>

      {/* NAV LINKS — desktop */}
      <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
        <a href="/search"    style={{ fontSize: 12, fontWeight: 600, color: "var(--soft)", textDecoration: "none" }}>Guides</a>
        <a href="/transport" style={{ fontSize: 12, fontWeight: 600, color: "var(--soft)", textDecoration: "none" }}>Transport</a>
      </div>

      {/* AUTH */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {!user ? (
          <>
            <a href="/auth/login" style={{ fontSize: 13, color: "var(--soft)", padding: "8px 14px", textDecoration: "none", fontWeight: 600 }}>
              Login
            </a>
            <a href="/auth/register" style={{
              background: "var(--bronze-g)", color: "#fff",
              borderRadius: "999px", padding: "9px 18px",
              fontSize: 12, fontWeight: 700, textDecoration: "none",
            }}>
              Join Free
            </a>
          </>
        ) : (
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "var(--white)", border: "1.5px solid var(--sand-dark)",
                borderRadius: "999px", padding: "6px 14px", cursor: "pointer",
              }}
            >
              {user.user_metadata?.avatar_url && (
                <img src={user.user_metadata.avatar_url} alt="" style={{ width: 26, height: 26, borderRadius: "50%", objectFit: "cover" }} />
              )}
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--charcoal)" }}>
                {user.user_metadata?.full_name?.split(" ")[0] || "Mon compte"}
              </span>
              <span style={{ fontSize: 9, color: "var(--muted)" }}>▼</span>
            </button>

            {menuOpen && (
              <div style={{
                position: "absolute", right: 0, top: "calc(100% + 8px)",
                background: "var(--white)", borderRadius: 20,
                boxShadow: "var(--shadow-lg)", minWidth: 210,
                overflow: "hidden", zIndex: 300,
                border: "1px solid var(--sand-dark)",
              }}>
                <a href="/dashboard/tourist" style={{ display: "block", padding: "12px 16px", fontSize: 13, color: "var(--charcoal)", textDecoration: "none", borderBottom: "1px solid var(--sand)", fontWeight: 600 }}>
                  🧳 Mes réservations
                </a>
                {guideId && (
                  <a href={`/dashboard/guide?id=${guideId}`} style={{ display: "block", padding: "12px 16px", fontSize: 13, color: "var(--charcoal)", textDecoration: "none", borderBottom: "1px solid var(--sand)", fontWeight: 600 }}>
                    📊 Mon dashboard
                  </a>
                )}
                {role === "ADMIN" && (
                  <a href="/dashboard/admin" style={{ display: "block", padding: "12px 16px", fontSize: 13, color: "var(--charcoal)", textDecoration: "none", borderBottom: "1px solid var(--sand)" }}>
                    ⚙️ Admin
                  </a>
                )}
                <button onClick={logout} style={{ display: "block", width: "100%", padding: "12px 16px", fontSize: 13, color: "#ef4444", border: "none", background: "none", cursor: "pointer", textAlign: "left", fontFamily: "var(--font-body)", fontWeight: 600 }}>
                  🚪 Déconnexion
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
