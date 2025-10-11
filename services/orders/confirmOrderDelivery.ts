import { apiUrl, authorization, originHeader, userAgent } from '../../constants/apiUrl.constants';

export async function confirmOrderDelivery(confirm_delivery: boolean, order_id: string) {
  try {
    const response = await fetch(apiUrl + '/api/orders/confirmOrderDelivery', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: originHeader,
        'User-Agent': userAgent,
        Authorization: authorization,
      },
      body: JSON.stringify({
        confirm_delivery,
        order_id,
      }),
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
