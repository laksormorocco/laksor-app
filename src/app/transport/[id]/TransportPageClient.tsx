"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TransportBookingModal from "./TransportBookingModal";

export default function TransportPageClient({ transport }: { transport: any }) {
  return (
    <div style={{ background: "var(--sand)", minHeight: "100vh", fontFamily: "var(--font-body)" }}>
      <Navbar />

      <div style={{ maxWidth: 1000, margin: "40px auto", padding: "0 16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 32 }}>
          
          {/* Main Content */}
          <div>
            <div style={{ background: "#fff", borderRadius: 32, padding: 40, border: "1px solid var(--sand-dark)", marginBottom: 32 }}>
              <div style={{ display: "flex", gap: 24, alignItems: "center", marginBottom: 32 }}>
                <div style={{ width: 100, height: 100, borderRadius: 24, overflow: "hidden", background: "var(--sand)" }}>
                  {transport.avatar ? <img src={transport.avatar} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-4xl">👤</div>}
                </div>
                <div>
                  <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 32, marginBottom: 8 }}>{transport.displayName}</h1>
                  <div style={{ fontSize: 14, color: "var(--bronze)", fontWeight: 700 }}>📍 {transport.city} · Chauffeur Professionnel</div>
                </div>
              </div>

              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 22, marginBottom: 16 }}>À propos</h2>
              <p style={{ color: "var(--soft)", lineHeight: 1.8, marginBottom: 32 }}>{transport.bio}</p>

              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 22, marginBottom: 16 }}>Véhicule</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
                <div style={{ background: "var(--sand)", padding: 20, borderRadius: 16 }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: "var(--muted)" }}>MODÈLE</div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>{transport.vehicleModel || transport.vehicleType}</div>
                </div>
                <div style={{ background: "var(--sand)", padding: 20, borderRadius: 16 }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: "var(--muted)" }}>CAPACITÉ</div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>{transport.capacity} passagers</div>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div style={{ background: "#fff", borderRadius: 32, padding: 40, border: "1px solid var(--sand-dark)" }}>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 22, marginBottom: 24 }}>Avis ({transport.reviews.length})</h2>
              {transport.reviews.length === 0 ? <p style={{ color: "var(--muted)", fontStyle: "italic" }}>Aucun avis pour le moment.</p> : 
                transport.reviews.map((r:any) => (
                  <div key={r.id} style={{ marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid var(--sand)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <div style={{ fontWeight: 700 }}>{r.author.name}</div>
                      <div style={{ color: "#F4C542" }}>{"★".repeat(r.rating)}</div>
                    </div>
                    <p style={{ color: "var(--soft)", fontSize: 14 }}>{r.comment}</p>
                  </div>
                ))
              }
            </div>
          </div>

          {/* Sidebar Booking */}
          <div style={{ position: "sticky", top: 100, height: "fit-content" }}>
            <div style={{ background: "#fff", borderRadius: 32, padding: 24, border: "2px solid var(--bronze)", boxShadow: "var(--shadow-lg)" }}>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", marginBottom: 4 }}>DÈS</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: "var(--charcoal)" }}>{transport.halfDayPrice} MAD</div>
              </div>
              
              <TransportBookingModal 
                transportName={transport.displayName} 
                halfDayPrice={transport.halfDayPrice} 
                fullDayPrice={transport.fullDayPrice} 
                transportId={transport.id} 
              />
              
              <div style={{ marginTop: 16, textAlign: "center", fontSize: 12, color: "var(--soft)" }}>
                Annulation gratuite 72h avant
              </div>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
