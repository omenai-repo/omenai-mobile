import React, { useMemo, useState } from "react";
import {
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";
import { useQuery } from "@tanstack/react-query";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { colors } from "#config/colors.config";
import { getPromotionalFileView } from "#lib/storage/getPromotionalsFileView";
import { EVENTS_QK } from "#utils/queryKeys";
import {
  GalleryEventRecord,
  fetchGalleryProgramming,
  getEventStatus,
} from "#services/events/events.service";
import { screenName } from "#constants/screenNames.constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppStore } from "#store/app/appStore";
import { retrieveSubscriptionData } from "#services/subscriptions/retrieveSubscriptionData";
import Loader from "#components/general/Loader";

type ProgrammingTab = "active" | "past";

const formatDateRange = (startDate?: string, endDate?: string) => {
  if (!startDate || !endDate) return "Date unavailable";
  const start = new Date(startDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const end = new Date(endDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return `${start} - ${end}`;
};

const resolvePromotionalImage = (image?: string, width = 900) => {
  if (!image) return "";
  if (/^https?:\/\//i.test(image)) return image;
  return getPromotionalFileView(image, width);
};

function ProgrammingTabs({
  activeTab,
  onChange,
}: Readonly<{
  activeTab: ProgrammingTab;
  onChange: (tab: ProgrammingTab) => void;
}>) {
  return (
    <View style={tw`flex-row border-b border-neutral-200 mb-6`}>
      <TouchableOpacity
        onPress={() => onChange("active")}
        activeOpacity={0.75}
        style={tw`pb-3 pr-8 relative`}
      >
        <Text
          style={[
            tw`text-sm`,
            activeTab === "active"
              ? tw`text-neutral-900 font-medium`
              : tw`text-neutral-400`,
          ]}
        >
          Upcoming & Active
        </Text>
        {activeTab === "active" ? (
          <View
            style={[
              tw`absolute -bottom-[1px] left-0 right-0 h-[2px]`,
              { backgroundColor: colors.black },
            ]}
          />
        ) : null}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onChange("past")}
        activeOpacity={0.75}
        style={tw`pb-3 pr-2 relative`}
      >
        <Text
          style={[
            tw`text-sm`,
            activeTab === "past"
              ? tw`text-neutral-900 font-medium`
              : tw`text-neutral-400`,
          ]}
        >
          Past Archives
        </Text>
        {activeTab === "past" ? (
          <View
            style={[
              tw`absolute -bottom-[1px] left-0 right-0 h-[2px]`,
              { backgroundColor: colors.black },
            ]}
          />
        ) : null}
      </TouchableOpacity>
    </View>
  );
}

export default function ShowsFairsEvents() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const insets = useSafeAreaInsets();
  const { userSession } = useAppStore();
  const galleryId = (userSession?.id as string) || "";

  const [programmingTab, setProgrammingTab] = useState<ProgrammingTab>("active");

  const programmingQuery = useQuery({
    queryKey: EVENTS_QK.galleryProgramming(galleryId),
    queryFn: async () => {
      const res = await fetchGalleryProgramming(galleryId);
      if (!res.isOk) {
        throw new Error(res.message || "Failed to load programming");
      }
      return { active: res.activeEvents, past: res.pastEvents };
    },
    enabled: !!galleryId,
    staleTime: 0,
    refetchOnMount: "always",
  });

  const subscriptionQuery = useQuery({
    queryKey: ["subscription_precheck", galleryId, "create_event_gate"],
    queryFn: async () => {
      const res = await retrieveSubscriptionData(galleryId);
      if (!res?.isOk) {
        throw new Error(res?.message || "Failed to load subscription details");
      }
      return res;
    },
    enabled: !!galleryId,
    staleTime: 5 * 60 * 1000,
  });

  const currentList = useMemo(() => {
    if (!programmingQuery.data) return [];
    return programmingTab === "active"
      ? programmingQuery.data.active
      : programmingQuery.data.past;
  }, [programmingQuery.data, programmingTab]);

  const refreshing =
    programmingQuery.isFetched && programmingQuery.fetchStatus === "fetching";

  const onRefresh = async () => {
    await programmingQuery.refetch();
  };

  const isLoadingInitial = programmingQuery.isLoading;
  const isCheckingCreateEventAccess = subscriptionQuery.isLoading;
  const currentPlan = String(
    subscriptionQuery.data?.data?.plan_details?.type || subscriptionQuery.data?.plan || "",
  )
    .trim()
    .toLowerCase();
  const hasPrincipalPlan = currentPlan === "principal";

  const handleCreateEvent = () => {
    if (isCheckingCreateEventAccess) return;
    if (!hasPrincipalPlan) {
      navigation.navigate(screenName.gallery.createGalleryEvent, {
        accessRestricted: true,
      });
      return;
    }

    navigation.navigate(screenName.gallery.createGalleryEvent);
  };

  const renderRow = (item: GalleryEventRecord) => {
    const status = getEventStatus(item.start_date, item.end_date);
    return (
      <TouchableOpacity
        key={item.event_id}
        style={tw`w-[48%] bg-white rounded-sm border border-neutral-200 mb-4 overflow-hidden`}
        activeOpacity={0.85}
        onPress={() =>
          navigation.push(screenName.gallery.showsFairsEventDetails, {
            eventId: item.event_id,
            source: "event",
          })
        }
      >
        <Image
          source={{
            uri: resolvePromotionalImage(item.cover_image, 900),
          }}
          style={tw`h-30 w-full bg-neutral-200`}
          resizeMode="cover"
        />
        <View style={tw`absolute top-2 right-2 bg-white px-1.5 py-1 rounded-xs`}>
          <Text style={tw`text-[8px] uppercase tracking-widest text-neutral-600`}>
            {status}
          </Text>
        </View>
        <View style={tw`p-3`}>
          <Text style={tw`text-xs uppercase tracking-widest text-neutral-500`}>
            {item.gallery?.name || "Gallery"}
          </Text>
          <Text numberOfLines={2} style={tw`font-serif text-sm text-neutral-900 mt-1`}>
            {item.title}
          </Text>
          <Text numberOfLines={1} style={tw`text-xs text-neutral-500 mt-1`}>
            {formatDateRange(item.start_date, item.end_date)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderProgrammingContent = () => {
    if (!galleryId) {
      return (
        <View style={tw`flex-1 items-center justify-center px-6`}>
          <Text style={tw`text-sm text-neutral-600 text-center`}>
            Sign in with a gallery account to view programming.
          </Text>
        </View>
      );
    }

    if (isLoadingInitial) {
      return (
        <View style={tw`flex-1 items-center justify-center`}>
          <Loader size={100} height={120} />
        </View>
      );
    }

    const renderProgrammingList = () => {
      if (programmingQuery.isError) {
        return (
          <View style={tw`bg-white border border-neutral-200 rounded-sm p-4`}>
            <Text style={tw`text-sm text-neutral-700`}>
              Failed to load programming. Pull to refresh and try again.
            </Text>
          </View>
        );
      }

      if (currentList.length === 0) {
        return (
          <View style={tw`bg-white border border-neutral-200 rounded-sm p-4`}>
            <Text style={tw`text-xs text-neutral-500`}>
              {programmingTab === "past"
                ? "No past archives yet."
                : "No upcoming or active programming yet."}
            </Text>
          </View>
        );
      }

      return (
        <View style={tw`flex-row flex-wrap justify-between`}>
          {currentList.map((item) => renderRow(item))}
        </View>
      );
    };

    return (
      <ScrollView
        style={tw`flex-1`}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          paddingTop: 18,
          paddingHorizontal: 16,
          paddingBottom: insets.bottom + 30,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={tw`mb-8`}>
          <ProgrammingTabs activeTab={programmingTab} onChange={setProgrammingTab} />
          {renderProgrammingList()}
        </View>

        <View style={{ height: 2 }} />
      </ScrollView>
    );
  };

  return (
    <View style={tw`flex-1 bg-[#F7F7F7]`}>
      <View
        style={[
          tw`flex-row items-center justify-between gap-4 px-4`,
          { paddingTop: insets.top + 16 },
        ]}
      >
        <View style={tw`flex-1`}>
          <Text style={tw`text-lg text-neutral-900 font-medium`}>Programming</Text>
          <Text style={tw`text-sm text-neutral-500 mt-1`}>
            Manage your exhibitions, fairs, and viewing rooms.
          </Text>
        </View>
        <TouchableOpacity
          style={tw`h-[36px] px-3 rounded-sm bg-[${colors.black}] items-center justify-center`}
          activeOpacity={0.85}
          onPress={handleCreateEvent}
          disabled={isCheckingCreateEventAccess}
        >
          <Text style={tw`text-[10px] uppercase tracking-widest text-white`}>
            + Create Event
          </Text>
        </TouchableOpacity>
      </View>

      {renderProgrammingContent()}
    </View>
  );
}
