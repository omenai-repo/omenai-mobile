import { getApiHeaders } from "./apiHeaders";
import { logout } from "./logout.utils";

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

  console.log(
    `[API] ${fetchOptions.method || "GET"} ${url} - Status: ${response.status}`,
  );

  if (response.status === 403) {
    if (shouldLogout) {
      console.warn(`[API] 403 Forbidden detected at ${url}. Logging out...`);
      await logout();
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || "Forbidden");
    }
  }

  return response;
}
