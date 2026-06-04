"use client";
import { useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function DashboardRedirect() {
  useEffect(() => {
    async function checkUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setTimeout(async () => {
          const { data: { session: s2 } } = await supabase.auth.getSession();
          if (!s2) { window.location.href = "/auth/login"; return; }
          redirect(s2);
        }, 1500);
        return;
      }
      redirect(session);
    }

    async function redirect(session: any) {
      const res = await fetch("/api/auth/me?supabaseId=" + session.user.id);
      const data = await res.json();
      if (data.role === "GUIDE" && data.guideId) {
        window.location.href = "/dashboard/guide?id=" + data.guideId;
      } else if (data.role === "ADMIN") {
        window.location.href = "/dashboard/admin";
      } else {
        window.location.href = "/dashboard/tourist";
      }
    }

    supabase.auth.onAuthStateChange((event, session) => {
      if (session) redirect(session);
    });

    checkUser();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-sand-200">
      <div className="text-center">
        <div className="w-16 h-16 bg-bronze-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl animate-pulse">🧭</div>
        <div className="font-display text-lg font-semibold text-charcoal-800 mb-1">Chargement...</div>
        <div className="text-sm text-charcoal-400">Préparation de votre espace</div>
      </div>
    </div>
  );
}
