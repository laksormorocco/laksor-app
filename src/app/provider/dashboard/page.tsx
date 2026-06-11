"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus, Star, CalendarBlank, ChartBar, SealCheck,
  SignOut, PencilSimple, Eye, Clock, CheckCircle,
  XCircle, Warning, ArrowRight, Users, CurrencyDollar
} from "@phosphor-icons/react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string; bg: string; icon: any }> = {
    APPROVED: { label: "Approuvée", color: "#7D8F69", bg: "rgba(125,143,105,0.12)", icon: CheckCircle },
    PENDING:  { label: "En attente", color: "#B88A44", bg: "rgba(184,138,68,0.12)", icon: Clock },
    REJECTED: { label: "Refusée",   color: "#ef4444", bg: "rgba(239,68,68,0.1)",   icon: XCircle },
  };
  const s = map[status] || map.PENDING;
  return (
    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
      style={{background: s.bg, color: s.color}}>
      <s.icon size={10} weight="fill" /> {s.label}
    </span>
  );
}

export default function ProviderDashboard() {
  const router = useRouter();
  const [provider, setProvider] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"experiences"|"stats"|"profile">("experiences");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push("/auth/login"); return; }
      fetch("/api/provider/me?supabaseId=" + session.user.id)
        .then(r => r.json())
        .then(d => {
          if (d.provider) { setProvider(d.provider); setLoading(false); }
          else { router.push("/provider/register"); }
        });
    });
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{background:"#F6F1E8"}}>
      <div className="w-10 h-10 border-4 border-bronze-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const experiences = provider?.experiences || [];
  const approved = experiences.filter((e: any) => e.status === "APPROVED").length;
  const pending = experiences.filter((e: any) => e.status === "PENDING").length;

  return (
    <div className="min-h-screen pb-24" style={{background:"#F6F1E8"}}>

      {/* HEADER */}
      <div className="sticky top-0 z-30 px-5 py-3"
        style={{background:"rgba(246,241,232,0.92)", backdropFilter:"blur(16px)", borderBottom:"1px solid rgba(184,138,68,0.12)"}}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl overflow-hidden flex-shrink-0"
              style={{background:"rgba(184,138,68,0.12)", border:"2px solid #EADCC8"}}>
              {provider.avatar
                ? <img src={provider.avatar} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center font-display text-lg font-bold" style={{color:"#B88A44"}}>{provider.displayName?.[0]}</div>
              }
            </div>
            <div>
              <div className="font-display text-sm font-bold text-charcoal-800">{provider.displayName}</div>
              <div className="flex items-center gap-1">
                {provider.status === "APPROVED"
                  ? <><SealCheck size={11} weight="fill" className="text-sage-300" /><span className="text-[10px] text-sage-300 font-semibold">Prestataire vérifié</span></>
                  : <><Warning size={11} className="text-amber-500" /><span className="text-[10px] text-amber-500 font-semibold">En cours de validation</span></>
                }
              </div>
            </div>
          </div>
          <button onClick={handleSignOut}
            className="w-9 h-9 rounded-full bg-white flex items-center justify-center active:scale-95 transition-all"
            style={{border:"1.5px solid #EADCC8"}}>
            <SignOut size={15} className="text-charcoal-500" />
          </button>
        </div>
      </div>

      <div className="px-4 pt-4 max-w-lg mx-auto">

        {/* PROVIDER NOT APPROVED WARNING */}
        {provider.status === "PENDING" && (
          <div className="rounded-2xl p-4 mb-4 flex items-start gap-3"
            style={{background:"rgba(184,138,68,0.08)", border:"1px solid rgba(184,138,68,0.25)"}}>
            <Clock size={18} weight="duotone" className="text-bronze-500 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-bold text-bronze-500 mb-0.5">Candidature en cours d'examen</div>
              <div className="text-[11px] text-charcoal-500 leading-relaxed">
                Notre équipe examine votre profil. Vous recevrez une réponse sur WhatsApp sous 24h.
                Vous pouvez déjà préparer vos expériences.
              </div>
            </div>
          </div>
        )}

        {/* STATS CARDS */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: "Expériences", value: experiences.length, icon: Star, color: "#B88A44" },
            { label: "Approuvées", value: approved, icon: CheckCircle, color: "#7D8F69" },
            { label: "En attente", value: pending, icon: Clock, color: "#F59E0B" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-3 text-center"
              style={{boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center mx-auto mb-2"
                style={{background: s.color + "15"}}>
                <s.icon size={16} weight="duotone" style={{color: s.color}} />
              </div>
              <div className="font-display text-xl font-bold text-charcoal-800">{s.value}</div>
              <div className="text-[10px] text-charcoal-400">{s.label}</div>
            </div>
          ))}
        </div>

        {/* TABS */}
        <div className="flex p-1 rounded-2xl mb-4" style={{background:"rgba(184,138,68,0.08)"}}>
          {[
            {id:"experiences", label:"Mes expériences"},
            {id:"profile", label:"Mon profil"},
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
              className={"flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all " + (activeTab === tab.id ? "text-white" : "text-charcoal-500")}
              style={activeTab === tab.id ? {background:"linear-gradient(135deg, #B88A44, #9A7238)", boxShadow:"0 3px 8px rgba(184,138,68,0.3)"} : {}}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB EXPERIENCES */}
        {activeTab === "experiences" && (
          <>
            <Link href="/provider/experiences/create"
              className="flex items-center justify-center gap-2 w-full py-4 text-white rounded-full text-sm font-bold no-underline mb-4 active:scale-[0.98] transition-all"
              style={{background:"linear-gradient(135deg, #B88A44, #9A7238)", boxShadow:"0 6px 20px rgba(184,138,68,0.4)"}}>
              <Plus size={16} weight="bold" /> Créer une expérience
            </Link>

            {experiences.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center" style={{boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
                <div className="text-4xl mb-3">🎭</div>
                <div className="font-display text-sm font-bold text-charcoal-800 mb-1">Aucune expérience</div>
                <div className="text-xs text-charcoal-400">Créez votre première expérience pour commencer à recevoir des réservations</div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {experiences.map((exp: any) => (
                  <div key={exp.id} className="bg-white rounded-2xl overflow-hidden"
                    style={{boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
                    {exp.photos?.[0] && (
                      <div className="h-32 overflow-hidden">
                        <img src={exp.photos[0]} alt={exp.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="font-display text-sm font-bold text-charcoal-800 truncate">{exp.title}</div>
                          <div className="text-[11px] text-charcoal-400 mt-0.5">{exp.city} · {exp.duration}</div>
                        </div>
                        <StatusBadge status={exp.status} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="font-display text-base font-bold" style={{color:"#B88A44"}}>{exp.price} MAD/pers.</div>
                        <Link href={"/provider/experiences/edit?id=" + exp.id}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold no-underline transition-all active:scale-95"
                          style={{background:"rgba(184,138,68,0.1)", color:"#B88A44"}}>
                          <PencilSimple size={12} weight="bold" /> Modifier
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* TAB PROFILE */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-2xl p-4" style={{boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
            <div className="font-display text-sm font-semibold text-charcoal-800 mb-4">Mon profil</div>
            <div className="flex flex-col gap-3">
              {[
                { label: "Nom", value: provider.displayName },
                { label: "Email", value: provider.email },
                { label: "WhatsApp", value: provider.phone },
                { label: "Ville", value: provider.city },
              ].map(f => (
                <div key={f.label} className="flex justify-between items-center py-2.5 border-b border-sand-100 last:border-0">
                  <span className="text-[11px] font-semibold text-charcoal-400 uppercase tracking-wide">{f.label}</span>
                  <span className="text-sm font-semibold text-charcoal-800">{f.value}</span>
                </div>
              ))}
              {provider.description && (
                <div className="pt-2">
                  <div className="text-[11px] font-semibold text-charcoal-400 uppercase tracking-wide mb-2">Description</div>
                  <div className="text-xs text-charcoal-600 leading-relaxed">{provider.description}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
