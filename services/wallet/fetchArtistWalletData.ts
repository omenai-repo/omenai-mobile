import { apiUrl } from "#constants/apiUrl.constants";
import { utils_getAsyncData } from "#utils/utils_asyncStorage";
import { apiRequest } from "../../utils/apiRequest";

export async function fetchArtistWalletData() {
  let artist_id = "";
  const userSession = await utils_getAsyncData("userSession");
  if (userSession.value) {
    artist_id = JSON.parse(userSession.value).id;
  }
  if (artist_id.length < 1) return;

  try {
    const res = await apiRequest(
      `${apiUrl}/api/wallet/fetch_wallet?id=${artist_id}`,
      {
        method: "GET",
      },
    );

    const result = await res.json();

    return { isOk: res.ok, message: result.message, data: result.wallet };
  } catch (error: any) {
    console.log(error);
  }
}
