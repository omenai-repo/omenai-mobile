import { apiUrl, authorization, originHeader, userAgent } from "../../constants/apiUrl.constants";
import { rollbar } from "../../config/rollbar.config";

export async function verifyAddress(payload: {
  type: string;
  countyName: string;
  cityName: string;
  postalCode: string;
  countryCode: string;
}) {
  try {
    const response = await fetch(`${apiUrl}/api/shipment/address_validation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: originHeader,
        "User-Agent": userAgent,
        Authorization: authorization,
      },
      body: JSON.stringify(payload),
    });
    const ParsedResponse = {
      isOk: response.ok,
      body: await response.json(),
    };
    // Report 500+ errors to Rollbar
    if (response.status >= 500) {
      rollbar.error("VerifyAddress API 500+ error", {
        status: response.status,
        url: `${apiUrl}/api/shipment/address_validation`,
        payload,
        response: ParsedResponse.body,
      });
    }
    return ParsedResponse;
  } catch (error) {
    rollbar.error("VerifyAddress API exception", {
      error,
      url: `${apiUrl}/api/shipment/address_validation`,
      payload,
    });
    return {
      isOk: false,
      body: { message: "Error verify address" },
    };
  }
}
