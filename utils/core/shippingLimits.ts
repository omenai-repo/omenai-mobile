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

  if (c === "UPS") {
    const girth = 2 * dims[1] + 2 * dims[2];
    return longestSide + girth > UPS_MAX_CM;
  }

  if (c === "DHL") {
    return longestSide > DHL_MAX_LENGTH_CM || weightKg > DHL_MAX_WEIGHT_KG;
  }

  return false;
}

// Simulates a rolled tube based on canvas dimensions to see if it WOULD pass
export function checkIfRolledPassesLimit(
  artWidthCm: number,
  artHeightCm: number,
  carrier: string,
): boolean {
  if (!carrier) return true;

  const shortestSide = Math.min(artWidthCm, artHeightCm);
  const estimatedTubeLength = shortestSide + 10;
  const estimatedTubeWidth = 15;
  const estimatedTubeHeight = 15;
  const estimatedWeight = 5;

  return !checkCarrierLimit(
    estimatedTubeLength,
    estimatedTubeWidth,
    estimatedTubeHeight,
    estimatedWeight,
    carrier,
  );
}
