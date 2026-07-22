import { apiUrl } from "#constants/apiUrl.constants";
import { apiRequest } from "#utils/apiRequest";

export type FetchFollowsResult = {
  isOk: boolean;
  message?: string;
  followedIds?: string[];
};

export async function fetchFollows(sessionId: string): Promise<FetchFollowsResult> {
  try {
    const res = await apiRequest(
      `${apiUrl}/api/engagements/fetchFollows?id=${encodeURIComponent(sessionId)}`,
      { method: "GET" },
    );
    const result = (await res.json()) as {
      message?: string;
      followedIds?: string[];
    };
    return {
      isOk: res.ok,
      message: result?.message,
      followedIds: Array.isArray(result?.followedIds) ? result.followedIds : [],
    };
  } catch {
    return {
      isOk: false,
      followedIds: [],
    };
  }
}
