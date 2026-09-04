import { apiUrl } from "#constants/apiUrl.constants";
import { apiRequest } from "#utils/network/apiRequest";

export const releaseOrderLock = async (art_id: string, user_id: string) => {
  try {
    const res = await apiRequest(`${apiUrl}/api/locks/releaseLock`, {
      method: "POST",
      body: JSON.stringify({
        art_id,
        user_id,
      }),
    });
    const result = await res.json();
    return { isOk: res.ok, message: result.message };
  } catch (error: any) {
    return {
      isOk: false,
      body: {
        message:
          error.message ||
          error?.response?.data?.message ||
          "Error releasing order lock",
      },
    };
  }
};
