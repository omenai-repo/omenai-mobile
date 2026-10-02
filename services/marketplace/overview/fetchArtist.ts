import { apiUrl } from "#constants/apiUrl.constants";
import { apiRequest } from "#utils/network/apiRequest";

export async function getArtists() {
  try {
    const res = await apiRequest(`${apiUrl}/api/requests/artist/fetchArtists`, {
      method: "GET",
    });

    const result = await res.json();

    return {
      isOk: res.ok,
      message: result.message,
      data: {
        featured_artists: result.featured_artists,
        all_artists: result.all_artists,
      },
    };
  } catch (error: any) {
    return {
      isOk: false,
      body: {
        message:
          error.message ||
          error?.response?.data?.message ||
          "Failed to load artists.",
      },
    };
  }
}
