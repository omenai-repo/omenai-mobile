import { apiUrl, authorization, originHeader, userAgent } from '../../constants/apiUrl.constants';

export async function resendVerifyCode(route: RouteIdentifier, id: string) {
  try {
    const res = await fetch(`${apiUrl}/api/requests/${route}/verify/resend`, {
      method: 'POST',
      body: JSON.stringify({ author: id }),
      headers: {
        'Content-Type': 'application/json',
        Origin: originHeader,
        'User-Agent': userAgent,
        Authorization: authorization,
      },
    });
    console.log(await res.json(), 'response');
    const data: { message: string } = await res.json();
    const response = {
      isOk: res.ok,
      body: { message: data.message },
    };

    return response;
  } catch (error) {
    return {
      isOk: false,
      body: { message: 'Error sending code, try again later' },
    };
  }
}
