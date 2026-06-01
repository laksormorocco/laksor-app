"use client";
import React from "react";
type ButtonVariant = "primary"|"secondary"|"sage"|"ghost"|"outline";
type ButtonSize = "sm"|"md"|"lg";
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:ButtonVariant; size?:ButtonSize; fullWidth?:boolean; loading?:boolean;
  icon?:React.ReactNode; iconPosition?:"left"|"right";
}
const V:Record<ButtonVariant,React.CSSProperties> = {
  primary:   {background:"linear-gradient(135deg,#B88A44,#A17635)",color:"#fff",border:"none",boxShadow:"0 4px 16px rgba(184,138,68,0.30)"},
  secondary: {background:"#fff",color:"#111",border:"1.5px solid #EADCC8"},
  sage:      {background:"rgba(125,143,105,0.10)",color:"#7D8F69",border:"1.5px solid #7D8F69"},
  ghost:     {background:"rgba(255,255,255,0.15)",color:"#fff",border:"1.5px solid rgba(255,255,255,0.30)",backdropFilter:"blur(10px)"},
  outline:   {background:"transparent",color:"#B88A44",border:"1.5px solid #B88A44"},
};
const S:Record<ButtonSize,React.CSSProperties> = {
  sm:{padding:"8px 18px",fontSize:13},
  md:{padding:"12px 28px",fontSize:14},
  lg:{padding:"16px 36px",fontSize:16},
};
export function Button({variant="primary",size="md",fullWidth=false,loading=false,icon,iconPosition="left",children,disabled,style,...props}:ButtonProps) {
  return (
    <button disabled={disabled||loading}
      onMouseEnter={e=>{if(!disabled&&!loading){e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.filter="brightness(1.06)"}}}
      onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.filter="brightness(1)"}}
      style={{display:"inline-flex",alignItems:"center",justifyContent:"center",gap:8,borderRadius:999,fontFamily:"var(--font-inter),sans-serif",fontWeight:600,cursor:disabled||loading?"not-allowed":"pointer",width:fullWidth?"100%":"auto",transition:"all 0.2s ease",opacity:disabled?0.55:1,whiteSpace:"nowrap",letterSpacing:"0.01em",...V[variant],...S[size],...style}}
      {...props}>
      {loading?<><span style={{width:14,height:14,border:"2px solid rgba(255,255,255,0.3)",borderTopColor:"#fff",borderRadius:"50%",display:"inline-block",animation:"spin 0.7s linear infinite"}}/>{children}</>:<>{icon&&iconPosition==="left"&&icon}{children}{icon&&iconPosition==="right"&&icon}</>}
    </button>
  );
}
