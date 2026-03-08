import { apiUrl } from "../../constants/apiUrl.constants";
import { apiRequest } from "../../utils/apiRequest";

export async function createCheckoutSession(
  item: string,
  amount: number,
  gallery_id: string,
  meta: {
    trans_type: string;
    user_id: string;
    user_email: string;
    art_id: string;
  },
  success_url: string,
  cancel_url: string,
) {
  console.log({
    item,
    amount,
    gallery_id,
    meta,
    cancel_url,
    success_url,
  });
  try {
    const res = await apiRequest(`${apiUrl}/api/stripe/createCheckoutSession`, {
      method: "POST",
      body: JSON.stringify({
        item,
        amount,
        gallery_id,
        meta,
        cancel_url,
        success_url,
      }),
    });

    const result = await res.json();

    return {
      isOk: res.ok,
      message: result.message,
      url: result.url,
    };
  } catch (error: any) {
    return {
      isOk: false,
      body: {
        message:
          error.message ||
          error?.response?.data?.message ||
          "Error creating checkout session",
      },
    };
  }
}
