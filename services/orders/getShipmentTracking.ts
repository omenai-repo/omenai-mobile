import { apiUrl } from "../../constants/apiUrl.constants";
import { apiRequest } from "../../utils/apiRequest";

export async function getShipmentTracking(order_id: string) {
  try {
    const response = await apiRequest(
      `${apiUrl}/api/shipment/shipment_tracking?order_id=${order_id}`,
      {
        method: "GET",
      },
    );

    const result = await response.json();
    return {
      isOk: response.ok,
      message: result.message,
      data: result.data,
    };
  } catch (error: any) {
    return {
      isOk: false,
      body: {
        message:
          error.message ||
          error?.response?.data?.message ||
          "Error fetching shipment data",
      },
    };
  }
}
