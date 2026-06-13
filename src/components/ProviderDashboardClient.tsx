"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus, Star, CalendarBlank, ChartBar, SealCheck,
  SignOut, PencilSimple, Clock, CheckCircle,
  XCircle, Warning, Users, CurrencyDollar,
  WhatsappLogo, MapPin
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

export default function ProviderDashboardClient({ provider, bookings }: { provider: any; bookings: any[] }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"experiences"|"bookings"|"profile">("experiences");

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  const experiences = provider?.experiences || [];
  const approved = experiences.filter((e: any) => e.status === "APPROVED").length;
  const pending = experiences.filter((e: any) => e.status === "PENDING").length;

  const totalRevenue = bookings.reduce((sum: number, b: any) => sum + Math.round((Number(b.totalPrice || 0) - 25) / 1.25), 0);
  const thisMonth = new Date().getMonth();
  const monthlyRevenue = bookings
    .filter((b: any) => new Date(b.createdAt).getMonth() === thisMonth)
    .reduce((sum: number, b: any) => sum + Math.round((Number(b.totalPrice || 0) - 25) / 1.25), 0);

  return (
    <div className="min-h-screen pb-24" style={{background:"#F6F1E8"}}>

      {/* HEADER */}
      <div className="sticky top-0 z-30 px-5 py-3"
        style={{background:"rgba(246,241,232,0.92)", backdropFilter:"blur(16px)", borderBottom:"1px solid rgba(184,138,68,0.12)"}}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl overflow-hidden flex-shrink-0"
              style={{background:"rgba(184,138,68,0.12)", border:"2px solid #EADCC8"}}>
              {provider.avatar
                ? <img src={provider.avatar} className="w-full h-full object-cover" alt="" />
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
            className="w-9 h-9 rounded-full bg-white flex items-center justify-center active:scale-95"
            style={{border:"1.5px solid #EADCC8"}}>
            <SignOut size={15} className="text-charcoal-500" />
          </button>
        </div>
      </div>

      <div className="px-4 pt-4 max-w-lg mx-auto">

        {provider.status === "PENDING" && (
          <div className="rounded-2xl p-4 mb-4 flex items-start gap-3"
            style={{background:"rgba(184,138,68,0.08)", border:"1px solid rgba(184,138,68,0.25)"}}>
            <Clock size={18} weight="duotone" className="text-bronze-500 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-bold text-bronze-500 mb-0.5">Candidature en cours d'examen</div>
              <div className="text-[11px] text-charcoal-500 leading-relaxed">
                Notre équipe examine votre profil. Vous recevrez une réponse sur WhatsApp sous 24h.
              </div>
            </div>
          </div>
        )}

        {/* STATS */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white rounded-2xl p-4" style={{boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2" style={{background:"rgba(184,138,68,0.1)"}}>
              <CurrencyDollar size={18} weight="duotone" className="text-bronze-500" />
            </div>
            <div className="font-display text-xl font-bold" style={{color:"#B88A44"}}>{totalRevenue} MAD</div>
            <div className="text-[10px] text-charcoal-400 mt-0.5">Revenus nets totaux</div>
          </div>
          <div className="bg-white rounded-2xl p-4" style={{boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2" style={{background:"rgba(184,138,68,0.1)"}}>
              <ChartBar size={18} weight="duotone" className="text-bronze-500" />
            </div>
            <div className="font-display text-xl font-bold text-charcoal-800">{monthlyRevenue} MAD</div>
            <div className="text-[10px] text-charcoal-400 mt-0.5">Ce mois-ci</div>
          </div>
          <div className="bg-white rounded-2xl p-4" style={{boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2" style={{background:"rgba(125,143,105,0.1)"}}>
              <Star size={18} weight="duotone" className="text-sage-300" />
            </div>
            <div className="font-display text-xl font-bold text-charcoal-800">{experiences.length}</div>
            <div className="text-[10px] text-charcoal-400 mt-0.5">{approved} approuvées · {pending} en attente</div>
          </div>
          <div className="bg-white rounded-2xl p-4" style={{boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2" style={{background:"rgba(125,143,105,0.1)"}}>
              <CalendarBlank size={18} weight="duotone" className="text-sage-300" />
            </div>
            <div className="font-display text-xl font-bold text-charcoal-800">{bookings.length}</div>
            <div className="text-[10px] text-charcoal-400 mt-0.5">Réservations confirmées</div>
          </div>
        </div>

        {/* TABS */}
        <div className="flex p-1 rounded-2xl mb-4" style={{background:"rgba(184,138,68,0.08)"}}>
          {[
            {id:"experiences", label:"Mes expériences"},
            {id:"bookings", label:"Réservations"},
            {id:"profile", label:"Profil"},
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
              className="flex items-center justify-center gap-2 w-full py-4 text-white rounded-full text-sm font-bold no-underline mb-4 active:scale-[0.98]"
              style={{background:"linear-gradient(135deg, #B88A44, #9A7238)", boxShadow:"0 6px 20px rgba(184,138,68,0.4)"}}>
              <Plus size={16} weight="bold" /> Créer une expérience
            </Link>
            {experiences.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center" style={{boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
                <div className="text-4xl mb-3">🎭</div>
                <div className="font-display text-sm font-bold text-charcoal-800 mb-1">Aucune expérience</div>
                <div className="text-xs text-charcoal-400">Créez votre première expérience pour commencer</div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {experiences.map((exp: any) => (
                  <div key={exp.id} className="bg-white rounded-2xl overflow-hidden"
                    style={{boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
                    {exp.photos?.[0] && (
                      <div className="h-36 overflow-hidden relative">
                        <img src={exp.photos[0]} alt={exp.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0" style={{background:"linear-gradient(to top, rgba(0,0,0,0.5), transparent)"}} />
                        <div className="absolute bottom-2 left-3"><StatusBadge status={exp.status} /></div>
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-1">
                        <div className="font-display text-sm font-bold text-charcoal-800 flex-1 pr-2">{exp.title}</div>
                        {!exp.photos?.[0] && <StatusBadge status={exp.status} />}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-charcoal-400 mb-3">
                        <MapPin size={10} /> {exp.city}
                        {exp.duration && <><span>·</span><Clock size={10} /> {exp.duration}</>}
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-display text-base font-bold" style={{color:"#B88A44"}}>{exp.price} MAD/pers.</div>
                          {exp.privatePricePerPerson && <div className="text-[10px] text-charcoal-400">Privé : {exp.privatePricePerPerson} MAD/pers.</div>}
                        </div>
                        <Link href={"/provider/experiences/edit?id=" + exp.id}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold no-underline"
                          style={{background:"rgba(184,138,68,0.1)", color:"#B88A44"}}>
                          <PencilSimple size={12} weight="bold" /> Modifier
                        </Link>
                      </div>
                      {exp.status === "REJECTED" && (
                        <div className="mt-2 p-2 rounded-xl text-[11px]" style={{background:"rgba(239,68,68,0.06)", color:"#ef4444"}}>
                          ✗ Refusée — modifiez et resoumettez
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* TAB RESERVATIONS */}
        {activeTab === "bookings" && (
          <>
            {bookings.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center" style={{boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
                <div className="text-4xl mb-3">📅</div>
                <div className="font-display text-sm font-bold text-charcoal-800 mb-1">Aucune réservation</div>
                <div className="text-xs text-charcoal-400">Vos réservations apparaîtront ici</div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {[...bookings].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((b: any, i: number) => (
                  <div key={i} className="bg-white rounded-2xl p-4" style={{boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-display text-sm font-bold text-charcoal-800">{b.expTitle}</div>
                        <div className="text-[11px] text-charcoal-400 mt-0.5">
                          {new Date(b.createdAt).toLocaleDateString("fr-FR", {day:"numeric", month:"long", year:"numeric"})}
                        </div>
                      </div>
                      <div className="font-display text-base font-bold" style={{color:"#B88A44"}}>
                        {Math.round((Number(b.totalPrice || 0) - 25) / 1.25)} MAD
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-charcoal-400">
                      <Users size={11} /> {b.persons} pers.
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{background:"rgba(125,143,105,0.1)", color:"#7D8F69"}}>Confirmée</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* TAB PROFILE */}
        {activeTab === "profile" && (
          <div className="flex flex-col gap-3">
            <div className="bg-white rounded-2xl p-4" style={{boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
              <div className="font-display text-sm font-semibold text-charcoal-800 mb-4">Informations</div>
              {[
                { label: "Nom", value: provider.displayName },
                { label: "Email", value: provider.email },
                { label: "WhatsApp", value: provider.phone },
                { label: "Ville", value: provider.city },
                { label: "Statut", value: provider.status === "APPROVED" ? "✅ Vérifié" : "⏳ En attente" },
              ].map(f => (
                <div key={f.label} className="flex justify-between items-center py-3 border-b border-sand-100 last:border-0">
                  <span className="text-[11px] font-semibold text-charcoal-400 uppercase tracking-wide">{f.label}</span>
                  <span className="text-sm font-semibold text-charcoal-800">{f.value}</span>
                </div>
              ))}
              {provider.description && (
                <div className="pt-3">
                  <div className="text-[11px] font-semibold text-charcoal-400 uppercase tracking-widest mb-2">Description</div>
                  <div className="text-xs text-charcoal-600 leading-relaxed">{provider.description}</div>
                </div>
              )}
            </div>
            <div className="rounded-2xl p-4" style={{background:"rgba(184,138,68,0.08)", border:"1px solid rgba(184,138,68,0.2)"}}>
              <div className="text-xs font-bold text-bronze-500 mb-1">Commission Laksor</div>
              <div className="text-[11px] text-charcoal-500 leading-relaxed">
                Laksor prend 25% + 25 MAD de commission sur chaque réservation. Vos revenus affichés sont nets.
              </div>
            </div>
            <a href="https://wa.me/212657436342"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full text-sm font-bold no-underline"
              style={{background:"#25D366", color:"white"}}>
              <WhatsappLogo size={16} weight="fill" /> Contacter le support Laksor
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
