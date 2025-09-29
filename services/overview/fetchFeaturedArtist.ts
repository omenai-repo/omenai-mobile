import { apiUrl, authorization, originHeader, userAgent } from '../../constants/apiUrl.constants';

export async function getFeaturedArtists() {
  try {
    const res = await fetch(`${apiUrl}/api/requests/artist/fetchTrendingArtists`, {
      method: 'GET',
      headers: {
        Origin: originHeader,
        'User-Agent': userAgent,
        Authorization: authorization,
      },
    });

    const result = await res.json();

    return { isOk: res.ok, message: result.message, data: result.data };
  } catch (error: any) {
    console.log(error);
  }
}
