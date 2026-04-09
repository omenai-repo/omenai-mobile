import { Platform } from "react-native";
import { getSecureItem } from "./secureStore";

export const getApiHeaders = async (authenticated: boolean = true) => {
  const headers: any = {
    "Content-Type": "application/json",
    "User-Agent": process.env.EXPO_PUBLIC_API_USER_AGENT!,
    "x-access-key": process.env.EXPO_PUBLIC_API_AUTHORIZATION!,
    "x-omenai-client": Platform.OS === "ios" ? "ios" : "android",
  };

  if (authenticated) {
    const token = await getSecureItem("session_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return headers;
};
