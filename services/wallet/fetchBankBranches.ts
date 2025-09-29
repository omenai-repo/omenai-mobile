import { apiUrl, authorization, originHeader, userAgent } from 'constants/apiUrl.constants';

export async function fetchBankBranches(bankCode: string) {
  try {
    const res = await fetch(
      `${apiUrl}/api/wallet/accounts/get_bank_branches?bankCode=${bankCode}`,
      {
        method: 'GET',
        headers: {
          Origin: originHeader,
          'User-Agent': userAgent,
          Authorization: authorization,
        },
      },
    );

    const result = await res.json();

    return { isOk: res.ok, data: result.bank_branches };
  } catch (error: any) {
    console.log(error);
  }
}
