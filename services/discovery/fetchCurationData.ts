import { apiUrl } from "#constants/apiUrl.constants";
import { apiRequest } from "#utils/network/apiRequest";

export type CurationType = "featured_feed" | "curator_picks";

export async function fetchCurationData(curationType: CurationType) {
  try {
    const response = await apiRequest(`${apiUrl}/api/curation?type=${curationType}`, {
      method: "GET",
    });
    const result = await response.json();
    return {
      isOk: response.ok,
      message: result?.message as string | undefined,
      data: result?.data,
    };
  } catch (error: any) {
    return {
      isOk: false,
      message:
        error?.message ||
        error?.response?.data?.message ||
        "Failed to fetch curated feed.",
      data: [],
    };
  }
}
