import { apiUrl } from "#constants/apiUrl.constants";
import { apiRequest } from "#utils/network/apiRequest";

interface UpdateDimensionsFilter {
  height: string;
  width: string;
  weight: string;
}

export async function updateArtworkDimensions(
  filter: UpdateDimensionsFilter,
  art_id: string,
) {
  try {
    const response = await apiRequest(
      `${apiUrl}/api/artworks/updateArtworkDimensions`,
      {
        method: "POST",
        body: JSON.stringify({ art_id, filter }),
      },
    );

    const result = await response.json();
    return {
      isOk: response.ok,
      message: result.message,
    };
  } catch (error: any) {
    return {
      isOk: false,
      message:
        error.message ||
        error?.response?.data?.message ||
        "An error occurred while updating dimensions. Please try again.",
    };
  }
}
