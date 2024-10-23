import { currency_symbol } from "../json/currencySymbol";

export function utils_getCurrencySymbol(currency: string) {
  const found_currency = currency_symbol.find(
    (single_currency) => single_currency.abbreviation === currency.toUpperCase()
  );

  return found_currency?.symbol;
}
