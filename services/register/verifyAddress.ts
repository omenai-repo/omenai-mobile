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
  } catch {
    return {
      isOk: false,
      body: { message: "Error verify address" },
    };
  }
}
