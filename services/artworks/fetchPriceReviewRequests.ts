import { apiUrl } from "#constants/apiUrl.constants";
import { apiRequest } from "#utils/apiRequest";

type FetchPriceReviewRequestsParams = {
  artistId: string;
  page?: number;
  limit?: number;
  status?: string;
};

export async function fetchPriceReviewRequests({
  artistId,
  page = 1,
  limit = 10,
  status,
}: FetchPriceReviewRequestsParams) {
  try {
    const query = new URLSearchParams({
      id: artistId,
      page: String(page),
      limit: String(limit),
    });

    if (status) {
      query.set("status", status);
    }

    const res = await apiRequest(
      `${apiUrl}/api/artworks/fetchPriceReviewRequests?${query.toString()}`,
      {
        method: "GET",
      }
    );

    const result = await res.json();

    return {
      isOk: res.ok,
      message: result?.message || result?.error || "",
      data: Array.isArray(result?.data) ? result.data : [],
      meta: result?.meta || {
        currentPage: page,
        totalPages: 1,
        totalItems: 0,
      },
      body: result,
    };
  } catch (error: any) {
    return {
      isOk: false,
      message:
        error?.message ||
        error?.response?.data?.message ||
        "Unable to fetch pricing proposals right now",
      data: [],
      meta: {
        currentPage: page,
        totalPages: 1,
        totalItems: 0,
      },
    };
  }
}
