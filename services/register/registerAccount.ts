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
