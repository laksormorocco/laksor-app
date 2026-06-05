// Prix avec commission Laksor : prix_guide * 1.25 + 25 MAD
export function priceWithCommission(guidePrice: number): number {
  return Math.ceil(guidePrice * 1.25 + 25);
}
