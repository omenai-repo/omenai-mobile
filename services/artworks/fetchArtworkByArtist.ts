import { apiUrl } from "../../constants/apiUrl.constants";
import { apiRequest } from "../../utils/apiRequest";

export const fetchArtworkByArtist = async (artist: string) => {
  try {
    const response = await apiRequest(
      `${apiUrl}/api/artworks/getArtworksByArtist`,
      {
        method: "POST",
        body: JSON.stringify({ artist }),
      },
    ).then(async (res) => {
      const ParsedResponse = {
        isOk: res.ok,
        body: await res.json(),
      };
      return ParsedResponse;
    });
    return response;
  } catch (error: any) {
    return {
      isOk: false,
      body: { message: error.message },
    };
  }
};
