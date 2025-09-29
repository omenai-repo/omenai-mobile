import { apiUrl, authorization, originHeader, userAgent } from '../../constants/apiUrl.constants';

export async function verifyEmail(
  payload: { params: string; token: string },
  route: RouteIdentifier,
) {
  try {
    const response = await fetch(`${apiUrl}/api/requests/${route}/verifyMail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: originHeader,
        'User-Agent': userAgent,
        Authorization: authorization,
      },
      body: JSON.stringify({ params: payload.params, token: payload.token }),
    });

    const ParsedResponse = {
      isOk: response.ok,
      body: await response.json(),
    };
    return ParsedResponse;
  } catch (error) {
    return {
      isOk: false,
      body: { message: 'Error verifying token, try again later' },
    };
  }
}
