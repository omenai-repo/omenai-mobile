import React, { useCallback, useState } from "react";
import { RefreshControl, View } from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import tw from "twrnc";
import ScrollWrapper from "#components/general/ScrollWrapper";
import Banner from "./components/banner/Banner";
import TrendingArtworks from "./components/TrendingArtworks";
import CuratedArtworksListing from "./components/CuratedArtworksListing";
import CatalogListing from "./components/catalog/CatalogListing";
import RecentlyViewedArtworks from "./components/recentlyViewed/RecentlyViewedArtworks";
import Editorials from "./components/editorials/Editorials";
import { HOME_QK } from "#utils/queryKeys";
import { useAppStore } from "#store/app/appStore";
import FairsEvents from "./components/fairsEvents/FairsEvents";
import FeaturedShows from "./components/featuredShows/FeaturedShows";
import FeaturedGalleries from "./components/featuredGalleries/FeaturedGalleries";
import FeaturedFeed from "./components/featuredFeed/FeaturedFeed";
import CuratorPicks from "./components/curatorPicks/CuratorPicks";
import FeaturedArtists from "./components/featuredArtists/FeaturedArtists";

export default function Home() {
  const [refreshing, setRefreshing] = useState(false);
  const queryClient = useQueryClient();
  const { userSession } = useAppStore();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Mark everything on Home as stale
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: HOME_QK.banner(userSession?.id),
      }),
      queryClient.invalidateQueries({
        queryKey: HOME_QK.newArtworks(userSession?.id),
      }),
      queryClient.invalidateQueries({
        queryKey: HOME_QK.trending(28, userSession?.id),
      }),
      queryClient.invalidateQueries({
        queryKey: HOME_QK.curated(20, userSession?.id),
      }),
      queryClient.invalidateQueries({
        queryKey: HOME_QK.featuredArtists(userSession?.id),
      }),
      queryClient.invalidateQueries({
        queryKey: HOME_QK.featuredFeed(userSession?.id),
      }),
      queryClient.invalidateQueries({
        queryKey: HOME_QK.curatorPicks(userSession?.id),
      }),
      queryClient.invalidateQueries({
        queryKey: HOME_QK.editorials(userSession?.id),
      }),
      queryClient.invalidateQueries({
        queryKey: HOME_QK.fairsEventsPreview(userSession?.id),
      }),
      queryClient.invalidateQueries({
        queryKey: HOME_QK.featuredShows(userSession?.id),
      }),
      queryClient.invalidateQueries({
        queryKey: HOME_QK.featuredGalleries(userSession?.id),
      }),
    ]);
    // Optional: kick a refetch immediately
    await queryClient.refetchQueries({
      predicate: (q) => Array.isArray(q.queryKey) && q.queryKey[0] === "home",
    });
    setRefreshing(false);
  }, [queryClient, userSession?.id]);

  return (
    <ScrollWrapper
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={tw`gap-10`}>
        <FeaturedFeed />
        <CuratorPicks />
        <FairsEvents />
        <TrendingArtworks limit={28} />
        <FeaturedShows />
        <CuratedArtworksListing limit={20} />
        <FeaturedArtists />
        <FeaturedGalleries />
        <Editorials />
        <Banner />
        {/* <NewArtworksListing /> */}
        <CatalogListing />
        <RecentlyViewedArtworks />
      </View>
    </ScrollWrapper>
  );
}
