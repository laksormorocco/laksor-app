"use client";
import { WhatsappLogo } from "@phosphor-icons/react";

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/212657436342?text=Bonjour, j'ai une question concernant Laksor 🇲🇦"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 right-4 z-50 w-13 h-13 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-all"
      style={{
        background: "#25D366",
        width: 52,
        height: 52,
        boxShadow: "0 4px 20px rgba(37,211,102,0.4)"
      }}>
      <WhatsappLogo size={26} weight="fill" className="text-white" />
    </a>
  );
}
