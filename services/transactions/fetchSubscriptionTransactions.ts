import { apiUrl } from "constants/apiUrl.constants";

export async function fetchSubscriptionTransactions(gallery_id: string) {
  try {
    const res = await fetch(`${apiUrl}/api/transactions/fetchSubTrans`, {
      method: "POST",
      body: JSON.stringify({ gallery_id: gallery_id }),
    });

    const result = await res.json();

    return { isOk: res.ok, message: result.message, data: result.data };
  } catch (error: any) {
    console.log(error);
  }
}
