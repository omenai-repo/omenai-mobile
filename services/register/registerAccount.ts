import {
  ArtistRegisterData,
  GalleryRegisterData,
  IndividualRegisterData,
} from "#types/types";
import {
  apiUrl,
  authorization,
  originHeader,
  userAgent,
} from "../../constants/apiUrl.constants";

export async function registerAccount(
  payload:
    | (Omit<IndividualRegisterData, "confirmPassword"> & {
        preferences: string[];
      })
    | GalleryRegisterData
    | ArtistRegisterData,
  route: "gallery" | "individual" | "artist",
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
      status: response.status,
    };
    return ParsedResponse;
  } catch (error: any) {
    return {
      isOk: false,
      status: error?.status,
      error: error,
      body: { message: "Error creating account" },
    };
  }
}
