import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { colors } from "#config/colors.config";
import { getPromotionalFileView } from "#lib/storage/getPromotionalsFileView";
import {
  EVENTS_QK,
} from "#utils/queryKeys";
import {
  GalleryEventRecord,
  getAllEvents,
  getAllShows,
  getEventStatus,
} from "#services/events/events.service";
import { screenName } from "#constants/screenNames.constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ProgrammingFilter = "Upcoming" | "Active" | "Past";

type ProgrammingItem = {
  source: "show" | "event";
  data: GalleryEventRecord;
};

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

function ProgrammingFilterChip({
  value,
  active,
  onPress,
}: {
  value: ProgrammingFilter;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        tw`px-3 py-2 rounded-sm border`,
        active ? tw`bg-black border-black` : tw`bg-white border-neutral-300`,
      ]}
      activeOpacity={0.8}
    >
      <Text
        style={[
          tw`text-[10px] uppercase tracking-widest`,
          active ? tw`text-white` : tw`text-neutral-600`,
        ]}
      >
        {value}
      </Text>
    </TouchableOpacity>
  );
}

export default function ShowsFairsEvents() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const insets = useSafeAreaInsets();
  const [programmingFilter, setProgrammingFilter] =
    useState<ProgrammingFilter>("Upcoming");

  const showsQuery = useQuery({
    queryKey: EVENTS_QK.allShows,
    queryFn: async () => {
      const result = await getAllShows();
      if (!result.isOk) throw new Error(result.message || "Failed to load shows");
      return result.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const eventsQuery = useInfiniteQuery({
    queryKey: EVENTS_QK.allFairsEvents("all"),
    queryFn: async ({ pageParam = 1 }) => {
      const result = await getAllEvents(pageParam, 20, "all");
      if (!result.isOk) {
        throw new Error(result.message || "Failed to load fairs and events");
      }
      return result;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page < lastPage.pagination.totalPages) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    staleTime: 5 * 60 * 1000,
  });

  const shows = useMemo(() => showsQuery.data ?? [], [showsQuery.data]);
  const allFairsEvents = useMemo(
    () => eventsQuery.data?.pages.flatMap((page) => page.data) ?? [],
    [eventsQuery.data],
  );

  const allProgramming = useMemo<ProgrammingItem[]>(() => {
    const merged = [
      ...shows.map((item) => ({ source: "show" as const, data: item })),
      ...allFairsEvents.map((item) => ({ source: "event" as const, data: item })),
    ];

    return merged.sort(
      (a, b) =>
        new Date(b.data.start_date).getTime() - new Date(a.data.start_date).getTime(),
    );
  }, [allFairsEvents, shows]);

  const filteredProgramming = useMemo(() => {
    return allProgramming.filter(({ data }) => {
      const status = getEventStatus(data.start_date, data.end_date);
      if (programmingFilter === "Past") return status === "Past";
      if (programmingFilter === "Active") return status === "Active";
      return status === "Upcoming";
    });
  }, [allProgramming, programmingFilter]);

  const refreshing = showsQuery.isRefetching || eventsQuery.isRefetching;

  const onRefresh = async () => {
    await Promise.all([showsQuery.refetch(), eventsQuery.refetch()]);
  };

  const isLoadingInitial = showsQuery.isLoading || eventsQuery.isLoading;
  const handleCreateEvent = async () => {
    const baseWebUrl = process.env.EXPO_PUBLIC_WEB_URL || "https://omenai.app";
    const normalizedBase = baseWebUrl.replace(/\/$/, "");
    const createUrl = `${normalizedBase}/gallery/programming/new`;
    try {
      const canOpen = await Linking.canOpenURL(createUrl);
      if (canOpen) {
        await Linking.openURL(createUrl);
        return;
      }
      Alert.alert("Open in Browser", "Unable to open the programming creation page.");
    } catch {}
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
          style={tw`h-[36px] px-3 rounded-sm bg-black items-center justify-center`}
          activeOpacity={0.85}
          onPress={handleCreateEvent}
        >
          <Text style={tw`text-[10px] uppercase tracking-widest text-white`}>
            + Create Event
          </Text>
        </TouchableOpacity>
      </View>

      {isLoadingInitial ? (
        <View style={tw`flex-1 items-center justify-center`}>
          <ActivityIndicator size="large" color={colors.black} />
        </View>
      ) : (
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
            <View style={tw`flex-row gap-2 mb-4`}>
              {(["Upcoming", "Active", "Past"] as ProgrammingFilter[]).map(
                (value) => (
                  <ProgrammingFilterChip
                    key={value}
                    value={value}
                    active={programmingFilter === value}
                    onPress={() => setProgrammingFilter(value)}
                  />
                ),
              )}
            </View>

            {showsQuery.isError || eventsQuery.isError ? (
              <View style={tw`bg-white border border-neutral-200 rounded-md p-4`}>
                <Text style={tw`text-sm text-neutral-700`}>
                  Failed to load programming. Pull to refresh and try again.
                </Text>
              </View>
            ) : filteredProgramming.length === 0 ? (
              <View style={tw`bg-white border border-neutral-200 rounded-md p-4`}>
                <Text style={tw`text-xs uppercase tracking-widest text-neutral-500`}>
                  No {programmingFilter.toLowerCase()} programming found.
                </Text>
              </View>
            ) : (
              <View style={tw`flex-row flex-wrap justify-between`}>
                {filteredProgramming.map(({ source, data: item }) => {
                  const status = getEventStatus(item.start_date, item.end_date);
                  return (
                    <TouchableOpacity
                      key={`${source}-${item.event_id}`}
                      style={tw`w-[48%] bg-white rounded-md border border-neutral-200 mb-4 overflow-hidden`}
                      activeOpacity={0.85}
                      onPress={() =>
                        navigation.push(screenName.gallery.showsFairsEventDetails, {
                          eventId: item.event_id,
                          source,
                        })
                      }
                    >
                      <Image
                        source={{ uri: resolvePromotionalImage(item.cover_image, 900) }}
                        style={tw`h-30 w-full bg-neutral-200`}
                        resizeMode="cover"
                      />
                      <View style={tw`absolute top-2 right-2 bg-white px-1.5 py-1 rounded-xs`}>
                        <Text style={tw`text-[8px] uppercase tracking-widest text-neutral-600`}>
                          {status}
                        </Text>
                      </View>
                      <View style={tw`p-3`}>
                        <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-500`}>
                          {item.gallery?.name || "Gallery"}
                        </Text>
                        <Text numberOfLines={2} style={tw`text-sm text-neutral-900 mt-1`}>
                          {item.title}
                        </Text>
                        <Text numberOfLines={1} style={tw`text-xs text-neutral-500 mt-1`}>
                          {formatDateRange(item.start_date, item.end_date)}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {eventsQuery.hasNextPage && (
              <TouchableOpacity
                onPress={() => eventsQuery.fetchNextPage()}
                disabled={eventsQuery.isFetchingNextPage}
                style={tw`mt-1 border border-neutral-300 rounded-sm py-3`}
                activeOpacity={0.8}
              >
                <Text style={tw`text-[10px] uppercase tracking-widest text-center text-neutral-700`}>
                  {eventsQuery.isFetchingNextPage ? "Loading..." : "Load More"}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={{ height: 2 }} />
        </ScrollView>
      )}
    </View>
  );
}
