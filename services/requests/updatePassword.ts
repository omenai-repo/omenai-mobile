import { utils_getAsyncData } from "utils/utils_asyncStorage";
import { apiUrl, authorization, originHeader, userAgent } from "../../constants/apiUrl.constants";
import { rollbar } from "../../config/rollbar.config";

export async function updatePassword(password: string, code: string, route: string) {
  let id = "";
  const userSession = await utils_getAsyncData("userSession");
  if (userSession.value) {
    id = JSON.parse(userSession.value).id;
  } else {
    return;
  }

  try {
    const response = await fetch(`${apiUrl}/api/requests/${route}/updatePassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: originHeader,
        "User-Agent": userAgent,
        Authorization: authorization,
      },
      body: JSON.stringify({
        ...(route === "gallery" ? { gallery_id: id } : { id: id }),
        password,
        code,
      }),
    }).then(async (res) => {
      const result = await res.json();
      // Report 500+ errors to Rollbar
      if (res.status >= 500) {
        rollbar.error("UpdatePassword API 500+ error", {
          status: res.status,
          url: `${apiUrl}/api/requests/${route}/updatePassword`,
          id,
          password,
          code,
          response: result,
        });
      }
      return { isOk: res.ok, message: result.message };
    });
    return response;
  } catch (error) {
    rollbar.error("UpdatePassword API exception", {
      error,
      url: `${apiUrl}/api/requests/${route}/updatePassword`,
      id,
      password,
      code,
    });
    return {
      isOk: false,
      message: "Error reseting password",
    };
  }
}
