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
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#F8F5F0", fontFamily:"Georgia,serif" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:48, marginBottom:16 }}>⏳</div>
        <div style={{ fontSize:16, color:"#666" }}>Chargement de votre espace...</div>
      </div>
    </div>
  );
}
