import React from "react";
import { View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import tw from "twrnc";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { fetchArtworks } from "#services/artworks/fetchArtworks";
import ArtworkCardLoader from "#components/general/ArtworkCardLoader";
import ViewAllCategoriesButton from "#components/buttons/ViewAllCategoriesButton";
import EmptyArtworks from "#components/general/EmptyArtworks";
import ArtworkCard from "#components/artwork/ArtworkCard";
import ListSeparator from "#components/general/ListSeparator";
import { screenName } from "#constants/screenNames.constants";
import { HOME_QK } from "#utils/queryKeys";
import SectionHeader from "#components/general/SectionHeader";
import { useAppStore } from "#store/app/appStore";

export default function TrendingArtworks({
  limit,
  hideAction,
}: Readonly<{
  limit: number;
  hideAction?: boolean;
}>) {
  const navigation = useNavigation<any>();
  const { userSession } = useAppStore();

  const { data = [], isLoading } = useQuery({
    queryKey: HOME_QK.trending(limit, userSession?.id),
    queryFn: async () => {
      const res = await fetchArtworks({ listingType: "trending", page: 1 });
      return res?.isOk ? res.body.data ?? [] : [];
    },
    select: (rows) => rows.slice(0, limit),
  });

  const showMoreButton = data.length >= limit;

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
        <FlashList
          data={data}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={tw`mt-5`}
          contentContainerStyle={{
            alignItems: "flex-end",
            paddingHorizontal: 20,
          }}
          ItemSeparatorComponent={ListSeparator}
          keyExtractor={(item: any, index) =>
            item.art_id?.toString() ?? `trend-${index}`
          }
          renderItem={({ item }) => (
            <ArtworkCard
              artwork={item}
              hideBackground
              useImageLoadAspectRatio
              metadataMode="trending"
            />
          )}
          ListFooterComponent={
            showMoreButton ? (
              <ViewAllCategoriesButton
                label="View all trending artworks"
                listingType="trending"
              />
            ) : null
          }
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
