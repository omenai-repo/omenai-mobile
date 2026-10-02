import { apiUrl } from "#constants/apiUrl.constants";
import { apiRequest } from "#utils/network/apiRequest";

export async function fetchPaginatedArtworks(page: number, filters?: any) {
  try {
    const response = await apiRequest(
      `${apiUrl}/api/artworks/getPaginatedArtworks`,
      {
        method: "POST",
        body: JSON.stringify({ page, filters }),
      },
    );
    const result = await response.json();

    return {
      isOk: response.ok && Array.isArray(result.data),
      message: result.message,
      data: Array.isArray(result.data) ? result.data : [],
      page: result.page || page,
      count: result.pageCount || 1,
    };
  } catch (error: any) {
    return {
      isOk: false,
      body: {
        message:
          error.message ||
          error?.response?.data?.message ||
          "Error loading artworks",
      },
      data: [],
      count: 1,
      page: 1,
    };
  }
}
