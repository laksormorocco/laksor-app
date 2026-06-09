"use client";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen pb-16" style={{background:"#F6F1E8"}}>
      <div className="sticky top-0 z-30 bg-white border-b border-sand-200 px-4 py-3 flex items-center gap-3">
        <Link href="/" className="w-9 h-9 rounded-full border border-sand-200 flex items-center justify-center no-underline flex-shrink-0">
          <ArrowLeft size={16} className="text-charcoal-600" />
        </Link>
        <img src="/logo7.png" alt="Laksor" style={{height:30, width:"auto", objectFit:"contain", maxWidth:100}} />
      </div>
      <div className="max-w-2xl mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
}
