import React, { useCallback, useMemo } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import tw from "twrnc";
import BackHeaderTitle from "#components/header/BackHeaderTitle";
import Loader from "#components/general/Loader";
import { useFairsEventsInfinite } from "#screens/individual/hooks/useFairsEvents";
import { getPromotionalFileView } from "#lib/storage/getPromotionalsFileView";
import {
  getEventStatus,
  type GalleryEventRecord,
} from "#services/events/events.service";
import { screenName } from "#constants/screenNames.constants";

function formatCurrentRange(start: string, end: string) {
  const a = new Date(start).toLocaleDateString("en-US", { month: "long", day: "numeric" });
  const b = new Date(end).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return `${a} — ${b}`;
}

function formatUpcomingRange(start: string, end: string) {
  return formatCurrentRange(start, end);
}

function formatPastRowDate(start: string, end: string) {
  const a = new Date(start).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const b = new Date(end).toLocaleDateString("en-US", { year: "numeric" });
  return `${a} — ${b}`;
}

function navigateToEvent(navigation: { navigate: (n: string, p: { eventId: string }) => void }, item: GalleryEventRecord) {
  if (item.event_type === "exhibition") {
    navigation.navigate(screenName.individual.showDetails, { eventId: item.event_id });
  } else {
    navigation.navigate(screenName.individual.fairEventDetails, { eventId: item.event_id });
  }
}

type ActiveGridCardProps = {
  item: GalleryEventRecord;
  width: number;
  onPress: () => void;
};

function FairsActiveGridCard({ item, width, onPress }: ActiveGridCardProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ width }, pressed && tw`opacity-95`]}>
      <View style={[{ width, aspectRatio: 3 / 2 }, tw`bg-neutral-100 overflow-hidden rounded-sm mb-4`]}>
        <Image
          source={{ uri: getPromotionalFileView(item.cover_image, Math.min(900, Math.round(width * 2))) }}
          style={tw`w-full h-full`}
          resizeMode="cover"
        />
      </View>
      <View style={tw`gap-1`}>
        <Text style={tw`text-[11px] uppercase tracking-widest text-neutral-500 font-sans-medium`}>
          {item.gallery?.name || " "}
        </Text>
        <Text style={tw`font-serif text-2xl text-neutral-900`} numberOfLines={3}>
          {item.title}
        </Text>
        <Text style={tw`font-sans-regular text-xs text-neutral-400 pt-1`}>
          {formatCurrentRange(item.start_date, item.end_date)}
        </Text>
      </View>
    </Pressable>
  );
}

type PastRowProps = { item: GalleryEventRecord; onPress: () => void };

function FairsPastRow({ item, onPress }: PastRowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        tw`flex-row items-center py-6 border-b border-neutral-200 pr-2`,
        pressed && tw`bg-neutral-50`,
      ]}
    >
      <View style={tw`w-16 h-16 shrink-0 bg-neutral-900 overflow-hidden rounded-sm`}>
        <Image
          source={{ uri: getPromotionalFileView(item.cover_image, 200) }}
          style={tw`w-full h-full opacity-90`}
          resizeMode="cover"
        />
      </View>
      <View style={tw`ml-4 flex-1 min-w-0`}>
        <Text style={tw`font-sans-medium text-base text-neutral-900`} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={tw`font-sans text-sm text-neutral-500 mt-0.5`} numberOfLines={1}>
          {item.gallery?.name}
        </Text>
      </View>
      <View style={tw`items-end justify-center ml-2 shrink-0`}>
        <Text style={tw`font-sans text-sm text-neutral-500`} numberOfLines={1}>
          {formatPastRowDate(item.start_date, item.end_date)}
        </Text>
        <MaterialCommunityIcons name="chevron-right" size={20} color={tw.color("neutral-300")} style={tw`mt-1`} />
      </View>
    </Pressable>
  );
}

type UpcomingBlockProps = { item: GalleryEventRecord; onPress: () => void };

function FairsUpcomingBlock({ item, onPress }: UpcomingBlockProps) {
  return (
    <View style={tw`py-5 border-b border-neutral-100`}>
      <Pressable onPress={onPress} style={({ pressed }) => [pressed && tw`opacity-80`]}>
        <Text
          style={tw`font-sans text-base text-neutral-900 leading-snug underline decoration-neutral-300`}
        >
          {item.title}
        </Text>
        <Text style={tw`font-sans text-sm text-neutral-500 mt-2`}>
          {formatUpcomingRange(item.start_date, item.end_date)}
        </Text>
      </Pressable>
    </View>
  );
}

