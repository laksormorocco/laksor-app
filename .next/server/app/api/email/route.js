"use strict";(()=>{var e={};e.id=7433,e.ids=[7433],e.modules={30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},13878:(e,t,r)=>{r.r(t),r.d(t,{headerHooks:()=>m,originalPathname:()=>v,patchFetch:()=>y,requestAsyncStorage:()=>c,routeModule:()=>x,serverHooks:()=>f,staticGenerationAsyncStorage:()=>u,staticGenerationBailout:()=>h});var o={};r.r(o),r.d(o,{POST:()=>g,dynamic:()=>p});var i=r(95419),a=r(69108),n=r(99678),d=r(4278),s=r(78070);let p="force-dynamic",l=new d.R(process.env.RESEND_API_KEY);async function g(e){try{let{to:t,guideName:r,date:o,persons:i,price:a,duration:n}=await e.json();return await l.emails.send({from:"Laksor <onboarding@resend.dev>",to:t,subject:"Confirmation de votre reservation - Laksor",html:`
        <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:40px 20px;background:#F8F5F0;">
          <div style="background:#123EAB;borderRadius:16px;padding:32px;text-align:center;margin-bottom:24px;">
            <h1 style="color:#fff;font-size:28px;margin:0 0 8px;">🎉 Reservation confirmee !</h1>
            <p style="color:rgba(255,255,255,0.8);margin:0;">Laksor - Tour Guide Morocco</p>
          </div>
          <div style="background:#fff;border-radius:16px;padding:24px;margin-bottom:16px;">
            <h2 style="color:#123EAB;font-size:18px;margin:0 0 16px;">Details de votre reservation</h2>
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:8px 0;color:#666;font-size:14px;">Guide</td><td style="padding:8px 0;font-weight:700;font-size:14px;text-align:right;">${r}</td></tr>
              <tr><td style="padding:8px 0;color:#666;font-size:14px;">Date</td><td style="padding:8px 0;font-weight:700;font-size:14px;text-align:right;">${o}</td></tr>
              <tr><td style="padding:8px 0;color:#666;font-size:14px;">Duree</td><td style="padding:8px 0;font-weight:700;font-size:14px;text-align:right;">${n}</td></tr>
              <tr><td style="padding:8px 0;color:#666;font-size:14px;">Personnes</td><td style="padding:8px 0;font-weight:700;font-size:14px;text-align:right;">${i}</td></tr>
              <tr style="border-top:2px solid #e8e0d6;"><td style="padding:12px 0;color:#123EAB;font-weight:700;font-size:16px;">Total</td><td style="padding:12px 0;font-weight:900;font-size:20px;color:#123EAB;text-align:right;">${a} MAD</td></tr>
            </table>
          </div>
          <div style="background:#fff7ed;border-radius:14px;padding:16px;margin-bottom:16px;border:1px solid #fed7aa;">
            <p style="color:#c2410c;font-weight:700;margin:0 0 4px;">Paiement cash</p>
            <p style="color:#9a3412;font-size:13px;margin:0;">Le paiement s effectue directement au guide le jour de la visite.</p>
          </div>
          <p style="text-align:center;color:#999;font-size:12px;">Laksor - Trouvez votre guide, vivez le Maroc</p>
        </div>
      `}),s.Z.json({success:!0})}catch(e){return s.Z.json({error:e.message},{status:500})}}let x=new i.AppRouteRouteModule({definition:{kind:a.x.APP_ROUTE,page:"/api/email/route",pathname:"/api/email",filename:"route",bundlePath:"app/api/email/route"},resolvedPagePath:"/workspaces/laksor-app/laksor-v2/laksor/src/app/api/email/route.ts",nextConfigOutput:"",userland:o}),{requestAsyncStorage:c,staticGenerationAsyncStorage:u,serverHooks:f,headerHooks:m,staticGenerationBailout:h}=x,v="/api/email/route";function y(){return(0,n.patchFetch)({serverHooks:f,staticGenerationAsyncStorage:u})}}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),o=t.X(0,[1638,6206,4278],()=>r(13878));module.exports=o})();