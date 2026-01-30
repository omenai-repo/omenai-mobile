import { RouteIdentifier } from "#types/types";
import { apiUrl } from "../../constants/apiUrl.constants";
import { apiRequest } from "../../utils/apiRequest";

export async function resendVerifyCode(route: RouteIdentifier, id: string) {
  try {
    const res = await apiRequest(
      `${apiUrl}/api/requests/${route}/verify/resend`,
      {
        method: "POST",
        body: JSON.stringify({ author: id }),
      },
    );
    const data: { message: string } = await res.json();
    const response = {
      isOk: res.ok,
      body: { message: data.message },
    };

    return response;
  } catch (error) {
    return {
      isOk: false,
      body: { message: "Error sending code, try again later" },
    };
  }
}
