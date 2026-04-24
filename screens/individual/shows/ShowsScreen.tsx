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
import tw from "twrnc";
import BackHeaderTitle from "#components/header/BackHeaderTitle";
import Loader from "#components/general/Loader";
import { useShows } from "#screens/individual/hooks/useShows";
import { getPromotionalFileView } from "#lib/storage/getPromotionalsFileView";
import { getEventStatus, type GalleryEventRecord } from "#services/events/events.service";
import { screenName } from "#constants/screenNames.constants";

type FilterType = "All" | "Active" | "Upcoming" | "Closed";
const FILTERS: FilterType[] = ["All", "Active", "Upcoming", "Closed"];

function ShowsFilterStrip({
  active,
  onChange,
}: {
  active: FilterType;
  onChange: (f: FilterType) => void;
}) {
  return (
    <View style={tw`border-b border-neutral-200 mb-8`}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={tw`gap-8 flex-row`}>
        {FILTERS.map((filter) => (
          <Pressable key={filter} onPress={() => onChange(filter)} style={tw`pb-3`}>
            <Text
              style={[
                tw`text-xs uppercase tracking-widest font-sans-medium`,
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

function statusMatchesFilter(status: ReturnType<typeof getEventStatus>, filter: FilterType): boolean {
  if (filter === "All") return true;
  if (filter === "Closed") return status === "Past";
  return status === filter;
}

function formatShowCardDates(start: string, end: string) {
  const a = new Date(start).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const b = new Date(end).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return `${a} — ${b}`;
}

type ShowCardProps = { show: GalleryEventRecord; width: number; onPress: () => void };

function AllShowsGridCard({ show, width, onPress }: ShowCardProps) {
  const status = getEventStatus(show.start_date, show.end_date);
  const isClosed = status === "Past";
  const loc = show.location;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ width }, pressed && tw`opacity-95`]}>
      <View style={[{ width, aspectRatio: 3 / 2 }, tw`bg-neutral-50 overflow-hidden mb-5 border border-neutral-100`]}>
        <Image
          source={{ uri: getPromotionalFileView(show.cover_image, Math.min(900, Math.round(width * 2))) }}
          style={[tw`w-full h-full`, isClosed && tw`opacity-80`]}
          resizeMode="cover"
        />
        <View style={tw`absolute top-3 left-3`}>
          <Text
            style={[
              tw`px-3 py-1.5 font-sans-regular text-[9px] uppercase tracking-widest`,
              isClosed ? tw`bg-black text-white` : tw`bg-white text-black`,
            ]}
          >
            {isClosed ? "Closed" : show.event_type.replace("_", " ")}
          </Text>
        </View>
      </View>
      <View style={tw`pr-4 gap-2`}>
        <Text style={tw`font-sans-medium text-[10px] uppercase tracking-[0.2em] text-neutral-500`}>
          {show.gallery?.name || "Gallery"}
        </Text>
        <Text style={tw`font-serif text-lg text-neutral-900 leading-snug`} numberOfLines={3}>
          {show.title}
        </Text>
        <View style={tw`flex-row flex-wrap items-center gap-x-2`}>
          {loc?.city != null && String(loc.city).trim() !== "" ? (
            <Text style={tw`font-sans-regular text-[10px] uppercase tracking-[0.2em] text-neutral-400`}>
              {loc.city}
              {loc.country != null && String(loc.country).trim() !== "" ? `, ${loc.country} —` : " —"}
            </Text>
          ) : null}
          <Text style={tw`font-sans-regular text-[10px] uppercase tracking-widest text-neutral-400`}>
            {formatShowCardDates(show.start_date, show.end_date)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

export default function ShowsScreen() {
  const navigation = useNavigation<any>();
  const { width: screenW } = useWindowDimensions();
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");
  const { data: shows = [], isLoading, isError, refetch } = useShows();

  const useTwoCol = screenW >= 640;
  const hPad = 20;
  const gap = 24;
  const cardW = useTwoCol ? (screenW - hPad * 2 - gap) / 2 : screenW - hPad * 2;

  const filteredShows = useMemo(() => {
    if (!shows.length) return [];
    return shows.filter((show) => {
      const s = getEventStatus(show.start_date, show.end_date);
      return statusMatchesFilter(s, activeFilter);
    });
  }, [shows, activeFilter]);

  const rows = useMemo(() => {
    const r: GalleryEventRecord[][] = [];
    for (let i = 0; i < filteredShows.length; i += useTwoCol ? 2 : 1) {
      r.push(filteredShows.slice(i, i + (useTwoCol ? 2 : 1)));
    }
    return r;
  }, [filteredShows, useTwoCol]);

  const onOpen = useCallback(
    (item: GalleryEventRecord) => {
      navigation.navigate(screenName.individual.showDetails, { eventId: item.event_id });
    },
    [navigation],
  );

  if (isError) {
    return (
      <View style={tw`flex-1 bg-white`}>
        <BackHeaderTitle title="Exhibitions" />
        <View style={tw`flex-1 items-center justify-center px-6`}>
          <Text style={tw`text-center text-sm text-neutral-500`}>
            Failed to load exhibitions. Please try again.
          </Text>
          <Pressable onPress={() => void refetch()} style={tw`mt-4 border border-neutral-300 px-4 py-2 rounded-sm`}>
            <Text style={tw`text-sm text-neutral-900`}>Retry</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={tw`flex-1 bg-white`}>
        <BackHeaderTitle title="Exhibitions" />
        <View style={tw`flex-1 items-center justify-center`}>
          <Loader size={100} height={120} />
          {/* <Text style={tw`mt-4 text-sm text-neutral-500`}>Loading exhibitions...</Text> */}
        </View>
      </View>
    );
  }

  const emptyLabel =
    activeFilter === "All"
      ? "No exhibitions at this time."
      : `No ${activeFilter.toLowerCase()} exhibitions found at this time.`;

  return (
    <View style={tw`flex-1 bg-white`}>
      <BackHeaderTitle title="Exhibitions" />
      <ScrollView
        style={tw`flex-1`}
        contentContainerStyle={tw`px-5 pb-28 pt-2`}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >
        <View style={tw`mb-8`}>
          <Text style={tw`text-sm text-neutral-500`}>
            Discover current, upcoming, and past gallery presentations from our global network of dealers.
          </Text>
        </View>

        <ShowsFilterStrip active={activeFilter} onChange={setActiveFilter} />

        {filteredShows.length === 0 ? (
          <View style={tw`py-16 items-center`}>
            <Text style={tw`text-center text-sm text-neutral-400`}>{emptyLabel}</Text>
          </View>
        ) : (
          <View style={tw`gap-y-12`}>
            {rows.map((row) => (
              <View
                key={row.map((e) => e.event_id).join("-")}
                style={[tw`flex-row`, useTwoCol && tw`gap-x-6`]}
              >
                {row.map((show) => (
                  <AllShowsGridCard key={show.event_id} show={show} width={cardW} onPress={() => onOpen(show)} />
                ))}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
