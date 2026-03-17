import React, { useMemo } from "react";
import { View, ScrollView } from "react-native";
import tw from "twrnc";
import { useQuery } from "@tanstack/react-query";
import { fetchViewHistory } from "#services/artworks/viewHistory/fetchRecentlyViewedArtworks";
import { useAppStore } from "#store/app/appStore";
import EmptyArtworks from "#components/general/EmptyArtworks";
import ArtworkCardLoader from "#components/general/ArtworkCardLoader";
import { HOME_QK } from "#utils/queryKeys";
import ArtworkCard from "#components/artwork/ArtworkCard";
import { useDevice } from "#hooks/useDevice";

import SectionHeader from "#components/general/SectionHeader";

type ViewHistoryItem = {
  art_id: string;
  url: string;
  artist?: string;
  artwork?: string;
  title?: string;
  pricing?: {
    shouldShowPrice?: "Yes" | "No";
    usd_price?: number;
  };
  availability?: boolean;
  impressions?: number;
  like_IDs?: string[];
};

function RecentlyViewedArtworks() {
  const userSessionId = useAppStore((s) => s.userSession?.id);
  const { isTablet, horizontalPadding, width } = useDevice();
  const userId = userSessionId;

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

  const recentArtworks = useMemo(() => data as ViewHistoryItem[], [data]);

  return (
    <View style={tw`my-10`}>
      <SectionHeader subtitle="YOUR ACTIVITY" title="Recently viewed" />

      {isLoading && <ArtworkCardLoader />}

      {!isLoading && data.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={tw`mt-5`}
          contentContainerStyle={{
            paddingLeft: isTablet ? horizontalPadding : 20,
            paddingRight: isTablet ? horizontalPadding : 20,
          }}
        >
          <View style={tw`flex-row gap-5`}>
            {recentArtworks.map((item: ViewHistoryItem, i: number) => (
              <ArtworkCard
                key={item.art_id ?? `rv-${i}`}
                title={item.title ?? item.artwork ?? "Untitled"}
                url={item.url}
                artist={item.artist ?? "Unknown artist"}
                showPrice={
                  !!userSessionId && item.pricing?.shouldShowPrice === "Yes"
                }
                price={item.pricing?.usd_price ?? 0}
                availiablity={item.availability ?? true}
                impressions={item.impressions ?? 0}
                like_IDs={item.like_IDs ?? []}
                art_id={item.art_id}
                disableLikeButton
                hideBackground
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

export default React.memo(RecentlyViewedArtworks);
