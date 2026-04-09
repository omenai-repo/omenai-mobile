export { getApiHeaders } from "../utils/apiHeaders";

export const apiUrl =
  process.env.EXPO_PUBLIC_ENV === "production"
    ? process.env.EXPO_PUBLIC_API_BASE
    : process.env.EXPO_PUBLIC_API_STAGING_BASE;
