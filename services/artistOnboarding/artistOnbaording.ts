import { ArtistCategorizationUpdateDataTypes } from "#types/types";
import { apiUrl } from "../../constants/apiUrl.constants";
import { apiRequest } from "../../utils/apiRequest";

export async function artistOnboarding(
  payload: ArtistCategorizationUpdateDataTypes,
) {
  try {
    const response = await apiRequest(
      `${apiUrl}/api/auth/artist/onboarding/createCategorization`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );

    const ParsedResponse = {
      isOk: response.ok,
      body: await response.json(),
    };

    return ParsedResponse;
  } catch (error) {
    return {
      isOk: false,
      body: { message: "Error onboarding artist" },
    };
  }
}
