import { apiUrl } from "#constants/apiUrl.constants";
import { apiRequest } from "../../utils/apiRequest";

export async function fetchArtistProfile(artistId: string) {
  if (!artistId) return;

  try {
    const res = await apiRequest(`${apiUrl}/api/auth/profile/artist?id=${artistId}`, {
      method: "GET",
    });

    const result = await res.json();
    return { isOk: res.ok, data: result.artist, message: result.message };
  } catch (error: any) {
    return {
      isOk: false,
      body: {
        message:
          error.message ||
          error?.response?.data?.message ||
          "Error fetching artist profile",
      },
    };
  }
}
