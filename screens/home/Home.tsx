import { StyleSheet, SafeAreaView, RefreshControl, Platform, StatusBar, View } from 'react-native';
import React, { useState } from 'react';
import Header from '../../components/header/Header';
import FeaturedGalleries from './components/featuredGalleries/FeaturedGalleries';
import Editorials from './components/editorials/Editorials';
import NewArtworksListing from './components/NewArtworksListing';
import TrendingArtworks from './components/TrendingArtworks';
import Banner from './components/banner/Banner';
import CuratedArtworksListing from './components/CuratedArtworksListing';
import WithModal from 'components/modal/WithModal';
import CatalogListing from './components/CatalogListing';
import RecentlyViewedArtworks from './components/recentlyViewed/RecentlyViewedArtworks';
import ScrollWrapper from 'components/general/ScrollWrapper';
import tw from 'twrnc';
import FeaturedArtists from './components/featuredArtists/FeaturedArtists';

export default function Home() {
  const [refreshCount, setRefreshCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    // setRefreshing(true);
    setRefreshCount((prev) => prev + 1);
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
        {/* <FeaturedGalleries /> */}
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
