import { apiUrl, authorization, originHeader, userAgent } from '../../constants/apiUrl.constants';

export async function getFeaturedGalleries() {
  try {
    const res = await fetch(`${apiUrl}/api/requests/gallery/fetchFeaturedGalleries`, {
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
