import React from "react";
import { View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { FlashList } from "@shopify/flash-list";
import { HOME_QK } from "#utils/core/queryKeys";
import { fetchCurationData } from "#services/discovery/fetchCurationData";
import SectionHeader from "#components/general/SectionHeader";
import ArtworkCard from "#components/artwork/ArtworkCard";
import ArtworkCardLoader from "#components/general/ArtworkCardLoader";
import ListSeparator from "#components/general/ListSeparator";
import tw from "twrnc";
import { useAppStore } from "#store/app/appStore";

export default function CuratorPicks() {
  const userSession = useAppStore((s) => s.userSession);
  const { data: picks = [], isLoading } = useQuery({
    queryKey: HOME_QK.curatorPicks(userSession?.id),
    queryFn: async () => {
      const res = await fetchCurationData("curator_picks");
      if (!res?.isOk) return [];
      const rows = Array.isArray(res.data) ? res.data : [];
      return rows.filter(
        (item: any) =>
          String(item?.type || "").toLowerCase() === "artwork" &&
          item?.data?.art_id,
      );
    },
  });

  if (!isLoading && picks.length === 0) {
    return null;
  }

  return (
    <View style={tw`mt-6`}>
      <SectionHeader title="Curator's Picks" />
      {isLoading ? (
        <ArtworkCardLoader />
      ) : (
        <FlashList
          data={picks}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={tw`mt-5`}
          contentContainerStyle={{
            alignItems: "flex-end",
            paddingHorizontal: 20,
          }}
          ItemSeparatorComponent={ListSeparator}
          keyExtractor={(item: any, index) =>
            item.identifier || item?.data?.art_id || `curator-pick-${index}`
          }
          renderItem={({ item }) => {
            return (
              <ArtworkCard
                artwork={item.data}
                hideBackground
                useImageLoadAspectRatio
              />
            );
          }}
        />
      )}
    </View>
  );
}
