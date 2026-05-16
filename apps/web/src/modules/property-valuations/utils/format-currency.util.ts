import type { Currency } from "../types/land-valuation.types";

export function formatCurrency(value: number, currency: Currency): string {
  const locale = "es-BO";

  if (currency === "USD") {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "BOB",
    maximumFractionDigits: 0,
  }).format(value);
}
