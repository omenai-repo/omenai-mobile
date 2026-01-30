import { apiUrl } from "#constants/apiUrl.constants";
import { apiRequest } from "../../utils/apiRequest";
import { WithdrawalAccount } from "#types/types";

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
  console.log({ owner_id, account_details, base_currency });
  try {
    const url = `${apiUrl}/api/wallet/add_primary_account`;
    const res = await apiRequest(url, {
      method: "POST",
      body: JSON.stringify({ owner_id, account_details, base_currency }),
    });

    const result = await res.json();
    return { isOk: res.ok, data: result };
  } catch (error: any) {
    console.log(error);
  }
}
