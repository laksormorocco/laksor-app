"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

const B="#123EAB",Y="#F4C542",S="#F8F5F0";

export default function ReviewSection({ guideId }: { guideId: string }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [bookingId, setBookingId] = useState("");
  const [eligibleBookings, setEligibleBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchReviews();
    checkEligibility();
  }, [guideId]);

  async function fetchReviews() {
    const res = await fetch("/api/reviews?guideId=" + guideId);
    const data = await res.json();
    setReviews(data.reviews || []);
  }

  async function checkEligibility() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const res = await fetch("/api/tourist/bookings?supabaseId=" + session.user.id);
    const data = await res.json();
    const eligible = (data.bookings || []).filter((b: any) =>
      b.guide?.id === guideId && b.status === "COMPLETED" && !b.review
    );
    setEligibleBookings(eligible);
    if (eligible.length > 0) setBookingId(eligible[0].id);
  }

  async function submitReview() {
    if (!bookingId) return alert("Aucune visite terminee avec ce guide");
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ bookingId, rating, comment, supabaseId: session?.user?.id })
    });
    if (res.ok) { setSubmitted(true); fetchReviews(); }
    else alert("Erreur lors de l envoi");
    setLoading(false);
  }

  return (
    <div style={{background:"#fff",borderRadius:20,padding:24,marginBottom:20}}>
      <div style={{fontSize:13,fontWeight:700,color:B,letterSpacing:1,marginBottom:16}}>AVIS CLIENTS ({reviews.length})</div>

      {eligibleBookings.length > 0 && !submitted && (
        <div style={{background:S,borderRadius:16,padding:20,marginBottom:20}}>
          <div style={{fontSize:14,fontWeight:700,color:B,marginBottom:12}}>Laissez votre avis</div>
          <div style={{display:"flex",gap:8,marginBottom:12}}>
            {[1,2,3,4,5].map(s => (
              <button key={s} onClick={()=>setRating(s)} style={{fontSize:24,background:"none",border:"none",cursor:"pointer",opacity:s<=rating?1:0.3}}>⭐</button>
            ))}
          </div>
          <textarea value={comment} onChange={e=>setComment(e.target.value)} placeholder="Partagez votre experience..." rows={3} style={{width:"100%",border:"2px solid #e8e0d6",borderRadius:12,padding:"12px 16px",fontSize:14,boxSizing:"border-box",resize:"vertical",marginBottom:12}}/>
          <button onClick={submitReview} disabled={loading} style={{background:B,color:"#fff",border:"none",borderRadius:12,padding:"12px 24px",fontSize:14,fontWeight:700,cursor:"pointer"}}>
            {loading ? "Envoi..." : "Publier mon avis"}
          </button>
        </div>
      )}

      {submitted && (
        <div style={{background:"#dcfce7",borderRadius:12,padding:16,marginBottom:16,color:"#166534",fontWeight:600,fontSize:14}}>
          ✅ Merci pour votre avis !
        </div>
      )}

      {reviews.length === 0 && (
        <div style={{textAlign:"center",padding:24,color:"#999",fontSize:14}}>
          Aucun avis pour le moment
        </div>
      )}

      {reviews.map((r: any) => (
        <div key={r.id} style={{borderBottom:"1px solid #f0ebe4",paddingBottom:16,marginBottom:16}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
            {r.author?.avatar && <img src={r.author.avatar} alt="" style={{width:36,height:36,borderRadius:"50%",objectFit:"cover"}}/>}
            <div>
              <div style={{fontWeight:700,fontSize:14}}>{r.author?.name || "Voyageur"}</div>
              <div style={{color:Y,fontSize:14}}>{"★".repeat(r.rating)}{"☆".repeat(5-r.rating)}</div>
            </div>
            <div style={{marginLeft:"auto",fontSize:11,color:"#999"}}>{new Date(r.createdAt).toLocaleDateString("fr-FR")}</div>
          </div>
          {r.comment && <p style={{fontSize:14,color:"#444",lineHeight:1.6,margin:0}}>{r.comment}</p>}
        </div>
      ))}
    </div>
  );
}
