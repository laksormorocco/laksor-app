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
  "Chinois": "CN",
};

const CODES: Record<string, [number, number]> = {
  FR: [0x1F1EB, 0x1F1F7],
  GB: [0x1F1EC, 0x1F1E7],
  ES: [0x1F1EA, 0x1F1F8],
  DE: [0x1F1E9, 0x1F1EA],
  IT: [0x1F1EE, 0x1F1F9],
  MA: [0x1F1F2, 0x1F1E6],
  RU: [0x1F1F7, 0x1F1FA],
  IL: [0x1F1EE, 0x1F1F1],
  PT: [0x1F1F5, 0x1F1F9],
  CN: [0x1F1E8, 0x1F1F3],
};

export function flagEmoji(lang: string): string {
  const code = LANG_FLAGS[lang];
  if (!code || !CODES[code]) return lang;
  const [a, b] = CODES[code];
  return String.fromCodePoint(a) + String.fromCodePoint(b);
}
