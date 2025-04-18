import { apiUrl, authorization, originHeader, userAgent } from 'constants/apiUrl.constants';
import { utils_getAsyncData } from 'utils/utils_asyncStorage';

export async function fetchBanks() {
  let countryCode = '';
  const userSession = await utils_getAsyncData('userSession');
  if (userSession.value) {
    countryCode = JSON.parse(userSession.value).address.countryCode;
  }
  if (countryCode.length < 1) return;

  try {
    const res = await fetch(`${apiUrl}/api/wallet/accounts/get_banks?countryCode=${countryCode}`, {
      method: 'GET',
      headers: {
        Origin: originHeader,
        'User-Agent': userAgent,
        Authorization: authorization,
      },
    });

    const result = await res.json();

    return { isOk: res.ok, data: result };
  } catch (error: any) {
    console.log(error);
  }
}
