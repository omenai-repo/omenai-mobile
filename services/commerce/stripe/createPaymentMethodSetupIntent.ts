import { utils_getAsyncData } from "#utils/app/utils_asyncStorage";
import { apiUrl } from "#constants/apiUrl.constants";
import { apiRequest } from "#utils/network/apiRequest";

export const createPaymentMethodSetupIntent = async () => {
  let gallery_id = "";
  let email = "";
  const userSession = await utils_getAsyncData("userSession");
  if (userSession.value) {
    gallery_id = JSON.parse(userSession.value).id;
    email = JSON.parse(userSession.value).email;
  }
  if (gallery_id.length < 1) return;
  try {
    const res = await apiRequest(
      `${apiUrl}/api/subscriptions/stripe/createPaymentMethodSetupIntent`,
      {
        method: "POST",
        body: JSON.stringify({
          gallery_id,
          email,
        }),
      },
    );

    const result = await res.json();
    return {
      isOk: res.ok,
      message: result.message,
      client_secret: result.setupIntent,
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
