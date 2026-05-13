// src/components/home/HowItWorks.tsx
"use client";
import { motion } from "framer-motion";
import { Search, CalendarCheck, Map } from "lucide-react";

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Choisissez votre guide",
    desc: "Filtrez par ville, langue, spécialité et budget. Consultez les avis authentiques.",
    color: "bg-majorelle/10 text-majorelle",
  },
  {
    icon: CalendarCheck,
    step: "02",
    title: "Réservez en ligne",
    desc: "Choisissez votre date, durée et nombre de personnes. Paiement 100% sécurisé.",
    color: "bg-safran/20 text-safran-600",
  },
  {
    icon: Map,
    step: "03",
    title: "Vivez l'expérience",
    desc: "Votre guide vous accueille et vous fait découvrir le Maroc comme un local.",
    color: "bg-terracotta/10 text-terracotta",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section-padding max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <p className="text-terracotta font-semibold text-sm uppercase tracking-widest mb-2">
          Simple et rapide
        </p>
        <h2 className="font-display text-3xl md:text-4xl text-majorelle">
          Comment ça marche ?
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, i) => (
          <motion.div
            key={step.step}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            viewport={{ once: true }}
            className="relative flex flex-col items-center text-center p-8 rounded-2xl bg-white border border-sand-200"
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${step.color}`}>
              <step.icon size={24} />
            </div>
            <span className="absolute top-4 right-5 text-5xl font-bold text-sand-300 font-display select-none">
              {step.step}
            </span>
            <h3 className="font-semibold text-gray-900 text-lg mb-3">{step.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
