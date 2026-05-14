import { apiUrl } from "../../constants/apiUrl.constants";
import { apiRequest } from "../../utils/apiRequest";

type LoginPayload = {
  email: string;
  password: string;
  device_push_token?: string;
};

export type LoginApiJsonBody = {
  data?: unknown;
  message?: string;
  [key: string]: unknown;
};

async function parseJsonBody(response: Response): Promise<LoginApiJsonBody> {
  const text = await response.text();
  if (!text?.trim()) {
    return {
      message: "Empty response from server. Please try again.",
    };
  }
  try {
    return JSON.parse(text) as {
      data?: unknown;
      message?: string;
      [key: string]: unknown;
    };
  } catch {
    return {
      message: "Invalid response from server. Please try again.",
    };
  }
}

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
    const result = await parseJsonBody(response);
    return {
      isOk: response.ok,
      status: response.status,
      body: result as LoginApiJsonBody,
    };
  } catch (error: any) {
    const rawMessage = error?.message || "";
    const isBlobResolutionError =
      typeof rawMessage === "string" &&
      rawMessage.toLowerCase().includes("unable to resolve data for blob");

    return {
      isOk: false,
      status: error?.status,
      error,
      body: {
        message:
          (isBlobResolutionError
            ? "A temporary device data error occurred. Please restart the app and try logging in again."
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
