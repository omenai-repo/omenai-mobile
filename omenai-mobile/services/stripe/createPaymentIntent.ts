import { apiUrl } from "../../constants/apiUrl.constants";

export const createPaymentIntent = async (
    amount: number,
    gallery_id: string,
    meta: {
        trans_type: string;
        user_id: string;
        user_email: string;
        art_id: string;
    }
) => {
  try {
    const res = await fetch(`${apiUrl}/api/stripe/createPaymentIntent`, {
      method: "POST",
      body: JSON.stringify({
        amount,
        gallery_id,
        meta
      }),
    });
    const result = await res.json();
    return result
  } catch (error: any) {
    console.log(error);
  }
};