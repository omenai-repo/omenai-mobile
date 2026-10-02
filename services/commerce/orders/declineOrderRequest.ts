import { OrderAcceptedStatusTypes } from "#types/types";
import { apiUrl } from "#constants/apiUrl.constants";
import { apiRequest } from "#utils/network/apiRequest";

export async function declineOrderRequest(
  data: OrderAcceptedStatusTypes,
  order_id: string,
  seller_designation?: "artist" | "gallery",
  art_id?: string,
) {
  try {
    const response = await apiRequest(
      apiUrl + "/api/orders/declineOrderRequest",
      {
        method: "POST",
        body: JSON.stringify({ data, order_id, seller_designation, art_id }),
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
