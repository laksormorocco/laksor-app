"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function TouristDashboard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("upcoming");

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { window.location.href = "/auth/login"; return; }
      setUser(session.user);
      await fetch("/api/auth/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ supabaseId: session.user.id, email: session.user.email, name: session.user.user_metadata?.full_name || session.user.email, avatar: session.user.user_metadata?.avatar_url || null })
      });
      const res = await fetch("/api/tourist/bookings?supabaseId=" + session.user.id);
      const data = await res.json();
      setBookings(data.bookings || []);
      setLoading(false);
    });
  }, []);

  async function cancelBooking(id: string) {
    if (!confirm("Annuler cette reservation ?")) return;
    await fetch("/api/tourist/bookings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ bookingId: id, status: "CANCELLED" }) });
    setBookings(bookings.map(b => b.id === id ? { ...b, status: "CANCELLED" } : b));
  }

  const upcoming = bookings.filter(b => b.status === "PENDING" || b.status === "CONFIRMED");
  const past = bookings.filter(b => b.status === "COMPLETED" || b.status === "CANCELLED");

  function statusBadge(s: string) {
    const map: any = {
      CONFIRMED: { bg: "#DCFCE7", color: "#166534", label: "Confirme" },
      PENDING: { bg: "#FEF3C7", color: "#92400E", label: "En attente" },
      CANCELLED: { bg: "#FEE2E2", color: "#ef4444", label: "Annule" },
      COMPLETED: { bg: "#F1F5F9", color: "#475569", label: "Termine" },
    };
    return map[s] || map.PENDING;
  }

  const can72h = (date: string) => new Date(date).getTime() - Date.now() > 72 * 60 * 60 * 1000;

  return (
    <div style={{ background: "#F7F7F7", minHeight: "100vh", fontFamily: "Inter, -apple-system, sans-serif", paddingBottom: 40 }}>

      <div style={{ background: "#fff", borderBottom: "1px solid #EBEBEB", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ padding: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ position: "relative" }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", overflow: "hidden", background: "#E2E8F0", border: "2px solid #E2E8F0" }}>
                  {user?.user_metadata?.avatar_url && <img src={user.user_metadata.avatar_url} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                </div>
                <div style={{ position: "absolute", bottom: 0, right: 0, width: 12, height: 12, background: "#22c55e", borderRadius: "50%", border: "2px solid #fff" }} />
              </div>
              <div>
                <div style={{ fontSize: 12, color: "#94A3B8" }}>Bonjour,</div>
                <div style={{ fontWeight: 700, fontSize: 16, color: "#222" }}>{user?.user_metadata?.full_name || "Voyageur"} 👋</div>
              </div>
            </div>
            <Link href="/" style={{ width: 40, height: 40, background: "#F7F7F7", borderRadius: 12, border: "1px solid #EBEBEB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, textDecoration: "none" }}>🏠</Link>
          </div>
        </div>
        <div style={{ display: "flex", borderTop: "1px solid #EBEBEB" }}>
          {[["upcoming", "Reservations actives"], ["past", "Historique"]].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} style={{ flex: 1, padding: "12px 0", fontSize: 13, fontWeight: tab === id ? 700 : 500, color: tab === id ? "#123EAB" : "#94A3B8", background: "none", border: "none", borderBottom: "2px solid " + (tab === id ? "#123EAB" : "transparent"), cursor: "pointer", fontFamily: "inherit" }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "16px" }}>

        {loading && <div style={{ textAlign: "center", padding: 60, color: "#94A3B8" }}><div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>Chargement...</div>}

        {!loading && tab === "upcoming" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              <div style={{ background: "#fff", borderRadius: 16, padding: 16, border: "1px solid #EBEBEB" }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>📋</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#123EAB" }}>{upcoming.length}</div>
                <div style={{ fontSize: 12, color: "#94A3B8" }}>Reservations actives</div>
              </div>
              <div style={{ background: "#fff", borderRadius: 16, padding: 16, border: "1px solid #EBEBEB" }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>✅</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#22c55e" }}>{bookings.filter(b => b.status === "CONFIRMED").length}</div>
                <div style={{ fontSize: 12, color: "#94A3B8" }}>Confirmees</div>
              </div>
            </div>

            {upcoming.length === 0 ? (
              <div style={{ background: "#fff", borderRadius: 20, padding: 48, textAlign: "center", border: "1px solid #EBEBEB" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🧭</div>
                <h2 style={{ color: "#123EAB", marginBottom: 8, fontSize: 18, fontWeight: 700 }}>Aucune reservation</h2>
                <p style={{ color: "#94A3B8", marginBottom: 24, fontSize: 14 }}>Trouvez votre guide ideal</p>
                <Link href="/search" style={{ background: "#F4C542", color: "#111", borderRadius: 30, padding: "14px 28px", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>Trouver un guide</Link>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {upcoming.map(b => {
                  const s = statusBadge(b.status);
                  return (
                    <div key={b.id} style={{ background: "#fff", borderRadius: 20, padding: 18, border: "1px solid #EBEBEB" }}>
                      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}>
                        <div style={{ width: 52, height: 52, borderRadius: 14, overflow: "hidden", background: "#E2E8F0", flexShrink: 0 }}>
                          {b.guide?.avatar && <img src={b.guide.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: 15, color: "#0F172A" }}>{b.guide?.displayName}</div>
                          <div style={{ color: "#F59E0B", fontSize: 12 }}>📍 {b.guide?.city}</div>
                        </div>
                        <div style={{ background: s.bg, color: s.color, fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 20 }}>{s.label}</div>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
                        {[["Date", new Date(b.date).toLocaleDateString("fr-FR")], ["Duree", b.duration === "FULL_DAY" ? "8h" : "4h"], ["Pers.", String(b.persons)]].map(([k, v]) => (
                          <div key={k} style={{ background: "#F8FAFC", borderRadius: 10, padding: 8, textAlign: "center" }}>
                            <div style={{ fontSize: 9, color: "#94A3B8", textTransform: "uppercase" as const }}>{k}</div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "#222", marginTop: 2 }}>{v}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                        <div style={{ fontWeight: 800, fontSize: 18, color: "#22c55e" }}>{b.totalPrice} MAD</div>
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        {b.status === "CONFIRMED" && b.guide?.phone ? (
                          <a href={"https://wa.me/" + b.guide.phone.replace(/[^0-9]/g, "")} target="_blank" style={{ flex: 1, background: "#25D366", color: "#fff", borderRadius: 25, padding: "11px 0", fontSize: 13, fontWeight: 700, textDecoration: "none", textAlign: "center" }}>
                            💬 WhatsApp guide
                          </a>
                        ) : (
                          <div style={{ flex: 1, background: "#E2E8F0", color: "#94A3B8", borderRadius: 25, padding: "11px 0", fontSize: 13, fontWeight: 600, textAlign: "center", cursor: "not-allowed" }}>
                            💬 Actif si confirme
                          </div>
                        )}
                        {b.status === "PENDING" && can72h(b.date) && (
                          <button onClick={() => cancelBooking(b.id)} style={{ background: "#FFF1F2", color: "#ef4444", border: "none", borderRadius: 25, padding: "11px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                            Annuler
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {!loading && tab === "past" && (
          <>
            {past.length === 0 ? (
              <div style={{ background: "#fff", borderRadius: 20, padding: 48, textAlign: "center", border: "1px solid #EBEBEB" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📜</div>
                <div style={{ color: "#94A3B8", fontSize: 14 }}>Aucun historique</div>
              </div>
            ) : (
              <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #EBEBEB", overflow: "hidden" }}>
                {past.map((b, i) => {
                  const s = statusBadge(b.status);
                  return (
                    <div key={b.id} style={{ display: "flex", justifyContent: "space-between", padding: "16px", borderBottom: i < past.length - 1 ? "1px solid #F1F5F9" : "none", alignItems: "center" }}>
                      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, overflow: "hidden", background: "#E2E8F0", flexShrink: 0 }}>
                          {b.guide?.avatar && <img src={b.guide.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14, color: "#222" }}>{b.guide?.displayName}</div>
                          <div style={{ fontSize: 11, color: "#94A3B8" }}>{new Date(b.date).toLocaleDateString("fr-FR")} · {b.duration === "FULL_DAY" ? "8h" : "4h"}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: "#22c55e" }}>{b.totalPrice} MAD</div>
                        <div style={{ background: s.bg, color: s.color, fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 10, marginTop: 3, display: "inline-block" }}>{s.label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        <div style={{ background: "linear-gradient(135deg,#123EAB,#1a4fd6)", borderRadius: 20, padding: 20, marginTop: 20, textAlign: "center" }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>🧭</div>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#fff", marginBottom: 6 }}>Pret pour une nouvelle aventure ?</div>
          <Link href="/search" style={{ background: "#F4C542", color: "#111", borderRadius: 30, padding: "12px 28px", fontSize: 14, fontWeight: 700, textDecoration: "none", display: "inline-block", marginTop: 8 }}>
            Explorer les guides
          </Link>
        </div>
      </div>
    </div>
  );
}
