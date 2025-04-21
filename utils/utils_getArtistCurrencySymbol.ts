import { artist_countries_codes_currency } from 'data/artist_countries_codes_currency';

export const getArtistCurrencySymbol = (currencyCode: string): string | null => {
  const match = artist_countries_codes_currency.find(
    (item) => item.currency.toUpperCase() === currencyCode.toUpperCase(),
  );

  return match ? match.symbol : null;
};
