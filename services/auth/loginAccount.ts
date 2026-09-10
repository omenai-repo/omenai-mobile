import { apiUrl } from "#constants/apiUrl.constants";
import { apiRequest } from "#utils/network/apiRequest";
import {
  parseApiResponseJson,
  type ApiJsonBody,
} from "#utils/core/parseApiResponseJson";

type LoginPayload = {
  email: string;
  password: string;
  device_push_token?: string;
};

export type LoginApiJsonBody = ApiJsonBody;

export async function loginAccount(
  payload: LoginPayload,
  route: "individual" | "gallery" | "artist",
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

  const url = apiUrl + "/api/auth/" + route + "/login";

  try {
    const response = await apiRequest(url, {
      method: "POST",
      auth: false,
      body: JSON.stringify(payload),
    });
    const result = await parseApiResponseJson(response);
    return {
      isOk: response.ok,
      status: response.status,
      body: result,
    };
  } catch (error: any) {
    const rawMessage = error?.message || "";
    const isBlobResolutionError =
      typeof rawMessage === "string" &&
      rawMessage.toLowerCase().includes("unable to resolve data for blob");

    let errorMessage: string;
    if (isBlobResolutionError) {
      errorMessage = "An error occurred. Please restart the app and try logging in again.";
    } else if (typeof error?.message === "string") {
      errorMessage = error.message;
    } else {
      errorMessage =
        error?.body?.message ||
        error?.response?.data?.message ||
        "Unable to reach the server. Check your connection and try again.";
    }

    return {
      isOk: false,
      status: error?.status,
      error,
      body: { message: errorMessage },
    };
  }
}
