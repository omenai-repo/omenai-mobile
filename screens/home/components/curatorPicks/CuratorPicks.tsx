import React from "react";
import { ScrollView, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useAppStore } from "#store/app/appStore";
import { HOME_QK } from "#utils/queryKeys";
import { fetchCurationData } from "#services/curation/fetchCurationData";
import SectionHeader from "#components/general/SectionHeader";
import ArtworkCard from "#components/artwork/ArtworkCard";
import tw from "twrnc";

const SKELETON_ITEMS = ["curator-skeleton-1", "curator-skeleton-2", "curator-skeleton-3"];

export default function CuratorPicks() {
  const { userSession } = useAppStore();

  const { data: picks = [], isLoading } = useQuery({
    queryKey: HOME_QK.curatorPicks(userSession?.id),
    queryFn: async () => {
      const res = await fetchCurationData("curator_picks");
      if (!res?.isOk) return [];
      const rows = Array.isArray(res.data) ? res.data : [];
      return rows.filter(
        (item: any) => String(item?.type || "").toLowerCase() === "artwork" && item?.data?.art_id,
      );
    },
    staleTime: 5 * 60_000,
    gcTime: 15 * 60_000,
  });

  if (!isLoading && picks.length === 0) return null;

  return (
    <View style={tw`mt-6`}>
      <SectionHeader
        subtitle="CURATOR'S PICKS"
        title="Curator's Picks"
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={tw`mt-5`}
        contentContainerStyle={[tw`px-5 gap-5`, { alignItems: "flex-end" }]}
      >
        {isLoading
          ? SKELETON_ITEMS.map((item) => (
              <View key={item} style={tw`w-[170px]`}>
                <View style={tw`w-full h-[220px] rounded-sm bg-[#EAEAEA]`} />
                <View style={tw`h-3 w-24 rounded-sm bg-[#E6E6E6] mt-3`} />
                <View style={tw`h-4 w-32 rounded-sm bg-[#E6E6E6] mt-2`} />
              </View>
            ))
          : picks.map((item: any, index: number) => {
              const artwork = item.data;
              return (
                <ArtworkCard
                  key={item.identifier || artwork.art_id || `curator-pick-${index}`}
                  title={artwork.title}
                  url={artwork.url}
                  artist={artwork.artist}
                  showPrice={
                    !!userSession?.id && artwork.pricing?.shouldShowPrice === "Yes"
                  }
                  price={artwork.pricing?.usd_price}
                  availiablity={artwork.availability}
                  impressions={artwork.impressions}
                  like_IDs={artwork.like_IDs}
                  art_id={artwork.art_id}
                  image_format={artwork.image_format}
                  hideBackground
                  useImageLoadAspectRatio
                />
              );
            })}
      </ScrollView>
    </View>
  );
}
