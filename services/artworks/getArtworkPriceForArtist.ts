import { apiUrl, authorization, originHeader, userAgent } from 'constants/apiUrl.constants';

interface ArtworkPriceParams {
  medium: string;
  category: string;
  height: number;
  width: number;
  currency: string;
}

export async function getArtworkPriceForArtist({
  medium,
  category,
  height,
  width,
  currency,
}: ArtworkPriceParams) {
  try {
    const res = await fetch(
      `${apiUrl}/api/artworks/getArtworkPriceForArtist?medium=${medium}&category=${category}&height=${height}&width=${width}&currency=${currency}`,
      {
        method: 'GET',
        headers: {
          Origin: originHeader,
          'User-Agent': userAgent,
          Authorization: authorization,
        },
      },
    );

    const result = await res.json();
    return { isOk: res.ok, data: result.data };
  } catch (error: any) {
    return {
      isOk: false,
      message: error.response?.data?.message || 'Failed to get artwork price',
    };
  }
}
