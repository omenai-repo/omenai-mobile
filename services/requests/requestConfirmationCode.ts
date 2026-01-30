import { utils_getAsyncData } from "#utils/utils_asyncStorage";
import { apiUrl } from "../../constants/apiUrl.constants";
import { apiRequest } from "../../utils/apiRequest";

export async function requestPasswordConfirmationCode(route: string) {
  let id = "";
  const userSession = await utils_getAsyncData("userSession");
  if (userSession.value) {
    id = JSON.parse(userSession.value).id;
    console.log("id", id);
  } else {
    return;
  }

  try {
    const response = await apiRequest(
      `${apiUrl}/api/requests/${route}/requestPasswordConfirmationCode`,
      {
        method: "POST",
        body: JSON.stringify({ id: id }),
      },
    ).then(async (res) => {
      const result = await res.json();
      return { isOk: res.ok, message: result.message };
    });
    return response;
  } catch {
    return {
      isOk: false,
      message: "Error getting confirmation code",
    };
  }
}
