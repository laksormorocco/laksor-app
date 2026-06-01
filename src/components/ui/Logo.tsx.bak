"use client";
import React from "react";
type LogoSize = "xs"|"sm"|"md"|"lg"|"xl";
type LogoVariant = "dark"|"light"|"bronze";
interface LogoProps { size?:LogoSize; variant?:LogoVariant; showTagline?:boolean; style?:React.CSSProperties; }
const fontSizes:Record<LogoSize,number> = {xs:14,sm:18,md:22,lg:28,xl:36};
const colorMap:Record<LogoVariant,string> = {dark:"#111111",light:"#FFFFFF",bronze:"#B88A44"};
export function Logo({size="md",variant="bronze",showTagline=false,style}:LogoProps) {
  const fontSize = fontSizes[size];
  const color = colorMap[variant];
  return (
    <div style={{display:"inline-flex",flexDirection:"column",alignItems:"flex-start",gap:2,...style}}>
      <span style={{fontFamily:"var(--font-playfair),Georgia,serif",fontSize,fontWeight:700,color,letterSpacing:"0.12em",lineHeight:1,textTransform:"uppercase"}}>LAKSOR</span>
      {showTagline && <span style={{fontFamily:"var(--font-inter),sans-serif",fontSize:fontSize*0.38,fontWeight:400,color:variant==="light"?"rgba(255,255,255,0.65)":"#888888",letterSpacing:"0.15em",textTransform:"uppercase"}}>Guides Locaux · Maroc</span>}
    </div>
  );
}
