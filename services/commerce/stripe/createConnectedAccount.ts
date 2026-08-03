import { apiUrl } from "#constants/apiUrl.constants";
import { apiRequest } from "#utils/network/apiRequest";

export async function createConnectedAccount(customer: {
  name: string;
  email: string;
  customer_id: string;
  country: string;
}) {
  try {
    const res = await apiRequest(
      `${apiUrl}/api/stripe/createConnectedAccount`,
      {
        method: "POST",
        body: JSON.stringify({ customer }),
      },
    );

    const result = await res.json();

    return {
      isOk: res.ok,
      message: result.message,
      account_id: result.account_id,
    };
  } catch (error: any) {
    return {
      isOk: false,
      body: {
        message:
          error.message ||
          error?.response?.data?.message ||
          "Error creating connected account",
      },
    };
  }
}
