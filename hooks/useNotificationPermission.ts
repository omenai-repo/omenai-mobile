import { useState, useEffect, useCallback } from "react";
import * as Notifications from "expo-notifications";
import { AppState, Linking, AppStateStatus } from "react-native";

export function useNotificationPermission() {
  const [status, setStatus] = useState<Notifications.PermissionStatus | null>(
    null
  );

  const checkPermission = useCallback(async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setStatus(status);
  }, []);

  const requestPermission = useCallback(async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    setStatus(status);
    return status;
  }, []);

  const openSettings = useCallback(() => {
    Linking.openSettings();
  }, []);

  useEffect(() => {
    checkPermission();
    const subscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        if (nextAppState === "active") {
          checkPermission();
        }
      }
    );

    return () => {
      subscription.remove();
    };
  }, [checkPermission]);

  return {
    permissionStatus: status,
    requestPermission,
    openSettings,
    checkPermission,
  };
}
