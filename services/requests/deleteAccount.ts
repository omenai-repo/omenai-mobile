import { Commitment, RouteIdentifier } from "#types/types";
import { apiUrl } from "../../constants/apiUrl.constants";
import { apiRequest } from "../../utils/apiRequest";

export type DeleteAccountResponse = {
  status: number;
  isOk?: boolean;
  message?: string;
  commitments?: { commitments?: Commitment[] } | Commitment[];
};

export async function deleteAccount(
  route: RouteIdentifier,
  session_id: string,
  reason: string,
): Promise<DeleteAccountResponse> {
  try {
    const url = `${apiUrl}/api/requests/${route}/deleteAccount`;
    const res = await apiRequest(url, {
      method: "DELETE",
      body: JSON.stringify({ id: session_id, reason }),
    });
    const result = await res.json();
    return {
      isOk: res.ok,
      message: result.message || "An error occurred",
      commitments: result.commitments,
      status: res.status,
    };
  } catch (error: any) {
    return {
      isOk: false,
      body: {
        message:
          error.message ||
          error?.response?.data?.message ||
          "An error was encountered, please try again later or contact support",
      },
      status: 500,
    };
  }
}
