import { apiUrl } from "../../constants/apiUrl.constants";
import { apiRequest } from "../../utils/apiRequest";

export async function getArtworkHighlightData({
  sessionId,
}: {
  sessionId: string;
}) {
  try {
    const response = await apiRequest(
      `${apiUrl}/api/artworks/getAllArtworksbyId`,
      {
        method: "POST",
        body: JSON.stringify({ id: sessionId }),
      },
    ).then(async (res) => {
      if (!res.ok) return undefined;
      const result = await res.json();

      return result;
    });

    return response;
  } catch (error: any) {
    return {
      isOk: false,
      body: {
        message:
          error.message ||
          error?.response?.data?.message ||
          "Error fetching gallery artwork highlight",
      },
    };
  }
}
