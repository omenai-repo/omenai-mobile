import { apiUrl, authorization, originHeader, userAgent } from '../../constants/apiUrl.constants';

export async function getShipmentTracking(order_id: string) {
  try {
    const response = await fetch(`${apiUrl}/api/shipment/shipment_tracking?order_id=${order_id}`, {
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
      data: result,
    };
  } catch (error) {
    return {
      isOk: false,
      body: { message: 'Error fetching shipment data' },
    };
  }
}
