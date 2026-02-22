import { apiUrl } from "#constants/apiUrl.constants";
import { apiRequest } from "#utils/apiRequest";

export async function getTrackingData(orderId: string) {
  try {
    const url = `${apiUrl}/api/shipment/shipment_tracking?order_id=${orderId}`;
    const response = await apiRequest(url, {
      method: "GET",
    });

    const result = await response.json();
    return {
      isOk: response.ok,
      message: result.message,
      data: result.data,
    };
  } catch {
    return {
      isOk: false,
      message:
        "An error was encountered, please try again later or contact support",
    };
  }
}
