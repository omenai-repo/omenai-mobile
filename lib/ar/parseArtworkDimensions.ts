import type { ArtworkDimensions } from "#components/ar/types";

const CM_TO_M = 0.01;
const IN_TO_M = 0.0254;
const FT_TO_M = 0.3048;

const DEFAULT_WIDTH_M = 0.8;
const DEFAULT_HEIGHT_M = 0.6;

function parseDimensionToMeters(
  value: string | undefined,
  fallbackMeters: number,
): number {
  if (!value || value === "0") return fallbackMeters;

  const trimmed = value.trim().toLowerCase();
  const match = trimmed.match(/^([\d.]+)\s*(cm|in|m|ft)?$/);
  if (!match) {
    const numeric = Number.parseFloat(trimmed.replace(/[^\d.]/g, ""));
    return Number.isFinite(numeric) && numeric > 0
      ? numeric * CM_TO_M
      : fallbackMeters;
  }

  const amount = Number.parseFloat(match[1]);
  if (!Number.isFinite(amount) || amount <= 0) return fallbackMeters;

  switch (match[2] ?? "cm") {
    case "m":
      return amount;
    case "in":
      return amount * IN_TO_M;
    case "ft":
      return amount * FT_TO_M;
    case "cm":
    default:
      return amount * CM_TO_M;
  }
}

export function parseArtworkDimensions(
  dimensions?: {
    height?: string;
    width?: string;
    length?: string;
  },
): ArtworkDimensions {
  const widthSource =
    dimensions?.width && dimensions.width !== "0"
      ? dimensions.width
      : dimensions?.length;

  const width = parseDimensionToMeters(widthSource, DEFAULT_WIDTH_M);
  const height = parseDimensionToMeters(
    dimensions?.height,
    DEFAULT_HEIGHT_M,
  );

  return { width, height };
}
