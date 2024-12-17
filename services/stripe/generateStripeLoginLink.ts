import { apiUrl, originHeader } from "../../constants/apiUrl.constants";

export async function generateStripeLoginLink(account: string) {
  try {
    const res = await fetch(`${apiUrl}/api/stripe/generateStripeLoginLink`, {
      method: "POST",
      headers: {
        'Origin': originHeader,
      },
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
