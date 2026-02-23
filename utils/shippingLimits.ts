export const UPS_MAX_CM = 419.1; // 165 inches
export const DHL_MAX_LENGTH_CM = 300; // 118.1 inches
export const DHL_MAX_WEIGHT_KG = 300;

export function checkCarrierLimit(
  lengthCm: number,
  widthCm: number,
  heightCm: number,
  weightKg: number,
  carrier: string,
): boolean {
  if (!carrier) return false;
  const c = carrier.toUpperCase();
  const dims = [lengthCm, widthCm, heightCm].sort((a, b) => b - a);
  const longestSide = dims[0];
  const girth = 2 * dims[1] + 2 * dims[2];

  // Both UPS and DHL respect a maximum combined length and girth of 165 inches (419.1 cm)
  if (longestSide + girth > UPS_MAX_CM) {
    return true;
  }

  if (c === "DHL") {
    // DHL also has a hard independent limit on weight and single-side length
    return longestSide > DHL_MAX_LENGTH_CM || weightKg > DHL_MAX_WEIGHT_KG;
  }

  return false;
}

// Simulates a rolled tube based on canvas dimensions to see if it WOULD pass
export function checkIfRolledPassesLimit(
  artLengthCm: number,
  artHeightCm: number,
  carrier: string,
): boolean {
  if (!carrier) return true;
  // A rolled canvas takes the shortest side as the tube length, plus a small buffer
  const shortestSide = Math.min(artLengthCm, artHeightCm);
  const estimatedTubeLength = shortestSide + 10;
  const estimatedTubeWidth = 15; // Standard 6-inch tube
  const estimatedTubeHeight = 15;
  const estimatedWeight = 5; // Standard rolled weight

  return !checkCarrierLimit(
    estimatedTubeLength,
    estimatedTubeWidth,
    estimatedTubeHeight,
    estimatedWeight,
    carrier,
  );
}
