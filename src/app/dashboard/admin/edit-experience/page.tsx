"use client";
import { useState, useEffect } from "react";
import { X, ArrowLeft } from "@phosphor-icons/react";

const inputCls = "w-full border border-sand-300 rounded-xl px-4 py-3 text-sm text-charcoal-800 bg-sand-100 outline-none focus:border-bronze-500 transition-colors";

export default function EditExperiencePage() {
  const expId = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("id") : null;

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
            groupThreshold1: String(exp.groupThreshold1 || ""),
            groupDiscount1: String(exp.groupDiscount1 || ""),
            groupThreshold2: String(exp.groupThreshold2 || ""),
            groupDiscount2: String(exp.groupDiscount2 || ""),
          });
        });
    }
  }, [expId]);

  const [form, setForm] = useState({
    title: "", description: "", price: "", city: "",
    meetingPoint: "", duration: "4h", groupSize: "1-8 pers.",
    providerContact: "", tags: "", included: "", notIncluded: "",
    photos: [] as string[], transportRequired: false,
    groupThreshold1: "",
    groupDiscount1: "",
    groupThreshold2: "",
    groupDiscount2: ""
  });
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!form.title || !form.price) return alert("Titre et prix requis");
    setSaving(true);
    const LAKSOR_GUIDE_ID = "cmq5fr4ef0002xbtvwrfquu46";
    const data: any = { id: expId,
      
      guideId: LAKSOR_GUIDE_ID,
      title: form.title,
      description: form.description,
      price: Number(form.price),
      city: form.city,
      meetingPoint: form.meetingPoint,
      duration: form.duration,
      groupSize: form.groupSize,
      difficulty: "Facile",
      providerContact: form.providerContact,
      tags: form.tags ? form.tags.split(",").map(s => s.trim()).filter(Boolean) : [],
      included: form.included ? form.included.split(",").map(s => s.trim()).filter(Boolean) : [],
      notIncluded: form.notIncluded ? form.notIncluded.split(",").map(s => s.trim()).filter(Boolean) : [],
      photos: form.photos,
      transportRequired: form.transportRequired,
      isLaksorExp: true,
      pricePerPerson: true,
      status: "APPROVED",
      isActive: true,
    };
    const res = await fetch("/api/guide/experiences", {
      method: expId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (res.ok) {
      window.location.href = "/dashboard/admin";
    } else {
      const errData = await res.json().catch(() => ({})); alert("Erreur: " + JSON.stringify(errData));
    }
    setSaving(false);
  }

  return (
    <div className="min-h-screen bg-sand-100 pb-10">
      <div className="flex items-center justify-between px-4 py-3 border-b border-sand-200 bg-white sticky top-0 z-30">
        <button onClick={() => window.location.href="/dashboard/admin"}
          className="w-9 h-9 rounded-full border border-sand-200 flex items-center justify-center">
          <ArrowLeft size={16} className="text-charcoal-600" />
        </button>
        <span className="font-display text-sm font-bold text-charcoal-800">{expId ? "Modifier" : "Nouvelle"} experience Laksor</span>
        <div className="w-9" />
      </div>

      <div className="px-4 py-5 flex flex-col gap-4">

        {/* Photos */}
        <div>
          <div className="text-xs font-bold text-charcoal-400 mb-2">Photos</div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {form.photos.map((url, i) => (
              <div key={i} className="relative flex-shrink-0">
                <img src={url} className="w-20 h-20 rounded-xl object-cover" />
                <button onClick={() => setForm({...form, photos: form.photos.filter((_, j) => j !== i)})}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">✕</button>
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
                const res = await fetch("/api/upload", { method: expId ? "PATCH" : "POST", body: fd });
                const { url } = await res.json();
                if (url) setForm({...form, photos: [...form.photos, url]});
              }} />
            </label>
          </div>
        </div>

        {[
          { key: "title", label: "Titre *", ph: "Agafay Desert + Quad..." },
          { key: "description", label: "Description", ph: "Description de l experience...", area: true },
          { key: "price", label: "Prix par personne (MAD)", ph: "300" },
          { key: "city", label: "Ville", ph: "Marrakech" },
          { key: "meetingPoint", label: "Point de RDV", ph: "Place Jemaa el-Fna..." },
          { key: "duration", label: "Duree", ph: "4h" },
          { key: "groupSize", label: "Taille groupe", ph: "1-8 pers." },
          { key: "category", label: "Catégorie / Intérêt", ph: "Aventure, Culture, Nature, Gastronomie..." },
          { key: "providerContact", label: "Contact prestataire (WA/Email)", ph: "+212600000000" },
          { key: "groupThreshold1", label: "Seuil réduction 1 (nb personnes)", ph: "4" },
          { key: "groupDiscount1", label: "Réduction 1 (%)", ph: "8" },
          { key: "groupThreshold2", label: "Seuil réduction 2 (nb personnes)", ph: "7" },
          { key: "groupDiscount2", label: "Réduction 2 (%)", ph: "15" },
          { key: "tags", label: "Tags (virgule)", ph: "Desert, Aventure, Nature" },
          { key: "included", label: "Inclus (virgule)", ph: "Transport, Guide" },
          { key: "notIncluded", label: "Non inclus (virgule)", ph: "Repas, Entrees" },
        ].map(f => (
          <div key={f.key}>
            <div className="text-xs font-bold text-charcoal-400 mb-1">{f.label}</div>
            {(f as any).area ? (
              <textarea value={(form as any)[f.key]} onChange={e => setForm({...form, [f.key]: e.target.value})}
                placeholder={f.ph} rows={3} className={inputCls + " resize-none"} />
            ) : (
              <input value={(form as any)[f.key]} onChange={e => setForm({...form, [f.key]: e.target.value})}
                placeholder={f.ph} className={inputCls} />
            )}
          </div>
        ))}

        <div className="flex items-center justify-between bg-white rounded-xl border border-sand-300 px-4 py-3">
          <div className="text-sm font-semibold text-charcoal-800">Transport necessaire</div>
          <button onClick={() => setForm({...form, transportRequired: !form.transportRequired})}
            className={"w-12 h-6 rounded-full relative transition-colors " + (form.transportRequired ? "bg-sage-300" : "bg-sand-300")}>
            <div className={"w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm " + (form.transportRequired ? "left-6" : "left-0.5")} />
          </button>
        </div>

        <button onClick={save} disabled={saving}
          className="w-full text-white font-bold py-4 rounded-full text-sm"
          style={{ background: "linear-gradient(135deg, #B88A44, #9A7238)", boxShadow: "0 4px 14px rgba(184,138,68,0.3)" }}>
          {saving ? "Enregistrement..." : expId ? "Mettre à jour" : "Publier l experience"}
        </button>
      </div>
    </div>
  );
}
