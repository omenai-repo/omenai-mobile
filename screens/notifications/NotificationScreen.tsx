import {
  View,
  Text,
  Pressable,
  SectionList,
  RefreshControl,
  ScrollView,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import tw from "twrnc";
import BackHeaderTitle from "#components/header/BackHeaderTitle";
import { useAppStore } from "#store/app/appStore";
import { getNotificationHistory } from "#services/notification/getNotificationHistory";
import { updateNotification } from "#services/notification/updateNotification";
import SkeletonLoaderContainer from "./SkeletonLoaderContainer";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";

dayjs.extend(isToday);
dayjs.extend(isYesterday);

import { navigate } from "#navigation/RootNavigation";
import { screenName } from "#constants/screenNames.constants";
import { colors } from "#config/colors.config";

/** Match your push payload contract */
type AccessType = "artist" | "gallery" | "collector";

type NotificationDataType = {
  type: "wallet" | "orders" | "subscriptions" | "updates" | "engagement";
  access_type: AccessType;
  metadata: any; // e.g. { orderId, date, ... }
  userId: string;
};

type Notification = {
  id: string;
  title: string;
  body: string;
  sentAt: string;
  type: string; // keep if API returns this
  read: boolean;
  readAt?: string;
  data?: NotificationDataType; // ⬅️ add data to align with push payload
};

type Props = {
  item: Notification;
  onPress: () => void;
};

const getIconConfig = (type?: string) => {
  switch (type) {
    case "wallet":
      return {
        name: "wallet-outline" as const,
        color: "#10B981",
        bg: "bg-[#E6F4EA]",
      };
    case "orders":
      return {
        name: "cart-outline" as const,
        color: "#F59E0B",
        bg: "bg-[#FEF3C7]",
      };
    case "subscriptions":
      return {
        name: "ribbon-outline" as const,
        color: "#8B5CF6",
        bg: "bg-[#F3E8FF]",
      };
    case "updates":
    case "engagement":
    default:
      return {
        name: "notifications-outline" as const,
        color: "#0EA5E9",
        bg: "bg-[#E0F2FE]",
      };
  }
};

const AnimatedNotificationItem = ({ item, onPress }: Props) => {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, {
      duration: 150,
      easing: Easing.out(Easing.ease),
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const isUnread = !item.read;
  const iconConfig = getIconConfig(item.data?.type || item.type);

  return (
    <Animated.View style={[animatedStyle]}>
      <Pressable
        onPress={onPress}
        style={tw.style(
          `flex-row items-start py-4 px-[20px] border-b border-[#F2F2F7]`,
          isUnread ? `bg-[#F5FAFF]` : `bg-white`,
        )}
      >
        {/* Rounded-full icon container */}
        <View
          style={tw`w-11 h-11 rounded-full ${iconConfig.bg} items-center justify-center mr-3.5`}
        >
          <Ionicons name={iconConfig.name} size={18} color={iconConfig.color} />
        </View>

        <View style={tw`flex-1`}>
          <View style={tw`flex-row justify-between items-baseline gap-5 mb-1`}>
            <View style={tw`flex-row items-center flex-1 mr-2`}>
              <Text
                numberOfLines={1}
                style={tw.style(
                  `text-base text-slate-900`,
                  isUnread ? `font-sans-medium` : `font-sans-regular`,
                )}
              >
                {item.title}
              </Text>
            </View>
            <Text style={tw`text-sm text-gray-500 font-sans-regular`}>
              {dayjs(item.sentAt).format("h:mm a")}
            </Text>
          </View>

          <Text
            numberOfLines={2}
            style={tw`text-sm text-gray-500 font-sans-regular`}
          >
            {item.body}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const ROOT_BY_ACCESS: Record<AccessType, string> = {
  artist: "Artist",
  gallery: "Gallery",
  collector: "Individual",
};

/** Centralized router — mirrors Expo notification response logic */
function routeFromNotification(data?: NotificationDataType) {
  if (!data?.type || !data?.access_type) return;

  const { type, access_type } = data;
  const root = ROOT_BY_ACCESS[access_type] || "Individual";

  if (type === "engagement") {
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
    return;
  }

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
    } else {
      navigate("Individual", { screen: "NotificationScreen" });
    }
  } else if (access_type === "artist") {
    navigate("Artist");
  } else if (access_type === "gallery") {
    navigate("Gallery");
  } else {
    navigate("Individual");
  }
}

type FilterType = "All" | "Reminders" | "Payments" | "Orders";

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");
  const { userType } = useAppStore();

  const fetchNotifications = async () => {
    try {
      const response = await getNotificationHistory({
        access_type: userType === "user" ? "collector" : userType,
      });

      const rawData = response?.data ?? [];
      // Sort newest to oldest
      const sortedData = [...rawData].sort(
        (a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime(),
      );
      setNotifications(sortedData);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchNotifications();
  }, []);

  const handlePress = async (item: Notification) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === item.id
          ? { ...n, read: true, readAt: new Date().toISOString() }
          : n,
      ),
    );

    routeFromNotification(item.data);

    try {
      await updateNotification({
        read: true,
        readAt: new Date(),
        access_type: userType === "user" ? "collector" : userType,
        notification_id: item.id,
      });
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  // Grouping function
  const getGroupedSections = () => {
    // Filter active type
    const filtered = notifications.filter((item) => {
      if (activeFilter === "All") return true;
      const type = item.data?.type || item.type;
      if (activeFilter === "Reminders")
        return type === "engagement" || type === "updates";
      if (activeFilter === "Payments")
        return type === "wallet" || type === "subscriptions";
      if (activeFilter === "Orders") return type === "orders";
      return true;
    });

    const todayList: Notification[] = [];
    const yesterdayList: Notification[] = [];
    const earlierList: Notification[] = [];

    filtered.forEach((item) => {
      const date = dayjs(item.sentAt);
      if (date.isToday()) {
        todayList.push(item);
      } else if (date.isYesterday()) {
        yesterdayList.push(item);
      } else {
        earlierList.push(item);
      }
    });

    const sections = [];
    if (todayList.length > 0)
      sections.push({ title: "Today", data: todayList });
    if (yesterdayList.length > 0)
      sections.push({ title: "Yesterday", data: yesterdayList });
    if (earlierList.length > 0)
      sections.push({ title: "Earlier", data: earlierList });

    return sections;
  };

  const renderEmptyComponent = () => {
    if (loading) return null;

    return (
      <View
        style={tw`flex-1 justify-center items-center mt-[100px] px-[100px]`}
      >
        <Ionicons
          name="notifications-outline"
          style={tw`mb-4`}
          size={60}
          color={tw.color("slate-900")}
        />
        <Text
          style={tw`text-center text-slate-900 font-sans-medium text-xl mb-2`}
        >
          No Notifications
        </Text>
        <Text style={tw`text-center text-gray-500 font-sans-regular text-sm`}>
          You don’t have any notifications right now. We’ll keep you posted!
        </Text>
      </View>
    );
  };

  const filters: FilterType[] = ["All", "Reminders", "Payments", "Orders"];
  const groupedSections = getGroupedSections();

  return (
    <View style={tw`flex-1 bg-white`}>
      <BackHeaderTitle title="Notifications" />

      {/* Horizontal filter pills */}
      <View style={tw`border-b border-[#F2F2F7] pb-3`}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={tw`px-5 gap-2.5`}
        >
          {filters.map((filter) => {
            const isSelected = activeFilter === filter;
            return (
              <Pressable
                key={filter}
                onPress={() => setActiveFilter(filter)}
                style={tw.style(
                  `px-5 py-2 rounded-sm border`,
                  isSelected
                    ? `bg-[${colors.black}] border-[${colors.black}]`
                    : `bg-transparent border-gray-100`,
                )}
              >
                <Text
                  style={tw.style(
                    `text-sm font-sans-regular`,
                    isSelected ? `text-white` : `text-[#636366]`,
                  )}
                >
                  {filter}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {loading ? (
        <SkeletonLoaderContainer count={8} />
      ) : (
        <SectionList
          sections={groupedSections}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <AnimatedNotificationItem
              item={item}
              onPress={() => handlePress(item)}
            />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <View style={tw`bg-white px-5 pt-5 pb-1`}>
              <Text style={tw`text-lg font-sans-regular text-slate-700`}>
                {title}
              </Text>
            </View>
          )}
          ListEmptyComponent={renderEmptyComponent}
          contentContainerStyle={tw`pb-10`}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#007AFF"
            />
          }
        />
      )}
    </View>
  );
};

export default NotificationScreen;
