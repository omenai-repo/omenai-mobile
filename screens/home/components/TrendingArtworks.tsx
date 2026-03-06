import React, { useCallback } from "react";
import { View, FlatList } from "react-native";
import tw from "twrnc";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { fetchArtworks } from "#services/artworks/fetchArtworks";
import ArtworkCardLoader from "#components/general/ArtworkCardLoader";
import ViewAllCategoriesButton from "#components/buttons/ViewAllCategoriesButton";
import EmptyArtworks from "#components/general/EmptyArtworks";
import ArtworkCard from "#components/artwork/ArtworkCard";
import { screenName } from "#constants/screenNames.constants";
import { HOME_QK } from "#utils/queryKeys";
import { useAppStore } from "#store/app/appStore";
import SectionHeader from "#components/general/SectionHeader";

export default function TrendingArtworks({
  limit,
  hideAction,
}: {
  limit: number;
  hideAction?: boolean;
}) {
  const navigation = useNavigation<any>();
  const { userSession } = useAppStore();

  const { data = [], isLoading } = useQuery({
    queryKey: HOME_QK.trending(limit, userSession?.id),
    queryFn: async () => {
      const res = await fetchArtworks({ listingType: "trending", page: 1 });
      return res?.isOk ? res.body.data ?? [] : [];
    },
    select: (rows) => rows.slice(0, limit),
    staleTime: 60_000,
    gcTime: 10 * 60_000,
  });

  const showMoreButton = data.length >= limit;

  const renderItem = useCallback(
    ({ item, index }: { item: any; index: number }) =>
      index + 1 === data.length && showMoreButton ? (
        <ViewAllCategoriesButton
          label="View all trending artworks"
          listingType="trending"
        />
      ) : (
        <ArtworkCard
          title={item.title}
          url={item.url}
          artist={item.artist}
          showPrice={item.pricing.shouldShowPrice === "Yes"}
          price={item.pricing.usd_price}
          availiablity={item.availability}
          impressions={item.impressions}
          like_IDs={item.like_IDs}
          art_id={item.art_id}
        />
      ),
    [data.length, showMoreButton],
  );

  const keyExtractor = useCallback((_: any, i: number) => `trend-${i}`, []);

  return (
    <View style={tw`mt-6`}>
      <SectionHeader
        subtitle="Trending Now"
        title="Trending Artworks"
        onActionPress={
          hideAction
            ? undefined
            : () =>
                navigation.navigate(screenName.artworksMedium, {
                  catalog: "trending",
                })
        }
      />

      {isLoading && <ArtworkCardLoader />}

      {!isLoading && data.length > 0 && (
        <FlatList
          data={data}
          keyExtractor={keyExtractor}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={tw`mt-5`}
          contentContainerStyle={tw`px-5 gap-5`}
          renderItem={renderItem}
          initialNumToRender={15}
          maxToRenderPerBatch={15}
          windowSize={5}
          removeClippedSubviews
        />
      )}

      {!isLoading && data.length < 1 && (
        <EmptyArtworks
          size={70}
          fixedHeight
          writeUp="No trending artworks at the moment"
        />
      )}
    </View>
  );
}
