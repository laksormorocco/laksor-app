"use client";
import { useState } from "react";
import { CaretLeft, CaretRight, X, Sun, Moon } from "@phosphor-icons/react";

const DAYS   = ["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"];
const MONTHS = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];

type Slot = { date: string; duration: "half_am" | "half_pm" | "full" };

type Props = {
  blockedDates?: string[];
  priceHalfDay?: number;
  priceFullDay?: number;
  onSelectionChange?: (slots: Slot[], total: number) => void;
};

export default function CalendarPicker({
  blockedDates = [],
  priceHalfDay = 350,
  priceFullDay = 650,
  onSelectionChange,
}: Props) {
  const today = new Date(); today.setHours(0,0,0,0);
  const [current, setCurrent]   = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [slots,   setSlots]     = useState<Slot[]>([]);
  const [active,  setActive]    = useState<string | null>(null); // date active pour choisir créneau

  const year        = current.getFullYear();
  const month       = current.getMonth();
  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  function toStr(d: Date) { return d.toISOString().split("T")[0]; }
  function isPast(str: string) { return new Date(str + "T00:00:00") < today; }
  function isBlocked(str: string) { return blockedDates.includes(str) || isPast(str); }
  function getSlot(date: string): Slot | undefined { return slots.find(s => s.date === date); }
  function hasSlot(date: string): boolean { return !!getSlot(date); }

  function selectSlot(date: string, duration: Slot["duration"]) {
    const existing = getSlot(date);
    let newSlots: Slot[];
    if (existing && existing.duration === duration) {
      // désélectionner
      newSlots = slots.filter(s => s.date !== date);
    } else if (existing) {
      // changer le créneau
      newSlots = slots.map(s => s.date === date ? { ...s, duration } : s);
    } else {
      newSlots = [...slots, { date, duration }].sort((a, b) => a.date.localeCompare(b.date));
    }
    setSlots(newSlots);
    setActive(null);
    const total = newSlots.reduce((sum, s) => sum + (s.duration === "full" ? priceFullDay : priceHalfDay), 0);
    if (onSelectionChange) onSelectionChange(newSlots, total);
  }

  function removeSlot(date: string) {
    const newSlots = slots.filter(s => s.date !== date);
    setSlots(newSlots);
    const total = newSlots.reduce((sum, s) => sum + (s.duration === "full" ? priceFullDay : priceHalfDay), 0);
    if (onSelectionChange) onSelectionChange(newSlots, total);
  }

  function clearAll() {
    setSlots([]); setActive(null);
    if (onSelectionChange) onSelectionChange([], 0);
  }

  function handleDayClick(str: string) {
    if (isBlocked(str)) return;
    setActive(active === str ? null : str);
  }

  const cells: (string|null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let i = 1; i <= daysInMonth; i++) cells.push(toStr(new Date(year, month, i)));

  const total = slots.reduce((sum, s) => sum + (s.duration === "full" ? priceFullDay : priceHalfDay), 0);

  function durationLabel(d: Slot["duration"]) {
    if (d === "half_am") return "Matin";
    if (d === "half_pm") return "Après-midi";
    return "Journée";
  }

  return (
    <div className="bg-white rounded-2xl border border-sand-300 overflow-hidden">

      {/* ── NAVIGATION MOIS ── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-sand-200">
        <button
          onClick={() => setCurrent(new Date(year, month - 1, 1))}
          className="w-9 h-9 rounded-full border border-sand-300 flex items-center justify-center text-charcoal-600 hover:border-bronze-500 hover:text-bronze-500 transition-colors"
        >
          <CaretLeft size={16} weight="bold" />
        </button>
        <span className="font-display text-base font-semibold text-charcoal-800">
          {MONTHS[month]} {year}
        </span>
        <button
          onClick={() => setCurrent(new Date(year, month + 1, 1))}
          className="w-9 h-9 rounded-full border border-sand-300 flex items-center justify-center text-charcoal-600 hover:border-bronze-500 hover:text-bronze-500 transition-colors"
        >
          <CaretRight size={16} weight="bold" />
        </button>
      </div>

      {/* ── JOURS HEADER ── */}
      <div className="grid grid-cols-7 px-3 pt-3 pb-1">
        {DAYS.map(d => (
          <div key={d} className="text-center text-[11px] font-bold text-charcoal-400">{d}</div>
        ))}
      </div>

      {/* ── GRILLE ── */}
      <div className="grid grid-cols-7 gap-1 px-3 pb-2">
        {cells.map((str, i) => {
          if (!str) return <div key={"e" + i} />;
          const blocked  = isBlocked(str);
          const selected = hasSlot(str);
          const isActiveDay = active === str;
          const day = new Date(str + "T00:00:00").getDate();

          return (
            <button
              key={i}
              onClick={() => handleDayClick(str)}
              disabled={blocked}
              className={`
                aspect-square rounded-full text-[13px] font-medium transition-all flex items-center justify-center relative
                ${selected
                  ? "bg-bronze-500 text-white font-bold ring-2 ring-bronze-300"
                  : isActiveDay
                    ? "bg-sand-300 text-charcoal-800 font-bold"
                    : blocked
                      ? "text-charcoal-300 cursor-not-allowed line-through"
                      : "text-charcoal-700 hover:bg-sand-200 cursor-pointer"}
              `}
            >
              {day}
              {selected && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-sage-300 rounded-full border border-white" />
              )}
            </button>
          );
        })}
      </div>

      {/* ── PICKER CRÉNEAU (popup inline) ── */}
      {active && (
        <div className="mx-3 mb-3 bg-sand-100 rounded-xl p-3 border border-sand-300">
          <div className="text-xs font-bold text-charcoal-400 uppercase tracking-wider mb-2">
            {new Date(active + "T00:00:00").toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {([
              ["half_am", <Sun size={14} weight="fill" />, "Matin", "4h", priceHalfDay],
              ["half_pm", <Moon size={14} weight="fill" />, "Après-midi", "4h", priceHalfDay],
              ["full",    <span className="text-xs">☀️🌙</span>, "Journée", "8h", priceFullDay],
            ] as const).map(([val, icon, label, hours, price]) => {
              const currentSlot = getSlot(active);
              const isSel = currentSlot?.duration === val;
              return (
                <button
                  key={val}
                  onClick={() => selectSlot(active, val)}
                  className={`flex flex-col items-center p-2.5 rounded-xl border-2 transition-all
                    ${isSel
                      ? "border-bronze-500 bg-bronze-50"
                      : "border-sand-300 bg-white hover:border-sand-400"}`}
                >
                  <span className={`mb-1 ${isSel ? "text-bronze-500" : "text-charcoal-400"}`}>{icon}</span>
                  <span className={`text-[11px] font-bold ${isSel ? "text-bronze-500" : "text-charcoal-600"}`}>{label}</span>
                  <span className="text-[10px] text-charcoal-400">{hours}</span>
                  <span className={`text-[11px] font-bold mt-1 ${isSel ? "text-charcoal-800" : "text-charcoal-500"}`}>{price} MAD</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── LÉGENDE ── */}
      <div className="flex gap-4 px-4 py-2 border-t border-sand-200">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-bronze-500" />
          <span className="text-[10px] text-charcoal-400 font-medium">Sélectionné</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-charcoal-300" />
          <span className="text-[10px] text-charcoal-400 font-medium">Indisponible</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-sage-300" />
          <span className="text-[10px] text-charcoal-400 font-medium">Créneau ajouté</span>
        </div>
      </div>

      {/* ── RÉCAP SÉLECTION ── */}
      {slots.length > 0 && (
        <div className="mx-3 mb-3 bg-sand-200 rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-charcoal-800">
              {slots.length} créneau{slots.length > 1 ? "x" : ""} sélectionné{slots.length > 1 ? "s" : ""}
            </span>
            <button
              onClick={clearAll}
              className="text-[11px] font-bold text-charcoal-400 underline"
            >
              Tout effacer
            </button>
          </div>

          <div className="flex flex-col gap-1.5 mb-3">
            {slots.map(s => (
              <div key={s.date} className="flex items-center justify-between bg-white rounded-lg px-3 py-2">
                <div>
                  <span className="text-xs font-bold text-charcoal-800">
                    {new Date(s.date + "T00:00:00").toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" })}
                  </span>
                  <span className="text-[11px] text-charcoal-400 ml-2">{durationLabel(s.duration)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-bronze-500">
                    {s.duration === "full" ? priceFullDay : priceHalfDay} MAD
                  </span>
                  <button
                    onClick={() => removeSlot(s.date)}
                    className="w-5 h-5 rounded-full bg-sand-300 flex items-center justify-center"
                  >
                    <X size={10} weight="bold" className="text-charcoal-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-sand-300">
            <span className="text-xs text-charcoal-500 font-medium">Total</span>
            <span className="font-display text-lg font-bold text-charcoal-800">{total} MAD</span>
          </div>
        </div>
      )}
    </div>
  );
}
