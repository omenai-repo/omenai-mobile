import { apiUrl } from "../../constants/apiUrl.constants";

export async function createAccountLink(account: string) {
  try {
    const res = await fetch(`${apiUrl}/api/stripe/createAccountLink`, {
      method: "POST",
      body: JSON.stringify({ account }),
    });

    const result = await res.json();

    return {
      isOk: res.ok,
      url: result.url,
    };
  } catch (error: any) {
    console.log(error);
  }
}
