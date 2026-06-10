import Link from "next/link";
import { ArrowLeft, CheckCircle, Globe, Star, ShieldCheck, ArrowRight, TrendUp } from "@phosphor-icons/react/dist/ssr";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <div style={{background:"#F6F1E8", minHeight:"100vh"}}>

      {/* NAVBAR */}
      <div className="sticky top-0 z-30 bg-white border-b border-sand-300 px-5 h-14 flex items-center justify-between">
        <Link href="/" className="w-9 h-9 rounded-full border border-sand-200 flex items-center justify-center no-underline">
          <ArrowLeft size={15} weight="bold" className="text-charcoal-700" />
        </Link>
        <img src="/logo7.png" alt="Laksor" style={{height:30, width:"auto", objectFit:"contain", maxWidth:100}} />
        <div className="w-9" />
      </div>

      <div className="max-w-lg mx-auto px-5 pb-10">

        {/* HERO IMAGE */}
        <div className="relative overflow-hidden rounded-3xl mt-6 mb-6" style={{height:300}}>
          <img src="https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&q=80" alt="Maroc" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{background:"linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.78) 100%)"}} />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{color:"#B88A44", letterSpacing:2}}>Marrakech, 2025</div>
            <h1 className="font-display text-2xl font-bold text-white leading-tight">
              Une plateforme marocaine,<br/>pour le Maroc.
            </h1>
          </div>
        </div>

        {/* OPENING */}
        <div className="bg-white rounded-2xl p-6 mb-4" style={{boxShadow:"0 2px 16px rgba(0,0,0,0.07)"}}>
          <p className="text-sm text-charcoal-600 leading-relaxed mb-3">
            Le Maroc vient d accueillir <strong className="text-charcoal-800">19.8 millions de touristes</strong> — un record historique. Pourtant, derriere ces chiffres se cache une realite que peu de visiteurs connaissent.
          </p>
          <p className="text-sm text-charcoal-600 leading-relaxed">
            Dans les medinas, des guides exceptionnels voient leurs revenus amputes de <strong className="text-charcoal-800">30 a 50%</strong> par un reseau invisible de commissions. Les concierges monnaient leurs recommandations. Les boutiques reversent des primes. Des plateformes etrangeres prennent jusqu a <strong className="text-charcoal-800">35% de commission</strong> sans jamais avoir foule le sol marocain.
          </p>
        </div>

        {/* PROBLÈME - DARK */}
        <div className="rounded-2xl p-6 mb-4 relative overflow-hidden" style={{background:"linear-gradient(135deg, #111, #1E1E1E)"}}>
          <div className="absolute top-0 right-0 w-36 h-36 rounded-full opacity-[0.07]" style={{background:"#B88A44", transform:"translate(40%,-40%)"}} />
          <div className="text-[10px] font-bold text-bronze-500 uppercase tracking-widest mb-3">La realite cachee</div>
          <p className="text-sm text-white/75 leading-relaxed mb-3">
            Des guides qui font visiter la medina gratuitement, parce qu ils gagnent plus en commissions shopping qu en faisant leur vrai metier. Des touristes qui se sentent manipules. Des <strong className="text-white">milliards de dirhams</strong> qui circulent dans l informel — hors fiscalite, hors radar.
          </p>
          <p className="text-sm text-white/75 leading-relaxed">
            Un systeme opaque qui nuit aux guides, aux touristes et a l image du Maroc.
          </p>
        </div>

        {/* SOLUTION */}
        <div className="rounded-2xl p-6 mb-4" style={{background:"linear-gradient(135deg, #B88A44, #9A7238)", boxShadow:"0 4px 20px rgba(184,138,68,0.3)"}}>
          <div className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-3">Notre reponse</div>
          <h2 className="font-display text-xl font-bold text-white mb-3 leading-snug">
            Laksor est ne pour changer ca.
          </h2>
          <p className="text-sm text-white/85 leading-relaxed">
            Une plateforme 100% marocaine qui remet le guide au centre. Qui lui garantit <strong className="text-white">l integralite de ses revenus</strong> de visite. Qui interdit les commissions shopping. Qui digitalise chaque reservation — contribuant directement aux objectifs de <strong className="text-white">Vision Maroc 2030.</strong>
          </p>
        </div>

        {/* VISION 2030 */}
        <div className="bg-white rounded-2xl p-6 mb-4" style={{boxShadow:"0 2px 16px rgba(0,0,0,0.07)"}}>
          <div className="flex items-center gap-2 mb-3">
            <TrendUp size={16} weight="bold" className="text-bronze-500" />
            <div className="text-[10px] font-bold text-bronze-500 uppercase tracking-widest">Vision Maroc 2030</div>
          </div>
          <p className="text-sm text-charcoal-600 leading-relaxed mb-3">
            Le gouvernement marocain vise <strong className="text-charcoal-800">26 millions de touristes d ici 2030</strong> avec une digitalisation complete du secteur. Laksor s inscrit directement dans cette vision : en tracant chaque transaction, en eliminant les commissions informelles, en formalisant les revenus des guides.
          </p>
          <p className="text-sm text-charcoal-600 leading-relaxed">
            Une plateforme <strong className="text-charcoal-800">conforme, transparente, durable</strong> — qui donne au Maroc les outils pour valoriser son patrimoine touristique dans l economie formelle.
          </p>
        </div>

        {/* CE QUE CA CHANGE */}
        <div className="grid grid-cols-1 gap-3 mb-4">
          {[
            {icon:<ShieldCheck size={18} weight="fill" className="text-sage-300" />, title:"Pour les guides", desc:"100% des revenus de visite. Zero commission partagee avec des tiers. La dignite et la juste valeur de leur savoir-faire.", color:"rgba(125,143,105,0.08)"},
            {icon:<Star size={18} weight="fill" className="text-amber-400" />, title:"Pour les touristes", desc:"Un guide 100% dedie a votre experience culturelle. Pas au shopping. Des visites authentiques, pas des circuits commerciaux.", color:"rgba(245,158,11,0.08)"},
            {icon:<Globe size={18} weight="fill" className="text-bronze-500" />, title:"Pour le Maroc", desc:"Un tourisme transparent, formalise, durable. Des revenues declares. Une image de destination premium preservee.", color:"rgba(184,138,68,0.08)"},
          ].map((item, i) => (
            <div key={i} className="rounded-2xl p-4 flex items-start gap-3" style={{background:item.color, border:"1px solid rgba(0,0,0,0.05)"}}>
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0">{item.icon}</div>
              <div>
                <h3 className="text-sm font-bold text-charcoal-800 mb-1">{item.title}</h3>
                <p className="text-xs text-charcoal-500 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* STATS */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {[
            {num:"19.8M", lbl:"Touristes 2025"},
            {num:"50+", lbl:"Guides"},
            {num:"5", lbl:"Villes"},
            {num:"4.9★", lbl:"Note"},
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-3 text-center" style={{boxShadow:"0 2px 8px rgba(0,0,0,0.05)"}}>
              <div className="font-display text-base font-bold text-bronze-500">{s.num}</div>
              <div className="text-[9px] text-charcoal-400 mt-0.5 leading-tight">{s.lbl}</div>
            </div>
          ))}
        </div>

        {/* CLOSING QUOTE */}
        <div className="bg-charcoal-800 rounded-2xl p-6 mb-4 text-center">
          <p className="font-display text-lg font-bold text-white leading-snug mb-2">
            Franchissez le seuil.<br/>
            <span style={{color:"#B88A44"}}>Le vrai Maroc vous attend.</span>
          </p>
        </div>

        {/* CTA */}
        <div className="bg-white rounded-2xl p-6" style={{boxShadow:"0 2px 16px rgba(0,0,0,0.07)"}}>
          <h2 className="font-display text-lg font-bold text-charcoal-800 mb-1">Rejoignez Laksor</h2>
          <p className="text-sm text-charcoal-400 mb-4">Vous etes guide ? Partagez votre passion pour le Maroc avec des voyageurs du monde entier.</p>
          <div className="flex gap-3">
            <Link href="/auth/register"
              className="flex-1 flex items-center justify-center gap-1.5 text-white font-bold py-3 rounded-full text-sm no-underline"
              style={{background:"linear-gradient(135deg, #B88A44, #9A7238)"}}>
              Devenir guide <ArrowRight size={13} weight="bold" />
            </Link>
            <Link href="/search"
              className="flex-1 flex items-center justify-center text-charcoal-700 font-bold py-3 rounded-full text-sm no-underline border-2 border-sand-300">
              Trouver un guide
            </Link>
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
}
