import { apiUrl } from "#constants/apiUrl.constants";
import { apiRequest } from "#utils/apiRequest";

type VerifyDeepLinkResponse = {
  success?: boolean;
  data?: DeepLinkPayload;
};

export type VerifyDeepLinkOutcome =
  | { status: "ok"; data: DeepLinkPayload }
  | { status: "empty" }
  | { status: "failed"; lastStatus?: number };

const MAX_ATTEMPTS = 3;
const RETRY_DELAYS_MS = [0, 500, 1500];

const sleep = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

const isRetryableStatus = (status: number) =>
  status >= 500 || status === 408 || status === 429;

async function verifyDeepLinkTokenOnce(
  token: string,
): Promise<
  { ok: true; data: DeepLinkPayload } | { ok: false; status?: number }
> {
  const response = await apiRequest(`${apiUrl}/api/deeplink/verify`, {
    method: "POST",
    body: JSON.stringify({ token }),
    auth: false,
    shouldLogout: false,
  });

  if (!response.ok) {
    return { ok: false, status: response.status };
  }

  const body = (await response.json()) as VerifyDeepLinkResponse;
  if (!body.data) {
    return { ok: false, status: response.status };
  }

  return { ok: true, data: body.data };
}

export async function verifyDeepLinkToken(
  token: string,
): Promise<VerifyDeepLinkOutcome> {
  if (!apiUrl) return { status: "failed" };

  let lastStatus: number | undefined;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    if (attempt > 0) {
      await sleep(RETRY_DELAYS_MS[attempt] ?? 1500);
    }

    try {
      const result = await verifyDeepLinkTokenOnce(token);
      if (result.ok) {
        return { status: "ok", data: result.data };
      }

      lastStatus = result.status;
      if (result.status && !isRetryableStatus(result.status)) {
        return { status: "failed", lastStatus };
      }
    } catch {
      // Network / parse errors — retry unless out of attempts.
    }
  }

  return { status: "failed", lastStatus };
}
