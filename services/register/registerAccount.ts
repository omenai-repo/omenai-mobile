import { apiUrl } from "../../constants/apiUrl.constants";
import { apiRequest } from "../../utils/apiRequest";
import { parseApiResponseJson } from "../../utils/parseApiResponseJson";

export async function registerAccount(
  payload:
    | (Omit<IndividualRegisterData, "confirmPassword"> & {
        preferences: string[];
      })
    | GalleryRegisterData
    | ArtistRegisterData,
  route: "gallery" | "individual" | "artist",
) {
  if (!apiUrl) {
    return {
      isOk: false,
      status: 0,
      body: {
        message:
          "Unable to reach server configuration. Please restart the app and try again.",
      },
    };
  }

  const url = apiUrl + "/api/auth/" + route + "/register";

  try {
    const response = await apiRequest(url, {
      method: "POST",
      auth: false,
      body: JSON.stringify(payload),
    });
    const body = await parseApiResponseJson(response);
    const ParsedResponse = {
      isOk: response.ok,
      body,
      status: response.status,
    };
    return ParsedResponse;
  } catch (error: any) {
    const rawMessage = error?.message || "";
    const isBlobResolutionError =
      typeof rawMessage === "string" &&
      rawMessage.toLowerCase().includes("unable to resolve data for blob");

    return {
      isOk: false,
      status: error?.status,
      error: error,
      body: {
        message:
          (isBlobResolutionError
            ? "A temporary device data error occurred. Please restart the app and try again."
            : typeof error?.message === "string"
              ? error.message
              : undefined) ||
          error?.body?.message ||
          error?.response?.data?.message ||
          "Unable to reach the server. Check your connection and try again.",
      },
    };
  }
}
