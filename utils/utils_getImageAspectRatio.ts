import { Image } from "react-native";

/**
 * Calculates the aspect ratio of an image from its URI.
 * @param uri - The string URI of the image (local file:// or remote).
 * @returns A promise that resolves to the aspect ratio (width / height) as a number.
 */
export async function getImageAspectRatio(uri: string): Promise<number> {
  return new Promise((resolve, reject) => {
    Image.getSize(
      uri,
      (width, height) => {
        resolve(width / height);
      },
      (error) => {
        reject(error);
      },
    );
  });
}

/**
 * Converts a decimal aspect ratio into a readable string (e.g., "16:9").
 * @param decimal - The decimal aspect ratio (width / height).
 * @param maxDenominator - The highest denominator to check (100 is usually plenty).
 * @returns An object representing the ratio and its orientation.
 */
export function getRatioString(
  decimal: number,
  maxDenominator: number = 100,
): { ratio: string; orientation: "landscape" | "portrait" | "square" } | null {
  if (decimal <= 0) return null;

  let bestNumerator = 1;
  let bestDenominator = 1;
  let smallestError = Math.abs(decimal - 1);

  for (let denominator = 1; denominator <= maxDenominator; denominator++) {
    // Guess the closest numerator for this denominator
    const numerator = Math.round(decimal * denominator);

    // Check how far off this fraction is from the actual decimal
    const currentError = Math.abs(decimal - numerator / denominator);

    if (currentError < smallestError) {
      bestNumerator = numerator;
      bestDenominator = denominator;
      smallestError = currentError;

      // If we find a nearly perfect match, stop searching early to save time
      if (currentError < 0.001) {
        break;
      }
    }
  }
  const orientation =
    bestNumerator > bestDenominator
      ? "landscape"
      : bestNumerator === bestDenominator
      ? "square"
      : "portrait";

  return { ratio: `${bestNumerator}:${bestDenominator}`, orientation };
}
