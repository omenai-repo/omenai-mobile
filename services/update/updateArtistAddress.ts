import { apiUrl } from "#constants/apiUrl.constants";
import { apiRequest } from "../../utils/apiRequest";

type UpdateArtistAddressPayload = {
  artist_id: string;
  base_currency: string;
  address: {
    address_line: string;
    city: string;
    country: string;
    countryCode: string;
    state: string;
    stateCode: string;
    zip: string;
  };
};

export async function updateArtistAddress(payload: UpdateArtistAddressPayload) {
  try {
    const response = await apiRequest(`${apiUrl}/api/update/artist/address`, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const data: { message: string } = await response.json();
    return {
      isOk: response.ok,
      body: { message: data.message },
    };
  } catch (error: any) {
    return {
      isOk: false,
      body: {
        message:
          error.message ||
          error?.response?.data?.message ||
          "Error updating artist address",
      },
    };
  }
}
