import { apiUrl } from "#constants/apiUrl.constants";
import { apiRequest } from "#utils/network/apiRequest";

export async function generateStripeLoginLink(account: string) {
  try {
    const res = await apiRequest(
      `${apiUrl}/api/stripe/generateStripeLoginLink`,
      {
        method: "POST",
        body: JSON.stringify({ account }),
      },
    );

    const result = await res.json();

    return {
      isOk: res.ok,
      url: result.url,
    };
  } catch (error: any) {
    return {
      isOk: false,
      body: {
        message:
          error.message ||
          error?.response?.data?.message ||
          "Error generating Stripe login link",
      },
    };
  }
}
