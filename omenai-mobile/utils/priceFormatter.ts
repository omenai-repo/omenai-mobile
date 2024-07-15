export function formatPrice(price: number, currency?: string): string {
  if (currency) {
    return `${currency}${price.toLocaleString()}`;
  } else {
    return `$${price.toLocaleString()}`;
  }
}
