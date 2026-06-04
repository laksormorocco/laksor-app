import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { backgroundColor: "#F6F1E8", padding: 40, fontFamily: "Helvetica" },
  header: { backgroundColor: "#111111", borderRadius: 12, padding: 24, marginBottom: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  logo: { fontSize: 20, fontFamily: "Helvetica-Bold", color: "#B88A44", letterSpacing: 3 },
  headerRight: { alignItems: "flex-end" },
  headerTitle: { fontSize: 14, color: "#ffffff", fontFamily: "Helvetica-Bold" },
  headerSub: { fontSize: 9, color: "#888888", marginTop: 3 },
  refBox: { backgroundColor: "#ffffff", borderRadius: 8, padding: 12, marginBottom: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center", border: "1px solid #EADCC8" },
  refLabel: { fontSize: 9, color: "#888888", textTransform: "uppercase", letterSpacing: 1 },
  refValue: { fontSize: 16, fontFamily: "Helvetica-Bold", color: "#B88A44" },
  section: { backgroundColor: "#ffffff", borderRadius: 8, padding: 16, marginBottom: 12, border: "1px solid #EADCC8" },
  sectionTitle: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#111111", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 5, borderBottom: "1px solid #F6F1E8" },
  rowLabel: { fontSize: 11, color: "#888888" },
  rowValue: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#111111" },
  totalRow: { flexDirection: "row", justifyContent: "space-between", paddingTop: 10, marginTop: 4 },
  totalLabel: { fontSize: 13, fontFamily: "Helvetica-Bold", color: "#111111" },
  totalValue: { fontSize: 18, fontFamily: "Helvetica-Bold", color: "#B88A44" },
  footer: { marginTop: 20, alignItems: "center" },
  footerText: { fontSize: 9, color: "#aaaaaa", textAlign: "center", lineHeight: 1.6 },
  badge: { backgroundColor: "#7D8F69", borderRadius: 4, padding: "3 8", marginTop: 8 },
  badgeText: { fontSize: 9, color: "#ffffff", fontFamily: "Helvetica-Bold" },
});

type Props = {
  bookingRef: string;
  guideName: string;
  touristName: string;
  touristEmail: string;
  date: string;
  duration: string;
  persons: number;
  transport: boolean;
  paymentMethod: string;
  basePrice: number;
  extraCost: number;
  transportCost: number;
  serviceFee: number;
  total: number;
};

export default function InvoicePDF({
  bookingRef, guideName, touristName, touristEmail,
  date, duration, persons, transport, paymentMethod,
  basePrice, extraCost, transportCost, serviceFee, total
}: Props) {
  const deposit = Math.round(total * 0.3);
  const isPaid = paymentMethod === "deposit" || paymentMethod === "full";
  const paymentLabel = paymentMethod === "deposit" ? "Acompte 30%" : paymentMethod === "full" ? "100% en ligne" : "Cash le jour J";

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.logo}>LAKSOR</Text>
          <View style={styles.headerRight}>
            <Text style={styles.headerTitle}>Facture de réservation</Text>
            <Text style={styles.headerSub}>laksor.ma · +212 6 57 43 63 42</Text>
          </View>
        </View>

        {/* REF */}
        <View style={styles.refBox}>
          <View>
            <Text style={styles.refLabel}>Numéro de réservation</Text>
            <Text style={styles.refValue}>{bookingRef}</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.refLabel}>Date d'émission</Text>
            <Text style={{ fontSize: 11, fontFamily: "Helvetica-Bold", color: "#111111" }}>
              {new Date().toLocaleDateString("fr-FR")}
            </Text>
          </View>
        </View>

        {/* PARTIES */}
        <View style={{ flexDirection: "row", gap: 10, marginBottom: 12 }}>
          <View style={{ ...styles.section, flex: 1 }}>
            <Text style={styles.sectionTitle}>Client</Text>
            <Text style={{ fontSize: 12, fontFamily: "Helvetica-Bold", color: "#111" }}>{touristName}</Text>
            <Text style={{ fontSize: 10, color: "#888", marginTop: 3 }}>{touristEmail}</Text>
          </View>
          <View style={{ ...styles.section, flex: 1 }}>
            <Text style={styles.sectionTitle}>Guide</Text>
            <Text style={{ fontSize: 12, fontFamily: "Helvetica-Bold", color: "#111" }}>{guideName}</Text>
            <Text style={{ fontSize: 10, color: "#888", marginTop: 3 }}>Certifié Ministère du Tourisme</Text>
          </View>
        </View>

        {/* DETAILS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Détails de la prestation</Text>
          <View style={styles.row}><Text style={styles.rowLabel}>Date de la visite</Text><Text style={styles.rowValue}>{date}</Text></View>
          <View style={styles.row}><Text style={styles.rowLabel}>Durée</Text><Text style={styles.rowValue}>{duration}</Text></View>
          <View style={styles.row}><Text style={styles.rowLabel}>Participants</Text><Text style={styles.rowValue}>{persons} personnes</Text></View>
          <View style={styles.row}><Text style={styles.rowLabel}>Tarif de base (2 pers.)</Text><Text style={styles.rowValue}>{basePrice} MAD</Text></View>
          {extraCost > 0 && <View style={styles.row}><Text style={styles.rowLabel}>+15% pers. supplémentaires</Text><Text style={styles.rowValue}>+{extraCost} MAD</Text></View>}
          {transport && <View style={styles.row}><Text style={styles.rowLabel}>Transport hôtel/riad A/R</Text><Text style={styles.rowValue}>+{transportCost} MAD</Text></View>}
          <View style={styles.row}><Text style={styles.rowLabel}>Frais de service Laksor</Text><Text style={styles.rowValue}>+{serviceFee} MAD</Text></View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TOTAL</Text>
            <Text style={styles.totalValue}>{total} MAD</Text>
          </View>
          {isPaid && (
            <View style={{ marginTop: 8, alignItems: "flex-end" }}>
              <Text style={{ fontSize: 10, color: "#7D8F69", fontFamily: "Helvetica-Bold" }}>
                Acompte : {deposit} MAD · Reste le jour J : {total - deposit} MAD
              </Text>
            </View>
          )}
        </View>

        {/* PAIEMENT */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mode de paiement</Text>
          <Text style={{ fontSize: 12, fontFamily: "Helvetica-Bold", color: "#111" }}>{paymentLabel}</Text>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Guides certifiés Ministère du Tourisme Marocain</Text>
          </View>
          <Text style={{ ...styles.footerText, marginTop: 10 }}>
            LAKSOR Morocco · laksor.ma · noreply@laksor.ma{"\n"}
            Cette facture est générée automatiquement par la plateforme Laksor.
          </Text>
        </View>

      </Page>
    </Document>
  );
}
