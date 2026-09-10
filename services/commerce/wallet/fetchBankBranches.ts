import { apiUrl } from "#constants/apiUrl.constants";
import { apiRequest } from "#utils/network/apiRequest";

export async function fetchBankBranches(bankCode: string) {
  try {
    const res = await apiRequest(
      `${apiUrl}/api/wallet/accounts/get_bank_branches?bankCode=${bankCode}`,
      {
        method: "GET",
      },
    );

    const result = await res.json();

    return { isOk: res.ok, data: result.bank_branches };
  } catch (error: any) {
    return {
      isOk: false,
      body: {
        message:
          error.message ||
          error?.response?.data?.message ||
          "Error fetching bank branches",
      },
    };
  }
}
