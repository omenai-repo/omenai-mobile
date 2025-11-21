import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export async function registerForPushToken(): Promise<string | null> {
  try {
    if (!Device.isDevice) {
      alert("Push notifications require a physical device");
      return null;
    }

    console.log("[registerForPushToken] Requesting notification permissions...");
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return null;
    }

    console.log("[registerForPushToken] Permissions granted, getting Expo push token...");
    const tokenData = await Notifications.getExpoPushTokenAsync();
    const token = tokenData.data;
    console.log("Expo Push Token:", token);
    alert("Expo Push Token: " + token);

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
      });
    }

    return token;
  } catch (error) {
    console.error("[registerForPushToken] Error:", error);
    return null;
  }
}
