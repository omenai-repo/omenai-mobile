import { apiUrl } from "../../constants/apiUrl.constants";
import { apiRequest } from "../../utils/apiRequest";

export async function getAccountID(galleryId: string) {
  try {
    const res = await apiRequest(`${apiUrl}/api/stripe/getAccountId`, {
      method: "POST",
      body: JSON.stringify({ gallery_id: galleryId }),
    });

    const result = await res.json();

    return {
      isOk: res.ok,
      data: result.data,
    };
  } catch (error: any) {
    console.log(error);
  }
}
