"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function LogoutPage() {
  const router = useRouter();
  
  useEffect(() => {
    supabase.auth.signOut().then(() => {
      router.push("/");
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-sand-200">
      <div className="text-center">
        <div className="text-4xl mb-3">👋</div>
        <div className="text-sm text-charcoal-400 mb-4">Déconnexion en cours...</div>
        <a href="/" className="text-xs text-bronze-500 font-bold underline">
          Cliquez ici si vous n'êtes pas redirigé
        </a>
      </div>
    </div>
  );
}
