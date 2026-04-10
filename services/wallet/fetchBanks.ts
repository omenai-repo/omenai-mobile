import { apiUrl } from "#constants/apiUrl.constants";
import { utils_getAsyncData } from "#utils/utils_asyncStorage";
import { apiRequest } from "../../utils/apiRequest";

export async function fetchBanks(countryCodeArg?: string) {
  let countryCode = countryCodeArg || "";
  if (!countryCode) {
    const userSession = await utils_getAsyncData("userSession");
    if (userSession.value) {
      countryCode = JSON.parse(userSession.value).address.countryCode;
    }
  }
  if (countryCode.length < 1) return;

  try {
    const res = await apiRequest(
      `${apiUrl}/api/wallet/accounts/get_banks?countryCode=${countryCode}`,
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
