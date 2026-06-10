"use client";
import Link from "next/link";
import { CheckCircle, MagnifyingGlass, WhatsappLogo, ArrowRight, Confetti, Star } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

export default function RegisterSuccessPage() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    setTimeout(() => setShow(true), 100);
    setTimeout(() => setStep(1), 600);
    setTimeout(() => setStep(2), 1200);
    setTimeout(() => setStep(3), 1800);
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{background:"#F6F1E8"}}>

      {/* HERO */}
      <div className="relative overflow-hidden flex-shrink-0" style={{height:220}}>
        <img src="https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&q=80"
          alt="Maroc" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{background:"linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.75))"}} />
        <div className="relative z-10 flex flex-col items-center justify-end h-full pb-6 px-6 text-center">
          <div className={"w-20 h-20 rounded-full flex items-center justify-center mb-3 transition-all duration-700 " + (show ? "scale-100 opacity-100" : "scale-50 opacity-0")}
            style={{background:"linear-gradient(135deg, #B88A44, #9A7238)", boxShadow:"0 8px 32px rgba(184,138,68,0.5)"}}>
            <Confetti size={36} weight="fill" className="text-white" />
          </div>
          <h1 className={"font-display text-2xl font-bold text-white transition-all duration-700 delay-200 " + (show ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0")}>
            Bienvenue dans Laksor !
          </h1>
          <p className={"text-sm text-white/70 mt-1 transition-all duration-700 delay-300 " + (show ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0")}>
            Votre candidature a ete envoyee
          </p>
        </div>
      </div>

      <div className="flex-1 px-4 -mt-6 pb-10 max-w-sm mx-auto w-full">

        {/* MAIN CARD */}
        <div className={"bg-white rounded-3xl p-6 border border-sand-300 mb-4 transition-all duration-700 delay-100 " + (show ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0")}
          style={{boxShadow:"0 4px 24px rgba(0,0,0,0.08)"}}>

          <p className="text-sm text-charcoal-500 text-center leading-relaxed mb-6">
            Notre equipe va examiner votre profil et vous contacter sur{" "}
            <strong className="text-charcoal-800">WhatsApp</strong> sous 24h.
          </p>

          {/* STEPS ANIMÉS */}
          <div className="flex flex-col gap-0 mb-6">
            {[
              { Icon: CheckCircle, title: "Candidature soumise", sub: "Votre profil a ete envoye", done: true, delay: 0 },
              { Icon: MagnifyingGlass, title: "Verification en cours", sub: "Notre equipe examine votre dossier", done: false, delay: 1 },
              { Icon: WhatsappLogo, title: "Contact WhatsApp", sub: "Reponse sous 24h", done: false, delay: 2 },
            ].map((s, i) => (
              <div key={s.title}
                className={"flex items-center gap-4 py-3.5 border-b border-sand-100 last:border-0 transition-all duration-500 " + (step > s.delay ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4")}>
                <div className={"w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-500 " + (s.done ? "bg-sage-300/15" : step > s.delay ? "bg-sand-200" : "bg-sand-100")}>
                  <s.Icon size={20}
                    className={s.done ? "text-sage-300" : step > s.delay ? "text-charcoal-500" : "text-charcoal-300"}
                    weight={s.done ? "fill" : "regular"} />
                </div>
                <div className="flex-1">
                  <div className={"text-sm font-bold " + (s.done ? "text-sage-300" : step > s.delay ? "text-charcoal-800" : "text-charcoal-300")}>{s.title}</div>
                  <div className={"text-xs " + (step > s.delay ? "text-charcoal-400" : "text-charcoal-200")}>{s.sub}</div>
                </div>
                {s.done && <CheckCircle size={16} weight="fill" className="text-sage-300 flex-shrink-0" />}
              </div>
            ))}
          </div>

          {/* AVANTAGES */}
          <div className="bg-sand-100 rounded-2xl p-4 mb-5">
            <div className="text-[10px] font-bold text-bronze-500 uppercase tracking-widest mb-3">En tant que guide Laksor</div>
            {[
              "100% de vos revenus de visite",
              "Zero commission shopping imposee",
              "Visibilite aupres de 19.8M touristes",
              "Support WhatsApp dedie",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 mb-2 last:mb-0">
                <Star size={11} weight="fill" className="text-bronze-500 flex-shrink-0" />
                <span className="text-xs text-charcoal-600">{item}</span>
              </div>
            ))}
          </div>

          {/* CTA BUTTONS */}
          <Link href="/"
            className="flex items-center justify-center gap-2 w-full py-4 text-white rounded-2xl text-sm font-bold text-center no-underline mb-3"
            style={{background:"linear-gradient(135deg, #B88A44, #9A7238)", boxShadow:"0 4px 14px rgba(184,138,68,0.3)"}}>
            Retour a l accueil <ArrowRight size={14} weight="bold" />
          </Link>
          <Link href="/auth/login"
            className="flex items-center justify-center w-full py-3.5 border-2 border-sand-300 text-charcoal-600 rounded-2xl text-sm font-bold text-center no-underline hover:border-bronze-500 hover:text-bronze-500 transition-colors">
            Acceder a mon espace guide
          </Link>
        </div>

        {/* CONTACT */}
        <div className={"bg-white rounded-2xl p-4 border border-sand-300 flex items-center gap-3 transition-all duration-700 delay-500 " + (show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}
          style={{boxShadow:"0 2px 12px rgba(0,0,0,0.05)"}}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:"#25D366"}}>
            <WhatsappLogo size={20} weight="fill" className="text-white" />
          </div>
          <div className="flex-1">
            <div className="text-xs font-bold text-charcoal-800">Une question ?</div>
            <div className="text-xs text-charcoal-400">Notre equipe repond sur WhatsApp</div>
          </div>
          <a href="https://wa.me/212657436342" target="_blank" rel="noopener noreferrer"
            className="text-xs font-bold text-white px-3 py-2 rounded-full no-underline flex-shrink-0"
            style={{background:"#25D366"}}>
            Contacter
          </a>
        </div>
      </div>
    </div>
  );
}
