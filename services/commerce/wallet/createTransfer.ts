import { apiUrl } from "#constants/apiUrl.constants";
import { apiRequest } from "#utils/network/apiRequest";

export async function createTransfer(payload: {
  amount: number;
  url: string;
  wallet_id: string;
  wallet_pin: string;
}) {
  try {
    const url = `${apiUrl}/api/flw/createTransfer`;
    const res = await apiRequest(url, {
      method: "POST",
      body: JSON.stringify(payload),
      shouldLogout: false,
    });

    const result = await res.json();
    if (!res.ok) {
      return {
        isOk: false,
        message: result?.message || result?.data?.message || "Transfer failed",
        data: result,
      };
    }
    return { isOk: true, data: result, message: result?.message };
  } catch (error: any) {
    return {
      isOk: false,
      body: {
        message:
          error.message ||
          error?.response?.data?.message ||
          "Transfer failed",
      },
    };
  }
}
