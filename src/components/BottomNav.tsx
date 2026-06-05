"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { House, MagnifyingGlass, Sparkle, UserCircle } from "@phosphor-icons/react";

export default function BottomNav() {
  const path = usePathname();
  const [visible, setVisible] = useState(true);
  const [lastY, setLastY] = useState(0);

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
    { href: "/dashboard", Icon: UserCircle, label: "Profil" },
  ];

  return (
    <nav style={{ paddingBottom: "env(safe-area-inset-bottom)" }} className={"fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-sand-200 z-50 flex transition-transform duration-300 " + (visible ? "translate-y-0" : "translate-y-full")}>
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
