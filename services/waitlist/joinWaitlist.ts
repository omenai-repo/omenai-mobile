import {
  apiUrl,
  authorization,
  originHeader,
  userAgent,
} from "#constants/apiUrl.constants";

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
  payload: JoinWaitlistPayload
): Promise<JoinWaitlistResponse> {
  try {
    const result = await fetch(
      `${apiUrl}/api/auth/waitlist/createWaitlistUser`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: originHeader,
          "User-Agent": userAgent,
          Authorization: authorization,
        },
        body: JSON.stringify(payload),
      }
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
  } catch {
    return { isOk: false, message: "Something went wrong" };
  }
}
