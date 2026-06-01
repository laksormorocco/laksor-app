"use client";
import React from "react";
type BadgeVariant = "bronze"|"sage"|"sand"|"verified"|"pending"|"success"|"error";
interface BadgeProps { variant?:BadgeVariant; children:React.ReactNode; icon?:React.ReactNode; style?:React.CSSProperties; }
const B:Record<BadgeVariant,React.CSSProperties> = {
  bronze:  {background:"rgba(184,138,68,0.12)", color:"#B88A44",border:"1px solid rgba(184,138,68,0.25)"},
  sage:    {background:"rgba(125,143,105,0.12)",color:"#7D8F69",border:"1px solid rgba(125,143,105,0.25)"},
  verified:{background:"rgba(125,143,105,0.12)",color:"#7D8F69",border:"1px solid rgba(125,143,105,0.25)"},
  sand:    {background:"#EADCC8",color:"#111111",border:"1px solid #EADCC8"},
  pending: {background:"rgba(184,138,68,0.10)", color:"#9A6F2A",border:"1px solid rgba(184,138,68,0.20)"},
  success: {background:"rgba(125,143,105,0.12)",color:"#7D8F69",border:"1px solid rgba(125,143,105,0.25)"},
  error:   {background:"rgba(220,53,69,0.10)",  color:"#C0392B",border:"1px solid rgba(220,53,69,0.20)"},
};
export function Badge({variant="sand",children,icon,style}:BadgeProps) {
  return <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"4px 10px",borderRadius:999,fontSize:12,fontWeight:600,fontFamily:"var(--font-inter),sans-serif",letterSpacing:"0.02em",whiteSpace:"nowrap",...B[variant],...style}}>{icon&&<span style={{fontSize:11}}>{icon}</span>}{children}</span>;
}
export function VerifiedBadge() { return <Badge variant="verified" icon="✓">Guide certifié</Badge>; }
