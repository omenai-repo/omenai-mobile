import { utils_getAsyncData } from "#utils/utils_asyncStorage";
import { apiUrl } from "../../constants/apiUrl.constants";
import { apiRequest } from "../../utils/apiRequest";

export const verifyDiscountedSubscriptionCharge = async (
  setupIntentId: string,
  planId: string,
): Promise<{ isOk: boolean; message: string }> => {
  let gallery_id = "";
  const userSession = await utils_getAsyncData("userSession");
  if (userSession.value) {
    gallery_id = JSON.parse(userSession.value).id;
  }
  if (!gallery_id) return { isOk: false, message: "No gallery ID found" };

  try {
    const res = await apiRequest(
      `${apiUrl}/api/subscriptions/stripe/verifyDiscountedSubscriptionCharge`,
      {
        method: "POST",
        body: JSON.stringify({
          setupIntentId,
          planId,
          galleryId: gallery_id,
        }),
      },
    );

    const result = await res.json();
    return { isOk: res.ok, message: result.message };
  } catch {
    return {
      isOk: false,
      message:
        "An error was encountered, please try again later or contact support",
    };
  }
};
