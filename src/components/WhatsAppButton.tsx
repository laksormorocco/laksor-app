"use client";
import { ChatTeardrop } from "@phosphor-icons/react";

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/212657436342?text=Bonjour, j'ai une question concernant Laksor 🇲🇦"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 right-4 z-50 w-13 h-13 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-all"
      style={{
        background: "#7D8F69",
        width: 52,
        height: 52,
        boxShadow: "0 4px 20px rgba(125,143,105,0.4)"
      }}>
      <ChatTeardrop size={26} weight="fill" className="text-white" />
    </a>
  );
}
