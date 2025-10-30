import { apiUrl, authorization, originHeader, userAgent } from '../../constants/apiUrl.constants';

export async function verifyAddress(payload: {
  type: string;
  countyName: string;
  cityName: string;
  postalCode: string;
  countryCode: string;
}) {
  try {
    const response = await fetch(`${apiUrl}/api/shipment/address_validation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: originHeader,
        'User-Agent': userAgent,
        Authorization: authorization,
      },
      body: JSON.stringify(payload),
    });

    const ParsedResponse = {
      isOk: response.ok,
      body: await response.json(),
    };

    return ParsedResponse;
  } catch (error) {
    return {
      isOk: false,
      body: { message: 'Error verify address' },
    };
  }
}
