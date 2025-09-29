import { utils_getAsyncData } from 'utils/utils_asyncStorage';
import { apiUrl, authorization, originHeader, userAgent } from '../../constants/apiUrl.constants';

export async function getSalesHighlightData() {
  let userId = '';
  const userSession = await utils_getAsyncData('userSession');
  if (userSession.value) {
    userId = JSON.parse(userSession.value).id;
  } else {
    return;
  }
  try {
    const response = await fetch(`${apiUrl}/api/sales/getAllSalesById`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: originHeader,
        'User-Agent': userAgent,
        Authorization: authorization,
      },
      body: JSON.stringify({ id: userId }),
    });
    const result = await response.json();
    return { isOk: response.ok, data: result.data };
  } catch (error) {
    return {
      isOk: false,
      body: { message: 'Error fetching gallery artwork highlight' },
    };
  }
}
