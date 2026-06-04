import { useState, useEffect } from "react";

export type Currency = { code: string; symbol: string; rate: number };

const CURRENCY_MAP: Record<string, string> = {
  "fr-FR": "EUR", "fr-BE": "EUR", "fr-CH": "EUR",
  "de-DE": "EUR", "de-AT": "EUR", "de-CH": "EUR",
  "es-ES": "EUR", "it-IT": "EUR", "pt-PT": "EUR",
  "en-GB": "GBP",
  "en-US": "USD", "en-CA": "USD",
  "he-IL": "ILS",
  "ru-RU": "RUB",
};

const SYMBOLS: Record<string, string> = {
  EUR: "€", GBP: "£", USD: "$", ILS: "₪", RUB: "₽", MAD: "MAD"
};

export function useExchangeRate() {
  const [currency, setCurrency] = useState<Currency>({ code: "MAD", symbol: "MAD", rate: 1 });

  useEffect(() => {
    const lang = navigator.language || "fr-MA";
    const code = CURRENCY_MAP[lang] || "MAD";
    if (code === "MAD") return;

    fetch("https://open.er-api.com/v6/latest/MAD")
      .then(r => r.json())
      .then(data => {
        const rate = data.rates?.[code];
        if (rate) setCurrency({ code, symbol: SYMBOLS[code] || code, rate });
      })
      .catch(() => {});
  }, []);

  function convert(mad: number): string {
    if (currency.code === "MAD") return mad + " MAD";
    const converted = Math.ceil(mad * currency.rate);
    return currency.symbol + converted;
  }

  return { currency, convert };
}
