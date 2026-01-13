import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export async function registerForPushToken(): Promise<string | null> {
  try {
    if (!Device.isDevice) {
      return null;
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      return null;
    }

    // Get the project ID from the config
    const projectId = Constants.expoConfig?.extra?.eas?.projectId;

    console.log("Debug: Project ID found:", projectId);

    if (!projectId) {
      console.log("Debug: No Project ID found, cannot generate EAS token");
      // If we can't find the project ID, we can't generate a valid token for EAS build
      return null;
    }

    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId,
    });
    const token = tokenData.data;
    console.log("Debug: Token generated:", token);

    // Create Android notification channel if available
    if (Platform.OS === "android") {
      try {
        if (typeof Notifications.setNotificationChannelAsync === "function") {
          await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance?.MAX ?? 5,
          });
        }
      } catch {
        // Silently fail - not critical
      }
    }

    return token;
  } catch {
    return null;
  }
}
