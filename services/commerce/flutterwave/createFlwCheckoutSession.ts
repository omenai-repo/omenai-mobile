import { apiUrl } from "#constants/apiUrl.constants";
import { apiRequest } from "#utils/network/apiRequest";

export async function createFlwCheckoutSession(
  customer: { email: string; name: string },
  tx_ref: string,
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
  redirect: string,
) {
  try {
    const res = await apiRequest(`${apiUrl}/api/flw/createCheckoutSession`, {
      method: "POST",
      body: JSON.stringify({
        customer,
        fullname: customer.name,
        tx_ref,
        order_id,
        meta,
        redirect,
      }),
    });

    const result = await res.json();

    return {
      isOk: res.ok,
      message: result.message,
      url: result.data,
    };
  } catch (error: any) {
    return {
      isOk: false,
      message:
        error.message ||
        error?.response?.data?.message ||
        "Error creating checkout session",
    };
  }
}
