import { apiUrl, authorization, originHeader, userAgent } from '../../constants/apiUrl.constants';

export async function extendArtworkExclusivity(art_id: string) {
  try {
    const response = await fetch(apiUrl + '/api/artworks/extendArtworkExclusivity', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Origin: originHeader,
        'User-Agent': userAgent,
        Authorization: authorization,
      },
      body: JSON.stringify({ art_id }),
    });

    const result = await response.json();

    return {
      isOk: response.ok,
      message: result.message,
      data: result.data,
    };
  } catch (error) {
    return {
      isOk: false,
      message: 'An error was encountered, please try again later or contact support',
    };
  }
}
