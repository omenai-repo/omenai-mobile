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

const ROOT_BY_ACCESS: Record<AccessType, string> = {
  artist: "Artist",
  gallery: "Gallery",
  collector: "Individual",
};

function handleEngagementNotification(
  data: NotificationDataType,
  root: string,
) {
  const { engagement_event_type, art_id, event_id } = data.metadata || {};
  if (engagement_event_type === "EVENT_CREATED") {
    if (event_id) {
      navigate(screenName.individual.fairEventDetails, { eventId: event_id });
    } else {
      navigate(root);
    }
  } else if (art_id) {
    navigate(screenName.artwork, { art_id });
  } else {
    navigate(root);
  }
}

function handleNotification(data: NotificationDataType) {
  const root = ROOT_BY_ACCESS[data.access_type];
  if (!root) return;

  switch (data.type) {
    case "wallet":
      if (data.access_type === "artist") {
        navigate(root, { screen: "WalletScreen" });
      } else if (data.access_type === "gallery") {
        navigate(root, { screen: "Payouts" });
      }
      break;
    case "orders":
      navigate(root, { screen: "Orders" });
      break;
    case "subscriptions":
      if (data.access_type === "gallery") {
        navigate(root, { screen: "SubscriptionScreen" });
      }
      break;
    case "updates":
      navigate(root, { screen: "NotificationScreen" });
      break;
    case "engagement":
      handleEngagementNotification(data, root);
      break;
    default:
      navigate(root);
  }
}

export function useNotificationHandler() {
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content
          .data as NotificationDataType;
        if (data?.type && data?.access_type) {
          handleNotification(data);
        }
      },
    );

    return () => subscription.remove();
  }, []);
}
