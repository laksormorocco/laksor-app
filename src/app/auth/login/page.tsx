"use client";
import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import Link from "next/link";
import { ArrowLeft, ArrowRight, EnvelopeSimple, Lock, Eye, EyeSlash, X } from "@phosphor-icons/react";
import LoginButton from "@/components/LoginButton";

export default function LoginPage() {
  const [step, setStep] = useState<"email"|"password"|"signup">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  async function checkEmail() {
    if (!email) return;
    setLoading(true);
    setError("");
    // Verifier si compte existe
    const { data } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: false } });
    setLoading(false);
    setStep("password");
  }

  async function handleLogin() {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      if (error.message.includes("Invalid")) setError("Mot de passe incorrect");
      else setError(error.message);
    } else {
      const res = await fetch("/api/auth/me?email=" + encodeURIComponent(email));
      const meData = await res.json();
      if (meData.role === "GUIDE") window.location.href = "/dashboard/guide?id=" + meData.guideId;
      else if (meData.role === "ADMIN") window.location.href = "/dashboard/admin";
        else {
            const { data: { session: s2 } } = await supabase.auth.getSession();
            if (s2) {
                const provRes = await fetch("/api/provider/me?supabaseId=" + s2.user.id);
                const provData = await provRes.json();
                if (provData.provider) window.location.href = "/provider/dashboard";
                else window.location.href = "/dashboard/tourist";
            } else window.location.href = "/dashboard/tourist";
        }
    }
    setLoading(false);
  }

  async function handleSignup() {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
    else setSuccess("Verifiez votre email pour confirmer votre compte !");
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-sand-200 flex flex-col max-w-lg mx-auto">
      <div className="flex justify-center pt-8 pb-4">
        <a href="/"><img src="/logo7.png" alt="Laksor" style={{ height: 52, width: "auto", objectFit: "contain", maxWidth: 180 }} /></a>
      </div>

      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-sand-300 bg-white">
        {step !== "email" ? (
          <button onClick={() => { setStep("email"); setError(""); setPassword(""); }}
            className="w-9 h-9 rounded-full border border-sand-200 flex items-center justify-center">
            <ArrowLeft size={16} weight="bold" className="text-charcoal-800" />
          </button>
        ) : (
          <Link href="/" className="w-9 h-9 rounded-full border border-sand-200 flex items-center justify-center no-underline">
            <X size={16} weight="bold" className="text-charcoal-800" />
          </Link>
        )}
        <span className="font-display text-sm font-bold text-charcoal-800">
          {step === "email" ? "Connexion ou inscription" : step === "password" ? "Connexion" : "Creer un compte"}
        </span>
        <div className="w-9" />
      </div>

      {/* CONTENT */}
      <div className="flex-1 px-4 pt-6 pb-10">

        {/* STEP EMAIL */}
        {step === "email" && (
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="font-display text-2xl font-bold text-charcoal-800 mb-1">Bienvenue</h2>
              <p className="text-sm text-charcoal-400">Connectez-vous ou creez un compte</p>
            </div>

            <div className="relative">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="Email"
                onKeyDown={e => e.key === "Enter" && checkEmail()}
                className="w-full border border-sand-300 rounded-2xl px-4 py-4 text-sm text-charcoal-800 outline-none focus:border-bronze-500 transition-colors" />
            </div>

            <button onClick={checkEmail} disabled={!email || loading}
              className="w-full text-white font-bold py-4 rounded-2xl text-sm flex items-center justify-center gap-2 disabled:opacity-40" style={{background:"linear-gradient(135deg, #B88A44, #9A7238)", boxShadow:"0 4px 14px rgba(184,138,68,0.3)"}}>
              {loading ? "..." : "Continuer"} {!loading && <ArrowRight size={14} weight="bold" />}
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-sand-200" />
              <span className="text-xs text-charcoal-400">ou</span>
              <div className="flex-1 h-px bg-sand-200" />
            </div>

            <LoginButton />

            <p className="text-center text-[11px] text-charcoal-300 leading-relaxed">
              En continuant, vous acceptez les <span className="underline">CGU</span> et la <span className="underline">Politique de confidentialite</span> de Laksor.
            </p>
          </div>
        )}

        {/* STEP PASSWORD */}
        {step === "password" && (
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="font-display text-2xl font-bold text-charcoal-800 mb-1">Bon retour !</h2>
              <p className="text-sm text-charcoal-400">{email}</p>
            </div>

            <div className="relative">
              <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Mot de passe"
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                className="w-full border border-sand-300 rounded-2xl px-4 py-4 pr-12 text-sm text-charcoal-800 outline-none focus:border-bronze-500 transition-colors" />
              <button onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal-400">
                {showPw ? <EyeSlash size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && <div className="text-xs text-red-500 bg-red-50 rounded-xl px-4 py-3">{error}</div>}

            <button onClick={handleLogin} disabled={!password || loading}
              className="w-full text-white font-bold py-4 rounded-2xl text-sm disabled:opacity-40" style={{background:"linear-gradient(135deg, #B88A44, #9A7238)", boxShadow:"0 4px 14px rgba(184,138,68,0.3)"}}>
              {loading ? "..." : "Se connecter"}
            </button>

            <button onClick={() => setStep("signup")}
              className="text-sm text-charcoal-600 underline text-center">
              Pas encore de compte ? S inscrire
            </button>
            <button onClick={async () => {
              if (!email) return setError("Entrez votre email d abord");
              const {error} = await supabase.auth.resetPasswordForEmail(email, {redirectTo: window.location.origin + "/auth/callback"});
              if (error) setError(error.message);
              else setSuccess("Email envoye ! Verifiez votre boite mail.");
            }} className="text-xs text-charcoal-400 underline text-center block w-full">
              Mot de passe oublie ?
            </button>
          </div>
        )}

        {/* STEP SIGNUP */}
        {step === "signup" && (
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="font-display text-2xl font-bold text-charcoal-800 mb-1">Creer un compte</h2>
              <p className="text-sm text-charcoal-400">{email}</p>
            </div>

            <div className="relative">
              <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Choisir un mot de passe"
                className="w-full border border-sand-300 rounded-2xl px-4 py-4 pr-12 text-sm text-charcoal-800 outline-none focus:border-bronze-500 transition-colors" />
              <button onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal-400">
                {showPw ? <EyeSlash size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && <div className="text-xs text-red-500 bg-red-50 rounded-xl px-4 py-3">{error}</div>}
            {success && <div className="text-xs text-sage-300 bg-sage-300/10 rounded-xl px-4 py-3 text-center">{success}</div>}

            <button onClick={handleSignup} disabled={!password || loading || !!success}
              className="w-full bg-bronze-500 text-white font-bold py-4 rounded-2xl text-sm disabled:opacity-40" style={{boxShadow:"0 4px 14px rgba(184,138,68,0.3)"}}>
              {loading ? "..." : "Creer mon compte"}
            </button>

            <div className="bg-sand-100 rounded-2xl p-4 border border-sand-300">
              <p className="text-[11px] text-charcoal-400 leading-relaxed">Vous etes guide ou chauffeur ?</p>
              <Link href="/auth/register" className="text-xs font-bold text-bronze-500 no-underline">Candidater comme guide →</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
