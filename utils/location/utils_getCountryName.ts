import { Country } from "country-state-city";

export function getCountryName(input: string): string {
  if (!input) return "";

  const value = input.trim();

  // If it looks like a 2-letter ISO code, look it up
  if (value.length === 2) {
    const country = Country.getCountryByCode(value.toUpperCase());
    return country?.name || value;
  }

  // Check if it's already a valid country name by trying to find it
  const allCountries = Country.getAllCountries();
  const match = allCountries.find(
    (c) => c.name.toLowerCase() === value.toLowerCase(),
  );

  if (match) {
    return match.name;
  }

  // Fallback: return as-is
  return value;
}
