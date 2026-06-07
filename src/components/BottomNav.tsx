"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { House, MagnifyingGlass, Sparkle, UserCircle, SignIn } from "@phosphor-icons/react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function BottomNav() {
  const path = usePathname();
  const [visible, setVisible] = useState(true);
  const [lastY, setLastY] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
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
    { href: "/experiences", Icon: Sparkle, label: "Experiences" },
    { href: isLoggedIn ? "/dashboard" : "/auth/login", Icon: isLoggedIn ? UserCircle : SignIn, label: isLoggedIn ? "Profil" : "Connexion" },
  ];

  return (
    <nav className={"fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-sand-200 z-50 flex transition-transform duration-300 " + (visible ? "translate-y-0" : "translate-y-full")}>
      {items.map(({ href, Icon, label }) => {
        const active = path === href || (href !== "/" && path.startsWith(href));
        return (
          <a key={href} href={href}
            className={"flex flex-col items-center gap-0.5 flex-1 py-2.5 no-underline transition-colors " + (active ? "text-bronze-500" : "text-charcoal-300 hover:text-charcoal-500")}>
            <Icon size={17} weight={active ? "fill" : "regular"} />
            <span className="text-[8px] font-semibold tracking-wide">{label}</span>
          </a>
        );
      })}
    </nav>
  );
}
