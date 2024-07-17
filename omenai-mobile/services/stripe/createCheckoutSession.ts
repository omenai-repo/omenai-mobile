import { apiUrl } from "../../constants/apiUrl.constants";

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
  cancel_url: string
) {
  console.log({
    item,
    amount,
    gallery_id,
    meta,
    cancel_url,
    success_url,
  })
  try {
    const res = await fetch(`${apiUrl}/api/stripe/createCheckoutSession`, {
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
    console.log(error);
  }
}
