import { RouteIdentifier } from "#types/types";
import { apiUrl } from "../../constants/apiUrl.constants";
import { apiRequest } from "../../utils/apiRequest";

export async function verifyEmail(
  payload: { params: string; token: string },
  route: RouteIdentifier,
) {
  try {
    const response = await apiRequest(
      `${apiUrl}/api/requests/${route}/verifyMail`,
      {
        method: "POST",
        body: JSON.stringify({ params: payload.params, token: payload.token }),
      },
    );

    const ParsedResponse = {
      isOk: response.ok,
      body: await response.json(),
    };
    return ParsedResponse;
  } catch (error) {
    return {
      isOk: false,
      body: { message: "Error verifying token, try again later" },
    };
  }
}
