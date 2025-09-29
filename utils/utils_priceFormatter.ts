export function utils_formatPrice(price: number, currency?: string, decimals: number = 2): string {
  if (price === undefined || price === null) return 'NaN';

  const formattedPrice = price.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return `${currency ?? '$'}${formattedPrice}`;
}
