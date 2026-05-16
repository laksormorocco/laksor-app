"use client";
import { useState, useEffect } from "react";

const B = "#123EAB";
const G = "#22c55e";

export default function GuideStats({ guideId }: { guideId: string }) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/guide/stats?guideId=" + guideId)
      .then(r => r.json())
      .then(d => { setStats(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [guideId]);

  if (loading) return (
    <div style={{ textAlign: "center", padding: 40, color: "#94A3B8" }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
      Chargement des stats...
    </div>
  );

  if (!stats) return (
    <div style={{ textAlign: "center", padding: 40, background: "#fff", borderRadius: 20, border: "1px solid #EBEBEB" }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>📊</div>
      <div style={{ color: "#94A3B8" }}>Aucune statistique disponible</div>
    </div>
  );

  const maxRevenue = Math.max(...(stats.monthlyRevenue || []).map((m: any) => m.revenue || 0), 1);

  const CARDS = [
    { icon: "💰", label: "Revenus total", val: (stats.totalRevenue || 0) + " MAD", bg: "#F0FDF4", color: G },
    { icon: "🏆", label: "Tours realises", val: String(stats.completedTours || 0), bg: "#FDF4FF", color: "#9333ea" },
    { icon: "⭐", label: "Note moyenne", val: Number(stats.avgRating || 0).toFixed(1) + "/5", bg: "#FFFBEB", color: "#d97706" },
    { icon: "📋", label: "Reservations", val: String(stats.totalBookings || 0), bg: "#EFF6FF", color: B },
  ];

  const STATUS = [
    { label: "En attente", val: stats.pendingBookings || 0, color: "#92400E", bg: "#FEF3C7" },
    { label: "Confirmes", val: stats.confirmedBookings || 0, color: "#166534", bg: "#DCFCE7" },
    { label: "Termines", val: stats.completedTours || 0, color: "#123EAB", bg: "#EFF6FF" },
    { label: "Annules", val: stats.cancelledBookings || 0, color: "#ef4444", bg: "#FEE2E2" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, fontFamily: "Inter, sans-serif" }}>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {CARDS.map(s => (
          <div key={s.label} style={{ background: "#fff", borderRadius: 16, padding: 16, border: "1px solid #EBEBEB" }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, marginBottom: 10 }}>{s.icon}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: s.color, marginBottom: 2 }}>{s.val}</div>
            <div style={{ fontSize: 12, color: "#94A3B8" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Graphique revenus */}
      {stats.monthlyRevenue && stats.monthlyRevenue.length > 0 && (
        <div style={{ background: "#fff", borderRadius: 16, padding: 18, border: "1px solid #EBEBEB" }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#222", marginBottom: 16 }}>Revenus par mois</h3>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 100 }}>
            {stats.monthlyRevenue.map((m: any, i: number) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ fontSize: 9, color: "#94A3B8", fontWeight: 600 }}>{m.revenue}</div>
                <div style={{ width: "100%", background: i === stats.monthlyRevenue.length - 1 ? B : B + "60", borderRadius: "4px 4px 0 0", height: Math.max((m.revenue / maxRevenue) * 80, 4) + "px" }}/>
                <div style={{ fontSize: 9, color: "#94A3B8" }}>{m.month}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Statuts */}
      <div style={{ background: "#fff", borderRadius: 16, padding: 18, border: "1px solid #EBEBEB" }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#222", marginBottom: 14 }}>Statut des reservations</h3>
        {STATUS.map(s => (
          <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #F1F5F9" }}>
            <span style={{ fontSize: 13, color: "#475569" }}>{s.label}</span>
            <span style={{ fontSize: 13, fontWeight: 700, padding: "3px 10px", borderRadius: 12, background: s.bg, color: s.color }}>{s.val}</span>
          </div>
        ))}
      </div>

      {/* Types de visite */}
      {stats.bookingTypes && stats.bookingTypes.length > 0 && (
        <div style={{ background: "#fff", borderRadius: 16, padding: 18, border: "1px solid #EBEBEB" }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#222", marginBottom: 14 }}>Types de visite</h3>
          {stats.bookingTypes.map((d: any, i: number) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 13, color: "#475569" }}>{d.type === "HALF_DAY" ? "Demi-journee" : "Journee"}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: B }}>{d.count}</span>
              </div>
              <div style={{ background: "#F1F5F9", borderRadius: 6, height: 8 }}>
                <div style={{ background: B, borderRadius: 6, height: 8, width: stats.totalBookings > 0 ? (d.count / stats.totalBookings * 100) + "%" : "0%" }}/>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Taux acceptation */}
      <div style={{ background: "linear-gradient(135deg, #123EAB, #1a4fd6)", borderRadius: 16, padding: 18, textAlign: "center" }}>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "1px" }}>Taux d acceptation</div>
        <div style={{ fontSize: 36, fontWeight: 800, color: "#F4C542" }}>{stats.acceptanceRate || 0}%</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>des demandes acceptees</div>
      </div>

    </div>
  );
}
