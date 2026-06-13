"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { House, MagnifyingGlass, Sparkle, UserCircle, SignIn, ChatCircle } from "@phosphor-icons/react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function BottomNav() {
  const path = usePathname();
  const [visible, setVisible] = useState(true);
  const [lastY, setLastY] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
      if (session) {
        fetch("/api/messages/unread?userId=" + session.user.id)
          .then(r => r.json())
          .then(d => setUnread(d.count || 0))
          .catch(() => {});
      }
    });
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setVisible(y < lastY || y < 50);
      setLastY(y);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastY]);

  const items = [
    { href: "/", Icon: House, label: "Accueil" },
    { href: "/search", Icon: MagnifyingGlass, label: "Rechercher" },
    { href: "/experiences", Icon: Sparkle, label: "Expériences" },
      { href: isLoggedIn ? "/dashboard" : "/auth/login", Icon: isLoggedIn ? UserCircle : SignIn, label: isLoggedIn ? "Profil" : "Connexion" },
  ];

  return (
    <nav className={"fixed bottom-0 left-0 right-0 z-50 flex transition-transform duration-300 " + (visible ? "translate-y-0" : "translate-y-full")}
      style={{background:"rgba(255,255,255,0.96)", backdropFilter:"blur(20px) saturate(160%)", borderTop:"1px solid rgba(184,138,68,0.1)"}}>
      {items.map(({ href, Icon, label, badge }: any) => {
        const active = path === href || (href !== "/" && path.startsWith(href));
        return (
          <a key={href} href={href}
            className={"flex flex-col items-center gap-0.5 flex-1 py-3 no-underline transition-all relative " + (active ? "" : "")}>
            <div className="relative">
              <Icon size={20} weight={active ? "fill" : "regular"}
                style={{color: active ? "#B88A44" : "rgba(17,17,17,0.35)"}} />
              {badge > 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                  style={{background:"#ef4444"}}>
                  {badge > 9 ? "9+" : badge}
                </div>
              )}
            </div>
            <span className="text-[9px] font-semibold tracking-wide"
              style={{color: active ? "#B88A44" : "rgba(17,17,17,0.35)"}}>
              {label}
            </span>
            {active && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                style={{background:"#B88A44"}} />
            )}
          </a>
        );
      })}
    </nav>
  );
}
