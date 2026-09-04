import { apiUrl } from "#constants/apiUrl.constants";
import { apiRequest } from "#utils/network/apiRequest";

interface ShippingQuoteData {
  package_carrier?: string;
  specialInstructions?: string;
  fees?: string;
  taxes?: string;
  dimensions?: any; // Replace with proper type if available
  exhibition_status?: any;
  hold_status?: any;
}

interface ShippingTypeProps {
  data: ShippingQuoteData;
  order_id: string;
  art_id?: string; // made optional
  seller_designation?: string; // made optional
}

export async function updateShippingQuote({
  data,
  order_id,
  art_id,
  seller_designation,
}: ShippingTypeProps) {
  try {
    const response = await apiRequest(
      apiUrl + "/api/orders/accept_order_request",
      {
        method: "POST",
        body: JSON.stringify({ ...data, order_id, art_id, seller_designation }),
      },
    );

    const result = await response.json();
    return { isOk: response.ok, message: result.message, data: result.data };
  } catch (error: any) {
    return {
      isOk: false,
      body: {
        message:
          error.message ||
          error?.response?.data?.message ||
          "Error updating order status",
      },
    };
  }
}
