import { apiUrl } from "../../constants/apiUrl.constants";

export async function getCurrencyConversion(currency: string, amount: number) {
  try {
    const res = await fetch(`${apiUrl}/api/exchange_rate`, {
      method: "POST",
      body: JSON.stringify({ currency, amount }),
    });

    const result = await res.json();

    return { isOk: res.ok, data: result.data };
  } catch (error: any) {
    console.log(error);
  }
}
