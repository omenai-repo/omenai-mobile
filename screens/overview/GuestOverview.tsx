import React, { useCallback, useState } from "react";
import { RefreshControl, View } from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import WithModal from "#components/modal/WithModal";
import ScrollWrapper from "#components/general/ScrollWrapper";
import Header from "#components/header/Header";
import Banner from "#screens/home/components/banner/Banner";
import NewArtworksListing from "#screens/home/components/NewArtworksListing";
import TrendingArtworks from "#screens/home/components/TrendingArtworks";
import Editorials from "#screens/home/components/editorials/Editorials";
import { HOME_QK } from "#utils/queryKeys";
import BlurStatusBar from "#components/general/BlurStatusBar";
import { useScrollY } from "#hooks/useScrollY";
import CatalogListing from "#screens/home/components/catalog/CatalogListing";
import tw from "twrnc";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function GuestOverview() {
  const [refreshing, setRefreshing] = useState(false);
  const queryClient = useQueryClient();
  const { scrollY, onScroll } = useScrollY();
  const insets = useSafeAreaInsets();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: HOME_QK.banner(undefined) }),
      queryClient.invalidateQueries({
        queryKey: HOME_QK.newArtworks(undefined),
      }),
      queryClient.invalidateQueries({
        queryKey: HOME_QK.trending(28, undefined),
      }),
      queryClient.invalidateQueries({
        queryKey: HOME_QK.featuredArtists(undefined),
      }),
      queryClient.invalidateQueries({
        queryKey: HOME_QK.editorials(undefined),
      }),
    ]);

    setRefreshing(false);
  }, [queryClient]);

  return (
    <WithModal>
      <BlurStatusBar scrollY={scrollY} intensity={80} tint="light" />
      <ScrollWrapper
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onScroll={onScroll}
      >
        <Header showAuthButton={true} showNotification={false} />
        <Banner />
        <View style={[tw`mt-10 gap-10`, { paddingBottom: insets.bottom + 20 }]}>
          <NewArtworksListing hideAction />
          <TrendingArtworks limit={28} hideAction />
          <CatalogListing hideAction />
          <Editorials hideAction />
        </View>
      </ScrollWrapper>
    </WithModal>
  );
}
