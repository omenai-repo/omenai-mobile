import { apiUrl } from "#constants/apiUrl.constants";
import { parseVerifiedDeepLinkPayload } from "#config/deepLinking.config";
import { apiRequest } from "#utils/apiRequest";

type VerifyDeepLinkResult = {
  payload: ReturnType<typeof parseVerifiedDeepLinkPayload>;
  isValid: boolean;
};

export async function verifyDeepLinkToken(
  token: string,
): Promise<VerifyDeepLinkResult> {
  if (!apiUrl) {
    return { payload: null, isValid: false };
  }

  try {
    const response = await apiRequest(`${apiUrl}/api/deeplink/verify`, {
      method: "POST",
      body: JSON.stringify({ token }),
      auth: false,
      shouldLogout: false,
    });

    if (!response.ok) {
      return { payload: null, isValid: false };
    }

    const body = (await response.json()) as {
      data?: unknown;
      payload?: unknown;
    };
    const payload = parseVerifiedDeepLinkPayload(body.data ?? body.payload);
    return { payload, isValid: !!payload };
  } catch {
    return { payload: null, isValid: false };
  }
}
