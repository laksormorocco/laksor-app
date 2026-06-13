"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { ChatCircle, CalendarBlank, ArrowRight } from "@phosphor-icons/react";
import BottomNav from "@/components/BottomNav";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function MessagesPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push("/auth/login"); return; }
      setUserId(session.user.id);
      fetch("/api/messages/conversations?userId=" + session.user.id)
        .then(r => r.json())
        .then(d => { setConversations(d.conversations || []); setLoading(false); });
    });
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{background:"#F6F1E8"}}>
      <div className="w-10 h-10 border-4 border-bronze-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen pb-24" style={{background:"#F6F1E8"}}>
      {/* HEADER */}
      <div className="sticky top-0 z-30 px-5 py-4"
        style={{background:"rgba(246,241,232,0.92)", backdropFilter:"blur(16px)", borderBottom:"1px solid rgba(184,138,68,0.12)"}}>
        <h1 className="font-display text-xl font-bold text-charcoal-800">Messages</h1>
        <p className="text-[11px] text-charcoal-400 mt-0.5">Communications sécurisées Laksor</p>
      </div>

      <div className="px-4 pt-4 max-w-lg mx-auto">
        {conversations.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center" style={{boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
            <ChatCircle size={40} weight="duotone" className="text-charcoal-300 mx-auto mb-3" />
            <div className="font-display text-sm font-bold text-charcoal-800 mb-1">Aucun message</div>
            <div className="text-xs text-charcoal-400">Vos conversations apparaîtront ici après une réservation</div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {conversations.map((conv: any) => (
              <a key={conv.bookingId} href={"/messages/" + conv.bookingId}
                className="bg-white rounded-2xl p-4 flex items-center gap-3 no-underline active:scale-[0.98] transition-all"
                style={{boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
                {/* Avatar */}
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 font-display text-lg font-bold"
                  style={{background:"linear-gradient(135deg, #B88A44, #9A7238)", color:"white"}}>
                  {conv.otherName?.[0] || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="font-display text-sm font-bold text-charcoal-800 truncate">{conv.otherName || "Inconnu"}</div>
                    <div className="text-[10px] text-charcoal-400 flex-shrink-0 ml-2">
                      {new Date(conv.lastMessageAt).toLocaleDateString("fr-FR", {day:"numeric", month:"short"})}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <CalendarBlank size={10} className="text-charcoal-400 flex-shrink-0" />
                    <span className="text-[10px] text-charcoal-400 truncate">{conv.bookingRef}</span>
                  </div>
                  <div className="text-xs text-charcoal-500 truncate mt-0.5">{conv.lastMessage}</div>
                </div>
                {conv.unread > 0 && (
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                    style={{background:"#ef4444"}}>
                    {conv.unread}
                  </div>
                )}
                <ArrowRight size={14} className="text-charcoal-300 flex-shrink-0" />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
    <BottomNav />
  );
}
