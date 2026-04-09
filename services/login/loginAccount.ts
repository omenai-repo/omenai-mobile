import { apiUrl } from "../../constants/apiUrl.constants";
import { apiRequest } from "../../utils/apiRequest";

type LoginPayload = {
  email: string;
  password: string;
  device_push_token?: string;
};

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
    const result = await response.json();
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

    return {
      isOk: false,
      status: error?.status,
      error,
      body: {
        message:
          (isBlobResolutionError
            ? "A temporary device data error occurred. Please restart the app and try logging in again."
            : error.message) ||
          error?.response?.data?.message ||
          "Error logging into account",
      },
    };
  }
}
