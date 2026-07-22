import { apiUrl } from "#constants/apiUrl.constants";
import { apiRequest } from "../../utils/apiRequest";

type addPrimaryAcctProp = {
  owner_id: string;
  account_details: Omit<WithdrawalAccount, "beneficiary_id">;
  base_currency: string;
};

export async function addPrimaryAcct({
  owner_id,
  account_details,
  base_currency,
}: addPrimaryAcctProp) {
  try {
    const url = `${apiUrl}/api/wallet/add_primary_account`;
    const res = await apiRequest(url, {
      method: "POST",
      body: JSON.stringify({ owner_id, account_details, base_currency }),
    });

    const result = await res.json();
    return { isOk: res.ok, data: result };
  } catch (error: any) {
    return {
      isOk: false,
      body: {
        message:
          error.message ||
          error?.response?.data?.message ||
          "Error adding primary account",
      },
    };
  }
}
