import { apiUrl } from "#constants/apiUrl.constants";
import { utils_getAsyncData } from "#utils/utils_asyncStorage";
import { apiRequest } from "../../utils/apiRequest";

export async function fetchArtistWalletData(artistId: string = "") {
  let finalArtistId = artistId;
  if (!finalArtistId) {
    const userSession = await utils_getAsyncData("userSession");
    if (userSession.value) {
      finalArtistId = JSON.parse(userSession.value).id;
    }
  }
  if (finalArtistId.length < 1) return;

  try {
    const res = await apiRequest(
      `${apiUrl}/api/wallet/fetch_wallet?id=${finalArtistId}`,
      {
        method: "GET",
      },
    );

    const result = await res.json();

    return { isOk: res.ok, message: result.message, data: result.wallet };
  } catch (error: any) {
    return {
      isOk: false,
      body: {
        message:
          error.message ||
          error?.response?.data?.message ||
          "Error fetching wallet data",
      },
    };
  }
}
