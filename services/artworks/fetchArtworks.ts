import { apiUrl } from "../../constants/apiUrl.constants";
import { apiRequest } from "../../utils/apiRequest";
import { artworkListingType } from "#types/types";

export async function fetchArtworks({
  listingType,
  page,
}: {
  listingType: artworkListingType;
  page: number;
}) {
  let url = "";
  if (listingType === "trending")
    url = apiUrl + "/api/artworks/getTrendingArtworks";
  if (listingType === "recent") url = apiUrl + "/api/artworks/getAllArtworks";

  try {
    const response = await apiRequest(url, {
      method: "POST",
      body: JSON.stringify({ page }),
    }).then(async (res) => {
      const ParsedResponse = {
        isOk: res.ok,
        body: await res.json(),
      };
      return ParsedResponse;
    });

    return response;
  } catch (error) {
    return {
      isOk: false,
      body: { message: "Error fetching post impressions" },
    };
  }
}
