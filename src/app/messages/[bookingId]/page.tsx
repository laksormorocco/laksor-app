"use client";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, PaperPlaneTilt, Lock } from "@phosphor-icons/react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function ChatPage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params.bookingId as string;
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("");
  const [booking, setBooking] = useState<any>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push("/auth/login"); return; }
      setUserId(session.user.id);
      // Charger le booking et les messages
      fetch("/api/bookings/" + bookingId).then(r => r.json()).then(d => {
        setBooking(d.booking);
      });
      fetch("/api/auth/me?supabaseId=" + session.user.id).then(r => r.json()).then(d => {
        setRole(d.role || "TOURIST");
      });
      loadMessages();
    });
  }, [bookingId]);

  async function loadMessages() {
    const res = await fetch("/api/messages?bookingId=" + bookingId);
    const d = await res.json();
    if (d.messages) setMessages(d.messages);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  }

  useEffect(() => {
    const interval = setInterval(loadMessages, 8000);
    return () => clearInterval(interval);
  }, [bookingId]);

  async function sendMessage() {
    if (!input.trim() || sending || !userId) return;
    setSending(true);
    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId, senderId: userId, senderRole: role, content: input.trim() })
    });
    setInput("");
    await loadMessages();
    setSending(false);
  }

  const otherName = role === "GUIDE"
    ? booking?.tourist?.name || "Touriste"
    : booking?.guide?.displayName || "Guide";

  const bookingRef = booking?.notes?.match(/REF:([A-Z0-9-]+)/)?.[1] || bookingId.slice(0,8);

  return (
    <div className="min-h-screen flex flex-col" style={{background:"#F6F1E8"}}>
      {/* HEADER */}
      <div className="sticky top-0 z-30 flex items-center gap-3 px-4 py-3"
        style={{background:"rgba(246,241,232,0.92)", backdropFilter:"blur(16px)", borderBottom:"1px solid rgba(184,138,68,0.12)"}}>
        <button onClick={() => router.push("/messages")}
          className="w-9 h-9 rounded-full bg-white flex items-center justify-center flex-shrink-0"
          style={{border:"1.5px solid #EADCC8"}}>
          <ArrowLeft size={15} weight="bold" className="text-charcoal-800" />
        </button>
        <div className="flex-1">
          <div className="font-display text-sm font-bold text-charcoal-800">{otherName}</div>
          <div className="text-[10px] text-charcoal-400">Réf : {bookingRef}</div>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-charcoal-400">
          <Lock size={10} /> Sécurisé
        </div>
      </div>

      {/* BOOKING RECAP */}
      {booking && (
        <div className="mx-4 mt-3 rounded-2xl p-3 flex items-center gap-3"
          style={{background:"rgba(184,138,68,0.06)", border:"1px solid rgba(184,138,68,0.15)"}}>
          <div className="flex-1">
            <div className="text-[10px] font-bold text-bronze-500 uppercase tracking-widest mb-0.5">Réservation</div>
            <div className="text-xs font-semibold text-charcoal-800">
              {new Date(booking.date).toLocaleDateString("fr-FR", {weekday:"long", day:"numeric", month:"long"})}
              {" · "}{booking.persons} pers.
            </div>
          </div>
          <div className="text-[10px] font-semibold px-2 py-1 rounded-full" style={{background:"rgba(125,143,105,0.1)", color:"#7D8F69"}}>
            {booking.status}
          </div>
        </div>
      )}

      {/* MESSAGES */}
      <div className="flex-1 px-4 py-4 flex flex-col gap-3 overflow-y-auto pb-24">
        {messages.length === 0 ? (
          <div className="text-center text-xs text-charcoal-400 py-10">
            Aucun message — commencez la conversation 👋
          </div>
        ) : messages.map(m => {
          const isMe = m.senderId === userId;
          return (
            <div key={m.id} className={"flex " + (isMe ? "justify-end" : "justify-start")}>
              <div className="max-w-[78%]">
                {!isMe && (
                  <div className="text-[10px] font-semibold text-charcoal-400 mb-1 ml-2">
                    {m.senderRole === "GUIDE" ? "Guide" : m.senderRole === "ADMIN" ? "Laksor" : "Touriste"}
                  </div>
                )}
                <div className={"px-4 py-2.5 text-sm leading-relaxed " + (isMe
                  ? "text-white rounded-2xl rounded-br-sm"
                  : "text-charcoal-800 rounded-2xl rounded-bl-sm")}
                  style={{background: isMe ? "linear-gradient(135deg, #B88A44, #9A7238)" : "white",
                          boxShadow: "0 1px 4px rgba(0,0,0,0.08)"}}>
                  {m.content}
                </div>
                <div className={"text-[10px] text-charcoal-400 mt-1 " + (isMe ? "text-right mr-1" : "ml-2")}>
                  {new Date(m.createdAt).toLocaleTimeString("fr-FR", {hour:"2-digit", minute:"2-digit"})}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* INPUT FIXE */}
      <div className="fixed bottom-0 left-0 right-0 px-4 py-3 max-w-lg mx-auto"
        style={{background:"rgba(246,241,232,0.95)", backdropFilter:"blur(16px)", borderTop:"1px solid rgba(184,138,68,0.1)"}}>
        <div className="flex items-center gap-2">
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder="Écrivez votre message..."
            className="flex-1 text-sm rounded-full px-4 py-3 outline-none border-2 border-transparent focus:border-bronze-500 transition-colors"
            style={{background:"white"}} />
          <button onClick={sendMessage} disabled={!input.trim() || sending}
            className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 active:scale-95 transition-all disabled:opacity-40"
            style={{background:"linear-gradient(135deg, #B88A44, #9A7238)"}}>
            <PaperPlaneTilt size={18} weight="fill" className="text-white" />
          </button>
        </div>
        <div className="text-center text-[10px] text-charcoal-400 mt-1.5 flex items-center justify-center gap-1">
          <Lock size={9} /> Les coordonnées personnelles sont automatiquement masquées
        </div>
      </div>
    </div>
  );
}
