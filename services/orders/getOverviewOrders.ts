import { apiUrl, authorization, originHeader, userAgent } from '../../constants/apiUrl.constants';
import { utils_getAsyncData } from 'utils/utils_asyncStorage';

export async function getOverviewOrders() {
  let userId = '';
  const userSession = await utils_getAsyncData('userSession');
  if (userSession.value) {
    userId = JSON.parse(userSession.value).id;
  } else {
    return;
  }

  try {
    const response = await fetch(`${apiUrl}/api/orders/getOrdersBySellerId`, {
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
    return {
      isOk: response.ok,
      message: result.message,
      data: result.data,
    };
  } catch (error) {
    return {
      isOk: false,
      body: { message: 'Error fetching orders' },
    };
  }
}
