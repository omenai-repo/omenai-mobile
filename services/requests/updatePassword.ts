import { utils_getAsyncData } from "#utils/utils_asyncStorage";
import { apiUrl } from "../../constants/apiUrl.constants";
import { apiRequest } from "../../utils/apiRequest";

export async function updatePassword(
  password: string,
  code: string,
  route: string,
) {
  let id = "";
  const userSession = await utils_getAsyncData("userSession");
  if (userSession.value) {
    id = JSON.parse(userSession.value).id;
  } else {
    return;
  }

  try {
    const response = await apiRequest(
      `${apiUrl}/api/requests/${route}/updatePassword`,
      {
        method: "POST",
        body: JSON.stringify({
          ...(route === "gallery" ? { gallery_id: id } : { id: id }),
          password,
          code,
        }),
      },
    ).then(async (res) => {
      const result = await res.json();
      return { isOk: res.ok, body: { message: result.message } };
    });
    return response;
  } catch (error: any) {
    return {
      isOk: false,
      body: {
        message:
          error.message ||
          error?.response?.data?.message ||
          "Error reseting password",
      },
    };
  }
}
