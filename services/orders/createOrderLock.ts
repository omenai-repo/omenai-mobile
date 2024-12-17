import { apiUrl, originHeader } from "../../constants/apiUrl.constants";

export const createOrderLock = async (art_id: string, user_id: string) => {
  try {
    const res = await fetch(`${apiUrl}/api/locks/createLock`, {
      method: "POST",
      headers: {
        'Origin': originHeader,
      },
      body: JSON.stringify({
        art_id,
        user_id,
      }),
    });
    const result = await res.json();
    return { isOk: res.ok, message: result.message, data: result.data };
  } catch (error: any) {
    console.log(error);
  }
};
