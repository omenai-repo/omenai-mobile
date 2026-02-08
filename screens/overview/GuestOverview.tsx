import React, { useCallback, useState } from "react";
import { RefreshControl } from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import WithModal from "#components/modal/WithModal";
import ScrollWrapper from "#components/general/ScrollWrapper";
import Header from "#components/header/Header";
import Banner from "../home/components/banner/Banner";
import NewArtworksListing from "../home/components/NewArtworksListing";
import TrendingArtworks from "../home/components/TrendingArtworks";
import CatalogListing from "../home/components/CatalogListing";
import Editorials from "../home/components/editorials/Editorials";
import { HOME_QK } from "#utils/queryKeys";
import BlurStatusBar from "#components/general/BlurStatusBar";
import { useScrollY } from "#hooks/useScrollY";

export default function GuestOverview() {
  const [refreshing, setRefreshing] = useState(false);
  const queryClient = useQueryClient();
  const { scrollY, onScroll } = useScrollY();

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
        <NewArtworksListing />
        <TrendingArtworks limit={28} />
        <CatalogListing />
        <Editorials />
      </ScrollWrapper>
    </WithModal>
  );
}
