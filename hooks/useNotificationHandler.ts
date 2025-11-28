import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { navigate } from "navigation/RootNavigation";

type AccessType = "artist" | "gallery" | "collector";

type NotificationDataType = {
  type: "wallet" | "orders" | "subscriptions" | "updates";
  access_type: AccessType;
  metadata: any;
  userId: string;
};

export function useNotificationHandler() {
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data as NotificationDataType;
      if (!data?.type || !data.access_type) return;

      const { type, access_type } = data;

      const ROOT_BY_ACCESS: Record<AccessType, string> = {
        artist: "Artist",
        gallery: "Gallery",
        collector: "Individual",
      };

      const root = ROOT_BY_ACCESS[access_type];

      switch (type) {
        case "wallet":
          if (access_type === "artist") navigate(root, { screen: "WalletScreen" });
          else if (access_type === "gallery") navigate(root, { screen: "Payouts" });
          break;
        case "orders":
          navigate(root, { screen: "Orders" });
          break;
        case "subscriptions":
          if (access_type === "gallery") navigate(root, { screen: "SubscriptionScreen" });
          break;
        case "updates":
          navigate(root, { screen: "NotificationScreen" });
          break;
        default:
          navigate(root);
      }
    });

    return () => subscription.remove();
  }, []);
}
