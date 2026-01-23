import {
  apiUrl,
  authorization,
  originHeader,
  userAgent,
} from "../../constants/apiUrl.constants";

export async function fetchPaginatedArtworks(page: number, filters?: any) {
  try {
    const response = await fetch(
      `${apiUrl}/api/artworks/getPaginatedArtworks`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: originHeader,
          "User-Agent": userAgent,
          Authorization: authorization,
        },
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
    console.log(error);
    return {
      isOk: false,
      body: { message: "Error loading artworks" },
      data: [],
      count: 1,
      page: 1,
    };
  }
}
