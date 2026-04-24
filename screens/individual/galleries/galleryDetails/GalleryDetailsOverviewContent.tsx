import React, { useMemo } from "react";
import {
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import tw from "twrnc";
import { getPromotionalFileView } from "#lib/storage/getPromotionalsFileView";
import {
  computeGalleryHeadliner,
  isExhibitionType,
  type HeadlinerStatus,
} from "#screens/individual/galleries/galleryOverview.utils";
import type { GalleryOverviewData, GalleryOverviewArtist, GalleryOverviewEvent } from "#services/partners/fetchGalleryOverviewData";
import { screenName } from "#constants/screenNames.constants";
import type { NavigationProp } from "@react-navigation/native";

function headlinerBadgeText(status: HeadlinerStatus) {
  if (status === "Closed") return "Past Show";
  if (status === "Upcoming") return "Upcoming";
  return "Current Show";
}

function openEvent(
  navigation: NavigationProp<any>,
  event: GalleryOverviewEvent,
) {
  if (isExhibitionType(event.event_type)) {
    navigation.navigate(screenName.individual.showDetails, { eventId: event.event_id });
  } else {
    navigation.navigate(screenName.individual.fairEventDetails, { eventId: event.event_id });
  }
}

type OverviewHighlightProps = {
  event: GalleryOverviewEvent;
  status: HeadlinerStatus;
  description: string;
  onPressEvent: (e: GalleryOverviewEvent) => void;
};

function OverviewHighlightWithEvents({ event, status, description, onPressEvent }: OverviewHighlightProps) {
  return (
    <View style={tw`border-b border-neutral-100`}>
      <View style={tw`py-12`}>
        <Pressable onPress={() => onPressEvent(event)} style={({ pressed }) => [pressed && tw`opacity-95`]}>
          <View style={[{ width: "100%", aspectRatio: 4 / 3 }, tw`bg-neutral-100 rounded-sm overflow-hidden`]}>
            <Image
              source={{ uri: getPromotionalFileView(event.cover_image, 1000) }}
              style={tw`w-full h-full`}
              resizeMode="cover"
            />
            <View style={tw`absolute top-3 left-3 bg-white/90 px-2.5 py-1.5`}>
              <Text style={tw`text-xs uppercase tracking-widest font-sans-regular text-neutral-900`}>
                {headlinerBadgeText(status)}
              </Text>
            </View>
          </View>
        </Pressable>
        <Pressable onPress={() => onPressEvent(event)} style={({ pressed }) => [pressed && tw`opacity-80`]}>
          <Text style={tw`mt-6 text-xs text-neutral-500 uppercase tracking-widest`}>
            {String(event.event_type ?? "event").replace(/_/g, " ")}
          </Text>
          <Text style={tw`mt-2 font-serif text-3xl text-neutral-900 leading-tight`}>
            {event.title}
          </Text>
          <Text style={tw`mt-4 text-sm text-neutral-500`}>
            {new Date(event.start_date).toLocaleDateString("en-US", { month: "long", day: "numeric" })}{" "}
            —{" "}
            {new Date(event.end_date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </Text>
        </Pressable>
        <View style={tw`h-px bg-neutral-200 my-8`} />
        <View>
          <Text style={tw`text-xs uppercase tracking-widest text-neutral-400 font-sans-medium`}>
            About the Gallery
          </Text>
          <Text style={tw`mt-4 font-serif text-lg text-neutral-700 leading-relaxed`}>
            {description || "Information about this gallery will be updated shortly."}
          </Text>
        </View>
      </View>
    </View>
  );
}

function OverviewBioOnly({ description }: { description: string }) {
  return (
    <View style={tw`border-b border-neutral-100`}>
      <View style={tw`py-12 items-center`}>
        <View style={tw`max-w-xl w-full`}>
          <Text
            style={tw`text-center text-xs uppercase tracking-widest text-neutral-400 font-sans-medium mb-8`}
          >
            About the Gallery
          </Text>
          <Text
            style={tw`text-center font-serif text-lg text-neutral-900 leading-relaxed px-1`}
          >
            {description || "Information about this gallery will be updated shortly."}
          </Text>
        </View>
      </View>
    </View>
  );
}

type HistoryRailProps = {
  events: GalleryOverviewEvent[];
  cardWidth: number;
  onOpenEvent: (e: GalleryOverviewEvent) => void;
  onViewAll: () => void;
};

function HistoryRail({ events, cardWidth, onOpenEvent, onViewAll }: HistoryRailProps) {
  if (events.length === 0) return null;
  return (
    <View style={tw`border-b border-neutral-100 py-10`}>
      <View style={tw`pr-0 flex-row justify-between items-end mb-6`}>
        <Text style={tw`font-serif text-2xl text-neutral-900`}>All Shows & Events</Text>
        <Pressable onPress={onViewAll} hitSlop={8}>
          <Text style={tw`text-xs uppercase tracking-widest text-neutral-900 border-b border-neutral-900 pb-1 font-sans-regular`}>
            View All
          </Text>
        </Pressable>
      </View>
      <ScrollView
        horizontal
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={tw`pb-1`}
      >
        {events.map((event, i) => (
          <Pressable
            key={event.event_id}
            onPress={() => onOpenEvent(event)}
            style={({ pressed }) => [
              { width: cardWidth, marginRight: i === events.length - 1 ? 0 : 16 },
              pressed && tw`opacity-90`,
            ]}
          >
            <View
              style={[
                { width: cardWidth, aspectRatio: 3 / 2 },
                tw`bg-neutral-100 rounded-sm overflow-hidden`,
              ]}
            >
              <Image
                source={{ uri: getPromotionalFileView(event.cover_image, 700) }}
                style={tw`w-full h-full opacity-80`}
                resizeMode="cover"
              />
            </View>
            <Text numberOfLines={1} style={tw`mt-3 font-serif text-lg text-neutral-900`}>
              {event.title}
            </Text>
            <Text style={tw`text-[11px] text-neutral-400 uppercase tracking-wide mt-0.5`}>
              {new Date(event.start_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}{" "}
              —{" "}
              {new Date(event.end_date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

export type RosterBlockProps = {
  title: string;
  artists: GalleryOverviewArtist[];
  onArtistPress: (artist: GalleryOverviewArtist) => void;
  contentWidth: number;
};

export function RosterBlock({ title, artists, onArtistPress, contentWidth }: RosterBlockProps) {
  if (artists.length === 0) return null;
  const gap = 8;
  const colW = (contentWidth - gap) / 2;
  return (
    <View style={tw`mb-12`}>
      <Text style={tw`font-serif text-lg text-neutral-900 mb-6 italic`}>{title}</Text>
      <View style={tw`flex-row flex-wrap`}>
        {artists.map((a, i) => (
          <Pressable
            key={a.artist_id}
            onPress={() => onArtistPress(a)}
            style={({ pressed }) => [
              {
                width: colW,
                marginRight: i % 2 === 0 ? gap : 0,
                marginBottom: 10,
              },
              pressed && tw`opacity-70`,
            ]}
          >
            <Text style={tw`text-sm text-neutral-900 font-sans-medium uppercase tracking-wide`} numberOfLines={2}>
              {a.name}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

type OverviewProps = {
  data: GalleryOverviewData;
  contentWidth: number;
  railCardWidth: number;
  navigation: NavigationProp<any>;
  onArtistPress: (artist: GalleryOverviewArtist) => void;
  onViewAllShows: () => void;
  isRefetching: boolean;
  onRefresh: () => void;
};

export default function GalleryDetailsOverviewContent({
  data,
  contentWidth,
  railCardWidth,
  navigation,
  onArtistPress,
  onViewAllShows,
  isRefetching,
  onRefresh,
}: OverviewProps) {
  const { highlightEvent, historyEvents, status } = useMemo(
    () => computeGalleryHeadliner(data?.events),
    [data?.events],
  );
  const description = data?.description?.trim() ?? "";
  const represented = data?.represented_artists ?? [];
  const available = data?.available_artists ?? [];

  const onPressEvent = (e: GalleryOverviewEvent) => {
    openEvent(navigation, e);
  };

  return (
    <ScrollView
      style={tw`flex-1`}
      contentContainerStyle={tw`px-4 pb-28`}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={onRefresh}
        />
      }
    >
      {highlightEvent ? (
        <OverviewHighlightWithEvents
          event={highlightEvent}
          status={status}
          description={description}
          onPressEvent={onPressEvent}
        />
      ) : (
        <OverviewBioOnly description={description} />
      )}

      <HistoryRail
        events={historyEvents}
        cardWidth={railCardWidth}
        onOpenEvent={onPressEvent}
        onViewAll={onViewAllShows}
      />

      {(represented.length > 0 || available.length > 0) && (
        <View style={tw`pt-4`}>
          <RosterBlock
            title="Represented Artists"
            artists={represented}
            onArtistPress={onArtistPress}
            contentWidth={contentWidth}
          />
          <RosterBlock
            title="Works Available By"
            artists={available}
            onArtistPress={onArtistPress}
            contentWidth={contentWidth}
          />
        </View>
      )}
    </ScrollView>
  );
}
