import { apiUrl } from "#constants/apiUrl.constants";
import { apiRequest } from "../../utils/apiRequest";

type JoinWaitlistPayload = Readonly<{
  name: string;
  email: string;
  entity: string;
}>;

type JoinWaitlistResponse = {
  isOk: boolean;
  message: string;
  status?: string;
};

export async function joinWaitlist(
  payload: JoinWaitlistPayload,
): Promise<JoinWaitlistResponse> {
  try {
    const result = await apiRequest(
      `${apiUrl}/api/auth/waitlist/createWaitlistUser`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );

    const responseText = await result.text();

    let response: { message: string; status?: string } = { message: "" };
    if (responseText) {
      try {
        response = JSON.parse(responseText);
      } catch {
        return { isOk: false, message: "Invalid server response" };
      }
    }

    return {
      isOk: result.ok,
      message: response.message || (result.ok ? "Success" : "Request failed"),
      status: response.status,
    };
  } catch (error: any) {
    return {
      isOk: false,
      message:
        error?.message ||
        error?.response?.data?.message ||
        "Something went wrong",
    };
  }
}
