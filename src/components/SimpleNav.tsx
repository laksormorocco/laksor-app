import Link from "next/link";

export default function SimpleNav() {
  return (
    <div style={{background:"#fff",borderBottom:"1px solid #e8e0d6",padding:"0 24px",height:72,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100}}>
      <Link href="/" style={{textDecoration:"none"}}>
        <img src="/Logo.png" alt="Laksor" style={{height:70,width:"auto"}}/>
      </Link>
      <Link href="/" style={{fontSize:13,color:"#666",textDecoration:"none"}}>← Retour</Link>
    </div>
  );
}
