import { apiUrl, authorization, originHeader, userAgent } from "constants/apiUrl.constants";

export async function checkIsStripeOnboarded(accountId: string) {
  try {
    const res = await fetch(`${apiUrl}/api/stripe/checkStripeDetailsSubmitted`, {
      method: "POST",
      headers: {
        Origin: originHeader,
        "User-Agent": userAgent,
        Authorization: authorization,
      },
      body: JSON.stringify({ accountId }),
    });

    const result = await res.json();

    return {
      isOk: res.ok,
      details_submitted: result.details_submitted,
    };
  } catch (error: any) {
    console.log(error);
  }
}
