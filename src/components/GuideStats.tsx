"use client";
import { useState, useEffect } from "react";
import { CurrencyDollar, Trophy, Star, CalendarCheck } from "@phosphor-icons/react";

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
    <div className="flex flex-col items-center justify-center py-16">
      <div className="text-4xl mb-3 animate-pulse">⏳</div>
      <div className="text-sm text-charcoal-400">Chargement des stats...</div>
    </div>
  );

  if (!stats) return (
    <div className="bg-white rounded-2xl border border-sand-300 p-10 text-center">
      <div className="text-4xl mb-3">📊</div>
      <div className="text-sm text-charcoal-400">Aucune statistique disponible</div>
    </div>
  );

  const maxRevenue = Math.max(...(stats.monthlyRevenue || []).map((m: any) => m.revenue || 0), 1);

  return (
    <div className="flex flex-col gap-3">

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { Icon: CurrencyDollar, label: "Revenus total",   val: (stats.totalRevenue||0)+" MAD",                       color: "text-sage-300",   bg: "bg-sage-50"   },
          { Icon: Trophy,         label: "Tours réalisés",  val: String(stats.completedTours||0),                      color: "text-bronze-500", bg: "bg-bronze-50" },
          { Icon: Star,           label: "Note moyenne",    val: Number(stats.avgRating||0).toFixed(1)+"/5",           color: "text-bronze-500", bg: "bg-bronze-50" },
          { Icon: CalendarCheck,  label: "Réservations",    val: String(stats.totalBookings||0),                       color: "text-charcoal-800", bg: "bg-sand-200"  },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-sand-300 p-4">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <s.Icon size={20} className={s.color} weight="duotone" />
            </div>
            <div className={`font-display text-xl font-bold ${s.color}`}>{s.val}</div>
            <div className="text-xs text-charcoal-400 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Graphique revenus */}
      {stats.monthlyRevenue?.length > 0 && (
        <div className="bg-white rounded-2xl border border-sand-300 p-4">
          <div className="text-sm font-bold text-charcoal-800 mb-4">Revenus par mois</div>
          <div className="flex items-end gap-1.5 h-24">
            {stats.monthlyRevenue.map((m: any, i: number) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="text-[8px] text-charcoal-400">{m.revenue > 0 ? m.revenue : ""}</div>
                <div className="w-full rounded-t-md transition-all"
                  style={{ height: Math.max((m.revenue/maxRevenue)*72, 3)+"px", background: i===stats.monthlyRevenue.length-1 ? "#B88A44" : "rgba(184,138,68,0.3)" }} />
                <div className="text-[8px] text-charcoal-400">{m.month}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Statuts */}
      <div className="bg-white rounded-2xl border border-sand-300 p-4">
        <div className="text-sm font-bold text-charcoal-800 mb-3">Statut des réservations</div>
        {[
          { label: "En attente",  val: stats.pendingBookings||0,   cls: "bg-bronze-50 text-bronze-500 border-bronze-500"  },
          { label: "Confirmés",   val: stats.confirmedBookings||0,  cls: "bg-sage-50 text-sage-300 border-sage-300"        },
          { label: "Terminés",    val: stats.completedTours||0,     cls: "bg-sand-200 text-charcoal-600 border-sand-300"   },
          { label: "Annulés",     val: stats.cancelledBookings||0,  cls: "bg-red-50 text-red-400 border-red-200"           },
        ].map(s => (
          <div key={s.label} className="flex items-center justify-between py-2.5 border-b border-sand-200 last:border-0">
            <span className="text-sm text-charcoal-600">{s.label}</span>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${s.cls}`}>{s.val}</span>
          </div>
        ))}
      </div>

      {/* Types de visite */}
      {stats.bookingTypes?.length > 0 && (
        <div className="bg-white rounded-2xl border border-sand-300 p-4">
          <div className="text-sm font-bold text-charcoal-800 mb-3">Types de visite</div>
          {stats.bookingTypes.map((d: any, i: number) => (
            <div key={i} className="mb-3 last:mb-0">
              <div className="flex justify-between mb-1.5">
                <span className="text-xs text-charcoal-600">{d.type === "HALF_DAY" ? "Demi-journée" : "Journée"}</span>
                <span className="text-xs font-bold text-bronze-500">{d.count}</span>
              </div>
              <div className="h-2 bg-sand-300 rounded-full overflow-hidden">
                <div className="h-full bg-bronze-500 rounded-full transition-all"
                  style={{ width: stats.totalBookings > 0 ? (d.count/stats.totalBookings*100)+"%" : "0%" }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Taux acceptation */}
      <div className="bg-charcoal-800 rounded-2xl p-5 text-center">
        <div className="text-[10px] text-charcoal-400 uppercase tracking-wider mb-2">Taux d&apos;acceptation</div>
        <div className="font-display text-4xl font-bold text-bronze-500">{stats.acceptanceRate||0}%</div>
        <div className="text-xs text-charcoal-400 mt-1">des demandes acceptées</div>
      </div>
    </div>
  );
}
