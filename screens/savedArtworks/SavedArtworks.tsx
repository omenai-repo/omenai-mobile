import { Text, View, RefreshControl, useWindowDimensions } from "react-native";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import Loader from "#components/general/Loader";
import { fetchUserSavedArtworks } from "#services/artworks/fetchUserSavedArtwork";
import { SingleArtworkCardLoader } from "#components/general/ArtworkCardLoader";
import { useIsFocused } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import BackHeaderTitle from "#components/header/BackHeaderTitle";
import tw from "twrnc";
import ArtworkCard from "#components/artwork/ArtworkCard";
import { FlashList } from "@shopify/flash-list";
import { useInfiniteQuery } from "@tanstack/react-query";

const H_PAD = 20;
const COL_GAP = 16;

const ListHeader = ({ totalCount }: { totalCount: number }) =>
  totalCount > 0 ? (
    <Text
      style={tw`text-[11px] uppercase tracking-widest text-neutral-400 mb-3`}
    >
      {totalCount} {totalCount === 1 ? "artwork" : "artworks"} saved
    </Text>
  ) : null;

const ListFooter = ({ isFetchingNextPage }: { isFetchingNextPage: boolean }) =>
  isFetchingNextPage ? (
    <Loader size={56} height={90} />
  ) : (
    <View style={tw`h-12`} />
  );

const ListEmpty = () => (
  <View style={tw`flex-1 items-center justify-center py-24`}>
    <View
      style={tw`w-16 h-16 rounded-full bg-neutral-100 items-center justify-center mb-4`}
    >
      <Ionicons name="heart-outline" size={28} color="#a3a3a3" />
    </View>
    <Text style={tw`text-base font-semibold text-neutral-800 mb-1`}>
      No saved artworks
    </Text>
    <Text style={tw`text-sm text-neutral-400 text-center px-8`}>
      Tap the heart on any artwork to save it here.
    </Text>
  </View>
);

export default function SavedArtworks() {
  const isFocused = useIsFocused();
  const { width: screenW } = useWindowDimensions();
  const cardW = useMemo(() => (screenW - H_PAD * 2 - COL_GAP) / 2, [screenW]);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    refetch,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["saved-artworks"],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await fetchUserSavedArtworks(pageParam);
      if (!res?.isOk) throw new Error("Failed to fetch saved artworks");
      return res;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const totalPages = lastPage.count ?? 1;
      const next = allPages.length + 1;
      return next <= totalPages ? next : undefined;
    },
    staleTime: 10_000,
  });

  useEffect(() => {
    if (isFocused) {
      refetch();
    }
  }, [isFocused, refetch]);

  const flatData = useMemo(
    () => (data?.pages || []).flatMap((p) => p.data ?? []),
    [data?.pages],
  );

  const totalCount = data?.pages[0]?.total ?? 0;

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const loadNextPage = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderItem = useCallback(
    (info: { item: any }) => (
      <View style={[tw`mb-4`, { width: cardW }]}>
        <ArtworkCard
          artwork={{
            art_id: info.item.art_id,
            title: info.item.title,
            url: info.item.url,
            artist: info.item.artist,
            impressions: info.item.impressions,
            like_IDs: info.item.like_IDs || [],
            availability: info.item.availability,
            image_format: info.item.image_format,
            pricing: {
              usd_price: info.item.pricing?.usd_price ?? 0,
              shouldShowPrice: info.item.pricing?.shouldShowPrice ?? "No",
            },
          }}
          width={cardW}
          useImageLoadAspectRatio
          useFixedImageFrame={false}
          hideBackground
        />
      </View>
    ),
    [cardW],
  );

  return (
    <View style={tw`flex-1 bg-white`}>
      <BackHeaderTitle title="Saved artworks" />

      {isLoading && flatData.length === 0 ? (
        <FlashList
          data={[1, 2, 3, 4, 5, 6]}
          numColumns={2}
          masonry
          renderItem={() => (
            <View style={[tw`mb-4`, { width: cardW }]}>
              <SingleArtworkCardLoader style={{ width: cardW }} />
            </View>
          )}
          keyExtractor={(_, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: H_PAD,
            paddingTop: 12,
            paddingBottom: 32,
          }}
        />
      ) : (
        <FlashList
          data={flatData}
          numColumns={2}
          masonry
          keyExtractor={(item: any) => item.art_id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: H_PAD,
            paddingTop: 12,
            paddingBottom: 32,
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#000"
            />
          }
          onEndReached={loadNextPage}
          onEndReachedThreshold={0.45}
          ListHeaderComponent={<ListHeader totalCount={totalCount} />}
          ListFooterComponent={<ListFooter isFetchingNextPage={isFetchingNextPage} />}
          ListEmptyComponent={<ListEmpty />}
        />
      )}
    </View>
  );
}
