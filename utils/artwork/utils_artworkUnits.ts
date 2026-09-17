// Canonical unit arrays
export const DIMENSION_UNITS = ["in", "cm"] as const;
export const WEIGHT_UNITS = ["lbs", "kg"] as const;

// Strips unit suffix, e.g. "24in" to "24"
export function stripUnit(val?: string): string {
  return val ? val.replace(/[^\d.]/g, "") : "";
}

// Converts to inches
export function toCanonicalDimension(
  value: number,
  from: DimensionUnit,
): number {
  if (from === "cm") return value / 2.54;
  return value;
}

// Converts to lbs
export function toCanonicalWeight(value: number, from: WeightUnit): number {
  if (from === "kg") return value * 2.20462;
  return value;
}

// Returns a canonical dimension string for API storage
export function toCanonicalDimensionString(
  value: number,
  from: DimensionUnit,
): string {
  const inches = Number.parseFloat(
    toCanonicalDimension(value, from).toFixed(1),
  );
  return `${inches}in`;
}

// Returns a canonical weight string for API storage
export function toCanonicalWeightString(
  value: number,
  from: WeightUnit,
): string {
  const lbs = Number.parseFloat(toCanonicalWeight(value, from).toFixed(1));
  return `${lbs}lbs`;
}
