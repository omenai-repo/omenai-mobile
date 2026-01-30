import { apiUrl } from "../../constants/apiUrl.constants";
import { apiRequest } from "../../utils/apiRequest";

export async function getWalletBalance({ id }: { id: string }) {
  try {
    const response = await apiRequest(
      `${apiUrl}/api/wallet/fetch_wallet_balance?id=${id}`,
      {
        method: "GET",
      },
    );

    const result = await response.json();

    return result;
  } catch (error) {
    return {
      isOk: false,
      body: { message: "Error fetching wallet balance" },
    };
  }
}
