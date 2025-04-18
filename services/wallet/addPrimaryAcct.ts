import { apiUrl, authorization, originHeader, userAgent } from 'constants/apiUrl.constants';

type addPrimaryAcctProp = {
  owner_id: string;
  account_details: Omit<WithdrawalAccount, 'beneficiary_id'>;
  base_currency: string;
};

export async function addPrimaryAcct({
  owner_id,
  account_details,
  base_currency,
}: addPrimaryAcctProp) {
  console.log({ owner_id, account_details, base_currency });
  try {
    const res = await fetch(`${apiUrl}/api/wallet/add_primary_account`, {
      method: 'POST',
      headers: {
        Origin: originHeader,
        'User-Agent': userAgent,
        Authorization: authorization,
      },
      body: JSON.stringify({ owner_id, account_details, base_currency }),
    });

    const result = await res.json();

    return { isOk: res.ok, data: result };
  } catch (error: any) {
    console.log(error);
  }
}
