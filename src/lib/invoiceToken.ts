import { createHmac } from "crypto";

const SECRET = process.env.INVOICE_SECRET || "laksor-invoice-2026";

export function generateInvoiceToken(bookingId: string): string {
  return createHmac("sha256", SECRET).update(bookingId).digest("hex").slice(0, 16);
}

export function verifyInvoiceToken(bookingId: string, token: string): boolean {
  const expected = generateInvoiceToken(bookingId);
  return token === expected;
}
