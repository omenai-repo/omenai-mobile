import { apiUrl } from "../../constants/apiUrl.constants";
import { apiRequest } from "../../utils/apiRequest";

export async function retrieveBalance(account: string) {
  try {
    const res = await apiRequest(`${apiUrl}/api/stripe/retrieveBalance`, {
      method: "POST",
      body: JSON.stringify({ account }),
    });

    const result = await res.json();

    return {
      isOk: res.ok,
      data: result.data,
    };
  } catch (error: any) {
    console.log(error);
  }
}
