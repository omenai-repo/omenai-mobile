import { apiUrl, authorization, originHeader, userAgent } from 'constants/apiUrl.constants';

export async function createTransfer(payload: {
  amount: number;
  url: string;
  wallet_id: string;
  wallet_pin: string;
}) {
  try {
    const res = await fetch(`${apiUrl}/api/flw/createTransfer`, {
      method: 'POST',
      headers: {
        Origin: originHeader,
        'User-Agent': userAgent,
        Authorization: authorization,
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    return { isOk: res.ok, data: result };
  } catch (error: any) {
    return {
      isOk: false,
      message: error.response?.data?.message || 'Transfer failed',
    };
  }
}
