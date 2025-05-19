import { apiUrl, authorization, originHeader, userAgent } from 'constants/apiUrl.constants';

export async function verifyGalleryRequest(name: string) {
  try {
    const res = await fetch(`${apiUrl}/api/verification/verifyGallery`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: originHeader,
        'User-Agent': userAgent,
        Authorization: authorization,
      },
      body: JSON.stringify({ name }),
    });

    const result = await res.json();

    return { isOk: res.ok, message: result.message };
  } catch (error: any) {
    console.log(error);
  }
}
