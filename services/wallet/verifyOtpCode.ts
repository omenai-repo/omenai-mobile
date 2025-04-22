import { apiUrl, authorization, originHeader, userAgent } from 'constants/apiUrl.constants';
import { utils_getAsyncData } from 'utils/utils_asyncStorage';

export async function verifyOtpCode(otp_pin: string) {
  let id = '';
  const userSession = await utils_getAsyncData('userSession');
  if (userSession.value) {
    id = JSON.parse(userSession.value).id;
  }
  if (id.length < 1) return;

  try {
    const res = await fetch(`${apiUrl}/api/wallet/pin_recovery/verify_otp_code`, {
      method: 'POST',
      headers: {
        Origin: originHeader,
        'User-Agent': userAgent,
        Authorization: authorization,
      },
      body: JSON.stringify({ artist_id: id, otp: otp_pin }),
    });

    const result = await res.json();

    return { isOk: res.ok, data: result };
  } catch (error: any) {
    return {
      isOk: false,
      message: error.response?.data?.message || 'Invalid OTP',
    };
  }
}
