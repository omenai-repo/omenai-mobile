import { apiUrl } from "#constants/apiUrl.constants";
import { apiRequest } from "#utils/network/apiRequest";

type CreateInviteTokenPayload = Readonly<{
  inviteCode: string;
  email: string;
  entity: string;
}>;

type CreateInviteTokenResponse = {
  isOk: boolean;
  message: string;
  status?: string;
  referrerKey?: string;
  body?: { message: string };
};

export async function createInviteToken(
  payload: CreateInviteTokenPayload,
): Promise<CreateInviteTokenResponse> {
  try {
    const result = await apiRequest(
      `${apiUrl}/api/auth/waitlist/createInviteToken`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );

    const responseText = await result.text();

    let response: { message: string; status?: string; referrerKey?: string } = {
      message: "",
    };
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
      referrerKey: response.referrerKey,
    };
  } catch (error: any) {
    return {
      isOk: false,
      message: error?.message || "Something went wrong",
      body: {
        message:
          error.message ||
          error?.response?.data?.message ||
          "Something went wrong",
      },
    };
  }
}
