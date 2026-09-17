import { apiUrl } from "#constants/apiUrl.constants";
import { apiRequest } from "#utils/network/apiRequest";

export async function createCheckoutSession(
  item: string,
  seller_id: string,
  order_id: string,
  meta: {
    buyer_id: string;
    buyer_email: string;
    art_id: string;
    seller_email: string;
    seller_name: string;
    seller_id: string;
    artwork_name: string;
    seller_designation: string;
  },
  success_url: string,
  cancel_url: string,
) {
  try {
    const res = await apiRequest(`${apiUrl}/api/stripe/createCheckoutSession`, {
      method: "POST",
      body: JSON.stringify({
        item,
        seller_id,
        order_id,
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
