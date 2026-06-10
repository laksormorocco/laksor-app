"use client";
import { useState, useEffect } from "react";
import { ArrowLeft, Image, MapPin, CurrencyDollar, ListBullets, Tag } from "@phosphor-icons/react";

const inputCls = "w-full border border-sand-300 rounded-xl px-4 py-3 text-sm text-charcoal-800 bg-white outline-none focus:border-bronze-500 transition-colors";

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-sand-200 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-sand-100" style={{background:"rgba(184,138,68,0.05)"}}>
        <span className="text-bronze-500">{icon}</span>
        <span className="text-xs font-bold text-charcoal-700 uppercase tracking-widest">{title}</span>
      </div>
      <div className="px-4 py-4 flex flex-col gap-4">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-semibold text-charcoal-400 mb-1.5">{label}</div>
      {children}
    </div>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: () => void }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm text-charcoal-700">{label}</span>
      <button onClick={onChange}
        className={"w-11 h-6 rounded-full relative transition-colors " + (value ? "bg-bronze-500" : "bg-sand-300")}>
        <div className={"w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm " + (value ? "left-5" : "left-0.5")} />
      </button>
    </div>
  );
}

export default function EditExperiencePage() {
  const expId = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("id") : null;

  const [form, setForm] = useState({
    title: "", description: "", price: "", city: "",
    meetingPoint: "", duration: "4h", groupSize: "1-8 pers.",
    providerContact: "", tags: "", included: "", notIncluded: "",
    photos: [] as string[], transportRequired: false,
    itinerary_raw: "",
    privatePricePerPerson: "",
    groupThreshold1: "", groupDiscount1: "",
    groupThreshold2: "", groupDiscount2: ""
  });
  const [saving, setSaving] = useState(false);

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  useEffect(() => {
    if (expId) {
      fetch("/api/admin/experiences?id=" + expId)
        .then(r => r.json())
        .then(d => {
          const exp = d.experience;
          if (exp) setForm({
            title: exp.title || "",
            description: exp.description || "",
            price: String(exp.price || ""),
            city: exp.city || "",
            meetingPoint: exp.meetingPoint || "",
            duration: exp.duration || "4h",
            groupSize: exp.groupSize || "1-8 pers.",
            providerContact: exp.providerContact || "",
            tags: (exp.tags || []).join(", "),
            included: (exp.included || []).join(", "),
            notIncluded: (exp.notIncluded || []).join(", "),
            photos: exp.photos || [],
            transportRequired: exp.transportRequired || false,
            privatePricePerPerson: String(exp.privatePricePerPerson || ""),
            itinerary_raw: (exp.itinerary || []).map((s: any) => [s.time, s.title, s.desc].join("|")).join("\n"),
            groupThreshold1: String(exp.groupThreshold1 || ""),
            groupDiscount1: String(exp.groupDiscount1 || ""),
            groupThreshold2: String(exp.groupThreshold2 || ""),
            groupDiscount2: String(exp.groupDiscount2 || ""),
          });
        });
    }
  }, [expId]);

  function parseItinerary(raw: string) {
    return raw.split("\n").filter(Boolean).map((l: string) => {
      const [time, title, desc] = l.split("|").map((s: string) => s.trim());
      return { time: time || "", title: title || l, desc: desc || "" };
    });
  }

  async function save() {
    if (!form.title || !form.price) return alert("Titre et prix requis");
    setSaving(true);
    const clean = (s: string) => s.replace(/\s+/g, " ").trim();
    const data: any = {
      id: expId,
      title: clean(form.title), description: clean(form.description),
      price: Number(form.price), city: form.city,
      meetingPoint: clean(form.meetingPoint), duration: form.duration,
      groupSize: form.groupSize, difficulty: "Facile",
      providerContact: form.providerContact,
      tags: form.tags ? form.tags.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
      privatePricePerPerson: form.privatePricePerPerson ? Number(form.privatePricePerPerson) : undefined,
      itinerary: form.itinerary_raw ? parseItinerary(form.itinerary_raw) : [],
      included: form.included ? form.included.replace(/\n/g, ",").split(",").map((s: string) => s.trim()).filter(Boolean) : [],
      notIncluded: form.notIncluded ? form.notIncluded.replace(/\n/g, ",").split(",").map((s: string) => s.trim()).filter(Boolean) : [],
      photos: form.photos, transportRequired: form.transportRequired,
      groupThreshold1: form.groupThreshold1 ? Number(form.groupThreshold1) : undefined,
      groupDiscount1: form.groupDiscount1 ? Number(form.groupDiscount1) : undefined,
      groupThreshold2: form.groupThreshold2 ? Number(form.groupThreshold2) : undefined,
      groupDiscount2: form.groupDiscount2 ? Number(form.groupDiscount2) : undefined,
      status: "APPROVED", isActive: true,
    };
    console.log("DATA SENT:", JSON.stringify(data)); const res = await fetch("/api/guide/experiences", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (res.ok) { window.location.href = "/dashboard/admin"; }
    else { const errText = await res.text().catch(() => "unknown"); alert("Status: " + res.status + " | " + errText.slice(0, 300)); }
    setSaving(false);
  }

  return (
    <div className="min-h-screen pb-10" style={{background:"#F6F1E8"}}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-sand-200 bg-white sticky top-0 z-30">
        <button onClick={() => window.location.href="/dashboard/admin"}
          className="w-9 h-9 rounded-full border border-sand-200 flex items-center justify-center">
          <ArrowLeft size={16} className="text-charcoal-600" />
        </button>
        <span className="font-display text-sm font-bold text-charcoal-800">
          {expId ? "Modifier" : "Nouvelle"} expérience
        </span>
        <div className="w-9" />
      </div>

      <div className="px-4 py-5 flex flex-col gap-4 max-w-lg mx-auto">

        <Section title="Infos générales" icon={<ListBullets size={14} weight="bold" />}>
          <Field label="Titre *">
            <input value={form.title} onChange={set("title")} placeholder="Agafay Desert + Quad + Diner" className={inputCls} />
          </Field>
          <Field label="Description">
            <textarea value={form.description} onChange={set("description")} placeholder="Decrivez l experience..." rows={3} className={inputCls + " resize-none"} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Ville">
              <input value={form.city} onChange={set("city")} placeholder="Marrakech" className={inputCls} />
            </Field>
            <Field label="Duree">
              <input value={form.duration} onChange={set("duration")} placeholder="4h" className={inputCls} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Taille groupe">
              <input value={form.groupSize} onChange={set("groupSize")} placeholder="1-8 pers." className={inputCls} />
            </Field>
            <Field label="Contact prestataire">
              <input value={form.providerContact} onChange={set("providerContact")} placeholder="+212600000000" className={inputCls} />
            </Field>
          </div>
          <Toggle label="Transport inclus" value={form.transportRequired} onChange={() => setForm(f => ({...f, transportRequired: !f.transportRequired}))} />
        </Section>

        <Section title="Prix" icon={<CurrencyDollar size={14} weight="bold" />}>
          <div className="bg-sand-100 rounded-xl p-3 text-xs text-charcoal-400 mb-1">Prix par personne · Groupe 2-20 pers. · Prive 2-5 pers.</div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Prix groupe (MAD/pers.) *">
              <input value={form.price} onChange={set("price")} placeholder="400" className={inputCls} />
            </Field>
            <Field label="Prix prive (MAD/pers.)">
              <input value={form.privatePricePerPerson} onChange={set("privatePricePerPerson")} placeholder="600" className={inputCls} />
            </Field>
          </div>
        </Section>

        <Section title="Logistique" icon={<MapPin size={14} weight="bold" />}>
          <Field label="Point de rendez-vous">
            <input value={form.meetingPoint} onChange={set("meetingPoint")} placeholder="Place Jemaa el-Fna, Marrakech" className={inputCls} />
          </Field>
          <Field label="Itineraire (HH:mm | Titre | Description — 1 etape par ligne)">
            <textarea value={form.itinerary_raw} onChange={set("itinerary_raw")}
              placeholder={"16:30 | Prise en charge | Transfert depuis l hotel\n17:30 | Arrivee Agafay | Accueil the menthe"} rows={5} className={inputCls + " resize-none font-mono text-xs"} />
          </Field>
        </Section>

        <Section title="Contenu & Tags" icon={<Tag size={14} weight="bold" />}>
          <Field label="Inclus (virgule)">
            <input value={form.included} onChange={set("included")} placeholder="Transport, Guide, The menthe" className={inputCls} />
          </Field>
          <Field label="Non inclus (virgule)">
            <input value={form.notIncluded} onChange={set("notIncluded")} placeholder="Boissons alcoolisees, Pourboires" className={inputCls} />
          </Field>
          <Field label="Tags (virgule)">
            <input value={form.tags} onChange={set("tags")} placeholder="Desert, Aventure, Couple, Famille" className={inputCls} />
          </Field>
        </Section>

        <Section title="Photos" icon={<Image size={14} weight="bold" />}>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {form.photos.map((url, i) => (
              <div key={i} className="relative flex-shrink-0">
                <img src={url} className="w-20 h-20 rounded-xl object-cover" />
                <button onClick={() => setForm(f => ({...f, photos: f.photos.filter((_, j) => j !== i)}))}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">x</button>
              </div>
            ))}
            <label className="w-20 h-20 rounded-xl border-2 border-dashed border-sand-300 flex flex-col items-center justify-center cursor-pointer flex-shrink-0 text-charcoal-400">
              <span className="text-2xl">+</span>
              <span className="text-[10px]">Photo</span>
              <input type="file" accept="image/*" className="hidden" onChange={async e => {
                const file = e.target.files?.[0];
                if (!file) return;
                const fd = new FormData();
                fd.append("file", file as Blob);
                fd.append("folder", "experiences");
                const res = await fetch("/api/upload", { method: "POST", body: fd });
                const { url } = await res.json();
                if (url) setForm(f => ({...f, photos: [...f.photos, url]}));
              }} />
            </label>
          </div>
        </Section>

        <button onClick={save} disabled={saving}
          className="w-full text-white font-bold py-4 rounded-full text-sm"
          style={{ background: "linear-gradient(135deg, #B88A44, #9A7238)", boxShadow: "0 4px 14px rgba(184,138,68,0.3)" }}>
          {saving ? "Enregistrement..." : expId ? "Mettre a jour" : "Publier l experience"}
        </button>
      </div>
    </div>
  );
}

