import { apiUrl, authorization, originHeader, userAgent } from 'constants/apiUrl.constants';

export async function getTrackingData(orderId: string) {
  try {
    const response = await fetch(`${apiUrl}/api/shipment/shipment_tracking?order_id=${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Origin: originHeader,
        'User-Agent': userAgent,
        Authorization: authorization,
      },
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
      message: 'An error was encountered, please try again later or contact support',
    };
  }
}
