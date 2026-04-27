import { utils_getAsyncData } from "#utils/utils_asyncStorage";
import { apiUrl } from "../../constants/apiUrl.constants";
import { apiRequest } from "../../utils/apiRequest";

export type DiscountData = {
  plan: "pro";
  active: boolean;
  redeemed: boolean;
} | null;

export const retrieveSubscriptionDiscount = async (): Promise<{
  isOk: boolean;
  message: string;
  discount?: DiscountData;
}> => {
  let email = "";
  const userSession = await utils_getAsyncData("userSession");
  if (userSession.value) {
    email = JSON.parse(userSession.value).email;
  }
  if (!email) return { isOk: false, message: "No email found" };

  try {
    const res = await apiRequest(
      `${apiUrl}/api/subscriptions/retrieveDiscountStatus`,
      {
        method: "POST",
        body: JSON.stringify({ email }),
      },
    );

    const result = await res.json();

    let discountData: DiscountData = result.discount;

    if (result.discount === true) {
      discountData = {
        plan: "pro",
        active: true,
        redeemed: false,
      };
    }

    return {
      isOk: res.ok,
      message: result.message,
      discount: discountData,
    };
  } catch (error: any) {
    console.log("[retrieveSubscriptionDiscount] error:", error);
    return {
      isOk: false,
      message:
        error.message ||
        error?.response?.data?.message ||
        "An error was encountered, please try again later or contact support",
    };
  }
};
