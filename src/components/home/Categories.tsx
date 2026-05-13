// src/components/home/Categories.tsx
"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { branding } from "@/../../content/branding";

export function Categories() {
  return (
    <section className="section-padding max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <p className="text-terracotta font-semibold text-sm uppercase tracking-widest mb-2">
          Explorez par thème
        </p>
        <h2 className="font-display text-3xl md:text-4xl text-majorelle">
          Quelle expérience vous attire ?
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {branding.categories.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            viewport={{ once: true }}
          >
            <Link
              href={`/search?visitType=${cat.id}`}
              className="group flex flex-col items-center gap-3 p-5 rounded-2xl bg-white border border-sand-200 hover:border-majorelle hover:shadow-lg transition-all duration-300 text-center card-hover"
            >
              <span className="text-3xl">{cat.emoji}</span>
              <span className="text-sm font-semibold text-gray-700 group-hover:text-majorelle transition-colors leading-tight">
                {cat.label}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
