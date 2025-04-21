import { apiUrl, authorization, originHeader, userAgent } from 'constants/apiUrl.constants';

export async function updateWalletPin(wallet_id: string, pin: string) {
  try {
    const res = await fetch(`${apiUrl}/api/wallet/update_wallet_pin`, {
      method: 'POST',
      headers: {
        Origin: originHeader,
        'User-Agent': userAgent,
        Authorization: authorization,
      },
      body: JSON.stringify({ wallet_id, pin }),
    });

    const result = await res.json();

    return { isOk: true, data: result.data };
  } catch (error: any) {
    return {
      isOk: false,
      message: error.response?.data?.message || 'Failed to update PIN',
    };
  }
}
