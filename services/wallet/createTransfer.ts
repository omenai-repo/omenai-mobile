import { apiUrl } from "#constants/apiUrl.constants";
import { apiRequest } from "../../utils/apiRequest";

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
    return { isOk: res.ok, data: result };
  } catch (error: any) {
    return {
      isOk: false,
      message:
        error.message || error.response?.data?.message || "Transfer failed",
    };
  }
}
