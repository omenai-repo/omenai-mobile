export function utils_formatPrice(price: number, currency?: string): string {
  if (price === undefined || price === null) return 'NaN';

  const formattedPrice = price.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `${currency ?? '$'}${formattedPrice}`;
}
