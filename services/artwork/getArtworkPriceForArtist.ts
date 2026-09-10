import { apiUrl } from "#constants/apiUrl.constants";
import { apiRequest } from "#utils/network/apiRequest";

interface ArtworkPriceParams {
  medium: string;
  category: string;
  height: number;
  width: number;
  currency: string;
  artistId: string;
}

export async function getArtworkPriceForArtist({
  medium,
  category,
  height,
  width,
  currency,
  artistId,
}: ArtworkPriceParams) {
  try {
    const params = new URLSearchParams({
      medium,
      category,
      height: String(height),
      width: String(width),
      currency: currency.toUpperCase(),
      id: artistId,
    });

    const res = await apiRequest(
      `${apiUrl}/api/artworks/getArtworkPriceForArtist?${params.toString()}`,
      {
        method: "GET",
      }
    );

    const result = await res.json();
    return {
      isOk: res.ok,
      data: result.data,
      message: result.message,
      raw: result,
    };
  } catch (error: any) {
    return {
      isOk: false,
      body: {
        message:
          error.message ||
          error?.response?.data?.message ||
          "Failed to get artwork price",
      },
    };
  }
}
