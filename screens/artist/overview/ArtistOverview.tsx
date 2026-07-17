import React, { useCallback } from "react";
import { View, RefreshControl } from "react-native";
import tw from "twrnc";
import ScrollWrapper from "#components/general/ScrollWrapper";
import SalesOverview from "#screens/overview/components/SalesOverview";

import PopularArtworks from "#screens/overview/components/PopularArtworks";

import { HighlightCard } from "./HighlightCard";
import { useQueryClient } from "@tanstack/react-query";
import { QK } from "#utils/queryKeys";
import { useAppStore } from "#store/app/appStore";

const ArtistOverview = () => {
  const queryClient = useQueryClient();
  const { userSession } = useAppStore();
  const isAnyFetching = false;

  const onRefresh = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: QK.highlightArtist("sales", userSession?.id),
      }),
      queryClient.invalidateQueries({
        queryKey: QK.highlightArtist("net", userSession?.id),
      }),
      queryClient.invalidateQueries({
        queryKey: QK.highlightArtist("revenue", userSession?.id),
      }),
      queryClient.invalidateQueries({
        queryKey: QK.highlightArtist("balance", userSession?.id),
      }),
      queryClient.invalidateQueries({
        queryKey: QK.salesOverview(userSession?.id),
      }),
      queryClient.invalidateQueries({
        queryKey: QK.popularArtworks(userSession?.id),
      }),
    ]);
  }, [queryClient, userSession?.id]);

  return (
    <View style={tw`flex-1 bg-[#F7F7F7]`}>
      <ScrollWrapper
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        style={tw`flex-1 bg-[#F7F7F7] px-5`}
        refreshControl={
          <RefreshControl refreshing={isAnyFetching} onRefresh={onRefresh} />
        }
      >
        <HighlightCard />
        <SalesOverview />
        <PopularArtworks />
      </ScrollWrapper>
    </View>
  );
};

export default ArtistOverview;
