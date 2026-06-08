import React, { useMemo } from "react";
import { Pressable, ScrollView, Text, useWindowDimensions, View } from "react-native";
import { useInfiniteQuery } from "@tanstack/react-query";
import { FlashList } from "@shopify/flash-list";
import tw from "twrnc";
import ListSeparator from "#components/general/ListSeparator";
import type { GalleryOverviewArtist } from "#services/partners/fetchGalleryOverviewData";
import ArtworkCard from "#components/artwork/ArtworkCard";
import Loader from "#components/general/Loader";
import { EVENTS_QK } from "#utils/queryKeys";
import { fetchGalleryArtistsPage, type GalleryArtistFloorRow } from "#services/partners/galleryPartnerApi";
import { priceFromGalleryWork, type GalleryWorkRow } from "./GalleryWorksTabContent";

const ArtistFloorSeparator = () => <ListSeparator width={12} />;

type Props = {
  readonly galleryId: string;
  readonly isActive: boolean;
  readonly isLoading: boolean;
  readonly represented: readonly GalleryOverviewArtist[];
  readonly available: readonly GalleryOverviewArtist[];
  readonly onArtistPress: (artist: GalleryOverviewArtist) => void;
};

export default function GalleryArtistsTabContent({
  galleryId,
  isActive,
  isLoading,
  represented,
  available,
  onArtistPress,
}: Readonly<Props>) {
  const { width: screenW } = useWindowDimensions();
  const contentWidth = screenW - 32;

  const {
    data: floorData,
    isLoading: isFloorLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: [...EVENTS_QK.galleryWorks(galleryId, { artist: "All", medium: "All", price: "All" }), "artists-floor"],
    queryFn: async ({ pageParam = 1 }) => fetchGalleryArtistsPage(galleryId, pageParam, 10),
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

  const renderArtistRows = (rows: readonly GalleryOverviewArtist[]) => {
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
        <FlashList
          data={artworks}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ alignItems: "flex-start" }}
          ItemSeparatorComponent={ArtistFloorSeparator}
          keyExtractor={(art) => art.art_id}
          renderItem={({ item: art }) => (
            <View>
              <ArtworkCard
                artwork={{
                  ...art,
                  pricing: {
                    ...((typeof art.pricing === "object" ? art.pricing : {}) as object),
                    usd_price: priceFromGalleryWork(art),
                    shouldShowPrice: priceFromGalleryWork(art) > 0 ? "Yes" : "No",
                  },
                }}
                galleryView
                disableLikeButton
                hideBackground
                useImageLoadAspectRatio
              />
            </View>
          )}
        />
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
              onPress={() => fetchNextPage()}
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
