import { apiUrl } from "#constants/apiUrl.constants";
import { apiRequest } from "#utils/network/apiRequest";

export async function updateWalletPin(pin: string, walletId: string) {
  if (!walletId || walletId.length < 1) return;
  try {
    const res = await apiRequest(`${apiUrl}/api/wallet/update_wallet_pin`, {
      method: "POST",
      body: JSON.stringify({ wallet_id: walletId, pin }),
    });

    const result = await res.json();

    return { isOk: res.ok, data: result };
  } catch (error: any) {
    return {
      isOk: false,
      body: {
        message:
          error.message ||
          error?.response?.data?.message ||
          "Failed to update PIN",
      },
    };
  }
}
