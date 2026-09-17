import { apiUrl } from "#constants/apiUrl.constants";
import { apiRequest } from "#utils/network/apiRequest";

export const updateOrderPickupAddress = async ({
  type,
  pickupAddress,
  order_id,
}: {
  type: "pickup" | "delivery";
  pickupAddress: AddressTypes;
  order_id: string;
}) => {
  try {
    const res = await apiRequest(
      apiUrl + `/api/orders/updateOrderPickupAddress`,
      {
        method: "PATCH",
        body: JSON.stringify({
          order_id,
          type,
          pickupAddress,
        }),
      }
    );
    const result = await res.json();
    return { isOk: res.ok, message: result.message };
  } catch (error: any) {
    return {
      isOk: false,
      message:
        error.message ||
        error?.response?.data?.message ||
        "An error was encountered, please try again later or contact support",
    };
  }
};
