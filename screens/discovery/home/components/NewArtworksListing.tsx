import React from "react";
import { View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import tw from "twrnc";
import { useQuery } from "@tanstack/react-query";
import ArtworkCard from "#components/artwork/ArtworkCard";
import { fetchArtworks } from "#services/artwork/fetchArtworks";
import ArtworkCardLoader from "#components/general/ArtworkCardLoader";
import EmptyArtworks from "#components/general/EmptyArtworks";
import ListSeparator from "#components/general/ListSeparator";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "#constants/screenNames.constants";
import { HOME_QK } from "#utils/core/queryKeys";
import SectionHeader from "#components/general/SectionHeader";
import { useAppStore } from "#store/app/appStore";

export default function NewArtworksListing({
  hideAction,
}: Readonly<{
  hideAction?: boolean;
}>) {
  const navigation = useNavigation<any>();
  const { userSession } = useAppStore();
  const limit = 20;

  const { data = [], isLoading } = useQuery({
    queryKey: HOME_QK.newArtworks(userSession?.id),
    queryFn: async () => {
      const results = await fetchArtworks({ listingType: "recent", page: 1 });
      return results?.isOk ? results.body.data ?? [] : [];
    },
    select: (rows) => rows.slice(0, limit),
  });

  return (
    <View style={tw`mt-6`}>
      <SectionHeader
        subtitle="Recently Added"
        title="New Arrivals"
        onActionPress={
          hideAction
            ? undefined
            : () =>
              navigation.navigate(screenName.artworksMedium, {
                catalog: "recent",
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
          contentContainerStyle={{ alignItems: "flex-end", paddingHorizontal: 20 }}
          ItemSeparatorComponent={ListSeparator}
          keyExtractor={(item: any, index) =>
            item.art_id?.toString() ?? `new-${index}`
          }
          renderItem={({ item }) => (
            <ArtworkCard
              artwork={item}
              hideBackground
              useImageLoadAspectRatio
            />
          )}
        />
      )}

      {!isLoading && data.length < 1 && (
        <EmptyArtworks
          size={70}
          fixedHeight
          writeUp="No new artworks at the moment"
        />
      )}
    </View>
  );
}
