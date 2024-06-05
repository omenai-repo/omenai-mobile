import { StyleSheet, Text, View, ScrollView, SafeAreaView } from 'react-native'
import React from 'react'
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
import Banner from './components/Banner'

export default function Home() {
    return (
        <View style={styles.container}> 
            <SafeAreaView>
                <ScrollView showsHorizontalScrollIndicator={false}>
                    <Header />
                    <NewArtworksListing />
                    <Banner />
                    <FeaturedGalleries />
                    <TrendingArtworks />
                    <Editorials />
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    }
})