"use client";
import { useExchangeRate } from "@/hooks/useExchangeRate";
import { useState } from "react";
import {
  MagnifyingGlass, MapPin, CalendarBlank, Users, Globe,
  X, Compass, Car, SunHorizon, AirplaneTakeoff, Check,
  Minus, Plus
} from "@phosphor-icons/react";

const CITIES = ["Marrakech", "Fès", "Chefchaouen", "Essaouira", "Agadir"];
const CITY_META: Record<string, { icon: string; desc: string }> = {
  "Marrakech":   { icon: "🕌", desc: "Médina, Jardin Majorelle, souks" },
  "Fès":         { icon: "🏺", desc: "Plus ancienne médina du monde" },
  "Chefchaouen": { icon: "💙", desc: "La ville bleue du Rif" },
  "Essaouira":   { icon: "🌊", desc: "Côte atlantique, médina fortifiée" },
  "Agadir":      { icon: "☀️", desc: "Destination balnéaire prisée" },
};
const LANGS: Record<string, string> = {
  "Français": "🇫🇷", "Anglais": "🇬🇧", "Espagnol": "🇪🇸",
  "Allemand": "🇩🇪", "Italien": "🇮🇹", "Arabe": "🇲🇦",
};

type Acc   = "dest" | "date" | "pers" | "lang" | null;
type Mode  = "guides" | "transport";
type TType = "airport" | "private";

