import { apiUrl } from "#constants/apiUrl.constants";
import { apiRequest } from "#utils/apiRequest";

type VerifyDeepLinkResponse = {
  success?: boolean;
  data?: DeepLinkPayload;
};

export async function verifyDeepLinkToken(
  token: string,
): Promise<DeepLinkPayload | null> {
  if (!apiUrl) return null;

  try {
    const response = await apiRequest(`${apiUrl}/api/deeplink/verify`, {
      method: "POST",
      body: JSON.stringify({ token }),
      auth: false,
      shouldLogout: false,
    });

    if (!response.ok) return null;

    const body = (await response.json()) as VerifyDeepLinkResponse;
    console.log("body", JSON.stringify(body, null, 2));
    return body.data ?? null;
  } catch {
    return null;
  }
}
