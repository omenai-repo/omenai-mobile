import { Platform } from "react-native";
import { authorization, userAgent } from "../config/api.config";
import { getSecureItem } from "./secureStore";

export const getApiHeaders = async (authenticated: boolean = true) => {
  const headers: any = {
    "Content-Type": "application/json",
    "User-Agent": userAgent,
    "x-access-key": authorization,
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
