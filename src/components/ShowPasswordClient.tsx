"use client";
import { useState } from "react";
import { Eye, EyeSlash, Lock, ArrowLeft } from "@phosphor-icons/react";

export default function ShowPasswordClient({ action, success, error }: { action: any; success: boolean; error: boolean }) {
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{background:"#F6F1E8"}}>
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-5">
          <a href="/provider/dashboard"
            className="w-9 h-9 rounded-full bg-white flex items-center justify-center no-underline"
            style={{border:"1.5px solid #EADCC8"}}>
            <ArrowLeft size={15} weight="bold" className="text-charcoal-800" />
          </a>
          <span className="font-display text-sm font-bold text-charcoal-800">Changer le mot de passe</span>
        </div>

        <div className="bg-white rounded-2xl p-5 flex flex-col gap-4" style={{boxShadow:"0 2px 16px rgba(0,0,0,0.06)"}}>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:"rgba(184,138,68,0.1)"}}>
              <Lock size={20} weight="duotone" className="text-bronze-500" />
            </div>
            <div>
              <div className="font-display text-sm font-bold text-charcoal-800">Nouveau mot de passe</div>
              <div className="text-[11px] text-charcoal-400">Minimum 6 caractères</div>
            </div>
          </div>

          {success && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-full text-sm font-semibold text-white"
              style={{background:"linear-gradient(135deg, #7D8F69, #566547)"}}>
              ✅ Mot de passe mis à jour avec succès !
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-full text-sm font-semibold"
              style={{background:"rgba(239,68,68,0.1)", color:"#ef4444"}}>
              ❌ Erreur — vérifiez vos mots de passe (min. 6 caractères)
            </div>
          )}

          {!success && (
            <form action={action} className="flex flex-col gap-3">
              <div className="relative">
                <input type={showPwd ? "text" : "password"} name="password"
                  placeholder="Nouveau mot de passe" required minLength={6}
                  className="w-full border-2 border-sand-300 rounded-xl px-4 py-3 pr-12 text-sm outline-none bg-sand-100 focus:border-bronze-500 transition-colors" />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400">
                  {showPwd ? <EyeSlash size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="relative">
                <input type={showConfirm ? "text" : "password"} name="confirm"
                  placeholder="Confirmer le mot de passe" required minLength={6}
                  className="w-full border-2 border-sand-300 rounded-xl px-4 py-3 pr-12 text-sm outline-none bg-sand-100 focus:border-bronze-500 transition-colors" />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400">
                  {showConfirm ? <EyeSlash size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <button type="submit"
                className="w-full py-4 rounded-full text-sm font-bold text-white active:scale-[0.98]"
                style={{background:"linear-gradient(135deg, #B88A44, #9A7238)", boxShadow:"0 4px 16px rgba(184,138,68,0.4)"}}>
                Mettre à jour le mot de passe
              </button>
            </form>
          )}

          {success && (
            <a href="/provider/dashboard"
              className="flex items-center justify-center w-full py-4 rounded-full text-sm font-bold text-white no-underline"
              style={{background:"linear-gradient(135deg, #B88A44, #9A7238)"}}>
              Retour au dashboard
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
