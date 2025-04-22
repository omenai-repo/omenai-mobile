import { apiUrl, authorization, originHeader, userAgent } from 'constants/apiUrl.constants';
import { utils_getAsyncData } from 'utils/utils_asyncStorage';

export async function updateWalletPin(pin: string) {
  let walletId = '';
  const userSession = await utils_getAsyncData('userSession');
  if (userSession.value) {
    walletId = JSON.parse(userSession.value).walletId;
  }
  if (walletId.length < 1) return;
  try {
    const res = await fetch(`${apiUrl}/api/wallet/update_wallet_pin`, {
      method: 'POST',
      headers: {
        Origin: originHeader,
        'User-Agent': userAgent,
        Authorization: authorization,
      },
      body: JSON.stringify({ wallet_id: walletId, pin }),
    });

    const result = await res.json();

    return { isOk: res.ok, data: result };
  } catch (error: any) {
    return {
      isOk: false,
      message: error.response?.data?.message || 'Failed to update PIN',
    };
  }
}
