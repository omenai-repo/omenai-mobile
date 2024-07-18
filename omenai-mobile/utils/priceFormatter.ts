export function formatPrice(price: number, currency?: string): string {
  if (currency) {
    return `${currency}${price.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}`;
  } else {
    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}`;
  }
}
