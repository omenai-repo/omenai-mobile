import { apiUrl, authorization, originHeader, userAgent } from "constants/apiUrl.constants";
import { rollbar } from "../../config/rollbar.config";

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
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Origin: originHeader,
        "User-Agent": userAgent,
        Authorization: authorization,
      },
      body: JSON.stringify({ owner_id, account_details, base_currency }),
    });

    const result = await res.json();
    // Report 500+ errors to Rollbar
    if (res.status >= 500) {
      rollbar.error("AddPrimaryAcct API 500+ error", {
        status: res.status,
        url,
        owner_id,
        account_details,
        base_currency,
        response: result,
      });
    }
    return { isOk: res.ok, data: result };
  } catch (error: any) {
    rollbar.error("AddPrimaryAcct API exception", {
      error,
      owner_id,
      account_details,
      base_currency,
    });
    console.log(error);
  }
}
