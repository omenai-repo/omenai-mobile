import { apiUrl } from "../../constants/apiUrl.constants";
import { apiRequest } from "../../utils/apiRequest";

export async function verifyAddress(payload: {
  type: string;
  countyName: string;
  cityName: string;
  postalCode: string;
  countryCode: string;
}) {
  try {
    const response = await apiRequest(
      `${apiUrl}/api/shipment/address_validation`,
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
  } catch (error: any) {
    return {
      isOk: false,
      body: {
        message:
          error.message ||
          error?.response?.data?.message ||
          "Error verify address",
      },
    };
  }
}
