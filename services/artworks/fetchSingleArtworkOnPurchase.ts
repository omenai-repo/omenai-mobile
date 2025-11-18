import { apiUrl, authorization, originHeader, userAgent } from "../../constants/apiUrl.constants";

export async function fetchsingleArtworkOnPurchase(art_id: string) {
  try {
    const response = await fetch(`${apiUrl}/api/artworks/getSingleArtworkOnPurchase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: originHeader,
        "User-Agent": userAgent,
        Authorization: authorization,
      },
      body: JSON.stringify({ art_id }),
    });

    const result = await response.json();

    return { isOk: response.ok, message: result.message, data: result.data };
  } catch {
    return {
      isOk: false,
      body: { message: "Error fetching artwork details" },
    };
  }
}
