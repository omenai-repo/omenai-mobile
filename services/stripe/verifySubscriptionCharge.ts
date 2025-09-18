import { utils_getAsyncData } from 'utils/utils_asyncStorage';
import { apiUrl, authorization, originHeader, userAgent } from '../../constants/apiUrl.constants';

export const verifySubscriptionCharge = async (paymentIntentId: string) => {
  let gallery_id = '';
  const userSession = await utils_getAsyncData('userSession');
  if (userSession.value) {
    gallery_id = JSON.parse(userSession.value).id;
  }
  if (gallery_id.length < 1) return;
  try {
    const res = await fetch(`${apiUrl}/api/subscriptions/stripe/verifyStripeSubscriptionCharge`, {
      method: 'POST',
      headers: {
        Origin: originHeader,
        'User-Agent': userAgent,
        Authorization: authorization,
      },
      body: JSON.stringify({
        paymentIntentId,
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
