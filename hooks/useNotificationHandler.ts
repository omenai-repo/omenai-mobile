import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { navigate } from "#navigation/RootNavigation";
import { screenName } from "#constants/screenNames.constants";

type AccessType = "artist" | "gallery" | "collector";

type NotificationDataType = {
  type: "wallet" | "orders" | "subscriptions" | "updates" | "engagement";
  access_type: AccessType;
  metadata: any;
  userId: string;
};

export function useNotificationHandler() {
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content
          .data as NotificationDataType;
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
            if (access_type === "artist")
              navigate(root, { screen: "WalletScreen" });
            else if (access_type === "gallery")
              navigate(root, { screen: "Payouts" });
            break;
          case "orders":
            navigate(root, { screen: "Orders" });
            break;
          case "subscriptions":
            if (access_type === "gallery")
              navigate(root, { screen: "SubscriptionScreen" });
            break;
          case "updates":
            navigate(root, { screen: "NotificationScreen" });
            break;
          case "engagement": {
            const { engagement_event_type, art_id, event_id } =
              data.metadata || {};
            if (engagement_event_type === "EVENT_CREATED") {
              if (event_id) {
                navigate(screenName.individual.fairEventDetails, {
                  eventId: event_id,
                });
              } else {
                navigate(root);
              }
            } else {
              if (art_id) {
                navigate(screenName.artwork, { art_id });
              } else {
                navigate(root);
              }
            }
            break;
          }
          default:
            navigate(root);
        }
      },
    );

    return () => subscription.remove();
  }, []);
}
