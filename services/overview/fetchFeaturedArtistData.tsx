import { apiUrl, authorization, originHeader, userAgent } from '../../constants/apiUrl.constants';

export async function getFeaturedArtistData({
  artist_id,
  page = 1,
}: {
  artist_id: string;
  page?: number;
}) {
  try {
    const res = await fetch(
      `${apiUrl}/api/requests/artist/fetchFeaturedArtistData?id=${artist_id}&page=${page}`,
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

    return { isOk: res.ok, message: result.message, data: result };
  } catch (error: any) {
    console.log(error);
  }
}
