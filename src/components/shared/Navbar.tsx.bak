// src/components/shared/Navbar.tsx
"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { branding } from "@/../../content/branding";
import { siteConfig } from "@/../../config/site";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-sand-200 shadow-sm">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-majorelle flex items-center justify-center">
            <span className="text-safran font-display font-bold text-lg">L</span>
          </div>
          <span className="font-display font-bold text-majorelle text-xl">
            {branding.name}
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-gray-600 hover:text-majorelle transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/auth/login"
            className="text-sm font-medium text-majorelle hover:text-majorelle-700 transition-colors"
          >
            Se connecter
          </Link>
          <Link
            href="/auth/register"
            className="px-4 py-2 rounded-xl bg-majorelle text-white text-sm font-semibold hover:bg-majorelle-600 transition-colors"
          >
            S'inscrire
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-sand-100 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-sand-200 bg-white"
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              {siteConfig.nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="py-2 text-sm font-medium text-gray-700 hover:text-majorelle"
                >
                  {item.label}
                </Link>
              ))}
              <hr className="border-sand-200" />
              <Link
                href="/auth/login"
                onClick={() => setOpen(false)}
                className="py-2 text-sm font-medium text-majorelle"
              >
                Se connecter
              </Link>
              <Link
                href="/auth/register"
                onClick={() => setOpen(false)}
                className="py-3 text-center rounded-xl bg-majorelle text-white text-sm font-semibold"
              >
                S'inscrire
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
