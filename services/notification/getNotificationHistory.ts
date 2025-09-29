import { utils_getAsyncData } from 'utils/utils_asyncStorage';
import { apiUrl, authorization, originHeader, userAgent } from '../../constants/apiUrl.constants';

export async function getNotificationHistory({ access_type }: { access_type: string }) {
  let id = '';
  const userSession = await utils_getAsyncData('userSession');
  if (userSession.value) {
    id = JSON.parse(userSession.value).id;
  } else {
    return;
  }
  try {
    const res = await fetch(
      `${apiUrl}/api/notifications/fetchNotifications?id=${id}&access_type=${access_type}`,
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

    return { isOk: res.ok, data: result.data };
  } catch (error: any) {
    console.log(error);
    return {
      isOk: false,
      error: error.message || 'An error occurred while fetching notifications.',
    };
  }
}
