import { apiUrl, originHeader } from "../../constants/apiUrl.constants";

export async function retrieveBalance(account: string) {
  try {
    const res = await fetch(`${apiUrl}/api/stripe/retrieveBalance`, {
      method: "POST",
      headers: {
        'Origin': originHeader,
      },
      body: JSON.stringify({ account }),
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
