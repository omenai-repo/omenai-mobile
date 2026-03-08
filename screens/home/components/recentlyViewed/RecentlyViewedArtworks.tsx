import React from "react";
import { ScrollView, View } from "react-native";
import tw from "twrnc";
import { useQuery } from "@tanstack/react-query";
import { fetchViewHistory } from "#services/artworks/viewHistory/fetchRecentlyViewedArtworks";
import { useAppStore } from "#store/app/appStore";
import ViewHistoryCard from "./ViewHistoryCard";
import EmptyArtworks from "#components/general/EmptyArtworks";
import ArtworkCardLoader from "#components/general/ArtworkCardLoader";
import { HOME_QK } from "#utils/queryKeys";

import SectionHeader from "#components/general/SectionHeader";

type ViewHistoryItem = {
  art_id: string;
  url: string;
  artist: string;
  artwork: string;
};

export default function RecentlyViewedArtworks() {
  const { userSession } = useAppStore();
  const userId = userSession?.id;

  const { data = [], isLoading } = useQuery({
    queryKey: HOME_QK.recentlyViewed(userId),
    queryFn: async () => {
      if (!userId) return [];
      const res = await fetchViewHistory(userId);
      return res?.isOk ? (res.data ?? []).slice(0, 10) : [];
    },
    enabled: !!userId,
    staleTime: 60_000,
    gcTime: 10 * 60_000,
  });

  return (
    <View style={tw`my-10`}>
      <SectionHeader subtitle="YOUR ACTIVITY" title="Recently viewed" />

      {isLoading && <ArtworkCardLoader />}

      {!isLoading && data.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={tw`mt-5`}
          contentContainerStyle={tw`px-5`}
        >
          <View style={tw`flex-row gap-5`}>
            {data.map((item: ViewHistoryItem, i: number) => (
              <ViewHistoryCard
                key={item.art_id ?? `rv-${i}`}
                art_id={item.art_id}
                artist={item.artist}
                artwork={item.artwork}
                url={item.url}
              />
            ))}
          </View>
        </ScrollView>
      )}

      {!isLoading && data.length < 1 && (
        <EmptyArtworks
          size={70}
          fixedHeight
          writeUp="You haven't viewed an artwork yet"
        />
      )}
    </View>
  );
}
