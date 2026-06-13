"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { ArrowLeft, User, Phone, MapPin, Buildings, CheckCircle, ArrowRight } from "@phosphor-icons/react";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

const inputCls = "w-full border-2 border-sand-300 rounded-xl px-4 py-3 text-sm text-charcoal-800 outline-none bg-sand-100 transition-colors focus:border-bronze-500";

export default function ProviderRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "", password: "", displayName: "", phone: "",
    city: "Marrakech", description: ""
  });

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  async function handleSubmit() {
    if (!form.email || !form.password || !form.displayName || !form.phone) {
      return alert("Veuillez remplir tous les champs obligatoires");
    }
    setLoading(true);
    try {
      // 1. Créer compte Supabase
      const { data, error } = await supabase.auth.signUp({
        email: form.email.toLowerCase(),
        password: form.password,
        options: { data: { displayName: form.displayName, role: "provider" } }
      });
      if (error) { alert(error.message); setLoading(false); return; }

      // 2. Créer profil prestataire
      const res = await fetch("/api/provider/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email.toLowerCase(),
          displayName: form.displayName,
          phone: form.phone,
          city: form.city,
          description: form.description,
          supabaseId: data.user?.id
        })
      });
      if (res.ok) {
        setStep(3);
      } else {
        const err = await res.json();
        alert(err.error || "Erreur");
      }
    } catch(e) { alert("Erreur réseau"); }
    setLoading(false);
  }

  if (step === 3) return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10" style={{background:"#F6F1E8"}}>
      <div className="w-full max-w-sm text-center">
        <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
          style={{background:"linear-gradient(135deg, #7D8F69, #566547)", boxShadow:"0 8px 24px rgba(125,143,105,0.4)"}}>
          <CheckCircle size={40} weight="fill" className="text-white" />
        </div>
        <h1 className="font-display text-2xl font-bold text-charcoal-800 mb-2">Candidature envoyée !</h1>
        <p className="text-sm text-charcoal-500 mb-6 leading-relaxed">
          Notre équipe va examiner votre profil et vous contacter sur WhatsApp sous 24h.
        </p>
        <div className="bg-white rounded-2xl p-4 mb-6" style={{boxShadow:"0 2px 16px rgba(0,0,0,0.06)"}}>
          {["Candidature reçue","Vérification en cours","Contact WhatsApp sous 24h","Accès au dashboard"].map((s, i) => (
            <div key={i} className="flex items-center gap-3 py-2.5 border-b border-sand-100 last:border-0">
              <div className={"w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold " + (i === 0 ? "bg-sage-300 text-white" : "bg-sand-200 text-charcoal-400")}>
                {i === 0 ? "✓" : i+1}
              </div>
              <span className={"text-sm " + (i === 0 ? "font-semibold text-charcoal-800" : "text-charcoal-400")}>{s}</span>
            </div>
          ))}
        </div>
        <Link href="/"
          className="flex items-center justify-center gap-2 w-full py-4 text-white rounded-full text-sm font-bold no-underline"
          style={{background:"linear-gradient(135deg, #B88A44, #9A7238)", boxShadow:"0 6px 20px rgba(184,138,68,0.4)"}}>
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-10" style={{background:"#F6F1E8"}}>
      {/* HEADER */}
      <div className="sticky top-0 z-30 px-5 pt-4 pb-3"
        style={{background:"rgba(246,241,232,0.92)", backdropFilter:"blur(16px)", borderBottom:"1px solid rgba(184,138,68,0.12)"}}>
        <div className="flex items-center justify-between mb-3">
          <Link href="/"
            className="w-9 h-9 rounded-full bg-white flex items-center justify-center no-underline"
            style={{border:"1.5px solid #EADCC8"}}>
            <ArrowLeft size={15} weight="bold" className="text-charcoal-800" />
          </Link>
          <div className="text-center">
            <div className="font-display text-sm font-bold text-charcoal-800">Devenir prestataire</div>
            <div className="text-[10px] text-charcoal-400">Étape {step} sur 2</div>
          </div>
          <div className="w-9" />
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-sand-300 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500"
            style={{width: step === 1 ? "50%" : "100%", background:"linear-gradient(90deg, #B88A44, #9A7238)"}} />
        </div>
      </div>

      <div className="px-4 pt-5 max-w-sm mx-auto flex flex-col gap-4">

        {/* HERO CARD */}
        <div className="rounded-2xl px-5 py-6 text-center"
          style={{background:"linear-gradient(135deg, #7D8F69 0%, #B88A44 100%)"}}>
          <div className="font-display text-xl font-bold text-white mb-1">Rejoignez Laksor</div>
          <p className="text-white/80 text-xs leading-relaxed">
            Proposez vos expériences à des milliers de voyageurs. Inscription gratuite, commission transparente.
          </p>
          <div className="flex justify-center gap-4 mt-3">
            {["100% gratuit","Commission 20%","Support dédié"].map(t => (
              <div key={t} className="flex items-center gap-1 text-[10px] text-white/90 font-semibold">
                <div className="w-1 h-1 rounded-full bg-white" /> {t}
              </div>
            ))}
          </div>
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <div className="bg-white rounded-2xl p-4" style={{boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
              <div className="font-display text-sm font-semibold text-charcoal-800 mb-1">Informations personnelles</div>
              <div className="text-[11px] text-charcoal-400 mb-4">Pour créer votre compte prestataire</div>
              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-[10px] font-bold text-charcoal-500 uppercase tracking-widest mb-1.5 block">Nom complet *</label>
                  <input value={form.displayName} onChange={set("displayName")} placeholder="Ahmed Benali" className={inputCls} />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-charcoal-500 uppercase tracking-widest mb-1.5 block">Email *</label>
                  <input type="email" value={form.email} onChange={set("email")} placeholder="ahmed@example.com" className={inputCls} />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-charcoal-500 uppercase tracking-widest mb-1.5 block">Mot de passe *</label>
                  <input type="password" value={form.password} onChange={set("password")} placeholder="••••••••" className={inputCls} />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-charcoal-500 uppercase tracking-widest mb-1.5 block">WhatsApp *</label>
                  <input value={form.phone} onChange={set("phone")} placeholder="+212 6XX XXX XXX" className={inputCls} />
                </div>
              </div>
            </div>
            <button onClick={() => {
                if (!form.email || !form.password || !form.displayName || !form.phone) return alert("Champs obligatoires manquants");
                setStep(2);
              }}
              className="w-full py-4 rounded-full text-sm font-bold text-white flex items-center justify-center gap-2 active:scale-[0.98]"
              style={{background:"linear-gradient(135deg, #B88A44, #9A7238)", boxShadow:"0 6px 20px rgba(184,138,68,0.4)"}}>
              Continuer <ArrowRight size={16} weight="bold" />
            </button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <div className="bg-white rounded-2xl p-4" style={{boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
              <div className="font-display text-sm font-semibold text-charcoal-800 mb-1">Votre activité</div>
              <div className="text-[11px] text-charcoal-400 mb-4">Décrivez vos expériences et votre ville</div>
              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-[10px] font-bold text-charcoal-500 uppercase tracking-widest mb-1.5 block">Ville principale</label>
                  <select value={form.city} onChange={set("city")} className={inputCls}>
                    {["Marrakech","Fès","Essaouira","Chefchaouen","Agadir"].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-charcoal-500 uppercase tracking-widest mb-1.5 block">Description de votre activité</label>
                  <textarea value={form.description} onChange={set("description")} rows={4}
                    placeholder="Décrivez vos expériences, votre expertise, ce qui vous rend unique..."
                    className={inputCls + " resize-none"} />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4" style={{boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
              <div className="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest mb-3">En rejoignant Laksor vous acceptez</div>
              {["La charte qualité Laksor","La commission de 20% par réservation","Le processus de validation admin","Les CGV et conditions prestataires"].map((t, i) => (
                <div key={i} className="flex items-center gap-2 mb-2 last:mb-0">
                  <CheckCircle size={14} weight="fill" className="text-sage-300 flex-shrink-0" />
                  <span className="text-xs text-charcoal-600">{t}</span>
                </div>
              ))}
            </div>
            <button onClick={handleSubmit} disabled={loading}
              className="w-full py-4 rounded-full text-sm font-bold text-white flex items-center justify-center gap-2 active:scale-[0.98]"
              style={{background: !loading ? "linear-gradient(135deg, #B88A44, #9A7238)" : "#D4C9B8", boxShadow: !loading ? "0 6px 20px rgba(184,138,68,0.4)" : "none"}}>
              {loading ? "Envoi en cours..." : "Soumettre ma candidature ✦"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
