import { apiUrl } from "#constants/apiUrl.constants";
import { utils_getAsyncData } from "#utils/app/utils_asyncStorage";
import { apiRequest } from "#utils/network/apiRequest";

type fetchArtistTransactionsType = {
  wallet_id?: string;
  year?: string;
  limit?: number;
  status?: string;
  page?: number;
};

export async function fetchArtistTransactions({
  wallet_id: walletIdArg,
  year = new Date().getFullYear().toString(),
  limit = 10,
  page = 1,
  status,
}: fetchArtistTransactionsType) {
  let wallet_id = walletIdArg || "";
  if (!wallet_id) {
    const userSession = await utils_getAsyncData("userSession");
    if (userSession.value) {
      wallet_id = JSON.parse(userSession.value).walletId;
    }
  }
  if (wallet_id.length < 1) return;

  try {
    const res = await apiRequest(
      `${apiUrl}/api/wallet/fetch_wallet_transactions?id=${wallet_id}&year=${year}&limit=${limit}&status=${status}&page=${page}`,
      {
        method: "GET",
      },
    );

    const result = await res.json();

    return { isOk: res.ok, message: result.message, data: result.data };
  } catch (error: any) {
    return {
      isOk: false,
      body: {
        message:
          error.message ||
          error?.response?.data?.message ||
          "Error fetching transactions",
      },
    };
  }
}
