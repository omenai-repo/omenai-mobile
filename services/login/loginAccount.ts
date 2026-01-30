import { IndividualLoginData } from "#types/types";
import { apiUrl } from "../../constants/apiUrl.constants";
import { apiRequest } from "../../utils/apiRequest";

export async function loginAccount(
  payload: IndividualLoginData,
  route: "individual" | "gallery" | "artist",
) {
  const url = apiUrl + "/api/auth/" + route + "/login";

  try {
    const response = await apiRequest(url, {
      method: "POST",
      auth: false,
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    return {
      isOk: response.ok,
      status: response.status,
      body: result,
    };
  } catch (error: any) {
    return {
      isOk: false,
      status: error?.status,
      error,
      body: { message: "Error logging into account" },
    };
  }
}
