"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { Lock, CheckCircle } from "@phosphor-icons/react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase met le token dans le hash #access_token=...
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });
    // Vérifier si déjà une session active
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });
  }, []);

  async function handleReset() {
    setError("");
    if (password !== confirm) { setError("Les mots de passe ne correspondent pas"); return; }
    if (password.length < 6) { setError("Minimum 6 caractères"); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) { setError(error.message); setLoading(false); return; }
    setDone(true);
    setTimeout(() => router.push("/auth/login"), 2500);
  }

  if (done) return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{background:"#F6F1E8"}}>
      <div className="text-center">
        <CheckCircle size={48} weight="fill" className="text-sage-300 mx-auto mb-3" />
        <div className="font-display text-lg font-bold text-charcoal-800">Mot de passe mis à jour !</div>
        <div className="text-sm text-charcoal-400 mt-1">Redirection vers la connexion...</div>
      </div>
    </div>
  );

  if (!ready) return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{background:"#F6F1E8"}}>
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-bronze-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <div className="text-sm text-charcoal-400">Vérification du lien...</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{background:"#F6F1E8"}}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{background:"rgba(184,138,68,0.1)"}}>
            <Lock size={28} weight="duotone" className="text-bronze-500" />
          </div>
          <h1 className="font-display text-xl font-bold text-charcoal-800">Nouveau mot de passe</h1>
          <p className="text-sm text-charcoal-400 mt-1">Choisissez un nouveau mot de passe sécurisé</p>
        </div>
        <div className="bg-white rounded-2xl p-5 flex flex-col gap-3" style={{boxShadow:"0 2px 16px rgba(0,0,0,0.06)"}}>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Nouveau mot de passe"
            className="w-full border-2 border-sand-300 rounded-xl px-4 py-3 text-sm outline-none bg-sand-100 focus:border-bronze-500 transition-colors" />
          <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
            placeholder="Confirmer le mot de passe"
            className="w-full border-2 border-sand-300 rounded-xl px-4 py-3 text-sm outline-none bg-sand-100 focus:border-bronze-500 transition-colors" />
          {error && <div className="text-xs text-red-400 font-semibold px-1">{error}</div>}
          <button onClick={handleReset} disabled={loading}
            className="w-full py-4 rounded-full text-sm font-bold text-white active:scale-[0.98]"
            style={{background: !loading ? "linear-gradient(135deg, #B88A44, #9A7238)" : "#D4C9B8",
                    boxShadow: !loading ? "0 4px 16px rgba(184,138,68,0.4)" : "none"}}>
            {loading ? "Mise à jour..." : "Mettre à jour le mot de passe"}
          </button>
        </div>
      </div>
    </div>
  );
}
