"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { House, MagnifyingGlass, Heart, User, Gauge, SignOut } from "@phosphor-icons/react";
import { usePathname } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function BottomNav() {
  const [dashboardUrl, setDashboardUrl] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const res = await fetch("/api/auth/me?supabaseId=" + session.user.id);
      const data = await res.json();
      if (data.role === "GUIDE" && data.guideId) {
        setDashboardUrl("/dashboard/guide?id=" + data.guideId);
      } else if (data.role === "ADMIN") {
        setDashboardUrl("/dashboard/admin");
      } else if (data.role === "TOURIST") {
        setDashboardUrl("/dashboard/tourist");
      }
    }
    checkSession();
  }, []);

  const items = [
    { href: "/",        Icon: House,           label: "Explorer"   },
    { href: "/search",  Icon: MagnifyingGlass,  label: "Rechercher" },
    { href: "/favorites", Icon: Heart,          label: "Favoris"    },
    dashboardUrl
      ? { href: dashboardUrl, Icon: Gauge,      label: "Dashboard", action: null  }
      : { href: "/auth/login", Icon: User,      label: "Connexion", action: null  },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-sand-300 z-50 flex">
      {items.map(({ href, Icon, label }) => {
        const active = pathname === href || (href !== "/" && pathname?.startsWith(href));
        return (
          <a key={label} href={href}
            className={`flex flex-col items-center gap-1 flex-1 py-3 no-underline transition-colors
              ${active ? "text-bronze-500" : "text-charcoal-400"}`}>
            <Icon size={20} weight={active ? "fill" : "regular"} />
            <span className="text-[10px] font-semibold">{label}</span>
          </a>
        );
      })}
    </nav>
  );
}
