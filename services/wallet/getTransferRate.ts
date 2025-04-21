import { apiUrl, authorization, originHeader, userAgent } from 'constants/apiUrl.constants';

export async function getTransferRate(params: {
  source: string;
  destination: string;
  amount: number;
}) {
  try {
    const res = await fetch(
      `${apiUrl}/api/flw/getTransferRate?source=${params.source}&destination=${params.destination}&amount=${params.amount}`,
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

    return { isOk: true, data: result.data };
  } catch (error: any) {
    return {
      isOk: false,
      message: error.response?.data?.message || 'Failed to get rate',
    };
  }
}
