export type PackagingType = "rolled" | "stretched";

export interface PackagingPreset {
  id: string;
  label: string;
  description: string;
  dims_in: { length: number; width: number; height: number };
  weight_lbs: number;
  dims_cm: { length: number; width: number; height: number };
  weight_kg: number;
  max_art: { length: number; width?: number };
}

const IN_TO_CM = 2.54;
const LB_TO_KG = 0.453592;

export const PACKAGING_PRESETS: Record<PackagingType, PackagingPreset[]> = {
  rolled: [
    {
      id: "rolled_s",
      label: "Small Tube",
      description: "Fits prints up to 22 inches",
      dims_in: { length: 26, width: 4, height: 4 },
      weight_lbs: 3,
      dims_cm: {
        length: 26 * IN_TO_CM,
        width: 4 * IN_TO_CM,
        height: 4 * IN_TO_CM,
      },
      weight_kg: 3 * LB_TO_KG,
      max_art: { length: 22 },
    },
    {
      id: "rolled_m",
      label: "Medium Tube",
      description: "Fits prints up to 34 inches",
      dims_in: { length: 38, width: 4, height: 6 },
      weight_lbs: 6,
      dims_cm: {
        length: 38 * IN_TO_CM,
        width: 4 * IN_TO_CM,
        height: 6 * IN_TO_CM,
      },
      weight_kg: 6 * LB_TO_KG,
      max_art: { length: 34 },
    },
    {
      id: "rolled_l",
      label: "Large Tube",
      description: "Fits prints up to 46 inches",
      dims_in: { length: 50, width: 6, height: 6 },
      weight_lbs: 8,
      dims_cm: {
        length: 50 * IN_TO_CM,
        width: 6 * IN_TO_CM,
        height: 6 * IN_TO_CM,
      },
      weight_kg: 8 * LB_TO_KG,
      max_art: { length: 46 },
    },
    {
      id: "rolled_xl",
      label: "Extra Large Tube",
      description: "Fits prints up to 60 inches",
      dims_in: { length: 64, width: 8, height: 8 },
      weight_lbs: 10,
      dims_cm: {
        length: 64 * IN_TO_CM,
        width: 8 * IN_TO_CM,
        height: 8 * IN_TO_CM,
      },
      weight_kg: 10 * LB_TO_KG,
      max_art: { length: 60 },
    },
  ],
  stretched: [
    {
      id: "stretched_s",
      label: "Small Box",
      description: "Fits art up to 27 x 33 inches",
      dims_in: { length: 36, width: 30, height: 6 },
      weight_lbs: 15,
      dims_cm: {
        length: 36 * IN_TO_CM,
        width: 30 * IN_TO_CM,
        height: 6 * IN_TO_CM,
      },
      weight_kg: 15 * LB_TO_KG,
      max_art: { length: 33, width: 27 },
    },
    {
      id: "stretched_m",
      label: "Medium Box",
      description: "Fits art up to 39 x 51 inches",
      dims_in: { length: 54, width: 42, height: 6 },
      weight_lbs: 25,
      dims_cm: {
        length: 54 * IN_TO_CM,
        width: 42 * IN_TO_CM,
        height: 6 * IN_TO_CM,
      },
      weight_kg: 25 * LB_TO_KG,
      max_art: { length: 51, width: 39 },
    },
    {
      id: "stretched_l",
      label: "Large Box",
      description: "Fits art up to 51 x 63 inches",
      dims_in: { length: 66, width: 54, height: 6 },
      weight_lbs: 35,
      dims_cm: {
        length: 66 * IN_TO_CM,
        width: 54 * IN_TO_CM,
        height: 6 * IN_TO_CM,
      },
      weight_kg: 35 * LB_TO_KG,
      max_art: { length: 63, width: 51 },
    },
    {
      id: "stretched_xl",
      label: "XL Cardboard Box",
      description: "Fits art up to 63 x 63 inches",
      dims_in: { length: 66, width: 66, height: 6 },
      weight_lbs: 40,
      dims_cm: {
        length: 66 * IN_TO_CM,
        width: 66 * IN_TO_CM,
        height: 6 * IN_TO_CM,
      },
      weight_kg: 40 * LB_TO_KG,
      max_art: { length: 63, width: 63 },
    },
  ],
};

// Find the best fitting preset for artwork dimensions
export function getRecommendedPreset(
  packagingType: PackagingType,
  artLength: number,
  artHeight: number,
): PackagingPreset | null {
  const presets = PACKAGING_PRESETS[packagingType];
  const artLong = Math.max(artLength, artHeight);
  const artShort = Math.min(artLength, artHeight);

  for (const preset of presets) {
    if (packagingType === "rolled") {
      // For tubes: the SHORTER dimension determines the minimum tube length required
      if (artShort <= preset.max_art.length) {
        return preset;
      }
    } else {
      // For boxes: both dimensions must fit
      const boxLong = Math.max(
        preset.max_art.length,
        preset.max_art.width || 0,
      );
      const boxShort = Math.min(
        preset.max_art.length,
        preset.max_art.width || 0,
      );
      if (artLong <= boxLong && artShort <= boxShort) {
        return preset;
      }
    }
  }
  return null;
}

// Check if artwork fits in a preset
export function checkFit(
  preset: PackagingPreset,
  packagingType: PackagingType,
  artLength: number,
  artHeight: number,
): boolean {
  const artLong = Math.max(artLength, artHeight);
  const artShort = Math.min(artLength, artHeight);

  if (packagingType === "rolled") {
    // For tubes: the SHORTER dimension determines the minimum tube length required
    return artShort <= preset.max_art.length;
  } else {
    // For boxes: both dimensions must fit
    const boxLong = Math.max(preset.max_art.length, preset.max_art.width || 0);
    const boxShort = Math.min(preset.max_art.length, preset.max_art.width || 0);
    return artLong <= boxLong && artShort <= boxShort;
  }
}
