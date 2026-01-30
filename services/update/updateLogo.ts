import { apiUrl } from "#constants/apiUrl.constants";
import { apiRequest } from "../../utils/apiRequest";

export async function updateLogo(
  payload: { id: string; url: string },
  type: "gallery" | "artist" | "individual",
) {
  const result = await apiRequest(`${apiUrl}/api/requests/${type}/logo`, {
    method: "POST",
    body: JSON.stringify({ ...payload }),
  }).then(async (res) => {
    const data: { message: string } = await res.json();
    const response = {
      isOk: res.ok,
      body: { message: data.message },
    };

    return response;
  });

  return result;
}
