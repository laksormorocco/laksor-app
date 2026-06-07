"use client";
import { useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function DashboardRedirect() {
  useEffect(() => {
    async function init() {
      // Attendre que Supabase traite le hash si present
      await new Promise(r => setTimeout(r, 500));
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        window.location.href = "/auth/login";
        return;
      }

      const res = await fetch("/api/auth/me?email=" + encodeURIComponent(session.user.email || ""));
      const data = await res.json();

      if (data.role === "ADMIN") window.location.href = "/dashboard/admin";
      else if (data.role === "GUIDE") window.location.href = "/dashboard/guide?id=" + data.guideId;
      else window.location.href = "/dashboard/tourist";
    }
    init();
  }, []);

  return (
        <div className="min-h-screen bg-sand-200 flex flex-col items-center justify-center gap-6">
      <img src="/logo7.png" alt="Laksor" style={{ height: 56, width: "auto", objectFit: "contain", maxWidth: 180 }} />
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full animate-spin" style={{ borderWidth: 3, borderStyle: "solid", borderColor: "#B88A44 transparent transparent transparent" }} />
        <p className="text-xs text-charcoal-400 font-medium">Chargement...</p>
      </div>
    </div>
  );
}
