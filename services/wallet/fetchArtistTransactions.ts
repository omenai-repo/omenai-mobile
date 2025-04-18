import { apiUrl, authorization, originHeader, userAgent } from 'constants/apiUrl.constants';
import { utils_getAsyncData } from 'utils/utils_asyncStorage';

type fetchArtistTransactionsType = {
  year?: string;
  limit?: number;
  status?: string;
};

export async function fetchArtistTransactions({
  year = '2025',
  limit = 10,
  status,
}: fetchArtistTransactionsType) {
  let wallet_id = '';
  const userSession = await utils_getAsyncData('userSession');
  if (userSession.value) {
    wallet_id = JSON.parse(userSession.value).walletId;
  }
  if (wallet_id.length < 1) return;

  try {
    const res = await fetch(
      `${apiUrl}/api/wallet/fetch_wallet_transactions?id=${wallet_id}&year=${year}&limit=${limit}&status=${status}`,
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

    return { isOk: res.ok, message: result.message, data: result.data };
  } catch (error: any) {
    console.log(error);
  }
}
