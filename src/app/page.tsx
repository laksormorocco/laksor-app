export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import HomeHero from "./HomeHero";
import BottomNav from "@/components/BottomNav";
import {
  MapPin, Star, Clock, ArrowRight,
  ShieldCheck, ChatCircle, ArrowsClockwise, Car
} from "@phosphor-icons/react/dist/ssr";

function toEur(mad: number) {
  return "€" + Math.round((mad * 1.25 + 25) * 0.092);
}

const LANG_FLAGS: Record<string, string> = {
  "Français": "🇫🇷", "French": "🇫🇷",
  "Anglais":  "🇬🇧", "English": "🇬🇧",
  "Espagnol": "🇪🇸", "Spanish": "🇪🇸",
  "Allemand": "🇩🇪", "German": "🇩🇪",
  "Italien":  "🇮🇹", "Italian": "🇮🇹",
  "Arabe":    "🇲🇦", "Arabic": "🇲🇦",
  "Portugais":"🇵🇹", "Portuguese": "🇵🇹",
};

const CITIES = [
  { name: "Marrakech",   img: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=600&q=80" },
  { name: "Fès",         img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80" },
  { name: "Essaouira",   img: "https://images.unsplash.com/photo-1509741102003-ca64bfe8696f?w=600&q=80" },
  { name: "Agadir",      img: "https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?w=600&q=80" },
  { name: "Chefchaouen", img: "https://images.unsplash.com/photo-1553522991-fd5deb8e3b50?w=600&q=80" },
];

const TRUST = [
  { Icon: ShieldCheck,     title: "Guides certifiés",       desc: "Chaque guide vérifié par Laksor" },
  { Icon: ChatCircle,      title: "WhatsApp temps réel",    desc: "Confirmations automatiques" },
  { Icon: ArrowsClockwise, title: "Annulation 72h",         desc: "Annulation gratuite avant 72h" },
  { Icon: Car,             title: "Transport inclus",       desc: "Guide + transfert ensemble" },
];

export default async function HomePage() {
  let guides: any[] = [];
  try {
    guides = await prisma.guideProfile.findMany({
      where: { status: "APPROVED" },
      take: 4,
      orderBy: { avgRating: "desc" },
    });
  } catch (e: any) {
    console.error("DB Error:", e.message);
  }

  return (
    <div className="bg-sand-200 min-h-screen pb-20">

      <HomeHero />

      {/* STATS */}
      <div className="px-4 mt-4 max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md flex justify-around text-center py-4 px-2">
          {[
            { n: "47+",   label: "Guides",        cls: "text-bronze-500" },
            { n: "28+",   label: "Chauffeurs",    cls: "text-sage-300"   },
            { n: "4.9★",  label: "Note",          cls: "text-charcoal-800" },
            { n: "1.2k+", label: "Réservations",  cls: "text-charcoal-800" },
          ].map((s, i) => (
            <div key={s.label} className="flex items-center">
              <div>
                <div className={`font-display text-lg font-bold ${s.cls}`}>{s.n}</div>
                <div className="text-[10px] text-charcoal-400 mt-0.5">{s.label}</div>
              </div>
              {i < 3 && <div className="w-px h-7 bg-sand-300 mx-3" />}
            </div>
          ))}
        </div>
      </div>

      {/* TOP GUIDES */}
      <section className="mt-8 px-4 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold text-charcoal-800">Top Guides</h2>
          <a href="/search" className="flex items-center gap-1 text-xs font-bold text-bronze-500">
            Voir tout <ArrowRight size={13} weight="bold" />
          </a>
        </div>

        <div className="grid grid-cols-2 gap-3 items-start">
          {guides.map((g) => (
            <a key={g.id} href={`/guide/${g.id}`} className="no-underline block">
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-sand-300 hover:shadow-md transition-shadow flex flex-col">
                <div className="relative h-44">
                  <img
                    src={g.avatar ?? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80"}
                    alt={g.displayName}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent" />

                  {/* Ville */}
                  <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2.5 py-1">
                    <MapPin size={10} color="#fff" weight="fill" />
                    <span className="text-white text-[11px] font-bold">{g.city}</span>
                  </div>

                  {/* Note */}
                  {g.avgRating > 0 && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1">
                    <Star size={10} color="#B88A44" weight="fill" />
                    <span className="text-charcoal-800 text-[11px] font-bold">{g.avgRating.toFixed(1)}</span>
                  </div>
                  )}

                  {/* Certifié */}
                  <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1">
                    <span className="text-[10px] font-bold text-sage-300">✓ Certifié</span>
                  </div>
                </div>

                <div className="p-3 flex flex-col flex-1">
                  <div className="font-display text-sm font-semibold text-charcoal-800 mb-1 truncate">
                    {g.displayName}
                  </div>
                  {g.yearsExp > 0 && (
                  <div className="flex items-center gap-1 text-charcoal-400 text-xs mb-2">
                    <Clock size={10} />
                    <span>{g.yearsExp} an{g.yearsExp > 1 ? "s" : ""} d'expérience</span>
                  </div>
                  )}

                  {g.languages?.length > 0 && (
                    <div className="flex gap-0.5 mb-3">
                      {g.languages.slice(0, 4).map((lang: string) => (
                        <span key={lang} className="text-base leading-none" title={lang}>
                          {LANG_FLAGS[lang] ?? "🏳️"}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-end justify-between mt-auto pt-2">
                    <div>
                      <div className="text-[10px] text-charcoal-400">À partir de</div>
                      <div className="font-display text-lg font-bold text-charcoal-800 leading-tight">
                        {toEur(g.halfDayPrice)}
                      </div>
                      <div className="text-[10px] text-charcoal-400">/ 2 pers.</div>
                    </div>
                    <span className="text-[11px] font-bold text-white bg-sage-300 px-3 py-2 rounded-full flex-shrink-0">
                      Voir le profil
                    </span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-4 text-center">
          <a href="/search"
            className="inline-flex items-center gap-2 border border-sand-300 text-charcoal-600 text-sm font-semibold px-6 py-3 rounded-full hover:border-bronze-500 transition-colors">
            Voir tous les guides <ArrowRight size={13} weight="bold" />
          </a>
        </div>
      </section>

      {/* VILLES */}
      <section className="mt-10 max-w-2xl mx-auto">
        <h2 className="font-display text-xl font-semibold text-charcoal-800 mb-4 px-4">Explorer par ville</h2>
        <div className="flex gap-3 px-4 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {CITIES.map((c) => (
            <a key={c.name} href={`/search?city=${encodeURIComponent(c.name)}`}
              className="relative flex-shrink-0 w-24 h-28 rounded-2xl overflow-hidden no-underline">
              <img src={c.img} alt={c.name} className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-black/35" />
              <div className="absolute bottom-2 left-0 right-0 text-center">
                <span className="text-white text-xs font-bold">{c.name}</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* POURQUOI */}
      <section className="mt-10 px-4 max-w-2xl mx-auto border-t border-sand-300 pt-8">
        <h2 className="font-display text-xl font-semibold text-charcoal-800 mb-5">Pourquoi Laksor ?</h2>
        <div className="grid grid-cols-2 gap-3">
          {TRUST.map((t) => (
            <div key={t.title} className="bg-white rounded-2xl p-4 border border-sand-300 shadow-sm">
              <t.Icon size={26} weight="duotone" className="text-bronze-500 mb-2" />
              <div className="text-sm font-bold text-charcoal-800 mb-1">{t.title}</div>
              <div className="text-xs text-charcoal-400 leading-relaxed">{t.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* JOIN */}
      <section className="mt-8 px-4 max-w-2xl mx-auto">
        <div className="bg-charcoal-800 rounded-3xl p-6 text-center">
          <div className="font-display text-xl font-semibold text-white mb-2">Rejoignez Laksor</div>
          <p className="text-sm text-charcoal-300 mb-5 leading-relaxed">
            Guide ou chauffeur ? Partagez votre expertise avec des voyageurs du monde entier.
          </p>
          <a href="/auth/register"
            className="inline-flex items-center gap-2 bg-bronze-500 hover:bg-bronze-600 text-white text-sm font-bold px-6 py-3 rounded-full no-underline transition-colors">
            Candidater <ArrowRight size={14} weight="bold" />
          </a>
        </div>
      </section>


      <BottomNav />
      <div className="h-20" />
    </div>
  );
}
