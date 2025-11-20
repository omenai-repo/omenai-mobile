import { apiUrl, authorization, originHeader, userAgent } from "constants/apiUrl.constants";
import { rollbar } from "../../config/rollbar.config";

export async function createTransfer(payload: {
  amount: number;
  url: string;
  wallet_id: string;
  wallet_pin: string;
}) {
  try {
    const url = `${apiUrl}/api/flw/createTransfer`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Origin: originHeader,
        "User-Agent": userAgent,
        Authorization: authorization,
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    // Report 500+ errors to Rollbar
    if (res.status >= 500) {
      rollbar.error("CreateTransfer API 500+ error", {
        status: res.status,
        url,
        payload,
        response: result,
      });
    }
    return { isOk: res.ok, data: result };
  } catch (error: any) {
    rollbar.error("CreateTransfer API exception", { error, payload });
    return {
      isOk: false,
      message: error.response?.data?.message || "Transfer failed",
    };
  }
}
