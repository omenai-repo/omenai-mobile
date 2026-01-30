import { RouteIdentifier } from "#types/types";
import { apiUrl } from "../../constants/apiUrl.constants";
import { apiRequest } from "../../utils/apiRequest";

export async function updateProfile(
  route: RouteIdentifier,
  payload: any,
  id: string,
) {
  try {
    const response = await apiRequest(`${apiUrl}/api/update/${route}/profile`, {
      method: "POST",
      body: JSON.stringify({ ...payload, id }),
    }).then(async (res) => {
      const data: { message: string } = await res.json();
      const response = {
        isOk: res.ok,
        body: { message: data.message },
      };

      return response;
    });

    return response;
  } catch (error) {
    return {
      isOk: false,
      body: { message: "Error updating profile" },
    };
  }
}
