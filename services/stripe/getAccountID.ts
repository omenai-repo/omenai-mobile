import { apiUrl, authorization, originHeader, userAgent } from "../../constants/apiUrl.constants";

export async function getAccountID(galleryId: string) {
  try {
    const res = await fetch(`${apiUrl}/api/stripe/getAccountId`, {
      method: "POST",
      headers: {
        Origin: originHeader,
        "User-Agent": userAgent,
        Authorization: authorization,
      },
      body: JSON.stringify({ gallery_id: galleryId }),
    });

    const result = await res.json();

    return {
      isOk: res.ok,
      data: result.data,
    };
  } catch (error: any) {
    console.log(error);
  }
}
