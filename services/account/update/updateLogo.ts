import { apiUrl } from "#constants/apiUrl.constants";
import { apiRequest } from "#utils/network/apiRequest";

export async function updateLogo(
  payload: { id: string; url: string },
  type: "gallery" | "artist" | "individual",
) {
  try {
    const res = await apiRequest(`${apiUrl}/api/requests/${type}/logo`, {
      method: "POST",
      body: JSON.stringify({ ...payload }),
    });
    const data: { message: string } = await res.json();
    return {
      isOk: res.ok,
      body: { message: data.message },
    };
  } catch (error: any) {
    return {
      isOk: false,
      body: {
        message:
          error.message ||
          error?.response?.data?.message ||
          "Error updating logo",
      },
    };
  }
}
