import { apiUrl, authorization, originHeader, userAgent } from "../../constants/apiUrl.constants";

export const createPaymentIntent = async (
    amount: number,
    gallery_id: string,
    meta: {
        trans_type: string;
        user_id: string;
        user_email: string;
        art_id: string;
        gallery_email: string;
        gallery_name: string;
        artwork_name: string;
    }
) => {
  try {
    const res = await fetch(`${apiUrl}/api/stripe/createPaymentIntent`, {
      method: "POST",
      headers: {
        'Origin': originHeader,
        "User-Agent": userAgent,
        "Authorization": authorization
      },
      body: JSON.stringify({
        amount,
        gallery_id,
        meta
      }),
    });
    console.log({
      amount,
      gallery_id,
      meta
    })
    const result = await res.json();
    return result
  } catch (error: any) {
    console.log(error);
  }
};