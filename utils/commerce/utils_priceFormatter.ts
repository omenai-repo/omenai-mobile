export function utils_formatPrice(
  price: number,
  currency?: string,
  decimals: number = 2,
): string {
  if (price === undefined || price === null) return "NaN";

  const formattedPrice = price.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  const currencyMap: Record<string, string> = {
    USD: "$",
    NGN: "₦",
    GBP: "£",
    EUR: "€",
  };

  const symbol = currencyMap[currency || ""] || currency || "$";

  return `${symbol}${formattedPrice}`;
}
