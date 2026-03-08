import { apiUrl } from "#constants/apiUrl.constants";
import { apiRequest } from "#utils/apiRequest";

export const createSubscriptionPaymentIntent = async (
  amount: number,
  gallery_id: string,
  meta: {
    name: string;
    email: string;
    gallery_id: string;
    plan_id: string;
    plan_interval: string;
  },
  return_url?: string,
) => {
  try {
    const res = await apiRequest(
      `${apiUrl}/api/subscriptions/stripe/createSubscriptionPaymentIntent`,
      {
        method: "POST",
        body: JSON.stringify({
          amount,
          gallery_id,
          meta,
          return_url,
        }),
      },
    );

    const result = await res.json();

    return {
      isOk: res.ok,
      message: result.message,
      client_secret: result.paymentIntent,
    };
  } catch (error: any) {
    return {
      isOk: false,
      body: {
        message:
          error.message ||
          error?.response?.data?.message ||
          "An error was encountered, please try again later or contact support",
      },
    };
  }
};
