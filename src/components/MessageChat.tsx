"use client";
import { useState, useEffect, useRef } from "react";
import { PaperPlaneTilt, Lock } from "@phosphor-icons/react";

interface Message {
  id: string;
  senderId: string;
  senderRole: string;
  content: string;
  createdAt: string;
}

interface Props {
  bookingId: string;
  currentUserId: string;
  currentRole: string;
  bookingRef?: string;
}

export default function MessageChat({ bookingId, currentUserId, currentRole, bookingRef }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  async function loadMessages() {
    const res = await fetch("/api/messages?bookingId=" + bookingId);
    const d = await res.json();
    if (d.messages) setMessages(d.messages);
  }

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 10000); // Refresh toutes les 10s
    return () => clearInterval(interval);
  }, [bookingId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || sending) return;
    setSending(true);
    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bookingId,
        senderId: currentUserId,
        senderRole: currentRole,
        content: input.trim()
      })
    });
    setInput("");
    await loadMessages();
    setSending(false);
  }

  const roleLabel: Record<string, string> = {
    GUIDE: "Guide",
    TOURIST: "Touriste",
    ADMIN: "Laksor"
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden" style={{boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
      {/* HEADER */}
      <div className="px-4 py-3 border-b border-sand-100 flex items-center justify-between"
        style={{background:"rgba(184,138,68,0.04)"}}>
        <div>
          <div className="font-display text-sm font-bold text-charcoal-800">Messagerie</div>
          {bookingRef && <div className="text-[10px] text-charcoal-400">Réf : {bookingRef}</div>}
        </div>
        <div className="flex items-center gap-1 text-[10px] text-charcoal-400">
          <Lock size={10} /> Communications sécurisées Laksor
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex flex-col gap-2 p-4 overflow-y-auto" style={{maxHeight:320, minHeight:150}}>
        {messages.length === 0 ? (
          <div className="text-center text-xs text-charcoal-400 py-6">
            Aucun message — commencez la conversation
          </div>
        ) : messages.map(m => {
          const isMe = m.senderId === currentUserId;
          return (
            <div key={m.id} className={"flex " + (isMe ? "justify-end" : "justify-start")}>
              <div className="max-w-[80%]">
                {!isMe && (
                  <div className="text-[10px] font-semibold text-charcoal-400 mb-1 ml-1">
                    {roleLabel[m.senderRole] || m.senderRole}
                  </div>
                )}
                <div className={"px-3 py-2 text-sm leading-relaxed " + (isMe ? "bg-bronze-500 text-white rounded-2xl rounded-br-sm" : "bg-sand-100 text-charcoal-800 rounded-2xl rounded-bl-sm")}>
                  {m.content}
                </div>
                <div className={"text-[10px] text-charcoal-400 mt-0.5 " + (isMe ? "text-right mr-1" : "ml-1")}>
                  {new Date(m.createdAt).toLocaleTimeString("fr-FR", {hour:"2-digit", minute:"2-digit"})}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="px-4 py-3 border-t border-sand-100 flex items-center gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
          placeholder="Écrivez votre message..."
          className="flex-1 text-sm bg-sand-100 rounded-full px-4 py-2.5 outline-none border border-transparent focus:border-bronze-500 transition-colors"
        />
        <button onClick={sendMessage} disabled={!input.trim() || sending}
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all active:scale-95 disabled:opacity-40"
          style={{background:"linear-gradient(135deg, #B88A44, #9A7238)"}}>
          <PaperPlaneTilt size={16} weight="fill" className="text-white" />
        </button>
      </div>
    </div>
  );
}
