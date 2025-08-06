export function formatCurrency(
  amount: unknown,
  currency: string | undefined = "USD",
  locale: string = "es-MX"
): string {
  try {
    if (amount == "" || amount == null) return "";
    if (currency == "" || currency == "$") currency = "USD";
    else if (currency === 'N/A') currency = '';
    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount)) throw new Error("Invalid number");

    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(parsedAmount);
  } catch (error) {
    return String(amount);
  }
}
