import { apiUrl, authorization, originHeader, userAgent } from "../../constants/apiUrl.constants";

export async function getCurrencyConversion(currency: string, amount: number) {
  try {
    const res = await fetch(`${apiUrl}/api/exchange_rate`, {
      method: "POST",
      headers: {
        'Origin': originHeader,
        "User-Agent": userAgent,
        "Authorization": authorization
      },
      body: JSON.stringify({ currency, amount }),
    });

    const result = await res.json();

    return { isOk: res.ok, data: result.data };
  } catch (error: any) {
    console.log(error);
  }
}
