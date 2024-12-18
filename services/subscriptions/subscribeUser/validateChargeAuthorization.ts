import { apiUrl, authorization, originHeader, userAgent } from "constants/apiUrl.constants";

export async function validateChargeAuthorization(
  data: FLWDirectChargeDataTypes & {
    authorization: PinAuthorizationData | AvsAuthorizationData;
  }
) {
  try {
    const res = await fetch(
      `${apiUrl}/api/subscriptions/subscribeUser/validateChargeAuthorization`,
      {
        method: "POST",
        headers: {
          'Origin': originHeader,
          "User-Agent": userAgent,
          "Authorization": authorization
        },
        body: JSON.stringify({ ...data }),
      }
    );

    const result = await res.json();
    return { isOk: res.ok, message: result.message, data: result.data };
  } catch (error: any) {
    console.log(error);
  }
}
