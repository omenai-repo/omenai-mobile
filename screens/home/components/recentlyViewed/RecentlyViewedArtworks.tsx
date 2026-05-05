import React, { useMemo } from "react";
import { View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import tw from "twrnc";
import { useQuery } from "@tanstack/react-query";
import { fetchViewHistory } from "#services/artworks/viewHistory/fetchRecentlyViewedArtworks";
import { useAppStore } from "#store/app/appStore";
import EmptyArtworks from "#components/general/EmptyArtworks";
import ArtworkCardLoader from "#components/general/ArtworkCardLoader";
import { HOME_QK } from "#utils/queryKeys";
import ArtworkCard from "#components/artwork/ArtworkCard";

import SectionHeader from "#components/general/SectionHeader";

type ViewHistoryItem = {
  _id?: string;
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
  image_format?: { ratio: string; orientation?: string };
};

function RecentlyViewedArtworks() {
  const userSessionId = useAppStore((s) => s.userSession?.id);
  const userId = userSessionId;
  const ITEM_GAP = 20;

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
    <View style={tw`mt-6 mb-10`}>
      <SectionHeader subtitle="YOUR ACTIVITY" title="Recently viewed" />

      {isLoading && <ArtworkCardLoader />}

      {!isLoading && data.length > 0 && (
        <FlashList
          data={recentArtworks}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={tw`mt-5`}
          ItemSeparatorComponent={() => <View style={{ width: ITEM_GAP }} />}
          contentContainerStyle={{
            alignItems: "flex-end",
            paddingHorizontal: 20,
          }}
          keyExtractor={(item, index) =>
            item._id ?? `${item.art_id?.toString() ?? "rv"}-${index}`
          }
          renderItem={({ item }) => (
            <ArtworkCard
              artwork={{
                ...item,
                title: item.title ?? item.artwork ?? "Untitled",
                artist: item.artist ?? "Unknown artist",
              }}
              rootHidePrice
              disableLikeButton
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
          writeUp="You haven't viewed an artwork yet"
        />
      )}
    </View>
  );
}

export default React.memo(RecentlyViewedArtworks);
