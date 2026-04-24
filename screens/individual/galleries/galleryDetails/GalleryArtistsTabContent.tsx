import React, { useMemo } from "react";
import { Pressable, ScrollView, Text, useWindowDimensions, View } from "react-native";
import { useInfiniteQuery } from "@tanstack/react-query";
import tw from "twrnc";
import type { GalleryOverviewArtist } from "#services/partners/fetchGalleryOverviewData";
import ArtworkCard from "#components/artwork/ArtworkCard";
import Loader from "#components/general/Loader";
import { EVENTS_QK } from "#utils/queryKeys";
import { fetchGalleryArtistsPage, type GalleryArtistFloorRow } from "#services/partners/galleryPartnerApi";
import { priceFromGalleryWork, type GalleryWorkRow } from "./GalleryWorksTabContent";

type Props = {
  galleryId: string;
  isActive: boolean;
  isLoading: boolean;
  represented: GalleryOverviewArtist[];
  available: GalleryOverviewArtist[];
  onArtistPress: (artist: GalleryOverviewArtist) => void;
};

export default function GalleryArtistsTabContent({
  galleryId,
  isActive,
  isLoading,
  represented,
  available,
  onArtistPress,
}: Props) {
  const { width: screenW } = useWindowDimensions();
  const contentWidth = screenW - 32;
  const floorCardWidth = Math.min(220, screenW * 0.52);

  const {
    data: floorData,
    isLoading: isFloorLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: [...EVENTS_QK.galleryWorks(galleryId, { artist: "All", medium: "All", price: "All" }), "artists-floor"],
    queryFn: async ({ pageParam = 1 }) => fetchGalleryArtistsPage(galleryId, pageParam as number, 10),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const pagination = lastPage?.pagination;
      if (pagination && pagination.page < pagination.totalPages) {
        return pagination.page + 1;
      }
      return undefined;
    },
    enabled: isActive && Boolean(galleryId),
    staleTime: 5 * 60_000,
  });

  const floorArtists = useMemo(
    () =>
      (floorData?.pages ?? [])
        .flatMap((page) => page?.data ?? [])
        .filter((artist) => (artist.totalWorks ?? 0) > 0),
    [floorData],
  );

  const renderArtistRows = (rows: GalleryOverviewArtist[]) => {
    const gap = 8;
    const colW = (contentWidth - gap) / 2;
    return (
      <View style={tw`flex-row flex-wrap`}>
        {rows.map((artist, i) => {
          const worksCount =
            Number(
              artist.availableWorks ??
                artist.available_works ??
                artist.totalWorks ??
                artist.total_works,
            ) || 0;
          return (
            <Pressable
              key={artist.artist_id}
              onPress={() => onArtistPress(artist)}
              style={({ pressed }) => [
                {
                  width: colW,
                  marginRight: i % 2 === 0 ? gap : 0,
                  marginBottom: 14,
                },
                pressed && tw`opacity-70`,
              ]}
            >
              <Text style={tw`text-sm text-neutral-900 font-sans-medium uppercase tracking-wide`} numberOfLines={2}>
                {artist.name}
              </Text>
              {worksCount > 0 && (
                <Text style={tw`mt-1 text-[10px] uppercase tracking-widest text-neutral-500`}>
                  {worksCount} artwork{worksCount === 1 ? "" : "s"} available
                </Text>
              )}
            </Pressable>
          );
        })}
      </View>
    );
  };

  const renderArtistFloorRow = (artist: GalleryArtistFloorRow) => {
    const artworks = Array.isArray(artist.artworks) ? (artist.artworks as GalleryWorkRow[]) : [];
    if (artworks.length === 0) return null;

    return (
      <View key={artist.artist_id} style={tw`py-8 border-t border-neutral-100`}>
        <View style={tw`flex-row items-center justify-between mb-4`}>
          <Text style={tw`font-serif text-2xl text-neutral-900`}>{artist.name}</Text>
          <Pressable onPress={() => onArtistPress({ artist_id: artist.artist_id, name: artist.name })}>
            <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-900 border-b border-neutral-900 pb-1`}>
              View all ({artist.totalWorks ?? artworks.length})
            </Text>
          </Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={tw`gap-3`}>
          {artworks.map((art) => (
            <View key={art.art_id} style={{ width: floorCardWidth }}>
              <ArtworkCard
                title={art.title}
                url={art.url}
                artist={art.artist}
                art_id={art.art_id}
                price={priceFromGalleryWork(art)}
                showPrice={priceFromGalleryWork(art) > 0}
                availiablity={art.availability}
                impressions={art.impressions ?? 0}
                like_IDs={art.like_IDs ?? []}
                width={floorCardWidth}
                galleryView
                disableLikeButton
                useImageLoadAspectRatio
              />
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  if (!isActive) return null;

  if (isLoading) {
    return (
      <View style={tw`py-20 items-center`}>
        <Text style={tw`text-xs uppercase tracking-widest text-neutral-400`}>Loading artists...</Text>
      </View>
    );
  }

  if (represented.length === 0 && available.length === 0) {
    return (
      <View style={tw`py-20 px-4`}>
        <Text style={tw`text-center text-xs uppercase text-neutral-400`}>
          No artist listing for this gallery yet.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={tw`flex-1`} contentContainerStyle={tw`px-4 pb-16 pt-4`} nestedScrollEnabled>
      {represented.length > 0 && (
        <View style={tw`mb-10`}>
          <Text style={tw`font-serif text-lg text-neutral-900 mb-6 italic`}>Represented Artists</Text>
          {renderArtistRows(represented)}
        </View>
      )}
      {available.length > 0 && (
        <View style={tw`mb-6`}>
          <Text style={tw`font-serif text-lg text-neutral-900 mb-6 italic`}>Works Available By</Text>
          {renderArtistRows(available)}
        </View>
      )}
      <View style={tw`pt-2`}>
        {isFloorLoading ? (
          <View style={tw`py-16 items-center`}>
            <Loader size={56} height={90} />
          </View>
        ) : (
          floorArtists.map(renderArtistFloorRow)
        )}
        {hasNextPage && (
          <View style={tw`py-10 items-center border-t border-neutral-100`}>
            <Pressable
              onPress={() => void fetchNextPage()}
              disabled={isFetchingNextPage}
              style={tw`border border-neutral-300 px-6 py-3 rounded-sm`}
            >
              <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-800`}>
                {isFetchingNextPage ? "Loading more artists..." : "Load more artists"}
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
