import { apiUrl } from "../../constants/apiUrl.constants";

export async function verifyFlwTransaction(data: { transaction_id: string }) {
  try {
    const res = await fetch(`${apiUrl}/api/transactions/verify_FLW_transaction`, {
      method: "POST",
      body: JSON.stringify(data),
    });

    const result = await res.json();

    return {
      isOk: res.ok,
      message: result.message,
      data: result.data,
    };
  } catch (error: any) {
    console.log(error);
  }
}
