"use strict";(()=>{var e={};e.id=35,e.ids=[35],e.modules={517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},6971:(e,t,o)=>{o.r(t),o.d(t,{headerHooks:()=>f,originalPathname:()=>b,patchFetch:()=>v,requestAsyncStorage:()=>m,routeModule:()=>c,serverHooks:()=>x,staticGenerationAsyncStorage:()=>h,staticGenerationBailout:()=>y});var r={};o.r(r),o.d(r,{PATCH:()=>u,dynamic:()=>p});var i=o(5419),a=o(9108),n=o(9678),d=o(9631),s=o(8070),l=o(4278);let p="force-dynamic",g=new l.R(process.env.RESEND_API_KEY);async function u(e){try{let{bookingId:t,status:o}=await e.json(),r=await d._.booking.update({where:{id:t},data:{status:o},include:{guide:!0,tourist:!0}});if("CONFIRMED"===o){let e=new Date(r.date).toLocaleDateString("fr-FR"),t="HALF_DAY"===r.duration?"Demi-journee (4h)":"Journee complete (8h)";r.tourist?.email&&await g.emails.send({from:"Laksor <onboarding@resend.dev>",to:"laksor.morocco@gmail.com",subject:"Votre reservation est confirmee - Laksor",html:`
            <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:40px 20px;background:#F8F5F0;">
              <div style="background:#22c55e;border-radius:16px;padding:32px;text-align:center;margin-bottom:24px;">
                <h1 style="color:#fff;font-size:28px;margin:0 0 8px;">✅ Reservation confirmee !</h1>
                <p style="color:rgba(255,255,255,0.9);margin:0;">Votre guide a accepte votre demande</p>
              </div>
              <div style="background:#fff;border-radius:16px;padding:24px;margin-bottom:16px;">
                <h2 style="color:#123EAB;margin:0 0 16px;">Details</h2>
                <table style="width:100%;border-collapse:collapse;">
                  <tr><td style="padding:8px 0;color:#666;">Guide</td><td style="text-align:right;font-weight:700;">${r.guide?.displayName}</td></tr>
                  <tr><td style="padding:8px 0;color:#666;">Date</td><td style="text-align:right;font-weight:700;">${e}</td></tr>
                  <tr><td style="padding:8px 0;color:#666;">Duree</td><td style="text-align:right;font-weight:700;">${t}</td></tr>
                  <tr><td style="padding:8px 0;color:#666;">Personnes</td><td style="text-align:right;font-weight:700;">${r.persons}</td></tr>
                  <tr style="border-top:2px solid #e8e0d6;"><td style="padding:12px 0;color:#123EAB;font-weight:700;">Total</td><td style="text-align:right;font-weight:900;font-size:20px;color:#123EAB;">${r.totalPrice} MAD</td></tr>
                </table>
              </div>
              <div style="background:#fff7ed;border-radius:14px;padding:16px;border:1px solid #fed7aa;">
                <p style="color:#c2410c;font-weight:700;margin:0 0 4px;">Contact guide</p>
                <p style="color:#9a3412;font-size:13px;margin:0;">WhatsApp : ${r.guide?.phone||"Non disponible"}</p>
              </div>
            </div>
          `});let o=null;if(r.tourist){let i=encodeURIComponent("✅ Votre reservation Laksor est confirmee !\n\nGuide: "+(r.guide?.displayName||"")+"\nDate: "+e+"\nDuree: "+t+"\nTotal: "+r.totalPrice+" MAD\n\nContact guide: "+(r.guide?.phone||""));if(r.guide?.phone){let e=r.guide.phone.replace(/[^0-9]/g,"");o="https://wa.me/"+e+"?text="+i}else o="https://wa.me/?text="+i}return s.Z.json({booking:r,whatsappUrl:o})}return s.Z.json({booking:r})}catch(e){return s.Z.json({error:e.message},{status:500})}}let c=new i.AppRouteRouteModule({definition:{kind:a.x.APP_ROUTE,page:"/api/guide/booking/route",pathname:"/api/guide/booking",filename:"route",bundlePath:"app/api/guide/booking/route"},resolvedPagePath:"/workspaces/laksor-app/laksor-v2/laksor/src/app/api/guide/booking/route.ts",nextConfigOutput:"",userland:r}),{requestAsyncStorage:m,staticGenerationAsyncStorage:h,serverHooks:x,headerHooks:f,staticGenerationBailout:y}=c,b="/api/guide/booking/route";function v(){return(0,n.patchFetch)({serverHooks:x,staticGenerationAsyncStorage:h})}},9631:(e,t,o)=>{o.d(t,{_:()=>i});let r=require("@prisma/client"),i=global.prisma||new r.PrismaClient}};var t=require("../../../../webpack-runtime.js");t.C(e);var o=e=>t(t.s=e),r=t.X(0,[638,206,278],()=>o(6971));module.exports=r})();