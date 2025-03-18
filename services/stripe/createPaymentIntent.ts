import { apiUrl, authorization, originHeader, userAgent } from "../../constants/apiUrl.constants";

export const createPaymentIntent = async (
    amount: number,
    seller_id: string,
    meta: {
        buyer_id: string;
        buyer_email: string;
        art_id: string;
        seller_email: string;
        seller_name: string;
        seller_id: string,
        artwork_name: string;
        shipping_cost: number
        unit_price: number
        tax_fees: number
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
        seller_id,
        meta
      }),
    });
    // console.log({
    //   amount,
    //   seller_id,
    //   meta
    // })
    const result = await res.json();
    return result
  } catch (error: any) {
    console.log(error);
  }
};