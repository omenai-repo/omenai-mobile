import { apiUrl, authorization, originHeader, userAgent } from "../../constants/apiUrl.constants";
import { rollbar } from "../../config/rollbar.config";

export type DeleteAccountResponse = {
  status: number;
  isOk?: boolean;
  message?: string;
  commitments?: { commitments?: Commitment[] } | Commitment[];
};

export async function deleteAccount(
  route: RouteIdentifier,
  session_id: string,
  reason: string
): Promise<DeleteAccountResponse> {
  try {
    const url = `${apiUrl}/api/requests/${route}/deleteAccount`;
    const res = await fetch(url, {
      method: "DELETE",
      body: JSON.stringify({ id: session_id, reason }),
      headers: {
        "Content-Type": "application/json",
        Origin: originHeader,
        "User-Agent": userAgent,
        Authorization: authorization,
      },
    });
    const result = await res.json();
    // Report 500+ errors to Rollbar
    if (res.status >= 500) {
      rollbar.error("DeleteAccount API 500+ error", {
        status: res.status,
        url,
        session_id,
        reason,
        response: result,
      });
    }
    return {
      isOk: res.ok,
      message: result.message || "An error occurred",
      commitments: result.commitments,
      status: res.status,
    };
  } catch (error: any) {
    rollbar.error("DeleteAccount API exception", { error, route, session_id, reason });
    return {
      isOk: false,
      message:
        error?.message || "An error was encountered, please try again later or contact support",
      status: 500,
    };
  }
}
