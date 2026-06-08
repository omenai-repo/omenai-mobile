import { getApiHeaders } from "./apiHeaders";
import { logout } from "./logout.utils";
import { useAppStore } from "../store/app/appStore";

/** Thrown on 403 when JSON body is present; mirrors Axios so `error?.response?.data?.message` works. */
class ApiForbiddenError extends Error {
  readonly response: { data: unknown };

  constructor(errorData: unknown) {
    super(messageFrom403Body(errorData));
    this.name = "ApiForbiddenError";
    this.response = { data: errorData };
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

function messageFrom403Body(data: unknown): string {
  if (typeof data === "string") return data;
  if (data && typeof data === "object" && "message" in data) {
    const msg = (data as Record<string, unknown>).message;
    if (typeof msg === "string") return msg;
  }
  return "Forbidden";
}

type RequestOptions = RequestInit & {
  auth?: boolean;
  shouldLogout?: boolean;
};

export async function apiRequest(url: string, options: RequestOptions = {}) {
  const { auth = true, shouldLogout = true, ...fetchOptions } = options;
  const headers = await getApiHeaders(auth);

  const response = await fetch(url, {
    ...fetchOptions,
    headers: {
      ...headers,
      ...fetchOptions.headers,
    },
  });

  // console.log(
  //   `[API] ${fetchOptions.method || "GET"} ${url} - Status: ${response.status}`,
  // );

  if (response.status === 403) {
    const { isLoggedIn } = useAppStore.getState();
    if (shouldLogout && auth && isLoggedIn) {
      console.warn(`[API] 403 Forbidden detected at ${url}. Logging out...`);
      await logout();
    } else {
      const errorData = await response.json();
      throw new ApiForbiddenError(errorData);
    }
  }

  return response;
}
