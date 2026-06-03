"use client";
import { useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function LogoutPage() {
  useEffect(() => {
    supabase.auth.signOut().then(() => {
      window.location.href = "/";
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-sand-200">
      <div className="text-center">
        <div className="text-4xl mb-3 animate-pulse">👋</div>
        <div className="text-sm text-charcoal-400">Déconnexion en cours...</div>
      </div>
    </div>
  );
}
