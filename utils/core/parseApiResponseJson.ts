export type ApiJsonBody = {
  data?: unknown;
  message?: string;
  [key: string]: unknown;
};

const EMPTY_MESSAGE = "Empty response from server. Please try again.";
const INVALID_MESSAGE = "Invalid response from server. Please try again.";

export async function parseApiResponseJson(
  response: Response,
): Promise<ApiJsonBody> {
  const text = await response.text();
  if (!text?.trim()) {
    return { message: EMPTY_MESSAGE };
  }
  try {
    return JSON.parse(text) as ApiJsonBody;
  } catch {
    return { message: INVALID_MESSAGE };
  }
}
