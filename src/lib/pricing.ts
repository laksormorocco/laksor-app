// Prix affiche au client (commission Laksor 25%)
export function priceWithCommission(guidePrice: number): number {
  return Math.ceil(guidePrice * 1.25);
}

// Prix final au paiement (commission + frais service)
export function priceWithFees(guidePrice: number): number {
  return Math.ceil(guidePrice * 1.25) + 25;
}
