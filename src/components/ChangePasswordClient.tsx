"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { ArrowLeft, Lock, CheckCircle } from "@phosphor-icons/react";

export default function ChangePasswordClient({ accessToken }: { accessToken: string }) {
  const router = useRouter();
  const [pwd, setPwd] = useState("");
  const [pwdConfirm, setPwdConfirm] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    { global: { headers: { Authorization: "Bearer " + accessToken } } }
  );

  async function handleSubmit() {
    setError("");
    if (pwd !== pwdConfirm) { setError("Les mots de passe ne correspondent pas"); return; }
    if (pwd.length < 6) { setError("Minimum 6 caractères"); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: pwd });
    if (error) { setError(error.message); setLoading(false); return; }
    setDone(true);
    setTimeout(() => router.push("/provider/dashboard"), 2500);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{background:"#F6F1E8"}}>
      <div className="w-full max-w-sm">
        <div className="sticky top-0 z-10 flex items-center gap-3 mb-6">
          <button onClick={() => router.back()}
            className="w-9 h-9 rounded-full bg-white flex items-center justify-center"
            style={{border:"1.5px solid #EADCC8"}}>
            <ArrowLeft size={15} weight="bold" className="text-charcoal-800" />
          </button>
          <span className="font-display text-sm font-bold text-charcoal-800">Changer le mot de passe</span>
        </div>

        {done ? (
          <div className="text-center py-8">
            <CheckCircle size={56} weight="fill" className="text-sage-300 mx-auto mb-3" />
            <div className="font-display text-lg font-bold text-charcoal-800">Mot de passe mis à jour !</div>
            <div className="text-sm text-charcoal-400 mt-1">Redirection en cours...</div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-5 flex flex-col gap-4" style={{boxShadow:"0 2px 16px rgba(0,0,0,0.06)"}}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:"rgba(184,138,68,0.1)"}}>
                <Lock size={20} weight="duotone" className="text-bronze-500" />
              </div>
              <div>
                <div className="font-display text-sm font-bold text-charcoal-800">Nouveau mot de passe</div>
                <div className="text-[11px] text-charcoal-400">Minimum 6 caractères</div>
              </div>
            </div>
            <input type="password" value={pwd} onChange={e => setPwd(e.target.value)}
              placeholder="Nouveau mot de passe"
              className="w-full border-2 border-sand-300 rounded-xl px-4 py-3 text-sm outline-none bg-sand-100 focus:border-bronze-500 transition-colors" />
            <input type="password" value={pwdConfirm} onChange={e => setPwdConfirm(e.target.value)}
              placeholder="Confirmer le mot de passe"
              className="w-full border-2 border-sand-300 rounded-xl px-4 py-3 text-sm outline-none bg-sand-100 focus:border-bronze-500 transition-colors" />
            {error && <div className="text-xs text-red-400 font-semibold px-1">{error}</div>}
            <button onClick={handleSubmit} disabled={loading}
              className="w-full py-4 rounded-full text-sm font-bold text-white active:scale-[0.98] transition-all"
              style={{background: !loading ? "linear-gradient(135deg, #B88A44, #9A7238)" : "#D4C9B8",
                      boxShadow: !loading ? "0 4px 16px rgba(184,138,68,0.4)" : "none"}}>
              {loading ? "Mise à jour..." : "Mettre à jour le mot de passe"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
