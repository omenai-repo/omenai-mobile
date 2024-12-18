import { apiUrl, authorization, originHeader, userAgent } from "constants/apiUrl.constants";

export async function fetchViewHistory(user_id: string) {
  try {
    const res = await fetch(`${apiUrl}/api/viewHistory/getViewHistory`, {
        method: "POST",
        headers: {
          'Origin': originHeader,
          "User-Agent": userAgent,
          "Authorization": authorization
        },
        body: JSON.stringify({ user_id }),
    });

    const result = await res.json();

    return { isOk: res.ok, message: result.message, data: result.data };
  } catch (error: any) {
    console.log(error);
  }
}
