// src/components/home/GuidesCTA.tsx
"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BadgeCheck, TrendingUp, Clock } from "lucide-react";

const perks = [
  { icon: BadgeCheck, text: "Profil vérifié et mis en avant" },
  { icon: TrendingUp, text: "Gérez vos tarifs librement" },
  { icon: Clock, text: "Disponibilités à votre rythme" },
];

export function GuidesCTA() {
  return (
    <section className="section-padding">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto gradient-hero rounded-3xl px-8 py-16 md:py-20 text-center relative overflow-hidden"
      >
        {/* Decorative */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-safran/10 rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-terracotta/10 rounded-full translate-y-24 -translate-x-24" />

        <div className="relative">
          <p className="text-safran font-semibold text-sm uppercase tracking-widest mb-4">
            Pour les guides
          </p>
          <h2 className="font-display text-3xl md:text-5xl text-white font-bold mb-4">
            Partagez votre passion<br />du Maroc
          </h2>
          <p className="text-white/75 text-lg mb-10 max-w-xl mx-auto">
            Rejoignez notre réseau de guides locaux certifiés et développez votre activité.
          </p>

          <div className="flex flex-wrap justify-center gap-6 mb-10">
            {perks.map((perk) => (
              <div key={perk.text} className="flex items-center gap-2 text-white/90 text-sm">
                <perk.icon size={16} className="text-safran" />
                {perk.text}
              </div>
            ))}
          </div>

          <Link
            href="/auth/register?role=guide"
            className="inline-flex items-center gap-2 bg-safran text-majorelle px-8 py-4 rounded-xl font-bold text-base hover:bg-safran-300 transition-colors shadow-lg"
          >
            Devenir guide <ArrowRight size={18} />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
