"use client";
import { useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function CallbackPage() {
  useEffect(() => {
    async function doRedirect(session: any) {
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

    async function handle() {
      // Attendre que Supabase parse le hash automatiquement
      const { data: { session } } = await supabase.auth.getSession();
      if (session) { await doRedirect(session); return; }

      // Sinon ecouter onAuthStateChange
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, s) => {
        if (event === "SIGNED_IN" && s) {
          subscription.unsubscribe();
          await doRedirect(s);
        }
      });

      // Fallback 5s
      setTimeout(async () => {
        const { data: { session: s2 } } = await supabase.auth.getSession();
        if (s2) await doRedirect(s2);
        else window.location.href = "/auth/login";
      }, 5000);
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
