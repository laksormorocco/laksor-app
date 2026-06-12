"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Clock, Users, MapPin, SealCheck, Star,
  CaretLeft, CaretRight, Lock, Heart, ArrowRight,
  CheckCircle, XCircle
} from "@phosphor-icons/react";
import { useExchangeRate } from "@/hooks/useExchangeRate";
import { priceWithCommission } from "@/lib/pricing";
import PriceDisplay from "@/components/PriceDisplay";

export default function ExperienceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [exp, setExp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [photoIdx, setPhotoIdx] = useState(0);
  const [bookingType, setBookingType] = useState<"group"|"private">("group");
  const { convert } = useExchangeRate();

  useEffect(() => {
    fetch("/api/admin/experiences?id=" + id)
      .then(r => r.json())
      .then(d => { if (d.experience) setExp(d.experience); setLoading(false); });
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{background:"#F6F1E8"}}>
      <div className="w-10 h-10 border-4 border-bronze-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!exp) return (
    <div className="min-h-screen flex items-center justify-center" style={{background:"#F6F1E8"}}>
      <div className="text-sm text-charcoal-400">Expérience introuvable</div>
    </div>
  );

  const price = bookingType === "private" && exp.privatePricePerPerson ? exp.privatePricePerPerson : exp.price;
  const bookingUrl = `/booking/${exp.guideId}?expId=${exp.id}&bookingType=${bookingType}&tourPrice=${Math.ceil(priceWithCommission(price))}`;

  return (
    <div className="min-h-screen pb-32" style={{background:"#F6F1E8"}}>

      {/* HEADER */}
      <div className="sticky top-0 z-30 flex items-center justify-between px-4 py-3"
        style={{background:"rgba(246,241,232,0.92)", backdropFilter:"blur(16px)", borderBottom:"1px solid rgba(184,138,68,0.12)"}}>
        <button onClick={() => router.back()}
          className="w-9 h-9 rounded-full bg-white flex items-center justify-center active:scale-95"
          style={{border:"1.5px solid #EADCC8"}}>
          <ArrowLeft size={15} weight="bold" className="text-charcoal-800" />
        </button>
        <div className="font-display text-sm font-bold text-charcoal-800 truncate mx-4 flex-1 text-center">{exp.title}</div>
        <button className="w-9 h-9 rounded-full bg-white flex items-center justify-center"
          style={{border:"1.5px solid #EADCC8"}}>
          <Heart size={15} className="text-charcoal-400" />
        </button>
      </div>

      {/* PHOTOS CAROUSEL */}
      <div className="relative overflow-hidden" style={{height:280}}>
        {exp.photos?.length > 0 ? (
          <>
            <div className="flex h-full transition-transform duration-500"
              style={{transform:`translateX(-${photoIdx * 100}%)`}}>
              {exp.photos.map((photo:string, i:number) => (
                <img key={i} src={photo} alt={exp.title} className="w-full h-full object-cover flex-shrink-0" style={{minWidth:"100%"}} />
              ))}
            </div>
            {exp.photos.length > 1 && (
              <>
                <button onClick={() => setPhotoIdx(Math.max(0, photoIdx-1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{background:"rgba(255,255,255,0.9)", backdropFilter:"blur(8px)"}}>
                  <CaretLeft size={14} weight="bold" className="text-charcoal-800" />
                </button>
                <button onClick={() => setPhotoIdx(Math.min(exp.photos.length-1, photoIdx+1))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{background:"rgba(255,255,255,0.9)", backdropFilter:"blur(8px)"}}>
                  <CaretRight size={14} weight="bold" className="text-charcoal-800" />
                </button>
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
                  {exp.photos.map((_:any, i:number) => (
                    <div key={i} className={"rounded-full transition-all " + (i === photoIdx ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50")} />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full" style={{background:"linear-gradient(135deg, #7D8F69, #B88A44)"}} />
        )}
        {/* Badge Laksor */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-white text-[10px] font-bold"
          style={{background:"#B88A44"}}>
          <SealCheck size={11} weight="fill" /> Laksor Certified
        </div>
        {/* Counter photos */}
        {exp.photos?.length > 1 && (
          <div className="absolute top-3 right-3 px-2 py-1 rounded-full text-white text-[10px] font-semibold"
            style={{background:"rgba(0,0,0,0.5)", backdropFilter:"blur(4px)"}}>
            {photoIdx+1}/{exp.photos.length}
          </div>
        )}
      </div>

      <div className="px-4 pt-4 max-w-lg mx-auto flex flex-col gap-4">

        {/* TITRE + META */}
        <div className="bg-white rounded-2xl p-4" style={{boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
          <div className="font-display text-2xl font-bold text-charcoal-800 mb-3" style={{lineHeight:1.2}}>{exp.title}</div>
          <div className="flex items-center gap-2 flex-wrap mb-3">
            {exp.duration && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium" style={{background:"#F6F1E8", border:"1px solid #EADCC8"}}>
                <Clock size={12} weight="duotone" className="text-bronze-500" /> {exp.duration}
              </div>
            )}
            {exp.groupSize && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium" style={{background:"#F6F1E8", border:"1px solid #EADCC8"}}>
                <Users size={12} weight="duotone" className="text-bronze-500" /> {exp.groupSize}
              </div>
            )}
            {exp.city && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium" style={{background:"#F6F1E8", border:"1px solid #EADCC8"}}>
                <MapPin size={12} weight="duotone" className="text-bronze-500" /> {exp.city}
              </div>
            )}
            {exp.languages?.slice(0,3).map((l:string) => (
              <span key={l} className="text-base">{l==="Français"?"🇫🇷":l==="Anglais"?"🇬🇧":l==="Espagnol"?"🇪🇸":l==="Allemand"?"🇩🇪":l==="Arabe"?"🇲🇦":l==="Italien"?"🇮🇹":l==="Russe"?"🇷🇺":"🏳️"}</span>
            ))}
          </div>
          {exp.description && (
            <p className="text-sm text-charcoal-600 leading-relaxed">{exp.description}</p>
          )}
        </div>

        {/* TOGGLE GROUPE / PRIVE */}
        {exp.privatePricePerPerson && (
          <div className="bg-white rounded-2xl p-4" style={{boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
            <div className="font-display text-sm font-semibold text-charcoal-800 mb-3">Type d'expérience</div>
            <div className="flex p-1 rounded-full mb-3" style={{background:"#F6F1E8"}}>
              <button onClick={() => setBookingType("group")}
                className={"flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-xs font-semibold transition-all " + (bookingType === "group" ? "text-white" : "text-charcoal-500")}
                style={bookingType === "group" ? {background:"linear-gradient(135deg, #B88A44, #9A7238)", boxShadow:"0 3px 8px rgba(184,138,68,0.3)"} : {}}>
                <Users size={12} weight="bold" /> Groupe · {convert(priceWithCommission(exp.price))}/pers.
              </button>
              <button onClick={() => setBookingType("private")}
                className={"flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-xs font-semibold transition-all " + (bookingType === "private" ? "text-white" : "text-charcoal-500")}
                style={bookingType === "private" ? {background:"#111", boxShadow:"0 3px 8px rgba(0,0,0,0.2)"} : {}}>
                <Lock size={12} weight="bold" /> Privé · {convert(priceWithCommission(exp.privatePricePerPerson))}/pers.
              </button>
            </div>
            <div className="text-[11px] text-charcoal-400 text-center">
              {bookingType === "group" ? "Créneaux fixes · Ramassage gratuit dans 10km" : "Heure libre · Ramassage inclus partout"}
            </div>
          </div>
        )}

        {/* POINT DE RDV */}
        {exp.meetingPoint && (
          <div className="bg-white rounded-2xl p-4" style={{boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:"rgba(184,138,68,0.1)"}}>
                <MapPin size={16} weight="duotone" className="text-bronze-500" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest">Point de rendez-vous</div>
                <div className="text-sm font-semibold text-charcoal-800">{exp.meetingPoint}</div>
              </div>
            </div>
          </div>
        )}

        {/* INCLUS / NON INCLUS */}
        {(exp.included?.length > 0 || exp.notIncluded?.length > 0) && (
          <div className="bg-white rounded-2xl p-4" style={{boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
            <div className="font-display text-sm font-semibold text-charcoal-800 mb-3">Ce qui est inclus</div>
            {exp.included?.map((item:string) => (
              <div key={item} className="flex items-center gap-2.5 mb-2">
                <CheckCircle size={15} weight="fill" className="text-sage-300 flex-shrink-0" />
                <span className="text-sm text-charcoal-600">{item}</span>
              </div>
            ))}
            {exp.notIncluded?.length > 0 && (
              <div className="mt-3 pt-3" style={{borderTop:"1px solid #F0EDE7"}}>
                <div className="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest mb-2">Non inclus</div>
                {exp.notIncluded.map((item:string) => (
                  <div key={item} className="flex items-center gap-2.5 mb-2">
                    <XCircle size={15} weight="fill" className="text-red-400 flex-shrink-0" />
                    <span className="text-sm text-charcoal-500">{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ITINÉRAIRE */}
        {exp.itinerary?.length > 0 && (
          <div className="bg-white rounded-2xl p-4" style={{boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
            <div className="font-display text-sm font-semibold text-charcoal-800 mb-4">Programme</div>
            {exp.itinerary.map((step:any, i:number) => (
              <div key={i} className="flex gap-3 mb-3 last:mb-0"
                style={{opacity:1, transform:"translateX(0)", transition:`opacity 0.4s ease-out ${i*100}ms`}}>
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                    style={{background:"linear-gradient(135deg, #7D8F69, #566547)"}}>
                    {i+1}
                  </div>
                  {i < exp.itinerary.length-1 && <div className="w-px flex-1 my-1" style={{background:"rgba(125,143,105,0.3)"}} />}
                </div>
                <div className="flex-1 pb-1">
                  {step.time && <div className="text-[10px] font-bold mb-0.5" style={{color:"#B88A44"}}>{step.time}</div>}
                  <div className="text-sm font-semibold text-charcoal-800">{step.title}</div>
                  {step.desc && <div className="text-xs text-charcoal-400 mt-0.5 leading-relaxed">{step.desc}</div>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CONTACT PRESTATAIRE */}
        {exp.providerContact && (
          <div className="bg-white rounded-2xl p-4" style={{boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
            <div className="font-display text-sm font-semibold text-charcoal-800 mb-2">Contact prestataire</div>
            <a href={"https://wa.me/" + exp.providerContact.replace(/[^0-9]/g, "")}
              className="flex items-center gap-3 no-underline">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:"#25D366"}}>
                <span className="text-white text-lg">💬</span>
              </div>
              <div>
                <div className="text-sm font-semibold text-charcoal-800">{exp.providerContact}</div>
                <div className="text-[11px] text-charcoal-400">WhatsApp</div>
              </div>
            </a>
          </div>
        )}

      </div>

      {/* CTA FIXE EN BAS */}
      <div className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-8 pt-3" style={{background:"linear-gradient(to top, #F6F1E8 75%, transparent)"}}>
        <div className="flex items-center justify-between mb-2 max-w-lg mx-auto">
          <div>
            <div className="text-[10px] text-charcoal-400 uppercase tracking-wide">À partir de</div>
            <div className="font-display text-2xl font-bold" style={{color:"#B88A44"}}>
              <PriceDisplay mad={priceWithCommission(price)} size="lg" />
            </div>
            <div className="text-[11px] text-charcoal-400">/ pers. · {bookingType === "private" ? "Privé" : "Groupe"}</div>
          </div>
          <Link href={bookingUrl}
            className="flex items-center gap-2 text-white font-bold px-6 py-3.5 rounded-full no-underline active:scale-[0.98] transition-all"
            style={{background:"linear-gradient(135deg, #B88A44, #9A7238)", boxShadow:"0 6px 20px rgba(184,138,68,0.4)"}}>
            Réserver <ArrowRight size={16} weight="bold" />
          </Link>
        </div>
      </div>
    </div>
  );
}