export default function FairsEventsScreen() {
  const navigation = useNavigation<any>();
  const { width: screenW } = useWindowDimensions();
  const useTwoCol = screenW >= 640;
  const hPad = 20;
  const gap = 32;
  const activeColW = useTwoCol ? (screenW - hPad * 2 - gap) / 2 : screenW - hPad * 2;

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useFairsEventsInfinite(20);

  const allEvents = useMemo(
    () => (data?.pages ?? []).flatMap((p) => p.data) as GalleryEventRecord[],
    [data],
  );

  const { currentEvents, pastEvents, upcomingEvents } = useMemo(() => {
    const current: GalleryEventRecord[] = [];
    const past: GalleryEventRecord[] = [];
    const upcoming: GalleryEventRecord[] = [];
    allEvents.forEach((event) => {
      const s = getEventStatus(event.start_date, event.end_date);
      if (s === "Active") current.push(event);
      else if (s === "Past") past.push(event);
      else upcoming.push(event);
    });
    return { currentEvents: current, pastEvents: past, upcomingEvents: upcoming };
  }, [allEvents]);

  const activeRows = useMemo(() => {
    const rows: GalleryEventRecord[][] = [];
    for (let i = 0; i < currentEvents.length; i += useTwoCol ? 2 : 1) {
      rows.push(currentEvents.slice(i, i + (useTwoCol ? 2 : 1)));
    }
    return rows;
  }, [currentEvents, useTwoCol]);

  const onOpen = useCallback(
    (item: GalleryEventRecord) => {
      navigateToEvent(navigation, item);
    },
    [navigation],
  );

  if (isLoading) {
    return (
      <View style={tw`flex-1 bg-white`}>
        <BackHeaderTitle title="Fairs & Events" />
        <View style={tw`flex-1 items-center justify-center`}>
          <Loader size={100} height={120} />
          {/* <Text style={tw`mt-4 text-xs uppercase tracking-widest text-neutral-400`}>Loading events...</Text> */}
        </View>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={tw`flex-1 bg-white`}>
        <BackHeaderTitle title="Fairs & Events" />
        <View style={tw`flex-1 items-center justify-center px-6`}>
          <Text style={tw`text-center text-sm text-neutral-500`}>Failed to load events.</Text>
          <Pressable onPress={() => refetch()} style={tw`mt-4 border border-neutral-300 px-4 py-2 rounded-sm`}>
            <Text style={tw`text-sm text-neutral-900`}>Retry</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const isEmpty = currentEvents.length === 0 && pastEvents.length === 0 && upcomingEvents.length === 0;

  return (
    <View style={tw`flex-1 bg-white`}>
      <BackHeaderTitle title="Fairs & Events" />
      <ScrollView
        style={tw`flex-1`}
        contentContainerStyle={tw`px-5 pb-32 pt-2`}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >
        <View style={tw`mb-12`}>
          <Text style={tw`font-serif text-3xl text-neutral-900 font-normal mb-3`}>Current Fairs & Events</Text>
          <Text style={tw`text-sm text-neutral-500 max-w-xl font-sans-regular`}>
            Discover global art fairs, exclusive digital viewing rooms, and time-sensitive gallery events.
          </Text>
        </View>

        {isEmpty ? (
          <Text style={tw`py-12 font-sans-regular text-sm text-neutral-400`}>No events to show yet.</Text>
        ) : null}

        {currentEvents.length > 0 ? (
          <View style={tw`mb-16 gap-8`}>
            {activeRows.map((row) => (
              <View
                key={row.map((e) => e.event_id).join("-")}
                style={[tw`flex-row`, useTwoCol && tw`gap-x-8`]}
              >
                {row.map((item) => (
                  <FairsActiveGridCard
                    key={item.event_id}
                    item={item}
                    width={activeColW}
                    onPress={() => onOpen(item)}
                  />
                ))}
              </View>
            ))}
          </View>
        ) : null}

        <View style={tw`gap-12`}>
          <View>
            <Text style={tw`font-serif text-3xl text-neutral-900 mb-6`}>Past Events</Text>
            <View style={tw`border-t border-neutral-200`}>
              {pastEvents.length === 0 ? (
                <Text style={tw`py-8 font-sans-regular text-sm text-neutral-400`}>No past events found.</Text>
              ) : (
                pastEvents.map((item) => (
                  <FairsPastRow key={item.event_id} item={item} onPress={() => onOpen(item)} />
                ))
              )}
            </View>
            {hasNextPage ? (
              <View style={tw`mt-8 items-center`}>
                <Pressable
                  onPress={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  style={({ pressed }) => [
                    tw`border border-neutral-200 px-8 py-3 rounded-sm`,
                    pressed && !isFetchingNextPage && tw`border-neutral-900 bg-neutral-50`,
                    isFetchingNextPage && tw`opacity-50`,
                  ]}
                >
                  {isFetchingNextPage ? (
                    <Loader size={56} height={70} />
                  ) : (
                    <Text style={tw`text-xs uppercase tracking-widest font-sans font-medium text-neutral-900`}>
                      Load more past events
                    </Text>
                  )}
                </Pressable>
              </View>
            ) : null}
          </View>

          <View>
            <Text style={tw`font-serif text-3xl text-neutral-900 mb-6`}>Upcoming Events</Text>
            <View style={tw`border-t border-neutral-200`}>
              {upcomingEvents.length === 0 ? (
                <Text style={tw`py-8 font-sans-regular text-sm text-neutral-400`}>
                  No upcoming events currently scheduled.
                </Text>
              ) : (
                upcomingEvents.map((item) => (
                  <FairsUpcomingBlock key={item.event_id} item={item} onPress={() => onOpen(item)} />
                ))
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
