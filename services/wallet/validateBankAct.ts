import { apiUrl, authorization, originHeader, userAgent } from 'constants/apiUrl.constants';

export async function validateBankAcct(bankCode: string, accountNumber: string) {
  try {
    const res = await fetch(`${apiUrl}/api/wallet/accounts/validate_account`, {
      method: 'POST',
      headers: {
        Origin: originHeader,
        'User-Agent': userAgent,
        Authorization: authorization,
      },
      body: JSON.stringify({ bankCode, accountNumber }),
    });

    const result = await res.json();

    return { isOk: res.ok, data: result.account_data };
  } catch (error: any) {
    console.log(error);
  }
}
