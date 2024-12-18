import { apiUrl, authorization, originHeader, userAgent } from "constants/apiUrl.constants";

export async function updateLogo(payload: { id: string; url: string }) {

  const result = await fetch(`${apiUrl}/api/auth/gallery/logo`, {
    method: "POST",
    body: JSON.stringify({ ...payload }),
    headers: {
      "Content-type": "application/json",
      'Origin': originHeader,
      "User-Agent": userAgent,
      "Authorization": authorization
    },
  }).then(async (res) => {
    const data: { message: string } = await res.json();
    const response = {
      isOk: res.ok,
      body: { message: data.message },
    };

    return response;
  });

  return result;
}
