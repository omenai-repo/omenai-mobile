import { utils_getAsyncData } from "#utils/app/utils_asyncStorage";
import { apiUrl } from "#constants/apiUrl.constants";
import { apiRequest } from "#utils/network/apiRequest";

export const verifySubscriptionCharge = async (paymentIntentId: string) => {
  let gallery_id = "";
  const userSession = await utils_getAsyncData("userSession");
  if (userSession.value) {
    gallery_id = JSON.parse(userSession.value).id;
  }
  if (gallery_id.length < 1) return;
  try {
    const res = await apiRequest(
      `${apiUrl}/api/subscriptions/stripe/verifyStripeSubscriptionCharge`,
      {
        method: "POST",
        body: JSON.stringify({
          paymentIntentId,
        }),
      },
    );

    const result = await res.json();
    return {
      isOk: res.ok,
      message: result.message,
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
