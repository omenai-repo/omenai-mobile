import { apiUrl, authorization, originHeader, userAgent } from '../../constants/apiUrl.constants';

interface ShippingTypeProps {
  order_id: string;
  dimensions: ShipmentDimensions;
  exhibition_status: OrderArtworkExhibitionStatus | null;
  hold_status: HoldStatus | null;
}

export async function updateShippingQuote({
  order_id,
  dimensions,
  exhibition_status,
  hold_status,
}: ShippingTypeProps) {
  try {
    const response = await fetch(apiUrl + '/api/orders/accept_order_request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: originHeader,
        'User-Agent': userAgent,
        Authorization: authorization,
      },
      body: JSON.stringify({ order_id, dimensions, exhibition_status, hold_status }),
    });

    const result = await response.json();
    return { isOk: response.ok, message: result.message, data: result.data };
  } catch (error) {
    console.log('error' + error);
    return {
      isOk: false,
      body: { message: 'Error updating order status' },
    };
  }
}
