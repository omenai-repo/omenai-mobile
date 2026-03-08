import { apiUrl } from "../../constants/apiUrl.constants";
import { apiRequest } from "../../utils/apiRequest";

export const createPaymentIntent = async (
  amount: number,
  seller_id: string,
  meta: {
    buyer_id: string;
    buyer_email: string;
    art_id: string;
    seller_email: string;
    seller_name: string;
    seller_id: string;
    artwork_name: string;
    shipping_cost: number;
    unit_price: number;
    tax_fees: number;
  },
) => {
  try {
    const url = `${apiUrl}/api/stripe/createPaymentIntent`;
    const res = await apiRequest(url, {
      method: "POST",
      body: JSON.stringify({
        amount,
        seller_id,
        meta,
      }),
    });
    const result = await res.json();
    return result;
  } catch (error: any) {
    return {
      isOk: false,
      body: {
        message:
          error.message ||
          error?.response?.data?.message ||
          "Error creating payment intent",
      },
    };
  }
};
