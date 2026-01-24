import { utils_getAsyncData } from "#utils/utils_asyncStorage";
import {
  apiUrl,
  authorization,
  originHeader,
  userAgent,
} from "../../constants/apiUrl.constants";

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
    const res = await fetch(
      `${apiUrl}/api/subscriptions/retrieveDiscountStatus`,
      {
        method: "POST",
        headers: {
          Origin: originHeader,
          "User-Agent": userAgent,
          Authorization: authorization,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      },
    );

    const result = await res.json();
    return {
      isOk: res.ok,
      message: result.message,
      discount: result.discount,
    };
  } catch {
    return {
      isOk: false,
      message:
        "An error was encountered, please try again later or contact support",
    };
  }
};
