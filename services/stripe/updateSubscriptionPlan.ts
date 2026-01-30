import { NextChargeParams } from "#types/types";
import { utils_getAsyncData } from "#utils/utils_asyncStorage";
import { apiUrl } from "../../constants/apiUrl.constants";
import { apiRequest } from "../../utils/apiRequest";

export const updateSubscriptionPlan = async (
  data: NextChargeParams,
  action: string,
) => {
  let gallery_id = "";
  const userSession = await utils_getAsyncData("userSession");
  if (userSession.value) {
    gallery_id = JSON.parse(userSession.value).id;
  }
  if (gallery_id.length < 1) return;
  try {
    const res = await apiRequest(
      `${apiUrl}/api/subscriptions/updateSubscriptionPlan`,
      {
        method: "POST",
        body: JSON.stringify({ data, gallery_id, action }),
      },
    );

    const result = await res.json();
    return { isOk: res.ok, message: result.message, data: result.data };
  } catch (error: any) {
    return {
      isOk: false,
      status: error?.status,
      message:
        "An error was encountered, please try again later or contact support",
      error: error,
    };
  }
};
