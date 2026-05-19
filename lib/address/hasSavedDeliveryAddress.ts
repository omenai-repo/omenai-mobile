type DeliveryAddressFields = {
  country?: string;
  countryCode?: string;
  stateCode?: string;
};

/** True when the user has a saved shipping location on their profile. */
export function hasSavedDeliveryAddress(
  address?: DeliveryAddressFields | null,
): boolean {
  if (!address) return false;
  return Boolean(
    address.country && address.countryCode && address.stateCode,
  );
}
