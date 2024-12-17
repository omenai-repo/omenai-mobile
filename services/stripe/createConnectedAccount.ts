import { apiUrl, originHeader } from "../../constants/apiUrl.constants";

export async function createConnectedAccount(customer: {
  name: string;
  email: string;
  customer_id: string;
  country: string;
}) {
  try {
    const res = await fetch(`${apiUrl}/api/stripe/createConnectedAccount`, {
      method: "POST",
      headers: {
        'Origin': originHeader,
      },
      body: JSON.stringify({ customer }),
    });

    const result = await res.json();

    return {
      isOk: res.ok,
      message: result.message,
      account_id: result.account_id,
    };
  } catch (error: any) {
    console.log(error);
  }
}
