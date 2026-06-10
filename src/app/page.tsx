export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import HomeHero from "./HomeHero";
import BottomNav from "@/components/BottomNav";
import AnimatedSection from "@/components/AnimatedSection";
import Footer from "@/components/Footer";
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
    <div className="bg-sand-200">

      <HomeHero />

      {/* STATS */}
      <AnimatedSection className="px-4 mt-4 max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md flex justify-around text-center py-4 px-2 animate-fade-up">
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
      </AnimatedSection>

      {/* TOP GUIDES */}
      <AnimatedSection className="mt-8 px-4 max-w-2xl mx-auto" delay={100}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold text-charcoal-800 animate-fade-up">Top Guides</h2>
          <a href="/search" className="flex items-center gap-1 text-xs font-bold text-bronze-500">
            Voir tout <ArrowRight size={13} weight="bold" />
          </a>
        </div>

    <div className="grid grid-cols-2 gap-3 items-stretch">
          {guides.map((g, idx) => (
            <a key={g.id} href={`/guide/${g.slug || g.id}`} className="no-underline block active:scale-[0.95] active:opacity-90 transition-all duration-150 animate-fade-up" style={{animationDelay: `${idx * 200}ms`, animationFillMode:"both"}}>
              <div className="bg-white overflow-hidden flex flex-col h-full" style={{borderRadius:20, boxShadow:"0 2px 14px rgba(0,0,0,0.08)"}}>
                <div className="relative" style={{height:180}}>
                  <img
                    src={g.avatar ?? "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=400&q=80"}
                    alt={g.displayName}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0" style={{background:"linear-gradient(to bottom, rgba(0,0,0,0) 35%, rgba(0,0,0,0.65) 100%)"}} />
                  {g.avgRating > 0 && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full"
                      style={{background:"rgba(255,255,255,0.92)", backdropFilter:"blur(8px)"}}>
                      <Star size={9} weight="fill" className="text-amber-400" />
                      <span className="text-[10px] font-bold text-charcoal-800">{g.avgRating.toFixed(1)}</span>
                    </div>
                  )}
                  <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-bold"
                    style={{background:"rgba(255,255,255,0.92)", backdropFilter:"blur(8px)", color:"#7D8F69"}}>
                    ✦ Certifié
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 px-2.5 pb-2.5">
                    <div className="text-[9px] font-bold uppercase tracking-widest mb-0.5" style={{color:"#B88A44"}}>{g.city}</div>
                    <div className="font-display text-sm font-bold text-white leading-tight truncate">{g.displayName}</div>
                  </div>
                </div>
                <div className="p-2.5 flex flex-col flex-1">
                  {g.languages?.length > 0 && (
                    <div className="flex gap-0.5 mb-2">
                      {g.languages.slice(0, 4).map((lang: string) => (
                        <span key={lang} className="text-sm leading-none">{LANG_FLAGS[lang] ?? "🏳️"}</span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-end justify-between mt-auto pt-2" style={{borderTop:"1px solid #F6F1E8"}}>
                    <div>
                      <div className="text-[9px] text-charcoal-400">À partir de</div>
                      <div className="font-display text-base font-bold leading-tight" style={{color:"#B88A44"}}>{toEur(g.halfDayPrice)}</div>
                      <div className="text-[9px] text-charcoal-400">/ groupe · 1-4 pers.</div>
                    </div>
                    <span className="text-[10px] font-bold text-white px-3 py-1.5 rounded-full flex-shrink-0"
                      style={{background:"linear-gradient(135deg, #B88A44, #9A7238)"}}>
                      Voir →
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
      </AnimatedSection>

      {/* VILLES */}
      <AnimatedSection className="mt-10 max-w-2xl mx-auto" delay={200}>
        <h2 className="font-display text-xl font-semibold text-charcoal-800 mb-4 px-4 animate-fade-up">Explorer par ville</h2>
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
      </AnimatedSection>

      {/* POURQUOI */}
<AnimatedSection className="mt-10 px-4 max-w-2xl mx-auto border-t border-sand-300 pt-8" delay={300}>
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
      </AnimatedSection>

      {/* JOIN */}
<AnimatedSection className="mt-8 px-4 max-w-2xl mx-auto pb-4" delay={400}>
        <div className="relative rounded-3xl overflow-hidden" style={{background:"linear-gradient(135deg, #111111 0%, #2a1f0e 100%)"}}>
          <div className="absolute inset-0 opacity-10" style={{backgroundImage:"url(https://images.unsplash.com/photo-1647878501041-1609141a7fb1?q=80&w=1971&auto=format&fit=crop)", backgroundSize:"cover", backgroundPosition:"center"}} />
          <div className="relative p-6">
            <div className="inline-flex items-center gap-1.5 bg-bronze-500/20 border border-bronze-500/30 rounded-full px-3 py-1 mb-4">
              <span className="text-bronze-500 text-[10px] font-bold uppercase tracking-widest">Devenez partenaire</span>
            </div>
            <div className="font-display text-2xl font-bold text-white mb-2 leading-tight">Partagez le Maroc<br/>avec le monde</div>
            <p className="text-sm text-white/60 mb-5 leading-relaxed">
              Rejoignez notre communaute de guides et chauffeurs certifies. Gagnez plus, voyagez mieux.
            </p>
            <div className="flex gap-3">
              <a href="/auth/register?role=guide"
                className="flex-1 flex items-center justify-center gap-2 bg-bronze-500 text-white text-sm font-bold py-3 rounded-full no-underline transition-colors" style={{boxShadow:"0 4px 14px rgba(184,138,68,0.4)"}}>
                Je suis guide
              </a>
              <a href="/auth/register?role=driver"
                className="flex-1 flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white text-sm font-bold py-3 rounded-full no-underline backdrop-blur-sm">
                Je suis chauffeur
              </a>
            </div>
            <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-white/10">
              <div className="text-center">
                <div className="font-display text-lg font-bold text-white">+50</div>
                <div className="text-[10px] text-white/50">Guides actifs</div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center">
                <div className="font-display text-lg font-bold text-white">5</div>
                <div className="text-[10px] text-white/50">Villes</div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center">
                <div className="font-display text-lg font-bold text-white">4.9★</div>
                <div className="text-[10px] text-white/50">Note moyenne</div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>


      <Footer />
      <BottomNav />
      <div className="h-20" />
    </div>
  );
}
