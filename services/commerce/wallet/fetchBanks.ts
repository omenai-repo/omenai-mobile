import { apiUrl } from "#constants/apiUrl.constants";
import { utils_getAsyncData } from "#utils/app/utils_asyncStorage";
import { apiRequest } from "#utils/network/apiRequest";

export async function fetchBanks(countryCode: string = "") {
  let finalCountryCode = countryCode;
  if (!finalCountryCode) {
    const userSession = await utils_getAsyncData("userSession");
    if (userSession.value) {
      finalCountryCode = JSON.parse(userSession.value).address.countryCode;
    }
  }
  if (finalCountryCode.length < 1) return;

  try {
    const res = await apiRequest(
      `${apiUrl}/api/wallet/accounts/get_banks?countryCode=${finalCountryCode}`,
      {
        method: "GET",
      },
    );

    const result = await res.json();

    return { isOk: res.ok, data: result };
  } catch (error: any) {
    return {
      isOk: false,
      body: {
        message:
          error.message ||
          error?.response?.data?.message ||
          "Error fetching banks",
      },
    };
  }
}
