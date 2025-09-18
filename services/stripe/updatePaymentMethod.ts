import { utils_getAsyncData } from 'utils/utils_asyncStorage';
import { apiUrl, authorization, originHeader, userAgent } from '../../constants/apiUrl.constants';

export const updatePaymentMethod = async (setupIntentId: string) => {
  let gallery_id = '';
  const userSession = await utils_getAsyncData('userSession');
  if (userSession.value) {
    gallery_id = JSON.parse(userSession.value).id;
  }
  if (gallery_id.length < 1) return;
  try {
    const res = await fetch(`${apiUrl}/api/subscriptions/stripe/updatePaymentMethod`, {
      method: 'PUT',
      headers: {
        Origin: originHeader,
        'User-Agent': userAgent,
        Authorization: authorization,
      },
      body: JSON.stringify({
        setupIntentId,
        gallery_id,
      }),
    });

    const result = await res.json();
    return {
      isOk: res.ok,
      message: result.message,
    };
  } catch (error: any) {
    return {
      isOk: false,
      message: 'An error was encountered, please try again later or contact support',
    };
  }
};
