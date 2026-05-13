// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency = "MAD") {
  return `${amount.toLocaleString("fr-MA")} ${currency}`;
}

export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("fr-MA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function calcBookingPrice(
  basePrice: number,
  persons: number,
  commissionRate = 0.2
) {
  const supplement = persons > 1 ? basePrice * 0.1 * (persons - 1) : 0;
  const subtotal = basePrice + supplement;
  const commission = subtotal * commissionRate;
  return {
    subtotal,
    commission,
    total: subtotal,
    guideEarning: subtotal - commission,
  };
}
