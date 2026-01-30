import { apiUrl } from "../../constants/apiUrl.constants";
import { apiRequest } from "../../utils/apiRequest";

export async function provideTrackingInfo({
  data,
  order_id,
}: {
  data: { id: string; link: string };
  order_id: string;
}) {
  try {
    const response = await apiRequest(
      apiUrl + "/api/orders/updateOrderTrackingData",
      {
        method: "POST",
        body: JSON.stringify({ data, order_id }),
      },
    ).then(async (res) => {
      const result = await res.json();
      return { isOk: res.ok, message: result.message, data: result.data };
    });

    return response;
  } catch (error) {
    console.log("error" + error);
    return {
      isOk: false,
      body: { message: "Error updating order status" },
      message: (error as any).message || "Error updating order status",
      error: error,
    };
  }
}
