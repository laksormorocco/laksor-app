"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const TABS = [
  { id:"home", icon:"🏠", label:"Accueil" },
  { id:"reservations", icon:"📋", label:"Réservations" },
  { id:"stats", icon:"📈", label:"Stats" },
  { id:"profil", icon:"👤", label:"Profil" },
];

export default function TransportDashboard() {
  const [active, setActive] = useState("home");
  const [transport, setTransport] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [transportId, setTransportId] = useState("");

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id") || "";
    setTransportId(id);
    if (id) fetchData(id);
    else setLoading(false);
  }, []);

  async function fetchData(id: string) {
    setLoading(true);
    try {
      const res = await fetch("/api/transport/dashboard?transportId=" + id);
      const data = await res.json();
      if (data.transport) {
        setTransport(data.transport);
        setBookings(data.transport.bookings || []);
        setTotalRevenue(data.totalRevenue || 0);
      }
    } catch(e) { console.error(e); }
    setLoading(false);
  }

  async function updateBooking(bookingId: string, status: string) {
    await fetch("/api/guide/booking", { // Reusing guide booking API as it's generic enough or update it
      method: "PATCH",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ bookingId, status })
    });
    if (transportId) fetchData(transportId);
  }

  const pending = bookings.filter(b => b.status === "PENDING");
  const confirmed = bookings.filter(b => b.status === "CONFIRMED");

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--sand)]">
      <div className="text-center">
        <div className="text-4xl mb-3 animate-bounce">⏳</div>
        <div className="text-[var(--muted)] font-bold uppercase tracking-widest text-[10px]">Chargement...</div>
      </div>
    </div>
  );

  if (!transportId) return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--sand)] p-4">
      <div className="bg-white rounded-[28px] p-8 text-center max-w-[360px] w-full border border-[var(--sand-dark)] shadow-xl">
        <div className="text-5xl mb-4">🔐</div>
        <h2 className="text-[var(--bronze)] font-serif font-bold text-xl mb-2">Accès Transport</h2>
        <p className="text-[var(--soft)] text-sm mb-6 leading-relaxed">Connectez-vous pour accéder à votre espace professionnel.</p>
        <Link href="/auth/login" className="btn-bronze w-full py-4 text-sm shadow-lg">Se connecter</Link>
      </div>
    </div>
  );

  return (
    <div className="bg-[var(--sand)] min-h-screen flex flex-col pb-24">
      <header className="bg-white p-4 border-b border-[var(--sand-dark)] sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full overflow-hidden bg-[var(--sand)] border-2 border-[var(--sand-dark)]">
              {transport?.avatar ? <img src={transport.avatar} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center font-bold text-[var(--bronze)]">{transport?.displayName?.[0]}</div>}
            </div>
            <div>
              <div className="text-[10px] text-[var(--muted)] font-bold uppercase tracking-wider">Transporteur,</div>
              <div className="font-serif font-bold text-base text-[var(--charcoal)] leading-none">{transport?.displayName || "Chauffeur"} ✦</div>
            </div>
          </div>
          <Link href="/" className="w-10 h-10 bg-[var(--sand)] rounded-xl border border-[var(--sand-dark)] flex items-center justify-center shadow-sm">🏠</Link>
        </div>
      </header>

      <main className="p-4 max-w-lg mx-auto w-full flex-1">
        {active === "home" && (
          <div className="flex flex-col gap-4">
            <div className="bg-[var(--bronze-g)] rounded-[28px] p-6 text-white shadow-xl">
              <div className="text-[10px] opacity-70 font-bold uppercase tracking-widest mb-1">Revenus cumulés</div>
              <div className="text-3xl font-serif font-bold">{totalRevenue} MAD</div>
            </div>

            {pending.length > 0 && (
              <div className="bg-white rounded-[28px] p-5 border border-[var(--sand-dark)] shadow-sm">
                <h2 className="text-sm font-bold uppercase tracking-wider mb-4">Réservations en attente</h2>
                {pending.map((b:any) => (
                  <div key={b.id} className="border border-[var(--sand-dark)] rounded-2xl p-4 bg-[var(--sand)]/30 mb-3">
                    <div className="flex justify-between mb-4">
                      <div className="font-bold">{b.tourist?.name}</div>
                      <div className="text-[var(--sage)] font-bold">{b.totalPrice} MAD</div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={()=>updateBooking(b.id,"CONFIRMED")} className="btn-bronze flex-1 py-2 text-xs">Accepter</button>
                      <button onClick={()=>updateBooking(b.id,"CANCELLED")} className="btn-ghost flex-1 py-2 text-xs">Refuser</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {confirmed.length > 0 && (
              <div className="bg-white rounded-[28px] p-5 border border-[var(--sand-dark)] shadow-sm">
                <h2 className="text-sm font-bold uppercase tracking-wider mb-4">Courses confirmées</h2>
                {confirmed.map((b:any) => (
                  <div key={b.id} className="flex justify-between items-center py-2 border-b border-[var(--sand)] last:border-0">
                    <div>
                      <div className="font-bold text-sm">{b.tourist?.name}</div>
                      <div className="text-[10px] text-[var(--muted)]">{new Date(b.date).toLocaleDateString("fr-FR")}</div>
                    </div>
                    <div className="text-[var(--sage)] font-bold text-sm">{b.totalPrice} MAD</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg bg-white/95 backdrop-blur-xl border-t border-[var(--sand-dark)] grid grid-cols-4 z-50 px-2 pb-6 pt-2 shadow-[0_-8px_40px_rgba(0,0,0,0.08)]">
        {TABS.map(t => (
          <button key={t.id} onClick={()=>setActive(t.id)} className={`flex flex-col items-center gap-1.5 ${active===t.id ? "text-[var(--bronze)]" : "text-[var(--muted)]"}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${active===t.id ? "bg-[var(--bronze-g)] text-white" : ""}`}>
              {t.icon}
            </div>
            <span className="text-[9px] font-extrabold uppercase tracking-tighter">{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
