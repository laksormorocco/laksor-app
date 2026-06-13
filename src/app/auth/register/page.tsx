"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle, User, Phone, MapPin, BookOpen, Translate, Star, Money, Compass, Buildings, ArrowRight } from "@phosphor-icons/react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

const CITIES = ["Marrakech","Fès","Casablanca","Rabat","Chefchaouen","Essaouira","Agadir","Tanger","Meknès","Ouarzazate"];

function Field({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label className="flex items-center gap-1.5 text-xs font-bold text-charcoal-600 uppercase tracking-wider mb-2">
        {icon}{label}
      </label>
      {children}
    </div>
  );
}

export default function RegisterGuidePage() {
  const router = useRouter();
  const [role, setRole] = useState<"guide"|"provider"|null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regPasswordConfirm, setRegPasswordConfirm] = useState("");
  const [regName, setRegName] = useState("");
  const [regLoading, setRegLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [form, setForm] = useState({
    displayName:"", phone:"", city:"", bio:"",
    languages:"", specialties:"", halfDayPrice:"500", fullDayPrice:"950"
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      if (session?.user?.user_metadata?.full_name) {
        setForm(f => ({ ...f, displayName: session.user.user_metadata.full_name }));
      }
      setLoading(false);
    });
  }, []);

  async function signUpWithEmail() {
    setPasswordError("");
    if (!regEmail || !regPassword || !regName) return alert("Remplissez tous les champs");
    if (regPassword !== regPasswordConfirm) { setPasswordError("Les mots de passe ne correspondent pas"); return; }
    if (regPassword.length < 6) { setPasswordError("Minimum 6 caractères"); return; }
    setRegLoading(true);
    const { data, error } = await supabase.auth.signUp({ email: regEmail, password: regPassword, options: { data: { full_name: regName } } });
    if (error) { if (error.message.includes("already registered")) alert("Cet email est déjà utilisé. Connectez-vous sur /auth/login."); else alert(error.message); }
    else if (data.user) { setUser(data.user); setForm(f => ({ ...f, displayName: regName })); }
    setRegLoading(false);
  }

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: "https://laksor.vercel.app/auth/register" }
    });
  }

  async function handleSubmit() {
    if (!user) return;
    setSubmitting(true);
    const res = await fetch("/api/guide/register", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        ...form, supabaseId: user.id, email: user.email,
        halfDayPrice: parseFloat(form.halfDayPrice),
        fullDayPrice: parseFloat(form.fullDayPrice),
        languages: form.languages.split(",").map((l:string)=>l.trim()).filter(Boolean),
        specialties: form.specialties.split(",").map((s:string)=>s.trim()).filter(Boolean)
      })
    });
    const result = await res.json();
    if (res.ok) router.push("/auth/register/success");
    else if (result.error && result.error.includes("deja un profil")) {
      const me = await fetch("/api/auth/me?supabaseId=" + user.id);
      const meData = await me.json();
      if (meData.guideId) router.push("/dashboard/guide?id=" + meData.guideId);
      else router.push("/dashboard");
    } else alert("Erreur: " + result.error);
    setSubmitting(false);
  }

  const inputCls = "w-full border border-sand-300 rounded-xl px-4 py-3 text-sm text-charcoal-800 bg-sand-100 outline-none focus:border-bronze-500 transition-colors";

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{background:"#F6F1E8"}}>
      <div className="w-10 h-10 border-4 border-bronze-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  // ECRAN CHOIX ROLE
  if (!role) return (
    <div className="min-h-screen pb-10" style={{background:"#F6F1E8"}}>
      <div className="sticky top-0 z-30 flex items-center justify-between px-4 py-3"
        style={{background:"rgba(246,241,232,0.92)", backdropFilter:"blur(16px)", borderBottom:"1px solid rgba(184,138,68,0.12)"}}>
        <Link href="/" className="w-9 h-9 rounded-full bg-white flex items-center justify-center no-underline"
          style={{border:"1.5px solid #EADCC8"}}>
          <ArrowLeft size={15} weight="bold" className="text-charcoal-800" />
        </Link>
        <span className="font-display text-sm font-bold text-charcoal-800">Rejoindre Laksor</span>
        <div className="w-9" />
      </div>

      <div className="px-4 pt-8 max-w-sm mx-auto">
        {/* HERO */}
        <div className="rounded-3xl px-6 pt-8 pb-7 text-center mb-8"
          style={{background:"linear-gradient(135deg, #7D8F69 0%, #B88A44 100%)"}}>
          <div className="font-display text-2xl font-bold text-white mb-2">Bienvenue chez Laksor</div>
          <p className="text-sm" style={{color:"rgba(255,255,255,0.8)"}}>
            Choisissez votre rôle pour commencer
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {/* GUIDE */}
          <button onClick={() => setRole("guide")}
            className="bg-white rounded-2xl p-5 flex items-center gap-4 text-left active:scale-[0.98] transition-all"
            style={{boxShadow:"0 2px 16px rgba(0,0,0,0.08)", border:"2px solid transparent"}}
            onMouseEnter={e => (e.currentTarget.style.border="2px solid #B88A44")}
            onMouseLeave={e => (e.currentTarget.style.border="2px solid transparent")}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{background:"linear-gradient(135deg, #B88A44, #9A7238)"}}>
              <Compass size={28} weight="duotone" className="text-white" />
            </div>
            <div className="flex-1">
              <div className="font-display text-base font-bold text-charcoal-800 mb-1">Je suis Guide</div>
              <div className="text-xs text-charcoal-500 leading-relaxed">
                Guidez des touristes dans votre ville. Commission transparente, validation Ministère du Tourisme.
              </div>
            </div>
            <ArrowRight size={18} className="text-charcoal-400 flex-shrink-0" />
          </button>

          {/* PRESTATAIRE */}
          <button onClick={() => router.push("/provider/register")}
            className="bg-white rounded-2xl p-5 flex items-center gap-4 text-left active:scale-[0.98] transition-all"
            style={{boxShadow:"0 2px 16px rgba(0,0,0,0.08)", border:"2px solid transparent"}}
            onMouseEnter={e => (e.currentTarget.style.border="2px solid #7D8F69")}
            onMouseLeave={e => (e.currentTarget.style.border="2px solid transparent")}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{background:"linear-gradient(135deg, #7D8F69, #566547)"}}>
              <Buildings size={28} weight="duotone" className="text-white" />
            </div>
            <div className="flex-1">
              <div className="font-display text-base font-bold text-charcoal-800 mb-1">Je suis Prestataire</div>
              <div className="text-xs text-charcoal-500 leading-relaxed">
                Proposez vos expériences (quad, buggy, karting...). Inscription gratuite, validation sous 24h.
              </div>
            </div>
            <ArrowRight size={18} className="text-charcoal-400 flex-shrink-0" />
          </button>
        </div>

        <div className="text-center mt-6">
          <Link href="/auth/login" className="text-xs text-charcoal-400 no-underline">
            Déjà inscrit ? <span style={{color:"#B88A44"}} className="font-semibold">Se connecter</span>
          </Link>
        </div>
      </div>
    </div>
  );

  // FLOW GUIDE
  return (
    <div className="min-h-screen pb-10" style={{background:"#F6F1E8"}}>
      <div className="sticky top-0 z-30 bg-white border-b border-sand-300 h-14 flex items-center px-4 gap-3">
        <button onClick={() => setRole(null)} className="w-9 h-9 rounded-full border border-sand-300 flex items-center justify-center text-charcoal-700">
          <ArrowLeft size={16} weight="bold" />
        </button>
        <span className="font-display text-base font-semibold text-charcoal-800 flex-1 text-center">Devenir Guide</span>
        <div className="w-9" />
      </div>

      <div className="relative overflow-hidden">
        <div className="absolute inset-0"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&q=80)", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7))" }} />
        <div className="relative z-10 text-center px-6 py-10">
          <div className="w-14 h-14 bg-bronze-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl" style={{ boxShadow: "0 8px 24px rgba(184,138,68,0.4)" }}>🧭</div>
          <h1 className="font-display text-2xl font-semibold text-white mb-2">Rejoignez Laksor</h1>
          <p className="text-sm text-white/70">Partagez votre passion avec des voyageurs du monde entier</p>
        </div>
      </div>

      <div className="bg-white border-b border-sand-300 px-4 py-3">
        <div className="flex items-center max-w-xs mx-auto">
          {[["1","Connexion", true],["2","Profil", !!user],["3","Validation", false]].map(([num, label, done], i) => (
            <div key={num as string} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all
                  ${done ? "bg-bronze-500 text-white" : "bg-sand-300 text-charcoal-400"}`}>
                  {done && i < 1 ? <CheckCircle size={14} weight="fill" /> : num as string}
                </div>
                <span className={`text-[10px] font-bold ${done ? "text-bronze-500" : "text-charcoal-400"}`}>{label as string}</span>
              </div>
              {i < 2 && <div className={`flex-1 h-0.5 mx-2 mb-4 ${done ? "bg-bronze-500" : "bg-sand-300"}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4 max-w-lg mx-auto">
        {!user ? (
          <div className="bg-white rounded-2xl p-6 border border-sand-300">
            <div className="w-16 h-16 bg-sand-200 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">🔐</div>
            <h2 className="font-display text-lg font-semibold text-charcoal-800 mb-2 text-center">Créez votre compte</h2>
            <p className="text-sm text-charcoal-400 mb-5 leading-relaxed text-center">Renseignez vos informations pour continuer</p>
            <div className="flex flex-col gap-3 mb-5">
              <input type="text" value={regName} onChange={e => setRegName(e.target.value)} placeholder="Votre nom complet" className="w-full border border-sand-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-bronze-500 bg-sand-100" />
              <input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} placeholder="Email" className="w-full border border-sand-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-bronze-500 bg-sand-100" />
              <input type="password" value={regPassword} onChange={e => setRegPassword(e.target.value)} placeholder="Mot de passe (min. 6 caractères)" className="w-full border border-sand-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-bronze-500 bg-sand-100" />
              <input type="password" value={regPasswordConfirm} onChange={e => setRegPasswordConfirm(e.target.value)} placeholder="Confirmer le mot de passe" className="w-full border border-sand-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-bronze-500 bg-sand-100" />
              {passwordError && <div className="text-xs text-red-400 font-semibold px-1">{passwordError}</div>}
              <button onClick={signUpWithEmail} disabled={!regEmail || !regPassword || !regName || regLoading}
                className="w-full text-white font-bold py-3.5 rounded-full text-sm disabled:opacity-40"
                style={{background:"linear-gradient(135deg, #B88A44, #9A7238)"}}>
                {regLoading ? "..." : "Continuer avec email"}
              </button>
            </div>
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-sand-200" />
              <span className="text-xs text-charcoal-400">ou</span>
              <div className="flex-1 h-px bg-sand-200" />
            </div>
            <button onClick={signInWithGoogle}
              className="w-full flex items-center justify-center gap-3 bg-white border-2 border-sand-300 rounded-full px-6 py-3.5 text-sm font-bold text-charcoal-800 hover:border-bronze-500 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuer avec Google
            </button>
          </div>
        ) : (
          <>
            <div className="bg-sage-50 border border-sage-300 rounded-2xl p-3 flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full overflow-hidden bg-sand-300 flex-shrink-0">
                {user.user_metadata?.avatar_url
                  ? <img src={user.user_metadata.avatar_url} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center font-bold text-charcoal-500">{user.email?.[0]?.toUpperCase()}</div>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-sage-300">{user.user_metadata?.full_name || user.email}</div>
                <div className="text-xs text-charcoal-400 truncate">{user.email}</div>
              </div>
              <span className="bg-sage-300 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">✓ Connecté</span>
            </div>

            <div className="bg-white rounded-2xl border border-sand-300 p-4 mb-3">
              <div className="text-[10px] font-bold text-bronze-500 uppercase tracking-wider mb-4">Informations personnelles</div>
              <Field label="Nom complet *" icon={<User size={11} className="text-charcoal-400" />}>
                <input value={form.displayName} onChange={e=>setForm({...form,displayName:e.target.value})} placeholder="Mohammed El Fassi" className={inputCls} />
              </Field>
              <Field label="WhatsApp *" icon={<Phone size={11} className="text-charcoal-400" />}>
                <input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="+212 6XX XXX XXX" className={inputCls} />
              </Field>
              <Field label="Ville principale *" icon={<MapPin size={11} className="text-charcoal-400" />}>
                <select value={form.city} onChange={e=>setForm({...form,city:e.target.value})} className={inputCls}>
                  <option value="">Choisir une ville</option>
                  {CITIES.map(c=><option key={c}>{c}</option>)}
                </select>
              </Field>
            </div>

            <div className="bg-white rounded-2xl border border-sand-300 p-4 mb-3">
              <div className="text-[10px] font-bold text-bronze-500 uppercase tracking-wider mb-4">Expérience & Expertise</div>
              <Field label="Bio *" icon={<BookOpen size={11} className="text-charcoal-400" />}>
                <textarea value={form.bio} onChange={e=>setForm({...form,bio:e.target.value})}
                  rows={3} placeholder="Décrivez votre expérience, votre passion pour votre ville..." className={inputCls + " resize-none"} />
              </Field>
              <Field label="Langues *" icon={<Translate size={11} className="text-charcoal-400" />}>
                <input value={form.languages} onChange={e=>setForm({...form,languages:e.target.value})} placeholder="Français, Anglais, Arabe" className={inputCls} />
                <div className="text-[10px] text-charcoal-300 mt-1">Séparées par virgule</div>
              </Field>
              <Field label="Spécialités *" icon={<Star size={11} className="text-charcoal-400" />}>
                <input value={form.specialties} onChange={e=>setForm({...form,specialties:e.target.value})} placeholder="Histoire, Gastronomie, Architecture" className={inputCls} />
                <div className="text-[10px] text-charcoal-300 mt-1">Séparées par virgule</div>
              </Field>
            </div>

            <div className="bg-white rounded-2xl border border-sand-300 p-4 mb-4">
              <div className="text-[10px] font-bold text-bronze-500 uppercase tracking-wider mb-3">Tarifs</div>
              <div className="bg-bronze-50 border border-bronze-500 rounded-xl p-3 mb-4 flex items-center gap-2">
                <Money size={16} className="text-bronze-500 flex-shrink-0" weight="duotone" />
                <p className="text-xs text-bronze-500 font-medium">Conseillés : ½ journée 500 MAD · Journée 950 MAD</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="½ Journée (MAD)" icon={null}>
                  <input type="number" value={form.halfDayPrice} onChange={e=>setForm({...form,halfDayPrice:e.target.value})} className={inputCls + " font-bold text-base"} />
                </Field>
                <Field label="Journée (MAD)" icon={null}>
                  <input type="number" value={form.fullDayPrice} onChange={e=>setForm({...form,fullDayPrice:e.target.value})} className={inputCls + " font-bold text-base"} />
                </Field>
              </div>
            </div>

            <button onClick={handleSubmit} disabled={submitting}
              className={"w-full py-4 rounded-2xl text-base font-bold text-white transition-all mb-3 " + (submitting ? "bg-sand-300 cursor-not-allowed" : "bg-bronze-500 shadow-md")}
              style={!submitting ? {background:"linear-gradient(135deg, #B88A44, #9A7238)"} : {}}>
              {submitting ? "Envoi en cours..." : "Soumettre ma candidature →"}
            </button>
            <p className="text-center text-xs text-charcoal-300 leading-relaxed">
              En soumettant, vous acceptez nos CGU<br/>
              Validation par notre équipe sous 24h
            </p>
          </>
        )}
      </div>
    </div>
  );
}
