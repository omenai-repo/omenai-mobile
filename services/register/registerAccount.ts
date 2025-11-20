import { apiUrl, authorization, originHeader, userAgent } from "../../constants/apiUrl.constants";
import { rollbar } from "../../config/rollbar.config";

export async function registerAccount(
  payload:
    | (Omit<IndividualRegisterData, "confirmPassword"> & { preferences: string[] })
    | GalleryRegisterData
    | ArtistRegisterData,
  route: "gallery" | "individual" | "artist"
) {
  const url = apiUrl + "/api/auth/" + route + "/register";

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
    console.log(payload);
    const ParsedResponse = {
      isOk: response.ok,
      body: await response.json(),
    };
    // Report 500+ errors to Rollbar
    if (response.status >= 500) {
      rollbar.error("RegisterAccount API 500+ error", {
        status: response.status,
        url,
        payload,
        response: ParsedResponse.body,
      });
    }
    return ParsedResponse;
  } catch (error) {
    // Only report to Rollbar if error is a server error (not network)
    rollbar.error("RegisterAccount API exception", { error, url, payload });
    return {
      isOk: false,
      body: { message: "Error creating account" },
    };
  }
}
