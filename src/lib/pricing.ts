// Laksor Pricing Logic

export function priceWithCommission(price: number): number {
  return Math.ceil(price * 1.25);
}

export function priceWithFees(price: number): number {
  return Math.ceil(price * 1.25) + 25;
}
// Guide defines halfDayPrice (base price for group 1-4 pax)

export function priceHalfDay(halfDayPrice: number, persons: number = 4): number {
  const base = Math.ceil(halfDayPrice * 1.25);
  if (persons <= 4) return base;
  return Math.ceil(base * (1 + (persons - 4) * 0.15));
}

export function priceFullDay(halfDayPrice: number, persons: number = 4): number {
  const fullDay = Math.ceil(halfDayPrice * 1.8);
  return priceHalfDay(fullDay, persons);
}


export function formatMAD(price: number): string {
  return price.toLocaleString("fr-FR") + " MAD";
}

export function formatEUR(price: number): string {
  return "€" + Math.round(price * 0.092);
}

// Affichage carte guide
export function priceCardDisplay(halfDayPrice: number) {
  return {
    halfDay: Math.ceil(halfDayPrice * 1.25),
    fullDay: Math.ceil(halfDayPrice * 1.8 * 1.25),
    group5: Math.ceil(halfDayPrice * 1.25 * 1.4),
  };
}

// Experience pricing avec reduction groupe
export function expPricePerPerson(priceWithCommission: number, persons: number): number {
  let discount = 1;
  if (persons >= 7) discount = 0.85;
  else if (persons >= 4) discount = 0.92;
  return Math.ceil(priceWithCommission * discount);
}

export function expTotalPrice(priceWithCommission: number, persons: number): number {
  return expPricePerPerson(priceWithCommission, persons) * persons;
}

export function expCommission(basePrice: number, persons: number): number {
  let discount = 1;
  if (persons >= 7) discount = 0.85;
  else if (persons >= 4) discount = 0.92;
  return Math.ceil(basePrice * discount * 0.25) * persons;
}
