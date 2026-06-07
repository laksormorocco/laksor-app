"use client";
import { useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function CallbackPage() {
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        await fetch("/api/auth/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            supabaseId: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.full_name || session.user.email,
            avatar: session.user.user_metadata?.avatar_url || null,
          }),
        });

        const res = await fetch("/api/auth/me?email=" + encodeURIComponent(session.user.email || ""));
        const data = await res.json();

        if (data.role === "ADMIN") window.location.href = "/dashboard/admin";
        else if (data.role === "GUIDE") window.location.href = "/dashboard/guide?id=" + data.guideId;
        else window.location.href = "/dashboard/tourist";
      } else if (event === "SIGNED_OUT") {
        window.location.href = "/auth/login";
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-sand-200 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-bronze-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-charcoal-400">Connexion en cours...</p>
      </div>
    </div>
  );
}
