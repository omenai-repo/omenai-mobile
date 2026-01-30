import { apiUrl } from "#constants/apiUrl.constants";
import { apiRequest } from "../../utils/apiRequest";

export async function validateBankAcct(
  bankCode: string,
  accountNumber: string,
) {
  try {
    const res = await apiRequest(
      `${apiUrl}/api/wallet/accounts/validate_account`,
      {
        method: "POST",
        body: JSON.stringify({ bankCode, accountNumber }),
      },
    );

    const result = await res.json();

    return { isOk: res.ok, data: result.account_data };
  } catch (error: any) {
    console.log(error);
  }
}
