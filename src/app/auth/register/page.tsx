"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle, User, Phone, MapPin, BookOpen, Translate, Star, Money } from "@phosphor-icons/react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

const CITIES = ["Marrakech","Fès","Casablanca","Rabat","Chefchaouen","Essaouira","Agadir","Tanger","Meknès","Ouarzazate"];

export default function RegisterGuidePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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
    if (res.ok) router.push("/auth/register/success");
    else alert("Erreur, réessaie.");
    setSubmitting(false);
  }

  const Field = ({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) => (
    <div className="mb-4">
      <label className="flex items-center gap-1.5 text-xs font-bold text-charcoal-600 uppercase tracking-wider mb-2">
        {icon}{label}
      </label>
      {children}
    </div>
  );

  const inputCls = "w-full border border-sand-300 rounded-xl px-4 py-3 text-sm text-charcoal-800 bg-sand-100 outline-none focus:border-bronze-500 transition-colors";

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-sand-200">
      <div className="text-4xl animate-pulse">⏳</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-sand-200 pb-10">

      {/* ── HEADER ── */}
      <div className="sticky top-0 z-30 bg-white border-b border-sand-300 h-14 flex items-center px-4 gap-3">
        <Link href="/" className="w-9 h-9 rounded-full border border-sand-300 flex items-center justify-center text-charcoal-700 no-underline">
          <ArrowLeft size={16} weight="bold" />
        </Link>
        <span className="font-display text-base font-semibold text-charcoal-800 flex-1 text-center">Devenir Guide</span>
        <div className="w-9" />
      </div>

      {/* ── HERO ── */}
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

      {/* ── PROGRESS ── */}
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

        {/* ── PAS CONNECTÉ ── */}
        {!user ? (
          <div className="bg-white rounded-2xl p-6 border border-sand-300 text-center">
            <div className="w-16 h-16 bg-sand-200 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">🔐</div>
            <h2 className="font-display text-lg font-semibold text-charcoal-800 mb-2">Connectez-vous d&apos;abord</h2>
            <p className="text-sm text-charcoal-400 mb-6 leading-relaxed">Utilisez votre compte Google pour créer votre profil guide</p>
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
            {/* Banner connecté */}
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
              <span className="bg-sage-300 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">✓ Google</span>
            </div>

            {/* Infos perso */}
            <div className="bg-white rounded-2xl border border-sand-300 p-4 mb-3">
              <div className="text-[10px] font-bold text-bronze-500 uppercase tracking-wider mb-4">Informations personnelles</div>
              <Field label="Nom complet *" icon={<User size={11} className="text-charcoal-400" />}>
                <input value={form.displayName} onChange={e=>setForm({...form,displayName:e.target.value})}
                  placeholder="Mohammed El Fassi" className={inputCls} />
              </Field>
              <Field label="WhatsApp *" icon={<Phone size={11} className="text-charcoal-400" />}>
                <input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}
                  placeholder="+212 6XX XXX XXX" className={inputCls} />
              </Field>
              <Field label="Ville principale *" icon={<MapPin size={11} className="text-charcoal-400" />}>
                <select value={form.city} onChange={e=>setForm({...form,city:e.target.value})} className={inputCls}>
                  <option value="">Choisir une ville</option>
                  {CITIES.map(c=><option key={c}>{c}</option>)}
                </select>
              </Field>
            </div>

            {/* Expérience */}
            <div className="bg-white rounded-2xl border border-sand-300 p-4 mb-3">
              <div className="text-[10px] font-bold text-bronze-500 uppercase tracking-wider mb-4">Expérience & Expertise</div>
              <Field label="Bio *" icon={<BookOpen size={11} className="text-charcoal-400" />}>
                <textarea value={form.bio} onChange={e=>setForm({...form,bio:e.target.value})}
                  rows={3} placeholder="Décrivez votre expérience, votre passion pour votre ville..."
                  className={inputCls + " resize-none"} />
              </Field>
              <Field label="Langues *" icon={<Translate size={11} className="text-charcoal-400" />}>
                <input value={form.languages} onChange={e=>setForm({...form,languages:e.target.value})}
                  placeholder="Français, Anglais, Arabe" className={inputCls} />
                <div className="text-[10px] text-charcoal-300 mt-1">Séparées par virgule</div>
              </Field>
              <Field label="Spécialités *" icon={<Star size={11} className="text-charcoal-400" />}>
                <input value={form.specialties} onChange={e=>setForm({...form,specialties:e.target.value})}
                  placeholder="Histoire, Gastronomie, Architecture" className={inputCls} />
                <div className="text-[10px] text-charcoal-300 mt-1">Séparées par virgule</div>
              </Field>
            </div>

            {/* Tarifs */}
            <div className="bg-white rounded-2xl border border-sand-300 p-4 mb-4">
              <div className="text-[10px] font-bold text-bronze-500 uppercase tracking-wider mb-3">Tarifs</div>
              <div className="bg-bronze-50 border border-bronze-500 rounded-xl p-3 mb-4 flex items-center gap-2">
                <Money size={16} className="text-bronze-500 flex-shrink-0" weight="duotone" />
                <p className="text-xs text-bronze-500 font-medium">Conseillés : ½ journée 500 MAD · Journée 950 MAD</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="½ Journée (MAD)" icon={null}>
                  <input type="number" value={form.halfDayPrice} onChange={e=>setForm({...form,halfDayPrice:e.target.value})}
                    className={inputCls + " font-bold text-base"} />
                </Field>
                <Field label="Journée (MAD)" icon={null}>
                  <input type="number" value={form.fullDayPrice} onChange={e=>setForm({...form,fullDayPrice:e.target.value})}
                    className={inputCls + " font-bold text-base"} />
                </Field>
              </div>
            </div>

            {/* Submit */}
            <button onClick={handleSubmit} disabled={submitting}
              className={`w-full py-4 rounded-2xl text-base font-bold text-white transition-all mb-3
                ${submitting ? "bg-sand-300 cursor-not-allowed" : "bg-bronze-500 hover:bg-bronze-600 shadow-md"}`}>
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
