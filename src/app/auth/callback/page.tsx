"use client";
import { useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function CallbackPage() {
  useEffect(() => {
    async function handle() {
      // Laisser Supabase parser le hash
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        // Ecouter l auth state change (OAuth hash parsing)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, s) => {
          if (s) {
            subscription.unsubscribe();
            await doRedirect(s);
          }
        });
        // Fallback 4s
        setTimeout(() => { window.location.href = "/auth/login"; }, 4000);
        return;
      }

      await doRedirect(session);
    }

    async function doRedirect(session: any) {
      // Sync user en DB
      await fetch("/api/auth/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supabaseId: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.full_name || session.user.email,
          avatar: session.user.user_metadata?.avatar_url || null,
        })
      });

      const res = await fetch("/api/auth/me?supabaseId=" + session.user.id);
      const data = await res.json();
      if (data.role === "ADMIN") window.location.href = "/dashboard/admin";
      else if (data.role === "GUIDE" && data.guideId) window.location.href = "/dashboard/guide?id=" + data.guideId;
      else window.location.href = "/dashboard/tourist";
    }

    handle();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-sand-200">
      <div className="text-center">
        <div className="w-16 h-16 bg-bronze-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl animate-pulse">🧭</div>
        <div className="font-display text-lg font-semibold text-charcoal-800 mb-1">Connexion en cours...</div>
        <div className="text-sm text-charcoal-400">Préparation de votre espace</div>
      </div>
    </div>
  );
}
