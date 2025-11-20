import { apiUrl, authorization, originHeader, userAgent } from '../../constants/apiUrl.constants';

export async function declineOrderRequest(
  data: OrderAcceptedStatusTypes,
  order_id: string,
  seller_designation: 'artist' | 'gallery',
  art_id: string,
) {
  try {
    const response = await fetch(apiUrl + '/api/orders/declineOrderRequest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: originHeader,
        'User-Agent': userAgent,
        Authorization: authorization,
      },
      body: JSON.stringify({ data, order_id, seller_designation, art_id }),
    });

    const result = await response.json();
    return { isOk: response.ok, message: result.message, data: result.data };
  } catch (error) {
    return {
      isOk: false,
      body: { message: 'Error updating order status' },
    };
  }
}
