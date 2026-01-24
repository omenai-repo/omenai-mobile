import {
  apiUrl,
  authorization,
  originHeader,
  userAgent,
} from "../../constants/apiUrl.constants";
import { AddressTypes } from "#types/types";

export async function createShippingOrder(
  buyer_id: string,
  art_id: string,
  seller_id: string,
  save_shipping_address: boolean,
  shipping_address: AddressTypes,
  origin_address: AddressTypes | null,
  designation: "gallery" | "artist",
) {
  try {
    const response = await fetch(`${apiUrl}/api/orders/createOrder`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: originHeader,
        "User-Agent": userAgent,
        Authorization: authorization,
      },
      body: JSON.stringify({
        buyer_id,
        art_id,
        seller_id,
        save_shipping_address,
        shipping_address,
        origin_address,
        designation,
      }),
    });
    const result = await response.json();
    return { isOk: response.ok, message: result.message };
  } catch (error) {
    console.log("error" + error);
    return {
      isOk: false,
      error,
      body: { message: "Error fetching orders" },
    };
  }
}