export default function HomeHero() {
  const [open, setOpen]     = useState(false);
  const [mode, setMode]     = useState<Mode>("guides");
  const [acc, setAcc]       = useState<Acc>("dest");

  const [dest, setDest]     = useState("");
  const [date, setDate]     = useState("");
  const [dur, setDur]       = useState<"half"|"full">("half");
  const [adults, setAdults] = useState(0);
  const [kids, setKids]     = useState(0);
  const [langs, setLangs]   = useState<string[]>([]);

  const [tType, setTType]   = useState<TType>("airport");
  const [tCity, setTCity]   = useState("");
  const [tDate, setTDate]   = useState("");
  const [tPax, setTPax]     = useState(1);
  const [tFlight, setTFlight] = useState("");

  const totalPax = adults + kids;
  const pillSub  = [
    dest || "Destination",
    date ? new Date(date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) : "Dates",
    totalPax > 0 ? `${totalPax} pers.` : "Voyageurs",
  ].join(" · ");

  function openModal(m: Mode) { setMode(m); setAcc("dest"); setOpen(true); }
  function toggleAcc(id: Acc) { setAcc(p => p === id ? null : id); }
  function toggleLang(l: string) { setLangs(p => p.includes(l) ? p.filter(x => x !== l) : [...p, l]); setAcc(null); }
  function selectDest(c: string) { setDest(c); setAcc("date"); }
  function handleDate(v: string) { setDate(v); setTimeout(() => setAcc("pers"), 200); }
  function clearAll() {
    setDest(""); setDate(""); setAdults(0); setKids(0); setLangs([]);
    setTCity(""); setTDate(""); setTPax(1); setTFlight(""); setAcc("dest");
  }
  function doSearch() {
    setOpen(false);
    if (mode === "guides") {
      const p = new URLSearchParams();
      if (dest) p.set("city", dest);
      if (date) p.set("date", date);
      p.set("duration", dur);
      if (totalPax > 0) p.set("persons", String(totalPax));
      if (langs.length) p.set("languages", langs.join(","));
      window.location.href = `/search?${p}`;
    } else {
      const p = new URLSearchParams({ type: tType });
      if (tCity)   p.set("city", tCity);
      if (tDate)   p.set("date", tDate);
      p.set("pax", String(tPax));
      if (tFlight) p.set("flight", tFlight);
      window.location.href = `/transport?${p}`;
    }
  }

  return (
    <>
      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-30 bg-white border-b border-sand-300">
        <div className="flex items-center h-16 px-3 gap-2">
          <a href="/" className="flex items-center gap-2 flex-shrink-0 no-underline">
            <div className="w-9 h-9 rounded-xl bg-bronze-500 flex items-center justify-center">
              <Compass size={18} weight="bold" color="#fff" />
            </div>
            <span className="font-display text-lg text-bronze-500 font-semibold">Laksor</span>
          </a>
          <button
            onClick={() => openModal("guides")}
            className="flex items-center gap-2 flex-1 bg-white border border-sand-300 rounded-full pl-3 pr-1.5 py-1.5 shadow-sm text-left hover:shadow-md transition-shadow min-w-0"
          >
            <MagnifyingGlass size={13} weight="bold" className="text-charcoal-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="block text-[12px] font-bold text-charcoal-800 truncate">Commencer ma recherche</span>
              <span className="block text-[10px] text-charcoal-400 truncate">{pillSub}</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-bronze-500 flex items-center justify-center flex-shrink-0">
              <MagnifyingGlass size={13} weight="bold" color="#fff" />
            </div>
          </button>
        </div>
      </nav>

      {/* ── TABS ── */}
      <div className="flex justify-center border-b border-sand-300 bg-white overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {[
          { id: "guides",       icon: <Compass size={20} />,    label: "Guides"       },
          { id: "experiences",  icon: <SunHorizon size={20} />, label: "Expériences", badge: true },
          { id: "transport",    icon: <Car size={20} />,        label: "Transport",   badge: true },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => t.id !== "experiences" && openModal(t.id as Mode)}
            className={`relative flex flex-col items-center gap-1 px-5 pt-3 pb-3 text-xs font-semibold border-b-2 flex-shrink-0 transition-colors
              ${t.id === "guides"
                ? "text-charcoal-800 border-charcoal-800"
                : "text-charcoal-400 border-transparent hover:text-charcoal-600"}`}
          >
            <span className={t.id === "guides" ? "text-bronze-500" : "text-charcoal-400"}>
              {t.icon}
            </span>
            <span>{t.label}</span>
            {t.badge && (
              <span className="absolute top-1.5 right-0 bg-charcoal-800 text-white text-[8px] font-black px-1 py-0.5 rounded">
                NEW
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── OVERLAY ── */}
      {open && <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setOpen(false)} />}

      {/* ── MODAL ── */}
      {open && (
        <div className="fixed inset-x-0 top-0 bottom-16 z-50 bg-white flex flex-col">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-sand-300">
            <div className="flex gap-1">
              {(["guides", "transport"] as Mode[]).map(m => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setAcc("dest"); }}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all
                    ${mode === m
                      ? "bg-charcoal-800 text-white"
                      : "text-charcoal-400 hover:text-charcoal-800"}`}
                >
                  {m === "guides" ? "Guides" : "Transport"}
                </button>
              ))}
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-8 h-8 rounded-full border border-sand-300 flex items-center justify-center text-charcoal-700 hover:bg-sand-200"
            >
              <X size={16} weight="bold" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4 flex flex-col gap-3">

            {/* ── GUIDES ── */}
            {mode === "guides" && (
              <>
                <AccBlock active={acc === "dest"} onToggle={() => toggleAcc("dest")}
                  label="Où ?" icon={<MapPin size={15} weight="fill" className="text-bronze-500" />}
                  value={dest ? `${CITY_META[dest]?.icon} ${dest}` : undefined}
                  placeholder="Rechercher une destination">
                  <div className="flex items-center gap-2 bg-sand-200 rounded-xl px-3 py-2.5 mb-3">
                    <MagnifyingGlass size={14} className="text-charcoal-400" />
                    <input className="flex-1 bg-transparent text-sm text-charcoal-800 outline-none placeholder-charcoal-400"
                      placeholder="Rechercher une destina..." />
                  </div>
                  <p className="text-[11px] font-bold text-charcoal-400 uppercase tracking-wider mb-2">
                    Suggestions
                  </p>
                  {CITIES.map(city => (
                    <button key={city} onClick={() => selectDest(city)}
                      className="flex items-center gap-3 w-full py-2.5 border-b border-sand-200 last:border-0 text-left hover:bg-sand-100">
                      <div className="w-10 h-10 rounded-xl bg-sand-200 flex items-center justify-center text-xl flex-shrink-0">
                        {CITY_META[city].icon}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-charcoal-800">{city}, Maroc</div>
                        <div className="text-xs text-charcoal-400 mt-0.5">{CITY_META[city].desc}</div>
                      </div>
                      {dest === city && <Check size={15} className="text-bronze-500" weight="bold" />}
                    </button>
                  ))}
                </AccBlock>

                <AccBlock active={acc === "date"} onToggle={() => toggleAcc("date")}
                  label="Quand ?" icon={<CalendarBlank size={15} weight="fill" className="text-bronze-500" />}
                  value={date ? new Date(date).toLocaleDateString("fr-FR", { day: "numeric", month: "long" }) : undefined}
                  placeholder="Ajouter des dates">
                  <MiniCal value={date} onChange={handleDate} />
                  <div className="flex gap-2 mt-2">
                    {([{ id: "half", label: "Demi-journee" }, { id: "full", label: "Journee complete" }] as {id:"half"|"full", label:string}[]).map(d => (
                      <button key={d.id} onClick={() => setDur(d.id as "half"|"full")}
                        className={`flex-1 px-3 py-2 rounded-full text-xs font-semibold border transition-all ${
                          dur === d.id ? "border-charcoal-800 text-charcoal-800 bg-sand-200" : "border-sand-300 text-charcoal-400"}`}>
                        {d.label}
                      </button>
                    ))}
                  </div>
                </AccBlock>

                <AccBlock active={acc === "pers"} onToggle={() => toggleAcc("pers")}
                  label="Voyageurs" icon={<Users size={15} weight="fill" className="text-bronze-500" />}
                  value={totalPax > 0 ? `${totalPax} voyageur${totalPax > 1 ? "s" : ""}` : undefined}
                  placeholder="Ajouter des voyageurs">
                  <CounterRow label="Adultes" sub="13 ans et plus" val={adults} min={0}
                    onDec={() => setAdults(Math.max(0, adults - 1))} onInc={() => setAdults(adults + 1)} />
                  <div className="border-t border-sand-200 mt-3 pt-3">
                    <CounterRow label="Enfants" sub="4 – 12 ans" val={kids} min={0}
                      onDec={() => setKids(Math.max(0, kids - 1))} onInc={() => setKids(kids + 1)} />
                  </div>
                </AccBlock>

                <AccBlock active={acc === "lang"} onToggle={() => toggleAcc("lang")}
                  label="Langue du guide" icon={<Globe size={15} weight="fill" className="text-bronze-500" />}
                  value={langs.length > 0 ? langs.map(l => LANGS[l]).join("  ") : undefined}
                  placeholder="Toutes les langues">
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(LANGS).map(([l, f]) => (
                      <button key={l} onClick={() => toggleLang(l)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold border transition-all
                          ${langs.includes(l)
                            ? "border-charcoal-800 text-charcoal-800 bg-sand-200"
                            : "border-sand-300 text-charcoal-400"}`}>
                        <span>{f}</span>{l}
                      </button>
                    ))}
                  </div>
                </AccBlock>
              </>
            )}

            {/* ── TRANSPORT ── */}
            {mode === "transport" && (
              <>
                <div className="grid grid-cols-2 gap-3 mb-1">
                  {[
                    { id: "airport" as TType, icon: <AirplaneTakeoff size={24} weight="duotone" />, label: "Transfert Aéroport", desc: "Arrivée · Départ · A/R" },
                    { id: "private"  as TType, icon: <Car size={24} weight="duotone" />,             label: "Chauffeur Privé",    desc: "Ville · Excursion" },
                  ].map(t => (
                    <button key={t.id} onClick={() => { setTType(t.id); }}
                      className={`p-4 rounded-2xl border-2 text-left transition-all
                        ${tType === t.id ? "border-charcoal-800 bg-sand-200" : "border-sand-300 bg-white"}`}>
                      <div className={`mb-2 ${tType === t.id ? "text-bronze-500" : "text-charcoal-400"}`}>{t.icon}</div>
                      <div className="text-sm font-bold text-charcoal-800">{t.label}</div>
                      <div className="text-xs text-charcoal-400 mt-0.5">{t.desc}</div>
                    </button>
                  ))}
                </div>

                <AccBlock active={acc === "dest"} onToggle={() => toggleAcc("dest")} label="Ville"
                  icon={<MapPin size={15} weight="fill" className="text-bronze-500" />}
                  value={tCity || undefined} placeholder="Choisir une ville">
                  {CITIES.map(city => (
                    <button key={city} onClick={() => { setTCity(city); setAcc(null); }}
                      className="flex items-center gap-3 w-full py-2.5 border-b border-sand-200 last:border-0 text-left hover:bg-sand-100">
                      <div className="w-10 h-10 rounded-xl bg-sand-200 flex items-center justify-center text-xl flex-shrink-0">
                        {CITY_META[city].icon}
                      </div>
                      <span className="text-sm font-bold text-charcoal-800 flex-1">{city}</span>
                      {tCity === city && <Check size={15} className="text-bronze-500" weight="bold" />}
                    </button>
                  ))}
                </AccBlock>

                <div className="border-2 border-sand-300 rounded-2xl overflow-hidden">
                  <div className="px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users size={15} weight="fill" className="text-bronze-500" />
                      <span className="text-xs font-bold text-charcoal-400 uppercase tracking-wide">Voyageurs</span>
                    </div>
                    <span className="text-sm font-bold text-charcoal-800">{tPax} personne{tPax > 1 ? "s" : ""}</span>
                  </div>
                  <div className="px-4 pb-4">
                    <CounterRow label="Personnes" sub="Adultes et enfants" val={tPax} min={1}
                      onDec={() => setTPax(Math.max(1, tPax - 1))} onInc={() => setTPax(Math.min(12, tPax + 1))} />
                  </div>
                </div>

                <AccBlock active={false} onToggle={() => {}} label="Date"
                  icon={<CalendarBlank size={15} weight="fill" className="text-bronze-500" />}
                  value={tDate ? new Date(tDate).toLocaleDateString("fr-FR", { day: "numeric", month: "long" }) : undefined}
                  placeholder="Ajouter une date">
                  <input type="date" value={tDate} onChange={e => { setTDate(e.target.value); setTimeout(() => setAcc(null), 200); }}
                    className="w-full border border-sand-300 rounded-xl px-3 py-2.5 text-sm text-charcoal-800 outline-none focus:border-bronze-500" />
                </AccBlock>

                {tType === "airport" && (
                  <AccBlock active={acc === "lang"} onToggle={() => toggleAcc("lang")} label="N° de vol"
                    icon={<AirplaneTakeoff size={15} weight="fill" className="text-bronze-500" />}
                    value={tFlight || undefined} placeholder="Ex : AT 456">
                    <div className="flex items-center gap-2 bg-sand-200 rounded-xl px-3 py-2.5">
                      <AirplaneTakeoff size={14} className="text-charcoal-400" />
                      <input className="flex-1 bg-transparent text-sm text-charcoal-800 outline-none placeholder-charcoal-400"
                        placeholder="AT 456" value={tFlight} onChange={e => setTFlight(e.target.value)} />
                    </div>
                  </AccBlock>
                )}
              </>
            )}
          </div>

          {/* Bottom */}
          <div className="flex-shrink-0 bg-white border-t border-sand-300 px-4 py-4 flex items-center justify-between shadow-lg" style={{marginBottom:"64px"}}>
            <button onClick={clearAll} className="text-sm font-bold text-charcoal-800 underline">
              Tout effacer
            </button>
            <button onClick={doSearch}
              className="flex items-center gap-2 bg-bronze-500 hover:bg-bronze-600 text-white text-sm font-bold px-6 py-3 rounded-full transition-colors">
              <MagnifyingGlass size={15} weight="bold" /> Rechercher
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function AccBlock({ active, onToggle, label, icon, value, placeholder, children }: {
  active: boolean; onToggle: () => void; label: string; icon: React.ReactNode;
  value?: string; placeholder: string; children: React.ReactNode;
}) {
  return (
    <div className={`border-2 rounded-2xl overflow-hidden transition-all ${active ? "border-charcoal-800 shadow-md" : "border-sand-300"}`}>
      <button onClick={onToggle} className="flex items-center justify-between w-full px-4 py-3.5 text-left">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-xs font-bold text-charcoal-400 uppercase tracking-wide">{label}</span>
        </div>
        {value
          ? <span className="text-sm font-bold text-charcoal-800">{value}</span>
          : <span className="text-sm text-charcoal-300">{placeholder}</span>}
      </button>
      {active && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

function CounterRow({ label, sub, val, min, onDec, onInc }: {
  label: string; sub: string; val: number; min: number;
  onDec: () => void; onInc: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="text-sm font-semibold text-charcoal-800">{label}</div>
        <div className="text-xs text-charcoal-400">{sub}</div>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={onDec} disabled={val <= min}
          className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all
            ${val <= min ? "border-sand-300 text-sand-400 cursor-default" : "border-sand-400 text-charcoal-700 hover:border-charcoal-800"}`}>
          <Minus size={13} weight="bold" />
        </button>
        <span className="text-sm font-bold text-charcoal-800 w-4 text-center">{val}</span>
        <button onClick={onInc}
          className="w-8 h-8 rounded-full border border-sand-400 flex items-center justify-center text-charcoal-700 hover:border-charcoal-800 transition-all">
          <Plus size={13} weight="bold" />
        </button>
      </div>
    </div>
  );
}

function MiniCal({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const today = new Date(); today.setHours(0,0,0,0);
  const [cur, setCur] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const MONTHS = ["Janvier","Fevrier","Mars","Avril","Mai","Juin","Juillet","Aout","Septembre","Octobre","Novembre","Decembre"];
  const DAYS = ["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"];
  const year = cur.getFullYear();
  const month = cur.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number|null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let i = 1; i <= daysInMonth; i++) cells.push(i);
  function toStr(d: number) {
    return year + "-" + String(month+1).padStart(2,"0") + "-" + String(d).padStart(2,"0");
  }
  function isPast(d: number) { return new Date(year, month, d) < today; }
  const selDate = value ? new Date(value + "T00:00:00") : null;

  return (
    <div className="bg-white rounded-2xl border border-sand-300 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-sand-200">
        <button onClick={() => setCur(new Date(year, month-1, 1))}
          className="w-8 h-8 rounded-full border border-sand-300 flex items-center justify-center text-charcoal-600 hover:border-bronze-500 transition-colors text-sm font-bold">
          &lt;
        </button>
        <span className="font-display text-sm font-semibold text-charcoal-800">{MONTHS[month]} {year}</span>
        <button onClick={() => setCur(new Date(year, month+1, 1))}
          className="w-8 h-8 rounded-full border border-sand-300 flex items-center justify-center text-charcoal-600 hover:border-bronze-500 transition-colors text-sm font-bold">
          &gt;
        </button>
      </div>
      <div className="grid grid-cols-7 px-3 pt-2 pb-1">
        {DAYS.map(d => <div key={d} className="text-center text-[10px] font-bold text-charcoal-400">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1 px-3 pb-3">
        {cells.map((d, i) => {
          if (!d) return <div key={"e"+i} />;
          const str = toStr(d);
          const past = isPast(d);
          const sel = selDate && str === value;
          return (
            <button key={i} disabled={past} onClick={() => onChange(str)}
              className={`aspect-square rounded-full text-xs font-medium transition-all flex items-center justify-center
                ${sel ? "bg-bronze-500 text-white font-bold" : past ? "text-charcoal-300 cursor-not-allowed" : "text-charcoal-700 hover:bg-sand-200"}`}>
              {d}
            </button>
          );
        })}
      </div>
      {value && (
        <div className="px-3 pb-3">
          <div className="bg-sage-300/10 border border-sage-300/30 rounded-xl px-3 py-2 text-xs font-semibold text-sage-300 text-center capitalize">
            {new Date(value + "T00:00:00").toLocaleDateString("fr-FR", { weekday:"long", day:"numeric", month:"long" })}
          </div>
        </div>
      )}
    </div>
  );
}
