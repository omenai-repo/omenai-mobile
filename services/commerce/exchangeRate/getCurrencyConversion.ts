import { apiUrl } from "#constants/apiUrl.constants";
import { apiRequest } from "#utils/network/apiRequest";

export async function getCurrencyConversion(currency: string, amount: number) {
  try {
    const res = await apiRequest(`${apiUrl}/api/exchange_rate`, {
      method: "POST",
      body: JSON.stringify({ currency, amount }),
    });

    const result = await res.json();

    return { isOk: res.ok, data: result.data };
  } catch (error: any) {
    return {
      isOk: false,
      body: {
        message:
          error.message ||
          error?.response?.data?.message ||
          "Error fetching currency conversion",
      },
    };
  }
}
