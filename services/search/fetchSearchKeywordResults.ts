import { apiUrl } from "../../constants/apiUrl.constants";
import { apiRequest } from "../../utils/apiRequest";

export async function fetchSearchKeyWordResults(searchTerm: string) {
  try {
    const response = await apiRequest(`${apiUrl}/api/search`, {
      method: "POST",
      body: JSON.stringify({ searchTerm }),
    }).then(async (res) => {
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
      body: {
        message:
          error.message ||
          error?.response?.data?.message ||
          "Error fetching search",
      },
    };
  }
}
