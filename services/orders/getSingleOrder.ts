import { apiUrl, originHeader } from "../../constants/apiUrl.constants";

export const getSingleOrder = async (order_id: string) => {
  try {
    const res = await fetch(`${apiUrl}/api/orders/getSingleOrder`, {
      method: "POST",
      headers: {
        'Origin': originHeader,
      },
      body: JSON.stringify({
        order_id,
      }),
    });
    const result = await res.json();
    return { isOk: res.ok, message: result.message, data: result.data };
  } catch (error: any) {
    console.log(error);
  }
};
