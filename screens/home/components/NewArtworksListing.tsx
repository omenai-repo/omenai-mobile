import React from "react";
import { View, ScrollView } from "react-native";
import tw from "twrnc";
import { useQuery } from "@tanstack/react-query";
import ArtworkCard from "#components/artwork/ArtworkCard";
import { fetchArtworks } from "#services/artworks/fetchArtworks";
import ArtworkCardLoader from "#components/general/ArtworkCardLoader";
import EmptyArtworks from "#components/general/EmptyArtworks";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "#constants/screenNames.constants";
import { HOME_QK } from "#utils/queryKeys";
import { useAppStore } from "#store/app/appStore";
import SectionHeader from "#components/general/SectionHeader";

export default function NewArtworksListing({
  hideAction,
}: {
  hideAction?: boolean;
}) {
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
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={tw`mt-5`}
          contentContainerStyle={[tw`px-5 gap-5`, { alignItems: "flex-end" }]}
        >
          {data.map((item: any, index: number) => (
            <ArtworkCard
              key={item.art_id?.toString() ?? `new-${index}`}
              title={item.title}
              url={item.url}
              artist={item.artist}
              showPrice={
                !!userSession?.id && item.pricing?.shouldShowPrice === "Yes"
              }
              price={item.pricing?.usd_price}
              availiablity={item.availability}
              impressions={item.impressions}
              like_IDs={item.like_IDs}
              art_id={item.art_id}
              image_format={item.image_format}
              hideBackground
              useImageLoadAspectRatio
            />
          ))}
        </ScrollView>
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
