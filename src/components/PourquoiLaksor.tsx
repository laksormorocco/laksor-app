"use client";
import { useState } from "react";
import { Info, CaretDown, CaretUp } from "@phosphor-icons/react";

export default function PourquoiLaksor() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mx-4 mb-6 rounded-2xl overflow-hidden border border-amber-200"
      style={{background:"rgba(184,138,68,0.05)"}}>
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3.5 text-left"
        style={{background:"rgba(184,138,68,0.08)"}}>
        <div className="flex items-center gap-2">
          <Info size={16} weight="duotone" className="text-bronze-500 flex-shrink-0" />
          <span className="text-sm font-bold text-charcoal-800">Pourquoi Laksor ?</span>
        </div>
        {open
          ? <CaretUp size={14} weight="bold" className="text-bronze-500 flex-shrink-0" />
          : <CaretDown size={14} weight="bold" className="text-bronze-500 flex-shrink-0" />
        }
      </button>

      {open && (
        <div className="px-4 py-4 flex flex-col gap-3 text-xs text-charcoal-600 leading-relaxed">
          <p>
            Sur les grandes plateformes et via certains concierges d'hôtels ou riads, un tour affiché à bas prix cache toujours quelque chose.
            Le concierge peut toucher jusqu'à <strong className="text-charcoal-800">50% de commission</strong> sur votre prestation.
            En échange, il impose au guide des passages obligatoires chez des boutiques partenaires — tapis, épices, cuir...
          </p>
          <p>
            Le guide ne travaille plus librement. Il ne peut pas adapter votre visite à vos envies — il suit un circuit imposé pour satisfaire
            les intérêts du concierge, pas les vôtres. Au final, vous perdez du temps, vous subissez une pression commerciale
            et vous rentrez avec une expérience gâchée.
          </p>
          <p>
            <strong className="text-charcoal-800">Chez Laksor, c'est différent.</strong> Nos guides certifiés par le Ministère du Tourisme marocain
            fixent eux-mêmes leurs tarifs et construisent leur programme librement selon vos besoins.
            La commission Laksor est incluse dans le prix affiché — aucun frais caché, aucune surprise.
          </p>
          <p>
            Nous travaillons également avec des concierges partenaires sélectionnés. Contrairement aux pratiques habituelles,
            ils reçoivent une commission fixe et transparente de notre part — et vous bénéficiez d'une <strong className="text-charcoal-800">réduction exclusive</strong> sur votre réservation.
          </p>
          <div className="pt-2 border-t border-sand-200 text-center font-semibold text-bronze-500">
            Prix clairs. Guides libres. Expérience vraie. 🇲🇦
          </div>
        </div>
      )}
    </div>
  );
}
