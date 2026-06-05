export const LANG_FLAGS: Record<string, string> = {
  "Francais": "🇫🇷",
  "Anglais": "🇬🇧",
  "Espagnol": "🇪🇸",
  "Allemand": "🇩🇪",
  "Italien": "🇮🇹",
  "Arabe": "🇲🇦",
  "Russe": "🇷🇺",
  "Hebreu": "🇮🇱",
  "Portugais": "🇵🇹",
  "Chinois": "🇨🇳",
};

export function flagEmoji(lang: string): string {
  return LANG_FLAGS[lang] || lang;
}
