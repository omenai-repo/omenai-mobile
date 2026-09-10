import { apiUrl } from "#constants/apiUrl.constants";
import { apiRequest } from "#utils/network/apiRequest";

export async function createShippingOrder(
  buyer_id: string,
  art_id: string,
  seller_id: string,
  phone: string,
  save_shipping_address: boolean,
  shipping_address: AddressTypes,
  origin_address: AddressTypes | null,
  designation: "gallery" | "artist",
) {
  try {
    const response = await apiRequest(`${apiUrl}/api/orders/createOrder`, {
      method: "POST",
      body: JSON.stringify({
        buyer_id,
        art_id,
        seller_id,
        phone_number: phone,
        save_shipping_address,
        shipping_address,
        origin_address,
        designation,
      }),
      shouldLogout: false,
    });
    const result = await response.json();
    return { isOk: response.ok, message: result.message };
  } catch (error: any) {
    return {
      isOk: false,
      body: {
        message:
          error.message ||
          error?.response?.data?.message ||
          "Error creating shipping order",
      },
    };
  }
}
