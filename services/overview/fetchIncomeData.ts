import { apiUrl, authorization, originHeader, userAgent } from 'constants/apiUrl.constants';
import { utils_getAsyncData } from 'utils/utils_asyncStorage';

export async function fetchIncomeData(route: RouteIdentifier) {
  let userId = '';
  const userSession = await utils_getAsyncData('userSession');
  if (userSession.value) {
    userId = JSON.parse(userSession.value).id;
  } else {
    return;
  }
  try {
    const response = await fetch(`${apiUrl}/api/requests/${route}/fetchIncomeData?id=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Origin: originHeader,
        'User-Agent': userAgent,
        Authorization: authorization,
      },
    });
    const result = await response.json();
    return { isOk: response.ok, data: result.data };
  } catch (error: any) {
    console.log(error);
  }
}
