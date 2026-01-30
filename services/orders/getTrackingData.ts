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
      data: {
        artwork_data: result.artwork_data,
        tracking_number: result.tracking_number,
        events: result.events,
        order_date: result.order_date,
        shipping_details: result.shipping_details,
      },
    };
  } catch {
    return {
      isOk: false,
      message:
        "An error was encountered, please try again later or contact support",
    };
  }
}
