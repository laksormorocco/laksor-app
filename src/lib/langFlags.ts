export const LANG_FLAGS: Record<string, string> = {
  "Francais": "FR",
  "Anglais": "GB", 
  "Espagnol": "ES",
  "Allemand": "DE",
  "Italien": "IT",
  "Arabe": "MA",
  "Russe": "RU",
  "Hebreu": "IL",
  "Portugais": "PT",
  "Chinois": "CN"
};

export function flagEmoji(code: string): string {
  const map: Record<string, string> = {
    FR: String.fromCodePoint(0x1F1EB, 0x1F1F7),
    GB: String.fromCodePoint(0x1F1EC, 0x1F1E7),
    ES: String.fromCodePoint(0x1F1EA, 0x1F8E),
    DE: String.fromCodePoint(0x1F1E9, 0x1F1EA),
    IT: String.fromCodePoint(0x1F1EE, 0x1F1F9),
    MA: String.fromCodePoint(0x1F1F2, 0x1F1E6),
    RU: String.fromCodePoint(0x1F1F7, 0x1F1FA),
    IL: String.fromCodePoint(0x1F1EE, 0x1F1F1),
    PT: String.fromCodePoint(0x1F1F5, 0x1F1F9),
    CN: String.fromCodePoint(0x1F1E8, 0x1F1F3),
  };
  return map[code] || "?";
}
