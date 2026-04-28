import React from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { FlashList } from "@shopify/flash-list";
import { fetchCuratedArtworks } from "#services/artworks/fetchCuratedArtworks";
import ArtworkCardLoader from "#components/general/ArtworkCardLoader";
import ViewAllCategoriesButton from "#components/buttons/ViewAllCategoriesButton";
import EmptyArtworks from "#components/general/EmptyArtworks";
import ArtworkCard from "#components/artwork/ArtworkCard";
import tw from "twrnc";
import { screenName } from "#constants/screenNames.constants";
import { HOME_QK } from "#utils/queryKeys";
import { useAppStore } from "#store/app/appStore";
import SectionHeader from "#components/general/SectionHeader";
import { colors } from "#config/colors.config";

export default function CuratedArtworksListing({ limit }: { limit: number }) {
  const navigation = useNavigation<any>();
  const { userSession } = useAppStore();

  const { data = [], isLoading } = useQuery({
    queryKey: HOME_QK.curated(limit, userSession?.id),
    queryFn: async () => {
      const res = await fetchCuratedArtworks({ page: 1 });
      return res?.data ?? [];
    },
    select: (rows) => rows.slice(0, limit),
    staleTime: 60_000,
    gcTime: 10 * 60_000,
  });

  const showMoreButton = data.length >= limit;

  return (
    <View style={[tw`py-10 mt-6`, { backgroundColor: colors.black }]}>
      <SectionHeader
        subtitle="CURATED FOR YOU"
        title="Because you liked"
        onActionPress={() =>
          navigation.navigate(screenName.artworksMedium, {
            catalog: "curated",
          })
        }
        dark
      />

      <View>
        {isLoading && <ArtworkCardLoader />}
        {!isLoading && data.length > 0 && (
          <FlashList
            data={data}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={tw`mt-5`}
            contentContainerStyle={{ alignItems: "flex-end", paddingHorizontal: 20 }}
            ItemSeparatorComponent={() => <View style={tw`w-5`} />}
            keyExtractor={(item: any, index) =>
              item.art_id?.toString() ?? `curated-${index}`
            }
            renderItem={({ item }) => (
              <ArtworkCard
                title={item.title}
                url={item.url}
                artist={item.artist}
                showPrice={
                  !!userSession?.id && item.pricing?.shouldShowPrice === "Yes"
                }
                price={item.pricing?.usd_price}
                availiablity={item.availability}
                lightText
                impressions={item.impressions}
                like_IDs={item.like_IDs}
                art_id={item.art_id}
                hideBackground
                image_format={item.image_format}
                useImageLoadAspectRatio
              />
            )}
            ListFooterComponent={
              showMoreButton ? (
                <ViewAllCategoriesButton
                  label="View all curated artworks"
                  listingType="curated"
                  darkMode
                />
              ) : null
            }
          />
        )}
        {!isLoading && data.length < 1 && (
          <EmptyArtworks
            writeUp="No artworks to match your interests"
            darkTheme
            fixedHeight
          />
        )}
      </View>
    </View>
  );
}
