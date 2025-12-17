import {
  apiUrl,
  authorization,
  originHeader,
  userAgent,
} from "#constants/apiUrl.constants";

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
  return_url?: string
) => {
  try {
    const res = await fetch(
      `${apiUrl}/api/subscriptions/stripe/createSubscriptionPaymentIntent`,
      {
        method: "POST",
        headers: {
          Origin: originHeader,
          "User-Agent": userAgent,
          Authorization: authorization,
        },
        body: JSON.stringify({
          amount,
          gallery_id,
          meta,
          return_url,
        }),
      }
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
      message:
        "An error was encountered, please try again later or contact support",
    };
  }
};
