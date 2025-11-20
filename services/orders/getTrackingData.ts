import { apiUrl, authorization, originHeader, userAgent } from "constants/apiUrl.constants";
import { rollbar } from "../../config/rollbar.config";

export async function getTrackingData(orderId: string) {
  try {
    const url = `${apiUrl}/api/shipment/shipment_tracking?order_id=${orderId}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Origin: originHeader,
        "User-Agent": userAgent,
        Authorization: authorization,
      },
    });

    const result = await response.json();
    // Report 500+ errors to Rollbar
    if (response.status >= 500) {
      rollbar.error("GetTrackingData API 500+ error", {
        status: response.status,
        url,
        orderId,
        response: result,
      });
    }
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
  } catch (error) {
    rollbar.error("GetTrackingData API exception", { error, orderId });
    return {
      isOk: false,
      message: "An error was encountered, please try again later or contact support",
    };
  }
}
