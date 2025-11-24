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

      if (type === "wallet") {
        if (access_type === "artist") {
          navigate("Artist", { screen: "WalletScreen" });
        } else if (access_type === "gallery") {
          navigate("Gallery", { screen: "Payouts" });
        }
      } else if (type === "orders") {
        if (access_type === "gallery") {
          navigate("Gallery", { screen: "Orders" });
        } else if (access_type === "artist") {
          navigate("Artist", { screen: "Orders" });
        } else {
          navigate("Individual", { screen: "Orders" });
        }
      } else if (type === "subscriptions") {
        if (access_type === "gallery") {
          navigate("Gallery", { screen: "SubscriptionScreen" });
        }
      } else if (type === "updates") {
        if (access_type === "artist") {
          navigate("Artist", { screen: "NotificationScreen" });
        } else if (access_type === "gallery") {
          navigate("Gallery", { screen: "NotificationScreen" });
        } else if (access_type === "collector") {
          navigate("Individual", { screen: "NotificationScreen" });
        }
      } else {
        if (access_type === "artist") {
          navigate("Artist");
        } else if (access_type === "gallery") {
          navigate("Gallery");
        } else if (access_type === "collector") {
          navigate("Individual");
        }
      }
    });

    return () => subscription.remove();
  }, []);
}
