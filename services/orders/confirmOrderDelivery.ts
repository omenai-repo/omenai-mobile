import { apiUrl } from "../../constants/apiUrl.constants";
import { apiRequest } from "../../utils/apiRequest";

export async function confirmOrderDelivery(
  confirm_delivery: boolean,
  order_id: string,
) {
  try {
    const response = await apiRequest(
      apiUrl + "/api/orders/confirmOrderDelivery",
      {
        method: "POST",
        body: JSON.stringify({
          confirm_delivery,
          order_id,
        }),
      },
    );

    const result = await response.json();
    return { isOk: response.ok, message: result.message, data: result.data };
  } catch (error: any) {
    return {
      isOk: false,
      body: { message: "Error updating order status" },
      message: (error as any).message || "Error updating order status",
      status: error?.status,
      error: error,
    };
  }
}
