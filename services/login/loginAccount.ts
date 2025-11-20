import { apiUrl, authorization, originHeader, userAgent } from "../../constants/apiUrl.constants";
import { rollbar } from "../../config/rollbar.config";

export async function loginAccount(
  payload: IndividualLoginData,
  route: "individual" | "gallery" | "artist"
) {
  const url = apiUrl + "/api/auth/" + route + "/login";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: originHeader,
        "User-Agent": userAgent,
        Authorization: authorization,
      },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    console.log(result, "result");
    // Report 500+ errors to Rollbar
    if (response.status >= 500) {
      rollbar.error("LoginAccount API 500+ error", {
        status: response.status,
        url,
        payload,
        response: result,
      });
    }
    return {
      isOk: response.ok,
      body: result,
    };
  } catch (error) {
    rollbar.error("LoginAccount API exception", { error, url, payload });
    return {
      isOk: false,
      body: { message: "Error logging into account" },
    };
  }
}
