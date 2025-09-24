import React, { useCallback, useState } from 'react';
import { RefreshControl, View } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import WithModal from 'components/modal/WithModal';
import ScrollWrapper from 'components/general/ScrollWrapper';
import Header from 'components/header/Header';
import Banner from './components/banner/Banner';
import NewArtworksListing from './components/NewArtworksListing';
import TrendingArtworks from './components/TrendingArtworks';
import CuratedArtworksListing from './components/CuratedArtworksListing';
import CatalogListing from './components/CatalogListing';
import RecentlyViewedArtworks from './components/recentlyViewed/RecentlyViewedArtworks';
import FeaturedArtists from './components/featuredArtists/FeaturedArtists';
import Editorials from './components/editorials/Editorials';

export const HOME_QK = {
  banner: ['home', 'banner'] as const,
  newArtworks: ['home', 'newArtworks'] as const,
  trending: (limit: number) => ['home', 'trending', { limit }] as const,
  curated: (limit: number) => ['home', 'curated', { limit }] as const,
  featuredArtists: ['home', 'featuredArtists'] as const,
  editorials: ['home', 'editorials'] as const,
  recentlyViewed: (userId?: string) => ['home', 'recentlyViewed', { userId }] as const,
};

export default function Home() {
  const [refreshing, setRefreshing] = useState(false);
  const queryClient = useQueryClient();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Mark everything on Home as stale
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: HOME_QK.banner }),
      queryClient.invalidateQueries({ queryKey: HOME_QK.newArtworks }),
      queryClient.invalidateQueries({ queryKey: HOME_QK.trending(28) }),
      queryClient.invalidateQueries({ queryKey: HOME_QK.curated(20) }),
      queryClient.invalidateQueries({ queryKey: HOME_QK.featuredArtists }),
      queryClient.invalidateQueries({ queryKey: HOME_QK.editorials }),
    ]);
    // Optional: kick a refetch immediately
    await queryClient.refetchQueries({
      predicate: (q) => Array.isArray(q.queryKey) && q.queryKey[0] === 'home',
    });
    setRefreshing(false);
  }, [queryClient]);

  return (
    <WithModal>
      <ScrollWrapper
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Header />
        <Banner />
        <NewArtworksListing />
        <FeaturedArtists />
        <TrendingArtworks limit={28} />
        <CuratedArtworksListing limit={20} />
        <CatalogListing />
        <Editorials />
        <RecentlyViewedArtworks />
        <View style={{ height: 100 }} />
      </ScrollWrapper>
    </WithModal>
  );
}
