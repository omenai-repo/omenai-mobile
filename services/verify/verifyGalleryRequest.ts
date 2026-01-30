import { apiUrl } from "#constants/apiUrl.constants";
import { apiRequest } from "../../utils/apiRequest";

export async function verifyGalleryRequest(name: string) {
  try {
    const res = await apiRequest(`${apiUrl}/api/verification/verifyGallery`, {
      method: "POST",
      body: JSON.stringify({ name }),
    });

    const result = await res.json();

    return { isOk: res.ok, message: result.message };
  } catch (error: any) {
    console.log(error);
  }
}
