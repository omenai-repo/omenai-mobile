// Home.tsx
import React, { useCallback, useState } from 'react';
import { RefreshControl, View } from 'react-native';
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

export default function Home() {
  const [refreshCount, setRefreshCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setRefreshCount((prev) => prev + 1);
    const T = setTimeout(() => setRefreshing(false), 900);
    return () => clearTimeout(T);
  }, []);

  return (
    <WithModal>
      <ScrollWrapper
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Header />
        <Banner reloadCount={refreshCount} />
        <NewArtworksListing refreshCount={refreshCount} />
        <FeaturedArtists />
        <TrendingArtworks limit={28} refreshCount={refreshCount} />
        <CuratedArtworksListing limit={20} refreshCount={refreshCount} />
        <CatalogListing />
        <Editorials />
        <RecentlyViewedArtworks refreshCount={refreshCount} />
        <View style={{ height: 100 }} />
      </ScrollWrapper>
    </WithModal>
  );
}
