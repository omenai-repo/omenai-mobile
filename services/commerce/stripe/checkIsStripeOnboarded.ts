import { apiUrl } from "#constants/apiUrl.constants";
import { apiRequest } from "#utils/network/apiRequest";

export async function checkIsStripeOnboarded(accountId: string) {
  try {
    const res = await apiRequest(
      `${apiUrl}/api/stripe/checkStripeDetailsSubmitted`,
      {
        method: "POST",
        body: JSON.stringify({ accountId }),
      },
    );

    const result = await res.json();

    return {
      isOk: res.ok,
      details_submitted: result.details_submitted,
    };
  } catch (error: any) {
    return {
      isOk: false,
      body: {
        message:
          error.message ||
          error?.response?.data?.message ||
          "Error checking Stripe onboarding status",
      },
    };
  }
}
