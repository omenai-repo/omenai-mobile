import {
  apiUrl,
  authorization,
  originHeader,
  userAgent,
} from "../../constants/apiUrl.constants";

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
    const response = await fetch(apiUrl + "/api/orders/accept_order_request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: originHeader,
        "User-Agent": userAgent,
        Authorization: authorization,
      },
      body: JSON.stringify({ ...data, order_id, art_id, seller_designation }),
    });

    const result = await response.json();
    return { isOk: response.ok, message: result.message, data: result.data };
  } catch (error) {
    console.log("error" + error);
    return {
      isOk: false,
      body: { message: "Error updating order status" },
      error: error,
    };
  }
}
