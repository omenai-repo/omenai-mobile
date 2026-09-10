import { RouteIdentifier } from "#types/types";
import { apiUrl } from "#constants/apiUrl.constants";
import { apiRequest } from "#utils/network/apiRequest";

export async function sendPasswordResetLink(
  payload: { email: string },
  route: RouteIdentifier,
) {
  const url = apiUrl + "/api/auth/" + route + "/sendPasswordResetLink";

  try {
    const response = await apiRequest(url, {
      method: "POST",
      body: JSON.stringify({ recoveryEmail: payload.email }),
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
          "Error sending password reset link",
      },
    };
  }
}
