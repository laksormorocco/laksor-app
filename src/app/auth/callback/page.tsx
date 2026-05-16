"use client";
import { useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function CallbackPage() {
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { window.location.href = "/auth/login"; return; }

      // Créer ou mettre à jour le user en base
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

      // Rediriger vers le bon dashboard
      const res = await fetch("/api/auth/me?supabaseId=" + session.user.id);
      const data = await res.json();
      if (data.role === "ADMIN") window.location.href = "/dashboard/admin";
      else if (data.role === "GUIDE") window.location.href = "/dashboard/guide?id=" + data.guideId;
      else window.location.href = "/dashboard/tourist";
    });
  }, []);

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#F7F7F7", fontFamily:"Inter, sans-serif" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ width:60, height:60, border:"4px solid #123EAB", borderTop:"4px solid transparent", borderRadius:"50%", animation:"spin 1s linear infinite", margin:"0 auto 20px" }}/>
        <div style={{ color:"#123EAB", fontWeight:600, fontSize:16 }}>Connexion en cours...</div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}
