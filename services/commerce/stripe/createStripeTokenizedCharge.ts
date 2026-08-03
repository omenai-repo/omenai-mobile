import { utils_getAsyncData } from "#utils/app/utils_asyncStorage";
import { apiUrl } from "#constants/apiUrl.constants";
import { apiRequest } from "#utils/network/apiRequest";

export const createStripeTokenizedCharge = async (
  amount: number,
  meta: {
    name: string;
    email: string;
    gallery_id: string;
    plan_id: string;
    plan_interval: string;
  },
) => {
  let gallery_id = "";
  const userSession = await utils_getAsyncData("userSession");
  if (userSession.value) {
    gallery_id = JSON.parse(userSession.value).id;
  }
  if (gallery_id.length < 1) return;
  try {
    const res = await apiRequest(
      `${apiUrl}/api/subscriptions/stripe/createStripeTokenizedCharge`,
      {
        method: "POST",
        body: JSON.stringify({
          amount,
          gallery_id,
          meta,
        }),
      },
    );

    const result = await res.json();
    return {
      isOk: res.ok,
      message: result.message,
      client_secret: result.paymentIntent,
      status: result.status,
      paymentIntentId: result.paymentIntentId,
    };
  } catch (error: any) {
    return {
      isOk: false,
      status: error?.status,
      body: {
        message:
          error.message ||
          error?.response?.data?.message ||
          "An error was encountered, please try again later or contact support",
      },
      error: error,
    };
  }
};
