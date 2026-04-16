import { apiUrl } from "../../constants/apiUrl.constants";
import { apiRequest } from "../../utils/apiRequest";

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
    const response = await apiRequest(url, {
      method: "POST",
      auth: false,
      body: JSON.stringify(payload),
    });
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
      body: {
        message:
          error.message ||
          error?.response?.data?.message ||
          "Error creating account",
      },
    };
  }
}
