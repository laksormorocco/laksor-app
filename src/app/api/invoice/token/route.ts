import { NextResponse } from "next/server";
import { generateInvoiceToken } from "@/lib/invoiceToken";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const bookingId = url.searchParams.get("bookingId");
  if (!bookingId) return NextResponse.json({ error: "bookingId requis" }, { status: 400 });
  const token = generateInvoiceToken(bookingId);
  return NextResponse.json({ token, url: "/booking/invoice/" + bookingId + "?token=" + token });
}
