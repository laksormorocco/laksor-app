"use client";
import { useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function CallbackPage() {
  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        window.location.href = "/dashboard";
      }
    });
    setTimeout(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) window.location.href = "/dashboard";
        else window.location.href = "/auth/login";
      });
    }, 2000);
  }, []);

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#F8F5F0" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:48, marginBottom:16 }}>⏳</div>
        <div style={{ fontSize:16, color:"#666" }}>Connexion en cours...</div>
      </div>
    </div>
  );
}
