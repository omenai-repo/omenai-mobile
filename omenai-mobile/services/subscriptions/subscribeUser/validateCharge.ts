import { apiUrl } from "constants/apiUrl.constants";

export async function validateCharge(data: { otp: string; flw_ref: string }) {
  try {
    const res = await fetch(
      `${apiUrl}/api/subscriptions/subscribeUser/validateCharge`,
      {
        method: "POST",
        body: JSON.stringify({ ...data }),
      }
    );

    const result = await res.json();
    return { isOk: res.ok, message: result.message, data: result.data };
  } catch (error: any) {
    console.log(error);
  }
}
