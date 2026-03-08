import { apiUrl } from "../../constants/apiUrl.constants";
import { apiRequest } from "../../utils/apiRequest";

export async function createAccountLink(account: string) {
  try {
    const res = await apiRequest(`${apiUrl}/api/stripe/createAccountLink`, {
      method: "POST",
      body: JSON.stringify({
        account,
        return_url: "omenaimobile://stripe-return",
      }),
    });

    const result = await res.json();

    return {
      isOk: res.ok,
      url: result.url,
    };
  } catch (error: any) {
    return {
      isOk: false,
      body: {
        message:
          error.message ||
          error?.response?.data?.message ||
          "Error creating account link",
      },
    };
  }
}
