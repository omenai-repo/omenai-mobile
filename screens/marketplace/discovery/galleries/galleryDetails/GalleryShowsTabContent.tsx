import React, { useCallback, useMemo, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useInfiniteQuery } from "@tanstack/react-query";
import tw from "twrnc";
import Loader from "#components/general/Loader";
import { screenName } from "#constants/screenNames.constants";
import { getPromotionalFileView } from "#lib/storage/getPromotionalsFileView";
import { getEventStatus, type GalleryEventRecord } from "#services/marketplace/events/events.service";
import { fetchGalleryShowsPage } from "#services/marketplace/partners/galleryPartnerApi";
import { EVENTS_QK } from "#utils/core/queryKeys";

type FilterType = "All" | "Active" | "Upcoming" | "Past";
const FILTERS: FilterType[] = ["All", "Active", "Upcoming", "Past"];

function ShowsFilterTabs({
  active,
  onChange,
  compact,
}: Readonly<{
  active: FilterType;
  onChange: (f: FilterType) => void;
  compact?: boolean;
}>) {
  return (
    <View style={[tw`border-b border-neutral-100 pt-7`, compact ? tw`mb-4` : tw`mb-10`]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={tw`gap-8 flex-row`}>
        {FILTERS.map((filter) => (
          <Pressable key={filter} onPress={() => onChange(filter)} style={tw`pb-3`}>
            <Text
              style={[
                tw`text-[10px] uppercase tracking-widest font-sans-medium`,
                active === filter ? tw`text-neutral-900` : tw`text-neutral-400`,
              ]}
            >
              {filter}
            </Text>
            <View style={[tw`mt-2 h-px w-full`, active === filter ? tw`bg-neutral-900` : tw`bg-transparent`]} />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

type Props = {
  readonly galleryId: string;
  readonly isActive: boolean;
  readonly galleryName: string;
};

function formatHeadlinerDates(start: string, end: string) {
  const a = new Date(start).toLocaleDateString("en-US", { month: "long", day: "numeric" });
  const b = new Date(end).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return `${a} — ${b}`;
}

function formatGridDates(start: string, end: string) {
  const a = new Date(start).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const b = new Date(end).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return `${a} — ${b}`;
}

type GridCardProps = {
  readonly show: GalleryEventRecord;
  readonly width: number;
  readonly onPress: () => void;
};

function GalleryShowGridCard({ show, width, onPress }: Readonly<GridCardProps>) {
  const status = getEventStatus(show.start_date, show.end_date);
  const isClosed = status === "Past";

  let pillStyle = tw`bg-white/90 border-neutral-200 text-neutral-900`;
  if (isClosed) {
    pillStyle = tw`bg-black/60 border-black/10 text-white`;
  } else if (status === "Upcoming") {
    pillStyle = tw`bg-white/90 border-neutral-200 text-neutral-600`;
  }

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ width }, pressed && tw`opacity-95`]}>
      <View style={[{ width, aspectRatio: 3 / 2 }, tw`bg-neutral-50 overflow-hidden mb-6 rounded-sm border border-neutral-100`]}>
        <Image
          source={{ uri: getPromotionalFileView(show.cover_image, Math.min(900, Math.round(width * 2))) }}
          style={[tw`w-full h-full`, isClosed && tw`opacity-90`]}
          resizeMode="cover"
        />
        <View style={tw`absolute top-4 left-4`}>
          <Text
            style={[
              tw`px-2.5 py-1.5 text-[9px] uppercase tracking-widest font-sans-medium rounded-sm border`,
              pillStyle,
            ]}
          >
            {status}
          </Text>
        </View>
      </View>
      <View style={tw`pr-4`}>
        <Text style={tw`text-xs uppercase tracking-widest text-neutral-400 font-sans-medium`}>
          {show.event_type.replace("_", " ")}
        </Text>
        <Text style={tw`font-serif text-2xl text-neutral-900 leading-tight mt-2`} numberOfLines={3}>
          {show.title}
        </Text>
        <Text style={tw`font-sans text-xs text-neutral-500 tracking-wide uppercase pt-2`}>
          {formatGridDates(show.start_date, show.end_date)}
        </Text>
      </View>
    </Pressable>
  );
}

type HeadlinerProps = {
  readonly show: GalleryEventRecord;
  readonly onPress: () => void;
  readonly activeFilter: FilterType;
};

function GalleryShowHeadliner({ show, onPress, activeFilter }: Readonly<HeadlinerProps>) {
  const status = getEventStatus(show.start_date, show.end_date);
  const isActive = status === "Active";
  const isClosed = status === "Past";
  const showFeaturedPill = activeFilter === "All";
  const loc = show.location;

  let locationLine: string | null = null;
  if (loc?.city != null && String(loc.city).trim() !== "") {
    const venuePart = loc.venue ? `${loc.venue}, ` : "";
    locationLine = `${venuePart}${loc.city}`;
  }

  let headlinerPillStyle = tw`bg-white/90 border-neutral-200 text-neutral-900`;
  if (isClosed) {
    headlinerPillStyle = tw`bg-black/60 border-black/10 text-white`;
  } else if (status === "Upcoming") {
    headlinerPillStyle = tw`bg-white/90 border-neutral-200 text-neutral-600`;
  }

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [pressed && tw`opacity-95`]}>
      <View style={tw`gap-7`}>
        <View style={tw`w-full`}>
          <View style={[{ width: "100%", aspectRatio: 3 / 2 }, tw`bg-neutral-100 overflow-hidden rounded-sm border border-neutral-100`]}>
            <Image
              key={`${show.event_id}-${show.cover_image}`}
              source={{ uri: getPromotionalFileView(show.cover_image, 1200) }}
              style={[tw`w-full h-full`, isClosed && tw`opacity-90`]}
              resizeMode="cover"
            />
            <View style={tw`absolute top-4 left-4`}>
              {showFeaturedPill ? (
                <View style={tw`bg-white/90 px-3 py-1.5`}>
                  <Text style={tw`text-[10px] uppercase tracking-widest font-sans-medium text-neutral-900`}>
                    Featured
                  </Text>
                </View>
              ) : (
                <Text
                  style={[
                    tw`px-2.5 py-1.5 text-xs uppercase tracking-widest font-sans-medium rounded-sm border`,
                    headlinerPillStyle,
                  ]}
                >
                  {status}
                </Text>
              )}
            </View>
          </View>
        </View>
        <View style={tw`justify-center`}>
          <View style={tw`flex-row items-center gap-3 mb-3`}>
            <View style={[tw`w-2 h-2 rounded-full`, isActive ? tw`bg-green-500` : tw`bg-neutral-400`]} />
            <Text style={tw`text-xs uppercase tracking-widest text-neutral-500 font-sans-medium`}>
              {status} {show.event_type.replace("_", " ")}
            </Text>
          </View>
          <Text style={tw`font-serif text-4xl text-neutral-900 leading-tight mb-6`}>{show.title}</Text>
          <View style={tw`gap-3`}>
            <Text style={tw`font-sans text-sm text-neutral-500`}>
              {formatHeadlinerDates(show.start_date, show.end_date)}
            </Text>
            {locationLine === null ? null : (
              <Text style={tw`font-sans text-sm text-neutral-800`}>{locationLine}</Text>
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export default function GalleryShowsTabContent({ galleryId, isActive, galleryName }: Readonly<Props>) {
  const navigation = useNavigation<any>();
  const { width: screenW } = useWindowDimensions();
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: EVENTS_QK.galleryShowsTab(galleryId),
    queryFn: async ({ pageParam = 1 }) => fetchGalleryShowsPage(galleryId, pageParam, 12),
    initialPageParam: 1,
    getNextPageParam: (last) => {
      const p = last?.pagination;
      if (p && p.page < p.totalPages) return p.page + 1;
      return undefined;
    },
    enabled: isActive && Boolean(galleryId),
    staleTime: 5 * 60_000,
  });

  const allShows = useMemo(
    () =>
      (data?.pages ?? []).flatMap((p) => (Array.isArray(p.data) ? (p.data as GalleryEventRecord[]) : [])),
    [data],
  );

  const { headliner, gridEvents } = useMemo(() => {
    if (allShows.length === 0) return { headliner: null as GalleryEventRecord | null, gridEvents: [] as GalleryEventRecord[] };

    const active: GalleryEventRecord[] = [];
    const upcoming: GalleryEventRecord[] = [];
    const past: GalleryEventRecord[] = [];

    allShows.forEach((show) => {
      const s = getEventStatus(show.start_date, show.end_date);
      if (s === "Active") active.push(show);
      else if (s === "Upcoming") upcoming.push(show);
      else past.push(show);
    });

    const immediateUpcoming = [...upcoming].sort(
      (a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime(),
    );

    let selectedHeadliner: GalleryEventRecord | null = null;
    let grid: GalleryEventRecord[] = [];

    if (activeFilter === "All") {
      if (active.length > 0) {
        selectedHeadliner = active[0];
      } else if (immediateUpcoming.length > 0) {
        selectedHeadliner = immediateUpcoming[0];
      } else {
        selectedHeadliner = null;
      }
      grid = allShows.filter((show) => show.event_id !== selectedHeadliner?.event_id);
    } else if (activeFilter === "Active") {
      selectedHeadliner = active.length > 0 ? active[0] : null;
      grid = active.filter((show) => show.event_id !== selectedHeadliner?.event_id);
    } else if (activeFilter === "Upcoming") {
      selectedHeadliner = immediateUpcoming.length > 0 ? immediateUpcoming[0] : null;
      grid = upcoming.filter((show) => show.event_id !== selectedHeadliner?.event_id);
    } else if (activeFilter === "Past") {
      selectedHeadliner = null;
      grid = past;
    }

    return { headliner: selectedHeadliner, gridEvents: grid };
  }, [allShows, activeFilter]);

  const useTwoColumns = screenW >= 768;
  const hPad = 20;
  const colGap = useTwoColumns ? 48 : 0;
  const gridCardWidth = useTwoColumns ? (screenW - hPad * 2 - colGap) / 2 : screenW - hPad * 2;

  const gridRows = useMemo(() => {
    if (!useTwoColumns) return gridEvents.map((s) => [s]);
    const rows: GalleryEventRecord[][] = [];
    for (let i = 0; i < gridEvents.length; i += 2) {
      rows.push(gridEvents.slice(i, i + 2));
    }
    return rows;
  }, [gridEvents, useTwoColumns]);

  const onEvent = useCallback(
    (item: GalleryEventRecord) => {
      if (item.event_type === "exhibition") {
        navigation.navigate(screenName.individual.showDetails, { eventId: item.event_id });
      } else {
        navigation.navigate(screenName.individual.fairEventDetails, { eventId: item.event_id });
      }
    },
    [navigation],
  );

  if (!isActive) return null;

  if (isLoading) {
    return (
      <View style={tw`flex-1 items-center justify-center py-20`}>
        <Loader size={90} height={110} />
        {/* <Text style={tw`mt-3 text-xs uppercase tracking-widest text-neutral-400`}>Loading exhibitions...</Text> */}
      </View>
    );
  }

  if (isError) {
    return (
      <View style={tw`py-20 px-4`}>
        <Text style={tw`text-center text-xs uppercase tracking-widest text-neutral-400`}>
          Failed to load exhibitions.
        </Text>
      </View>
    );
  }

  if (headliner === null && gridEvents.length === 0) {
    return (
      <View style={tw`flex-1 px-5`}>
        <ShowsFilterTabs active={activeFilter} onChange={setActiveFilter} compact />
        <View style={tw`py-20 px-1`}>
          <Text style={tw`text-center text-xs uppercase tracking-widest text-neutral-400`}>
            No {activeFilter.toLowerCase()} exhibitions found.
          </Text>
          <Text style={tw`text-center text-[10px] uppercase tracking-widest text-neutral-300 mt-3`}>
            {galleryName}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={tw`flex-1`}
      contentContainerStyle={tw`px-5 pb-28 pt-4`}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled
    >
      <ShowsFilterTabs active={activeFilter} onChange={setActiveFilter} />

      <View style={tw`gap-20`}>
        {headliner === null ? null : (
          <GalleryShowHeadliner
            key={`headliner-${headliner.event_id}-${activeFilter}`}
            show={headliner}
            activeFilter={activeFilter}
            onPress={() => onEvent(headliner)}
          />
        )}

        {gridEvents.length > 0 ? (
          <View style={tw`gap-y-16`}>
            {gridRows.map((row) => (
              <View key={`row-${row.map((e) => e.event_id).join("-")}`} style={[tw`flex-row`, useTwoColumns && tw`gap-x-12`]}>
                {row.map((show) => (
                  <GalleryShowGridCard
                    key={show.event_id}
                    show={show}
                    width={gridCardWidth}
                    onPress={() => onEvent(show)}
                  />
                ))}
              </View>
            ))}
          </View>
        ) : null}
      </View>

      {hasNextPage ? (
        <View style={tw`mt-16 pt-10 border-t border-neutral-100 items-center`}>
          <Pressable
            onPress={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            style={({ pressed }) => [
              tw`border border-neutral-200 px-10 py-4 rounded-sm`,
              pressed && !isFetchingNextPage && tw`bg-neutral-50 border-neutral-900`,
              isFetchingNextPage && tw`opacity-50`,
            ]}
          >
            {isFetchingNextPage ? (
              <Loader size={56} height={70} />
            ) : (
              <Text style={tw`text-xs uppercase tracking-widest font-sans font-medium text-neutral-900`}>
                Load more shows
              </Text>
            )}
          </Pressable>
        </View>
      ) : null}
    </ScrollView>
  );
}
