import { StyleSheet, ScrollView, SafeAreaView, RefreshControl, Platform, StatusBar} from 'react-native'
import React, { useState } from 'react'
import Header from '../../components/header/Header'
import { colors } from '../../config/colors.config'
import SearchInput from 'components/inputs/SearchInput'
import Coursel from './components/coursel/Coursel'
import Explore from './components/explore/Explore'
import FeaturedGalleries from './components/featuredGalleries/FeaturedGalleries'
import Editorials from './components/editorials/Editorials'
import ListingHeader from './components/listingHeader/ListingHeader'
import ListingSelectContainer from './components/listingHeader/ListingSelectContainer'
import NewArtworksListing from './components/NewArtworksListing'
import TrendingArtworks from './components/TrendingArtworks'
import Banner from './components/banner/Banner'
import CuratedArtworksListing from './components/CuratedArtworksListing'
import WithModal from 'components/modal/WithModal'
import CatalogListing from './components/CatalogListing'
import RecentlyViewedArtworks from './components/recentlyViewed/RecentlyViewedArtworks'

export default function Home() {
    const [refreshCount, setRefreshCount] = useState(0);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = React.useCallback(() => {
        // setRefreshing(true);
        setRefreshCount(prev => prev + 1)
    }, []);

    return (
        <WithModal> 
            <SafeAreaView style={styles.safeArea}>
                <ScrollView 
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                >
                    <Header showNotification />
                    <Banner reloadCount={refreshCount} />
                    <NewArtworksListing limit={20} refreshCount={refreshCount} />
                    <FeaturedGalleries />
                    <TrendingArtworks limit={28} refreshCount={refreshCount} />
                    <CuratedArtworksListing limit={20} refreshCount={refreshCount} />
                    <CatalogListing />
                    <Editorials />
                    <RecentlyViewedArtworks refreshCount={refreshCount} />
                </ScrollView>
            </SafeAreaView>
        </WithModal>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    }
})