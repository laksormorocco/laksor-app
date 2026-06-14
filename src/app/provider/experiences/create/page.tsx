"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { ArrowLeft, Image, MapPin, CurrencyDollar, ListBullets, Tag, Clock } from "@phosphor-icons/react";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const inputCls = "w-full border-2 border-sand-300 rounded-xl px-4 py-3 text-sm text-charcoal-800 bg-white outline-none focus:border-bronze-500 transition-colors";

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-sand-200 overflow-hidden" style={{boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
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

export default function ProviderCreateExperience() {
  const router = useRouter();
  const [providerId, setProviderId] = useState<string|null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", price: "", city: "Marrakech",
    meetingPoint: "", duration: "4h", groupSize: "1-8 pers.",
    tags: "", included: "", notIncluded: "",
    photos: [] as string[], itinerary_raw: "",
    privatePricePerPerson: "",
    departureSlots: [] as string[],
    languages: [] as string[]
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push("/auth/login"); return; }
      fetch("/api/provider/me?supabaseId=" + session.user.id)
        .then(r => r.json())
        .then(d => {
          if (d.provider) setProviderId(d.provider.id);
          else router.push("/provider/register");
        });
    });
  }, []);

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  function parseItinerary(raw: string) {
    return raw.split("\n").filter(Boolean).map((l: string) => {
      const [time, title, desc] = l.split("|").map((s: string) => s.trim());
      return { time: time || "", title: title || l, desc: desc || "" };
    });
  }

  async function save() {
    if (!form.title || !form.price || !providerId) return alert("Titre et prix requis");
    setSaving(true);
    const data: any = {
      title: form.title, description: form.description,
      price: Number(form.price), city: form.city,
      meetingPoint: form.meetingPoint, duration: form.duration,
      groupSize: form.groupSize, difficulty: "Facile",
      tags: form.tags ? form.tags.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
      privatePricePerPerson: form.privatePricePerPerson ? Number(form.privatePricePerPerson) : undefined,
      itinerary: form.itinerary_raw ? parseItinerary(form.itinerary_raw) : [],
      included: form.included ? form.included.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
      notIncluded: form.notIncluded ? form.notIncluded.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
      photos: form.photos, departureSlots: form.departureSlots, languages: form.languages,
      providerId, status: "PENDING", isActive: false,
      guideId: "cmq5fr4ef0002xbtvwrfquu46", isLaksorExp: true,
    };
    const res = await fetch("/api/guide/experiences", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (res.ok) router.push("/provider/dashboard");
    else { const err = await res.json(); alert("Erreur: " + JSON.stringify(err)); }
    setSaving(false);
  }

  return (
    <div className="min-h-screen pb-10" style={{background:"#F6F1E8"}}>
      <div className="flex items-center justify-between px-4 py-3 sticky top-0 z-30"
        style={{background:"rgba(246,241,232,0.92)", backdropFilter:"blur(16px)", borderBottom:"1px solid rgba(184,138,68,0.12)"}}>
        <button onClick={() => router.back()}
          className="w-9 h-9 rounded-full border border-sand-200 bg-white flex items-center justify-center">
          <ArrowLeft size={16} className="text-charcoal-600" />
        </button>
        <span className="font-display text-sm font-bold text-charcoal-800">Nouvelle experience</span>
        <div className="w-9" />
      </div>

      <div className="mx-4 mt-4 rounded-2xl p-3 flex items-center gap-2 mb-4"
        style={{background:"rgba(184,138,68,0.08)", border:"1px solid rgba(184,138,68,0.2)"}}>
        <Clock size={14} className="text-bronze-500 flex-shrink-0" />
        <span className="text-xs text-bronze-500 font-semibold">Votre experience sera publiee apres validation par notre equipe</span>
      </div>

      <div className="px-4 flex flex-col gap-4 max-w-lg mx-auto">
        <Section title="Infos generales" icon={<ListBullets size={14} weight="bold" />}>
          <Field label="Titre *">
            <input value={form.title} onChange={set("title")} placeholder="Agafay Desert + Quad + Diner" className={inputCls} />
          </Field>
          <Field label="Description">
            <textarea value={form.description} onChange={set("description")} placeholder="Decrivez votre experience..." rows={3} className={inputCls + " resize-none"} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Ville">
              <select value={form.city} onChange={set("city")} className={inputCls}>
                {["Marrakech","Fes","Essaouira","Chefchaouen","Agadir"].map(c => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Duree">
              <input value={form.duration} onChange={set("duration")} placeholder="4h" className={inputCls} />
            </Field>
          </div>
          <Field label="Taille groupe">
            <input value={form.groupSize} onChange={set("groupSize")} placeholder="1-8 pers." className={inputCls} />
          </Field>
        </Section>

        <Section title="Prix" icon={<CurrencyDollar size={14} weight="bold" />}>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Prix groupe (MAD/pers.) *">
              <input value={form.price} onChange={set("price")} placeholder="400" className={inputCls} />
            </Field>
            <Field label="Prix prive (MAD/pers.)">
              <input value={form.privatePricePerPerson} onChange={set("privatePricePerPerson")} placeholder="600" className={inputCls} />
            </Field>
          </div>
        </Section>

        <Section title="Creneaux et Langues" icon={<Clock size={14} weight="bold" />}>
          <div>
            <div className="text-xs font-semibold text-charcoal-400 mb-2">Creneaux de depart</div>
            {form.departureSlots.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {form.departureSlots.map((slot, i) => (
                  <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                    style={{background:"rgba(184,138,68,0.12)", color:"#B88A44"}}>
                    {slot}
                    <button onClick={() => setForm(f => ({...f, departureSlots: f.departureSlots.filter((_,j) => j !== i)}))}
                      className="ml-1 text-red-400 font-bold">x</button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {["07:00","08:00","09:00","10:00","14:00","16:00","16:30","17:00","18:00","19:00"].filter(h => !form.departureSlots.includes(h)).map(h => (
                <button key={h} onClick={() => setForm(f => ({...f, departureSlots: [...f.departureSlots, h].sort()}))}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold border border-sand-300 bg-white text-charcoal-600 active:bg-bronze-500 active:text-white transition-all">
                  {h}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-charcoal-400 mb-2">Langues disponibles</div>
            <div className="flex flex-wrap gap-2">
              {["Francais","Anglais","Espagnol","Allemand","Arabe","Italien","Russe"].map(lang => (
                <button key={lang} onClick={() => setForm(f => ({
                  ...f, languages: f.languages.includes(lang) ? f.languages.filter(l => l !== lang) : [...f.languages, lang]
                }))}
                  className={"px-3 py-1.5 rounded-full text-xs font-bold border transition-all " + (form.languages.includes(lang) ? "bg-sage-300 text-white border-sage-300" : "bg-white text-charcoal-600 border-sand-300")}>
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </Section>

        <Section title="Logistique" icon={<MapPin size={14} weight="bold" />}>
          <Field label="Point de rendez-vous">
            <input value={form.meetingPoint} onChange={set("meetingPoint")} placeholder="Place Jemaa el-Fna, Marrakech" className={inputCls} />
          </Field>
          <Field label="Itineraire (HH:mm | Titre | Description)">
            <textarea value={form.itinerary_raw} onChange={set("itinerary_raw")}
              placeholder="16:30 | Prise en charge | Transfert hotel" rows={4} className={inputCls + " resize-none font-mono text-xs"} />
          </Field>
        </Section>

        <Section title="Contenu et Tags" icon={<Tag size={14} weight="bold" />}>
          <Field label="Inclus (virgule)">
            <input value={form.included} onChange={set("included")} placeholder="Transport, Guide, The menthe" className={inputCls} />
          </Field>
          <Field label="Non inclus (virgule)">
            <input value={form.notIncluded} onChange={set("notIncluded")} placeholder="Boissons alcoolisees, Pourboires" className={inputCls} />
          </Field>
          <Field label="Tags (virgule)">
            <input value={form.tags} onChange={set("tags")} placeholder="Desert, Aventure, Couple" className={inputCls} />
          </Field>
        </Section>

        <Section title="Photos" icon={<Image size={14} weight="bold" />}>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {form.photos.map((url, i) => (
              <div key={i} className="relative flex-shrink-0">
                <img src={url} className="w-20 h-20 rounded-xl object-cover" alt="" />
                <button onClick={() => setForm(f => ({...f, photos: f.photos.filter((_,j) => j !== i)}))}
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
          className="w-full text-white font-bold py-4 rounded-full text-sm active:scale-[0.98] transition-all"
          style={{background: !saving ? "linear-gradient(135deg, #B88A44, #9A7238)" : "#D4C9B8", boxShadow: !saving ? "0 6px 20px rgba(184,138,68,0.4)" : "none"}}>
          {saving ? "Envoi en cours..." : "Soumettre pour validation"}
        </button>
      </div>
    </div>
  );
}
