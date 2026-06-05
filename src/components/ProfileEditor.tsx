"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Camera, Phone, MapPin, BookOpen, Translate,
  Star, Money, Images, CheckCircle, Clock
} from "@phosphor-icons/react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

const CITIES = ["Marrakech","Fès","Casablanca","Rabat","Chefchaouen","Essaouira","Agadir","Tanger","Meknès","Ouarzazate","Merzouga"];
const inputCls = "w-full border border-sand-300 rounded-xl px-4 py-3 text-sm text-charcoal-800 bg-sand-100 outline-none focus:border-bronze-500 transition-colors";

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-sand-300 p-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-bronze-500">{icon}</span>
        <span className="text-[10px] font-bold text-bronze-500 uppercase tracking-wider">{title}</span>
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 last:mb-0">
      <label className="text-xs font-bold text-charcoal-600 uppercase tracking-wider block mb-1.5">{label}</label>
      {children}
    </div>
  );
}

export default function ProfileEditor({ guide, guideId, onSaved }: { guide: any; guideId: string; onSaved: () => void }) {
  const [form, setForm] = useState({
    displayName:   guide.displayName || "",
    city:          guide.city || "",
    phone:         guide.phone || "",
    bio:           guide.bio || "",
    halfDayPrice:  guide.halfDayPrice || 500,
    fullDayPrice:  guide.fullDayPrice || 950,
    languages:     (guide.languages || []).join(", "),
    specialties:   (guide.specialties || []).join(", "),
    coveredCities: (guide.coveredCities || []).join(", "),
    certifications:(guide.certifications || []).join(", "),
    yearsExp:      guide.yearsExp || 0,
    avatar:        guide.avatar || "",
    gallery:       (guide.gallery || []).join("|"),
  });
  const [saving,    setSaving]    = useState(false);
  const [saved,     setSaved]     = useState(false);
  const [uploading, setUploading] = useState(false);

  function update(key: string, val: any) { setForm(f => ({...f, [key]: val})); }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const filename = guideId + "-" + Date.now() + "." + file.name.split(".").pop();
    const { error } = await supabase.storage.from("avatars").upload(filename, file, { upsert: true });
    if (!error) {
      const { data } = supabase.storage.from("avatars").getPublicUrl(filename);
      update("avatar", data.publicUrl);
    }
    setUploading(false);
  }

  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    const urls: string[] = [];
    for (const file of files) {
      const filename = guideId + "-gal-" + Date.now() + "-" + Math.random().toString(36).slice(2) + "." + file.name.split(".").pop();
      const { error } = await supabase.storage.from("avatars").upload(filename, file, { upsert: true });
      if (!error) {
        const { data } = supabase.storage.from("avatars").getPublicUrl(filename);
        urls.push(data.publicUrl);
      }
    }
    const existing = form.gallery ? form.gallery.split("|").filter(Boolean) : [];
    update("gallery", [...existing, ...urls].join("|"));
    setUploading(false);
  }

  async function handleSave() {
    setSaving(true);
    const res = await fetch("/api/guide/profile", {
      method: "PATCH",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        guideId,
        displayName:   form.displayName,
        city:          form.city,
        phone:         form.phone,
        bio:           form.bio,
        halfDayPrice:  parseFloat(String(form.halfDayPrice)),
        fullDayPrice:  parseFloat(String(form.fullDayPrice)),
        languages:     form.languages.split(",").map((l:string)=>l.trim()).filter(Boolean),
        specialties:   form.specialties.split(",").map((s:string)=>s.trim()).filter(Boolean),
        coveredCities: form.coveredCities.split(",").map((c:string)=>c.trim()).filter(Boolean),
        certifications:form.certifications.split(",").map((c:string)=>c.trim()).filter(Boolean),
        yearsExp:      parseInt(String(form.yearsExp)) || 0,
        avatar:        form.avatar,
        gallery:       form.gallery.split("|").map((u:string)=>u.trim()).filter(Boolean),
      })
    });
    if (res.ok) { setSaved(true); onSaved(); setTimeout(()=>setSaved(false), 3000); }
    setSaving(false);
  }

  return (
    <div className="flex flex-col gap-3">

      {/* Banner validation */}
      <div className="bg-bronze-50 border border-bronze-500 rounded-2xl p-3 flex items-start gap-3">
        <Clock size={16} className="text-bronze-500 flex-shrink-0 mt-0.5" weight="duotone" />
        <div>
          <div className="text-xs font-bold text-bronze-500 mb-0.5">Modifications validées par l&apos;admin</div>
          <p className="text-[11px] text-charcoal-400 leading-relaxed">Vos modifications seront visibles après validation par notre équipe (sous 24h).</p>
        </div>
      </div>

      {/* Photo de profil */}
      <Section title="Photo de profil" icon={<Camera size={14} weight="duotone" />}>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-sand-300 flex-shrink-0">
            {form.avatar
              ? <img src={form.avatar} alt="" className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-2xl text-charcoal-400">👤</div>}
          </div>
          <div className="flex-1">
            <label className="flex items-center gap-2 bg-bronze-500 text-white rounded-full px-4 py-2.5 text-xs font-bold cursor-pointer hover:bg-bronze-600 transition-colors w-fit">
              <Camera size={14} />
              {uploading ? "Upload..." : "Changer la photo"}
              <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" disabled={uploading} />
            </label>
            <p className="text-[10px] text-charcoal-400 mt-1.5">JPG, PNG · Max 5MB</p>
          </div>
        </div>
        <Field label="Ou URL directe">
          <input value={form.avatar} onChange={e=>update("avatar",e.target.value)} placeholder="https://..." className={inputCls} />
        </Field>
      </Section>

      {/* Infos perso */}
      <Section title="Informations personnelles" icon={<MapPin size={14} weight="duotone" />}>
        <Field label="Nom complet">
          <input value={form.displayName} onChange={e=>update("displayName",e.target.value)} className={inputCls} />
        </Field>
        <Field label="WhatsApp">
          <input value={form.phone} onChange={e=>update("phone",e.target.value)} placeholder="+212 6XX XXX XXX" className={inputCls} />
        </Field>
        <Field label="Ville principale">
          <select value={form.city} onChange={e=>update("city",e.target.value)} className={inputCls}>
            <option value="">Choisir</option>
            {CITIES.map(c=><option key={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Villes couvertes">
          <input value={form.coveredCities} onChange={e=>update("coveredCities",e.target.value)} placeholder="Marrakech, Essaouira" className={inputCls} />
          <div className="text-[10px] text-charcoal-300 mt-1">Séparées par virgule</div>
        </Field>
        <Field label="Années d&apos;expérience">
          <input type="number" min={0} value={form.yearsExp} onChange={e=>update("yearsExp",e.target.value)} className={inputCls} />
        </Field>
      </Section>

      {/* Expertise */}
      <Section title="Expertise" icon={<BookOpen size={14} weight="duotone" />}>
        <Field label="Bio">
          <textarea value={form.bio} onChange={e=>update("bio",e.target.value)} rows={4}
            placeholder="Décrivez votre expérience et votre passion..."
            className={inputCls + " resize-none"} />
        </Field>
        <Field label="Langues parlées">
      <div className="flex flex-wrap gap-2 mt-1">
        {[
          {code:"Français",flag:"🇫🇷"},{code:"Anglais",flag:"🇬🇧"},{code:"Arabe",flag:"🇲🇦"},
          {code:"Espagnol",flag:"🇪🇸"},{code:"Allemand",flag:"🇩🇪"},{code:"Italien",flag:"🇮🇹"},
          {code:"Russe",flag:"🇷🇺"},{code:"Hebreu",flag:"🇮🇱"},{code:"Portugais",flag:"🇵🇹"},{code:"Chinois",flag:"🇨🇳"}
        ].map(l => {
          const selected = form.languages.split(",").map((x:string)=>x.trim()).includes(l.code);
          return (
            <button key={l.code} type="button"
              onClick={() => {
                const langs = form.languages.split(",").map((x:string)=>x.trim()).filter(Boolean);
                const newLangs = selected ? langs.filter((x:string)=>x!==l.code) : [...langs, l.code];
                update("languages", newLangs.join(", "));
              }}
              className={"flex items-center gap-1.5 px-3 py-2 rounded-full text-sm border-2 transition-all " + (selected ? "border-sage-300 bg-sage-300/10 text-sage-300 font-bold" : "border-sand-300 text-charcoal-400 hover:border-bronze-500")}>
              <span className="text-base">{l.flag}</span>
              <span className="text-xs">{l.code}</span>
            </button>
          );
        })}
      </div>
          <div className="text-[10px] text-charcoal-300 mt-1">Séparées par virgule</div>
        </Field>
        <Field label="Spécialités">
          <input value={form.specialties} onChange={e=>update("specialties",e.target.value)} placeholder="Histoire, Gastronomie, Architecture" className={inputCls} />
          <div className="text-[10px] text-charcoal-300 mt-1">Séparées par virgule</div>
        </Field>
        <Field label="Certifications">
          <input value={form.certifications} onChange={e=>update("certifications",e.target.value)} placeholder="Guide agréé Ministère du Tourisme" className={inputCls} />
        </Field>
      </Section>

      {/* Tarifs */}
      <Section title="Tarifs" icon={<Money size={14} weight="duotone" />}>
        <div className="bg-bronze-50 border border-bronze-500 rounded-xl p-3 mb-4 text-xs text-bronze-500 font-medium">
          💡 Conseillés : Demi-journée 500 MAD · Journée 950 MAD
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="½ Journée (MAD)">
            <input type="number" value={form.halfDayPrice} onChange={e=>update("halfDayPrice",e.target.value)}
              className={inputCls + " font-bold text-base"} />
          </Field>
          <Field label="Journée (MAD)">
            <input type="number" value={form.fullDayPrice} onChange={e=>update("fullDayPrice",e.target.value)}
              className={inputCls + " font-bold text-base"} />
          </Field>
        </div>
      </Section>

      {/* Galerie */}
      <Section title="Galerie photos" icon={<Images size={14} weight="duotone" />}>
        <label className="flex items-center gap-2 bg-bronze-500 text-white rounded-full px-4 py-2.5 text-xs font-bold cursor-pointer hover:bg-bronze-600 transition-colors w-fit mb-4">
          <Images size={14} />
          {uploading ? "Upload..." : "Ajouter photos"}
          <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} className="hidden" disabled={uploading} />
        </label>
        <Field label="Ou URLs séparées par |">
          <input value={form.gallery} onChange={e=>update("gallery",e.target.value)}
            placeholder="https://photo1.jpg|https://photo2.jpg" className={inputCls} />
        </Field>
        {form.gallery && (
          <div className="grid grid-cols-3 gap-2 mt-3">
            {form.gallery.split("|").filter(Boolean).slice(0,6).map((url:string,i:number) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden bg-sand-300">
                <img src={url.trim()} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Submit */}
      <button onClick={handleSave} disabled={saving}
        className={`w-full py-4 rounded-2xl text-sm font-bold text-white transition-all
          ${saving ? "bg-sand-300 cursor-not-allowed" : "bg-bronze-500 hover:bg-bronze-600 shadow-md"}`}>
        {saving ? "Sauvegarde en cours..." : "Soumettre les modifications →"}
      </button>

      {saved && (
        <div className="flex items-center justify-center gap-2 text-sage-300 font-bold text-sm">
          <CheckCircle size={16} weight="fill" />
          Modifications soumises — en attente de validation
        </div>
      )}
    </div>
  );
}
