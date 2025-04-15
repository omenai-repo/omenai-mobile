import { utils_getAsyncData } from 'utils/utils_asyncStorage';
import { apiUrl, authorization, originHeader, userAgent } from '../../constants/apiUrl.constants';

export async function getEditEligibility() {
  let userId = '';
  const userSession = await utils_getAsyncData('userSession');
  if (userSession.value) {
    userId = JSON.parse(userSession.value).id;
  } else {
    return;
  }

  try {
    const response = await fetch(`${apiUrl}/api/update/artist/profile/isEditEligible`, {
      method: 'POST',
      body: JSON.stringify({ artist_id: '9ef44111-5336-4a07-a59d-121628a90acd' }),
      headers: {
        'Content-Type': 'application/json',
        Origin: originHeader,
        'User-Agent': userAgent,
        Authorization: authorization,
      },
    });

    const data = await response.json();
    const res = {
      isOk: response.ok,
      body: data,
    };

    return res;
  } catch (error) {
    return {
      isOk: false,
      body: { message: 'Error checking eligibility' },
    };
  }
}
