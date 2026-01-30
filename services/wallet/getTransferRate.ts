import { apiUrl } from "#constants/apiUrl.constants";
import { apiRequest } from "../../utils/apiRequest";

export async function getTransferRate(params: {
  source: string;
  destination: string;
  amount: number;
}) {
  try {
    const res = await apiRequest(
      `${apiUrl}/api/flw/getTransferRate?source=${params.source}&destination=${params.destination}&amount=${params.amount}`,
      {
        method: "GET",
      },
    );

    const result = await res.json();

    return { isOk: res.ok, data: result.data };
  } catch (error: any) {
    return {
      isOk: false,
      message: error.response?.data?.message || "Failed to get rate",
    };
  }
}
