import { apiUrl, authorization, originHeader, userAgent } from '../../constants/apiUrl.constants';

export async function getWalletBalance({ id }: { id: string }) {
  try {
    const response = await fetch(`${apiUrl}/api/wallet/fetch_wallet_balance?id=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Origin: originHeader,
        'User-Agent': userAgent,
        Authorization: authorization,
      },
    });

    const result = await response.json();

    return result;
  } catch (error) {
    return {
      isOk: false,
      body: { message: 'Error fetching wallet balance' },
    };
  }
}
